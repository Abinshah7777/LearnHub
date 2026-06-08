import express from "express";
import {
  getCourses, getCourse, createCourse, updateCourse,
  deleteCourse, getInstructorCourses, addLesson, deleteLesson,
} from "../controllers/courseController.js";
import { protect, instructorOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/instructor/my-courses", protect, instructorOnly, getInstructorCourses);
router.get("/:id", getCourse);
router.post("/", protect, instructorOnly, upload.single("thumbnail"), createCourse);
router.put("/:id", protect, instructorOnly, upload.single("thumbnail"), updateCourse);
router.delete("/:id", protect, instructorOnly, deleteCourse);

// Lesson routes (nested)
router.post("/:id/lessons", protect, instructorOnly, upload.single("file"), addLesson);
router.delete("/:id/lessons/:lessonId", protect, instructorOnly, deleteLesson);

export default router;