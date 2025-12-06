import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchClasses } from "@/services/api/classes/classes.queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  usePaidReportByClass,
  useUnpaidReportByClass,
} from "@/services/api/reports/reports.queries";
import { Label } from "@/components/ui/label";
import { Logo } from "@/assets";
import { printReport } from "@/components/print/print-report";
import type {
  ClassPaidReport,
  ClassUnpaidReport,
} from "@/services/api/reports/reports.api";

export default function ReportsPage() {
  const { data: classes } = useFetchClasses();
  const [classId, setClassId] = useState<number>(0);
  const [from, setFrom] = useState<Date | undefined>(new Date());
  const [to, setTo] = useState<Date | undefined>(new Date());
  const params = {
    from: from ? format(from, "yyyy-MM-dd") : undefined,
    to: to ? format(to, "yyyy-MM-dd") : undefined,
  };

  const { data: paid, isLoading: paidLoading } = usePaidReportByClass(
    classId,
    params
  );
  const { data: unpaid, isLoading: unpaidLoading } = useUnpaidReportByClass(
    classId,
    params
  );

  const onPrint = (type: "paid" | "unpaid") => {
    printReport({
      type,
      logoSrc: Logo,
      classId,
      classes: classes as Class[] | undefined,
      paid: paid as ClassPaidReport | undefined,
      unpaid: unpaid as ClassUnpaidReport | undefined,
      from: from,
      to: to,
    });
  };

  return (
    <section className="container p-4">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="report-class">Class</Label>
          <Select onValueChange={(v) => setClassId(Number(v))}>
            <SelectTrigger id="report-class" className="w-[240px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map((c: Class) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="report-from">From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start",
                  !from && "text-muted-foreground"
                )}
                id="report-from"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {from ? format(from, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={from}
                onSelect={(d) => d && setFrom(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="report-to">To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start",
                  !to && "text-muted-foreground"
                )}
                id="report-to"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {to ? format(to, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={to}
                onSelect={(d) => d && setTo(d)}
                disabled={(d) =>
                  !!from && d < new Date(new Date(from).setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="paid" className="w-full">
        <TabsList>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        </TabsList>
        <TabsContent value="paid">
          <div className="flex justify-end mb-2">
            <Button size="sm" onClick={() => onPrint("paid")}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
          <div id="paid-report-root" className="bg-white p-4 rounded-md border">
            {paidLoading ? (
              <p>Loading...</p>
            ) : paid?.students?.length ? (
              paid.students.map((s) => (
                <div key={s.studentId} className="mb-4">
                  <div className="font-semibold">{s.studentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Count: {s.totalCount} • Total: ₵{s.totalAmount}
                  </div>
                  <ul className="mt-2 text-sm list-disc pl-6">
                    {s.records.map((r) => (
                      <li key={r.id}>
                        {format(new Date(r.submitedAt), "PPp")} — ₵
                        {(r.settingsAmount ?? 0).toFixed(2)}{" "}
                        {r.isPrepaid ? "(Prepaid)" : r.hasPaid ? "(Paid)" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="unpaid">
          <div className="flex justify-end mb-2">
            <Button size="sm" onClick={() => onPrint("unpaid")}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
          <div
            id="unpaid-report-root"
            className="bg-white p-4 rounded-md border"
          >
            {unpaidLoading ? (
              <p>Loading...</p>
            ) : unpaid?.students?.length ? (
              unpaid.students.map((s) => (
                <div key={s.studentId} className="mb-4">
                  <div className="font-semibold">{s.studentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Count: {s.totalCount}
                  </div>
                  <ul className="mt-2 text-sm list-disc pl-6">
                    {s.records.map((r) => (
                      <li key={r.id}>
                        {format(new Date(r.submitedAt), "PPp")} — Unpaid
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
