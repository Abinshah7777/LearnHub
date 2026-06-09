import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Extra details collected at enrollment
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    linkedIn: {
      type: String,
      default: "",
      trim: true,
    },
    experience: {
      type: String,
      enum: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
      required: [true, "Professional experience level is required"],
    },
    motivation: {
      type: String,
      default: "",
      maxlength: 500,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    progress: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;