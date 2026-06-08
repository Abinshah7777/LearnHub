import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
 
// Routes
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
 
dotenv.config();
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();
 
// Connect to MongoDB
connectDB();
 
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
// Rate limiting
app.use("/api", apiLimiter);
 
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/certificates", certificateRoutes);
 
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Course Portal API is running" });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});