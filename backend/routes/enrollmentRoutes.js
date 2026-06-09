import express from "express";
import {
  enrollCourse, 
  getMyEnrollments, 
  getEnrollment,
  markLessonComplete, 
  unenrollCourse,
  getAllEnrollments, // Ensure this is imported
} from "../controllers/enrollmentController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student Routes
router.get("/my-courses", protect, getMyEnrollments);
router.get("/:courseId", protect, getEnrollment);
router.post("/:courseId", protect, enrollCourse);
router.put("/:courseId/lessons/:lessonId", protect, markLessonComplete);
router.delete("/:courseId", protect, unenrollCourse);

// Admin Route
router.get("/admin/all", protect, isAdmin, getAllEnrollments);

export default router;