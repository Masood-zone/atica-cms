"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRepository = void 0;
const client_1 = require("../client");
exports.expenseRepository = {
    findAll: async (filter) => {
        const where = {};
        if ((filter === null || filter === void 0 ? void 0 : filter.from) || (filter === null || filter === void 0 ? void 0 : filter.to)) {
            where.date = {};
            if (filter.from)
                where.date.gte = filter.from;
            if (filter.to)
                where.date.lte = filter.to;
        }
        return client_1.prisma.expense.findMany({
            where,
            include: {
                reference: true,
            },
            orderBy: {
                date: "desc",
            },
        });
    },
    findById: async (id) => {
        return client_1.prisma.expense.findUnique({
            where: { id },
            include: {
                reference: true,
            },
        });
    },
    create: async (data) => {
        return client_1.prisma.expense.create({
            data,
            include: {
                reference: true,
            },
        });
    },
    update: async (id, data) => {
        return client_1.prisma.expense.update({
            where: { id },
            data,
            include: {
                reference: true,
            },
        });
    },
    delete: async (id) => {
        return client_1.prisma.expense.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=expense-repository.js.map