import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
  fileName: { type: String, default: "" },
  duration: { type: Number, default: 0 }, // in minutes
  order: { type: Number, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    price: {
      type: Number,
      default: 0,
    },
    lessons: [lessonSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;