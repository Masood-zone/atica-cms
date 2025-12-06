import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { reportsController } from "../controllers/reports-controller";

const router = express.Router();

router.use(authenticate);

// Paid report for a class (optional ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/class/:classId/paid", reportsController.getPaidByClass);

// Unpaid report for a class (optional ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/class/:classId/unpaid", reportsController.getUnpaidByClass);

export const reportsRoutes = router;
