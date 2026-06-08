import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
// @access  Private/Student
export const getStudentDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate(
      "course",
      "title thumbnail category instructor"
    );

    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter((e) => e.isCompleted).length;
    const inProgress = enrollments.filter((e) => !e.isCompleted && e.progress > 0).length;
    const avgProgress =
      totalEnrolled > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrolled)
        : 0;

    // Recent activity (last 5)
    const recentEnrollments = enrollments
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    res.json({
      stats: { totalEnrolled, completed, inProgress, avgProgress },
      recentEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/dashboard/instructor
// @access  Private/Instructor
export const getInstructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.isPublished).length;
    const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const completedStudents = enrollments.filter((e) => e.isCompleted).length;

    // Per-course breakdown
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = await Enrollment.find({ course: course._id });
        return {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          isPublished: course.isPublished,
          enrollmentCount: course.enrollmentCount,
          completions: courseEnrollments.filter((e) => e.isCompleted).length,
          avgProgress:
            courseEnrollments.length > 0
              ? Math.round(
                  courseEnrollments.reduce((s, e) => s + e.progress, 0) / courseEnrollments.length
                )
              : 0,
        };
      })
    );

    res.json({
      stats: { totalCourses, publishedCourses, totalEnrollments, completedStudents },
      courseStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
    ]);

    const students = await User.countDocuments({ role: "student" });
    const instructors = await User.countDocuments({ role: "instructor" });
    const publishedCourses = await Course.countDocuments({ isPublished: true });

    res.json({
      totalUsers, students, instructors,
      totalCourses, publishedCourses,
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};