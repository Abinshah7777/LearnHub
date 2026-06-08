import PDFDocument from "pdfkit";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate certificate for completed course
// @route   GET /api/certificates/:courseId
// @access  Private/Student
export const generateCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    if (!enrollment.isCompleted) {
      return res.status(400).json({ message: "Course not completed yet" });
    }

    const [course, student] = await Promise.all([
      Course.findById(req.params.courseId).populate("instructor", "name"),
      User.findById(req.user._id).select("name email"),
    ]);

    // Create PDF
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${student.name.replace(/\s/g, "_")}-${course.title.replace(/\s/g, "_")}.pdf"`
    );

    doc.pipe(res);

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#0f172a");

    // Gold border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(4)
      .stroke("#f0c040");

    // Inner border
    doc
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1)
      .stroke("#f0c04080");

    // Title
    doc
      .fillColor("#f0c040")
      .font("Helvetica-Bold")
      .fontSize(42)
      .text("CERTIFICATE OF COMPLETION", 0, 80, { align: "center" });

    // Subtitle
    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(16)
      .text("This is to certify that", 0, 150, { align: "center" });

    // Student name
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(36)
      .text(student.name, 0, 185, { align: "center" });

    // Line under name
    const nameWidth = 300;
    const lineX = (doc.page.width - nameWidth) / 2;
    doc.moveTo(lineX, 235).lineTo(lineX + nameWidth, 235).lineWidth(1).stroke("#f0c040");

    // Course text
    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(16)
      .text("has successfully completed the course", 0, 255, { align: "center" });

    // Course title
    doc
      .fillColor("#f0c040")
      .font("Helvetica-Bold")
      .fontSize(28)
      .text(`"${course.title}"`, 0, 285, { align: "center" });

    // Instructor
    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(14)
      .text(`Instructed by ${course.instructor.name}`, 0, 330, { align: "center" });

    // Completion date
    const completedDate = new Date(enrollment.completedAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    doc
      .fillColor("#64748b")
      .fontSize(12)
      .text(`Completed on ${completedDate}`, 0, 365, { align: "center" });

    // Platform name
    doc
      .fillColor("#f0c040")
      .fontSize(11)
      .text("Course Portal — Online Learning Platform", 0, doc.page.height - 60, { align: "center" });

    doc.end();

    // Mark certificate as issued
    enrollment.certificateIssued = true;
    await enrollment.save();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};