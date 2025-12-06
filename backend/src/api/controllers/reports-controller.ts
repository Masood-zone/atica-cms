import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { reportsService } from "../../services/reports-service";

export const reportsController = {
  getPaidByClass: catchAsync(async (req: Request, res: Response) => {
    const classId = Number.parseInt(req.params.classId);
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await reportsService.getPaidReportByClass(classId, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    res.status(200).json(data);
  }),

  getUnpaidByClass: catchAsync(async (req: Request, res: Response) => {
    const classId = Number.parseInt(req.params.classId);
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await reportsService.getUnpaidReportByClass(classId, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    res.status(200).json(data);
  }),
};
