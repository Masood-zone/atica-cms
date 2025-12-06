import { settingsRepository } from "../db/repositories/settings-repository";
import { prisma } from "../db/client";
import { ApiError } from "../utils/api-error";

export const settingsService = {
  getAmount: async () => {
    const setting = await settingsRepository.findByName("amount");
    return {
      data: setting,
      deprecated: true,
      message: "Global amount is deprecated. Use per-class canteenPrice.",
    };
  },

  createAmount: async (value: string) => {
    const amount = Number.parseFloat(value);

    if (isNaN(amount)) {
      throw new ApiError(400, "Invalid amount: must be a number");
    }

    const setting = await settingsRepository.create({
      name: "amount",
      value: amount.toString(),
    });

    return { data: setting };
  },

  updateAmount: async (value: string) => {
    const amount = Number.parseFloat(value);

    if (isNaN(amount)) {
      throw new ApiError(400, "Invalid amount: must be a number");
    }

    const setting = await settingsRepository.update(
      "amount",
      amount.toString()
    );
    return {
      data: setting,
      deprecated: true,
      message:
        "Global amount updated but feature is deprecated. Prefer class canteenPrice.",
    };
  },
  getClassPrices: async () => {
    const classes = await prisma.class.findMany({
      select: { id: true, name: true, canteenPrice: true },
      orderBy: { name: "asc" },
    });
    return { data: classes };
  },
};
