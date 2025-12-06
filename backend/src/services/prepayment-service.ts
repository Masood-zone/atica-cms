import { prepaymentRepository } from "../db/repositories/prepayment-repository";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export interface CreatePrepaymentData {
  studentId: number;
  classId: number;
  amount: number;
  startDate: string;
  endDate: string;
  createdBy: number;
}

export interface UpdatePrepaymentData {
  amount?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const prepaymentService = {
  getAllPrepayments: async () => {
    return prepaymentRepository.findAll();
  },

  getPrepaymentById: async (id: number) => {
    const prepayment = await prepaymentRepository.findById(id);
    if (!prepayment) {
      throw new ApiError(404, "Prepayment not found");
    }
    return prepayment;
  },

  getPrepaymentsByStudentId: async (studentId: number) => {
    return prepaymentRepository.findByStudentId(studentId);
  },

  getPrepaymentsByClassId: async (classId: number) => {
    return prepaymentRepository.findByClassId(classId);
  },

  getActivePrepaymentsByStudentId: async (studentId: number) => {
    const currentDate = new Date();
    return prepaymentRepository.findActiveByStudentId(studentId, currentDate);
  },

  getActivePrepaymentsByClassId: async (classId: number) => {
    const currentDate = new Date();
    return prepaymentRepository.findActiveByClassId(classId, currentDate);
  },

  createPrepayment: async (data: CreatePrepaymentData) => {
    const { studentId, classId, amount, startDate, endDate, createdBy } = data;

    // Validate input
    if (amount <= 0) {
      throw new ApiError(400, "Amount must be greater than zero");
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, "Invalid start or end date");
    }
    if (end < start) {
      throw new ApiError(400, "End date must be after start date");
    }
    // Normalize end to end of day
    end.setHours(23, 59, 59, 999);

    // Check for overlapping active prepayments
    const existingPrepayments =
      await prepaymentRepository.findOverlappingByStudentId(
        studentId,
        start,
        end
      );
    const hasOverlap = existingPrepayments.length > 0;

    if (hasOverlap) {
      throw new ApiError(
        400,
        "Student already has an active prepayment for this period"
      );
    }

    // Derive duration fields for backward compatibility (store as days)
    const msInDay = 1000 * 60 * 60 * 24;
    const rawDays = Math.ceil((end.getTime() - start.getTime()) / msInDay);
    const durationValue = Math.max(1, rawDays);

    return prepaymentRepository.create({
      student: { connect: { id: studentId } },
      class: { connect: { id: classId } },
      creator: { connect: { id: createdBy } },
      amount,
      durationType: "days",
      durationValue,
      startDate: start,
      endDate: end,
    });
  },

  updatePrepayment: async (id: number, data: UpdatePrepaymentData) => {
    const existingPrepayment = await prepaymentRepository.findById(id);
    if (!existingPrepayment) {
      throw new ApiError(404, "Prepayment not found");
    }

    const updateData: any = { ...data };
    // If dates are being updated, normalize and validate
    if (data.startDate || data.endDate) {
      const start = data.startDate
        ? new Date(data.startDate)
        : new Date(existingPrepayment.startDate);
      const end = data.endDate
        ? new Date(data.endDate)
        : new Date(existingPrepayment.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid start or end date");
      }
      if (end < start) {
        throw new ApiError(400, "End date must be after start date");
      }
      end.setHours(23, 59, 59, 999);

      // Ensure no overlapping ranges with other active prepayments for this student
      const overlaps = await prepaymentRepository.findOverlappingByStudentId(
        existingPrepayment.studentId,
        start,
        end
      );
      const otherOverlaps = overlaps.filter(
        (p) => p.id !== existingPrepayment.id
      );
      if (otherOverlaps.length > 0) {
        throw new ApiError(
          400,
          "Student already has an active prepayment that overlaps this period"
        );
      }
      // Derive and set duration fields for backward compatibility
      const msInDay = 1000 * 60 * 60 * 24;
      const rawDays = Math.ceil((end.getTime() - start.getTime()) / msInDay);
      const durationValue = Math.max(1, rawDays);
      updateData.startDate = start;
      updateData.endDate = end;
      updateData.durationType = "days";
      updateData.durationValue = durationValue;
    }

    return prepaymentRepository.update(id, updateData);
  },

  deletePrepayment: async (id: number) => {
    const existingPrepayment = await prepaymentRepository.findById(id);
    if (!existingPrepayment) {
      throw new ApiError(404, "Prepayment not found");
    }

    return prepaymentRepository.delete(id);
  },

  deactivatePrepayment: async (id: number) => {
    return prepaymentRepository.update(id, { isActive: false });
  },

  // Check if a student has active prepayment for a specific date
  hasActivePrepayment: async (studentId: number, date: Date) => {
    const activePrepayments = await prepaymentRepository.findActiveByStudentId(
      studentId,
      date
    );
    return activePrepayments.length > 0;
  },

  // Get students with active prepayments for a specific class and date
  getStudentsWithActivePrepayments: async (classId: number, date: Date) => {
    return prepaymentRepository.getStudentsWithActivePrepayments(classId, date);
  },

  // Cleanup expired prepayments (can be called by cron job)
  cleanupExpiredPrepayments: async () => {
    const currentDate = new Date();

    try {
      const expiredPrepayments =
        await prepaymentRepository.findExpiredPrepayments(currentDate);

      if (expiredPrepayments.length > 0) {
        await prepaymentRepository.deactivateExpired(currentDate);
        logger.info(
          `Deactivated ${expiredPrepayments.length} expired prepayments`
        );
      }

      return {
        deactivatedCount: expiredPrepayments.length,
        expiredPrepayments,
      };
    } catch (error) {
      logger.error("Error cleaning up expired prepayments:", error);
      throw error;
    }
  },

  // Get prepayment status for students in a class on a specific date
  getClassPrepaymentStatus: async (classId: number, date: Date) => {
    const studentsWithPrepayments =
      await prepaymentRepository.getStudentsWithActivePrepayments(
        classId,
        date
      );

    return studentsWithPrepayments.map((prepayment) => ({
      studentId: prepayment.student.id,
      studentName: prepayment.student.name,
      prepaymentId: prepayment.id,
      amount: prepayment.amount,
      startDate: prepayment.startDate,
      endDate: prepayment.endDate,
      durationType: prepayment.durationType,
      durationValue: prepayment.durationValue,
      isActive: prepayment.isActive,
    }));
  },
};
