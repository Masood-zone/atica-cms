import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchPaidReportByClass,
  fetchUnpaidReportByClass,
} from "./reports.api";

export const usePaidReportByClass = (
  classId: number,
  params?: { from?: string; to?: string }
) => {
  return useQuery({
    queryKey: ["reports", "class", classId, "paid", params],
    queryFn: () => fetchPaidReportByClass(classId, params),
    enabled: !!classId,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch paid report");
    },
  });
};

export const useUnpaidReportByClass = (
  classId: number,
  params?: { from?: string; to?: string }
) => {
  return useQuery({
    queryKey: ["reports", "class", classId, "unpaid", params],
    queryFn: () => fetchUnpaidReportByClass(classId, params),
    enabled: !!classId,
    onError: (error) => {
      console.error(error);
      toast.error("Failed to fetch unpaid report");
    },
  });
};
