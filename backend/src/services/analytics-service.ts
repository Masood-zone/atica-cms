import { prisma } from "../db/client";

export const analyticsService = {
  getAdminAnalytics: async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [totalTeachers, classes, dailyExpenses, monthlyExpenses] =
      await Promise.all([
        prisma.user.count({
          where: { role: { in: ["TEACHER", "Teacher"] } },
        }),
        prisma.class.findMany({
          include: { students: true },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            date: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            date: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
      ]);

    const totalClasses = classes.length;
    const totalStudents = classes.reduce(
      (acc, c) => acc + c.students.length,
      0
    );

    // Expected daily collection is sum(class.canteenPrice * classStudentCount)
    const totalDailyCollection = classes.reduce(
      (acc, c) => acc + (c.canteenPrice || 0) * c.students.length,
      0
    );
    const totalCollections = totalDailyCollection; // legacy field kept

    // Monthly collection: daily expected * number of school days (Mon-Fri)
    const countSchoolDaysInMonth = () => {
      let count = 0;
      const d = new Date(monthStart);
      while (d <= monthEnd) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) count++;
        d.setDate(d.getDate() + 1);
      }
      return count;
    };
    const schoolDays = countSchoolDaysInMonth();
    const totalMonthlyCollection = totalDailyCollection * schoolDays;

    const totalDailyExpenses = dailyExpenses._sum.amount || 0;
    const totalMonthlyExpenses = monthlyExpenses._sum.amount || 0;

    return {
      totalTeachers,
      totalStudents,
      totalCollections,
      totalClasses,
      totalDailyCollection,
      totalMonthlyCollection,
      totalDailyExpenses,
      totalMonthlyExpenses,
    };
  },

  getTeacherAnalytics: async (classId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [classEntity, paidStudents, unpaidStudents] = await Promise.all([
      prisma.class.findUnique({
        where: { id: classId },
        include: { students: true },
      }),
      prisma.record.count({
        where: {
          classId,
          submitedAt: { gte: today },
          hasPaid: true,
        },
      }),
      prisma.record.count({
        where: {
          classId,
          submitedAt: { gte: today },
          hasPaid: false,
        },
      }),
    ]);

    const price = classEntity?.canteenPrice || 0;
    const totalStudents = classEntity?.students.length || 0;
    const totalAmount = totalStudents * price;
    const paidAmount = paidStudents * price;
    const unpaidAmount = unpaidStudents * price;

    return {
      totalAmount,
      totalStudents,
      paidStudents: {
        count: paidStudents,
        amount: paidAmount,
      },
      unpaidStudents: {
        count: unpaidStudents,
        amount: unpaidAmount,
      },
      canteenPrice: price,
    };
  },
};
