import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private/Student
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.isPublished) return res.status(400).json({ message: "Course is not published yet" });

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    if (existing) return res.status(400).json({ message: "Already enrolled in this course" });

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId,
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrollmentCount: 1 } });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrolled courses for student
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single enrollment with progress
// @route   GET /api/enrollments/:courseId
// @access  Private
export const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    }).populate("course");

    if (!enrollment) return res.status(404).json({ message: "Not enrolled in this course" });

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a lesson as complete
// @route   PUT /api/enrollments/:courseId/lessons/:lessonId
// @access  Private/Student
export const markLessonComplete = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lessonId = req.params.lessonId;

    // Add lesson if not already completed
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Recalculate progress
    const totalLessons = course.lessons.length;
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    // Check if course is fully complete
    if (enrollment.progress === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/enrollments/:courseId
// @access  Private/Student
export const unenrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user._id,
      course: req.params.courseId,
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrollmentCount: -1 } });

    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};