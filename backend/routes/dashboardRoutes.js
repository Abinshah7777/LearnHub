import express from "express";
import { getStudentDashboard, getInstructorDashboard, getAdminDashboard } from "../controllers/dashboardController.js";
import { protect, instructorOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, getStudentDashboard);
router.get("/instructor", protect, instructorOnly, getInstructorDashboard);
router.get("/admin", protect, adminOnly, getAdminDashboard);

export default router;