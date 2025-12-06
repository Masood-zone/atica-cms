import { prisma } from "../db/client";

export interface DateRange {
  from?: Date;
  to?: Date;
}

function normalizeRange(range?: DateRange) {
  const now = new Date();
  const from = range?.from
    ? new Date(range.from)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = range?.to
    ? new Date(range.to)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

export const reportsService = {
  getPaidReportByClass: async (classId: number, range?: DateRange) => {
    const { from, to } = normalizeRange(range);

    const records = await prisma.record.findMany({
      where: {
        classId,
        submitedAt: { gte: from, lte: to },
        OR: [{ hasPaid: true }, { isPrepaid: true }],
      },
      include: {
        student: {
          select: { id: true, name: true, gender: true, parentPhone: true },
        },
      },
      orderBy: [{ student: { name: "asc" } }, { submitedAt: "asc" }],
    });

    // Group by student
    const groups = new Map<
      number,
      {
        studentId: number;
        studentName: string;
        records: any[];
        totalCount: number;
        totalAmount: number;
      }
    >();

    for (const r of records) {
      if (!r.student) continue;
      const key = r.student.id;
      if (!groups.has(key)) {
        groups.set(key, {
          studentId: r.student.id,
          studentName: r.student.name,
          records: [],
          totalCount: 0,
          totalAmount: 0,
        });
      }
      const g = groups.get(key)!;
      g.records.push({
        id: r.id,
        submitedAt: r.submitedAt,
        hasPaid: r.hasPaid,
        isPrepaid: r.isPrepaid,
        settingsAmount: r.settingsAmount ?? 0,
        description: r.description ?? undefined,
      });
      g.totalCount += 1;
      g.totalAmount += r.settingsAmount ?? 0;
    }

    return {
      classId,
      from,
      to,
      totalRecords: records.length,
      students: Array.from(groups.values()),
    };
  },

  getUnpaidReportByClass: async (classId: number, range?: DateRange) => {
    const { from, to } = normalizeRange(range);

    const records = await prisma.record.findMany({
      where: {
        classId,
        submitedAt: { gte: from, lte: to },
        hasPaid: false,
        isPrepaid: false,
      },
      include: {
        student: {
          select: { id: true, name: true, gender: true, parentPhone: true },
        },
      },
      orderBy: [{ student: { name: "asc" } }, { submitedAt: "asc" }],
    });

    const groups = new Map<
      number,
      {
        studentId: number;
        studentName: string;
        records: any[];
        totalCount: number;
      }
    >();

    for (const r of records) {
      if (!r.student) continue;
      const key = r.student.id;
      if (!groups.has(key)) {
        groups.set(key, {
          studentId: r.student.id,
          studentName: r.student.name,
          records: [],
          totalCount: 0,
        });
      }
      const g = groups.get(key)!;
      g.records.push({
        id: r.id,
        submitedAt: r.submitedAt,
        hasPaid: r.hasPaid,
        isPrepaid: r.isPrepaid,
        description: r.description ?? undefined,
      });
      g.totalCount += 1;
    }

    return {
      classId,
      from,
      to,
      totalRecords: records.length,
      students: Array.from(groups.values()),
    };
  },
};
