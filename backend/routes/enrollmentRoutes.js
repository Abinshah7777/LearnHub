import express from "express";
import {
  enrollCourse, getMyEnrollments, getEnrollment,
  markLessonComplete, unenrollCourse,
} from "../controllers/enrollmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-courses", protect, getMyEnrollments);
router.get("/:courseId", protect, getEnrollment);
router.post("/:courseId", protect, enrollCourse);
router.put("/:courseId/lessons/:lessonId", protect, markLessonComplete);
router.delete("/:courseId", protect, unenrollCourse);

export default router;