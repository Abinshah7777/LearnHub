import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name avatar")
        .select("-lessons")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(query),
    ]);

    res.json({ courses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course (with lessons)
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name avatar bio");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Instructor
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, tags } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price: price || 0,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      instructor: req.user._id,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor (own course)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const { title, description, category, level, price, tags, isPublished } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.level = level || course.level;
    course.price = price !== undefined ? price : course.price;
    course.tags = tags ? tags.split(",").map((t) => t.trim()) : course.tags;
    if (isPublished !== undefined) course.isPublished = isPublished === "true" || isPublished === true;
    if (req.file) course.thumbnail = `/uploads/${req.file.filename}`;

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor (own course)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses by logged-in instructor
// @route   GET /api/courses/instructor/my-courses
// @access  Private/Instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private/Instructor
export const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, videoUrl, duration } = req.body;
    const lesson = {
      title,
      description,
      videoUrl: videoUrl || "",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : "",
      fileName: req.file ? req.file.originalname : "",
      duration: duration || 0,
      order: course.lessons.length + 1,
    };

    course.lessons.push(lesson);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lesson from course
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private/Instructor
export const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== req.params.lessonId
    );
    // Re-order
    course.lessons = course.lessons.map((l, i) => ({ ...l._doc, order: i + 1 }));

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};