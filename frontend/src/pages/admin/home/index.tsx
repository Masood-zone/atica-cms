import { AnalyticsCard } from "@/components/shared/cards/analytic-cards";
import { CardsSkeleton } from "@/components/shared/page-loader/loaders";
import { useAdminDashboardAnalytics } from "@/services/api/analytics/analytics.queries";
import {
  BookOpen,
  // CurrencyIcon,
  School,
  Users,
  CalendarDays,
  CalendarCheck2,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const { data: analytics, isLoading, error } = useAdminDashboardAnalytics();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold py-3">Overview</h1>
        {isLoading ? (
          <CardsSkeleton count={4} />
        ) : error ? (
          <div className="">
            <CardsSkeleton count={3} />
            <p className="text-center text-red-500">Error fetching analytics</p>
          </div>
        ) : (
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              onClick={() => navigate("/admin/teachers")}
              className="cursor-pointer"
            >
              <AnalyticsCard
                title="Total Teachers"
                value={analytics?.totalTeachers || 0}
                icon={<Users className="size-6 text-blue-500" />}
                notice="Total number of teachers in the school"
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              />
            </div>
            <div
              onClick={() => navigate("/admin/students")}
              className="cursor-pointer"
            >
              <AnalyticsCard
                title="Total Students"
                value={analytics?.totalStudents || 0}
                icon={<School className="size-6 text-emerald-500" />}
                notice="Total number of students in the school"
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
              />
            </div>
            <div className="cursor-pointer">
              <AnalyticsCard
                title="Total Daily Collection"
                value={`₵${analytics?.totalDailyCollection || 0}`}
                icon={<CalendarDays className="size-6 text-amber-500" />}
                notice="Expected collection from all students today"
                className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
              />
            </div>
            <div className="cursor-pointer">
              <AnalyticsCard
                title="Total Monthly Collection"
                value={`₵${analytics?.totalMonthlyCollection || 0}`}
                icon={<CalendarCheck2 className="size-6 text-green-500" />}
                notice="Expected collection from all students this month (school days)"
                className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              />
            </div>
            <div className="cursor-pointer">
              <AnalyticsCard
                title="Total Daily Expenses"
                value={`₵${analytics?.totalDailyExpenses || 0}`}
                icon={<ReceiptText className="size-6 text-red-500" />}
                notice="Total expenses recorded today"
                className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
              />
            </div>
            <div className="cursor-pointer">
              <AnalyticsCard
                title="Total Monthly Expenses"
                value={`₵${analytics?.totalMonthlyExpenses || 0}`}
                icon={<ReceiptText className="size-6 text-orange-500" />}
                notice="Total expenses recorded this month"
                className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
              />
            </div>
            {/* <div
              onClick={() => navigate("/admin/accounts")}
              className="cursor-pointer"
            >
              <AnalyticsCard
                title="Total Collections (Legacy)"
                value={`₵${analytics?.totalCollections || 0}`}
                icon={<CurrencyIcon className="size-6 text-amber-500" />}
                notice="Legacy: total students × price"
                className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
              />
            </div> */}
            <div
              onClick={() => navigate("/admin/classes")}
              className="cursor-pointer"
            >
              <AnalyticsCard
                title="Total Classes"
                value={analytics?.totalClasses || 0}
                icon={<BookOpen className="size-6 text-purple-500" />}
                notice="Total number of classes in the school"
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              />
            </div>
          </div>
        )}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
