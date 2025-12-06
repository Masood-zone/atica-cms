"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseController = void 0;
const expense_service_1 = require("../../services/expense-service");
const reference_service_1 = require("../../services/reference-service");
const catch_async_1 = require("../../utils/catch-async");
exports.expenseController = {
    getAllExpenses: (0, catch_async_1.catchAsync)(async (req, res) => {
        let { from, to, period } = req.query;
        let filter = {};
        const now = new Date();
        if (period && period !== "all") {
            if (period === "year") {
                filter.from = new Date(now.getFullYear(), 0, 1);
                filter.to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            }
            else if (period === "month") {
                filter.from = new Date(now.getFullYear(), now.getMonth(), 1);
                filter.to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            }
            else if (period === "week") {
                const day = now.getDay();
                const diffToMonday = (day + 6) % 7;
                filter.from = new Date(now);
                filter.from.setDate(now.getDate() - diffToMonday);
                filter.from.setHours(0, 0, 0, 0);
                filter.to = new Date(filter.from);
                filter.to.setDate(filter.from.getDate() + 6);
                filter.to.setHours(23, 59, 59, 999);
            }
        }
        else {
            if (from)
                filter.from = new Date(from);
            if (to)
                filter.to = new Date(to);
        }
        const expenses = await expense_service_1.expenseService.getAllExpenses(filter);
        res.status(200).json(expenses);
    }),
    getExpenseById: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const expense = await expense_service_1.expenseService.getExpenseById(id);
        res.status(200).json(expense);
    }),
    createExpense: (0, catch_async_1.catchAsync)(async (req, res) => {
        const expense = await expense_service_1.expenseService.createExpense(req.body);
        res.status(201).json(expense);
    }),
    updateExpense: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const expense = await expense_service_1.expenseService.updateExpense(id, req.body);
        res.status(200).json(expense);
    }),
    deleteExpense: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        await expense_service_1.expenseService.deleteExpense(id);
        res.status(204).end();
    }),
    getAllReferences: (0, catch_async_1.catchAsync)(async (req, res) => {
        const references = await reference_service_1.referenceService.getAllReferences();
        res.status(200).json(references);
    }),
    getReferenceById: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const reference = await reference_service_1.referenceService.getReferenceById(id);
        res.status(200).json(reference);
    }),
    createReference: (0, catch_async_1.catchAsync)(async (req, res) => {
        const reference = await reference_service_1.referenceService.createReference(req.body);
        res.status(201).json(reference);
    }),
    updateReference: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const reference = await reference_service_1.referenceService.updateReference(id, req.body);
        res.status(200).json(reference);
    }),
    deleteReference: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        await reference_service_1.referenceService.deleteReference(id);
        res.status(204).end();
    }),
};
//# sourceMappingURL=expense-controller.js.map