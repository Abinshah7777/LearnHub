import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// @desc    Enroll in a course (with extra details form)
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

    // Server-side validation of required extra details
    const { phone, linkedIn, experience, motivation } = req.body;

    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!/^\+?[\d\s\-()]{7,20}$/.test(phone.trim())) {
      return res.status(400).json({ message: "Please enter a valid phone number" });
    }
    if (!experience) {
      return res.status(400).json({ message: "Professional experience level is required" });
    }
    const validExperience = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];
    if (!validExperience.includes(experience)) {
      return res.status(400).json({ message: "Invalid experience level" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId,
      phone: phone.trim(),
      linkedIn: linkedIn ? linkedIn.trim() : "",
      experience,
      motivation: motivation ? motivation.trim() : "",
    });

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

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

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

// @desc    Get all enrollments with user + course details (admin aggregation)
// @route   GET /api/enrollments/admin/all
// @access  Private/Admin
export const getAllEnrollments = async (req, res) => {
  try {
    const { courseId, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (courseId) query.course = courseId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let enrollments = await Enrollment.find(query)
      .populate("student", "name email avatar role createdAt")
      .populate("course", "title category level instructor enrollmentCount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Apply search filter after population
    if (search) {
      const s = search.toLowerCase();
      enrollments = enrollments.filter(
        (e) =>
          e.student?.name?.toLowerCase().includes(s) ||
          e.student?.email?.toLowerCase().includes(s) ||
          e.course?.title?.toLowerCase().includes(s)
      );
    }

    const total = await Enrollment.countDocuments(query);

    res.json({ enrollments, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};