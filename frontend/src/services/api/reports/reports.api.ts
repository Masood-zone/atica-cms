import { apiClient } from "@/services/root";

export interface ReportRecord {
  id: number;
  submitedAt: string;
  hasPaid: boolean;
  isPrepaid: boolean;
  settingsAmount?: number;
  description?: string;
}

export interface StudentGroupPaid {
  studentId: number;
  studentName: string;
  totalCount: number;
  totalAmount: number;
  records: ReportRecord[];
}

export interface StudentGroupUnpaid {
  studentId: number;
  studentName: string;
  totalCount: number;
  records: ReportRecord[];
}

export interface ClassPaidReport {
  classId: number;
  from: string;
  to: string;
  totalRecords: number;
  students: StudentGroupPaid[];
}

export interface ClassUnpaidReport {
  classId: number;
  from: string;
  to: string;
  totalRecords: number;
  students: StudentGroupUnpaid[];
}

export const fetchPaidReportByClass = async (
  classId: number,
  params?: { from?: string; to?: string }
): Promise<ClassPaidReport> => {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const qs = search.toString();
  const url = `/reports/class/${classId}/paid${qs ? `?${qs}` : ""}`;
  const res = await apiClient.get(url);
  return res.data;
};

export const fetchUnpaidReportByClass = async (
  classId: number,
  params?: { from?: string; to?: string }
): Promise<ClassUnpaidReport> => {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  const qs = search.toString();
  const url = `/reports/class/${classId}/unpaid${qs ? `?${qs}` : ""}`;
  const res = await apiClient.get(url);
  return res.data;
};
