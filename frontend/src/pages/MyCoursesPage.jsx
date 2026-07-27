import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { BookOpen, PlayCircle, Award, CheckCircle } from "lucide-react";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/my-courses")
      .then(({ data }) => setEnrollments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: "32px", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
            My <span style={{ color: "var(--accent)" }}>Courses</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: 4 }}>
            You have enrolled in {enrollments.length} course{enrollments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {enrollments.length === 0 ? (
          <div className="card fade-up" style={{
            textAlign: "center",
            padding: "80px 40px",
            maxWidth: "500px",
            margin: "0 auto",
            borderStyle: "dashed"
          }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 20, opacity: 0.5 }} />
            <h3 style={{ fontSize: "18px", marginBottom: 8 }}>No Active Enrollments</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
              You haven't enrolled in any courses yet. Explore our extensive courses database and find your path!
            </p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="fade-up">
            {enrollments.map((enr) => {
              const hasThumbnail = !!enr.course?.thumbnail;
              return (
                <div
                  key={enr._id}
                  className="card"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 24px",
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {hasThumbnail ? (
                      <img src={enr.course.thumbnail} alt={enr.course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <BookOpen size={24} color="var(--accent)" style={{ opacity: 0.5 }} />
                    )}
                  </div>

                  {/* Course Details */}
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <span className="badge badge-gold" style={{ fontSize: "9px", marginBottom: 6 }}>
                      {enr.course?.category}
                    </span>
                    
                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                      {enr.course?.title}
                    </h3>
                    
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: 12, fontWeight: 500 }}>
                      Instructor: <span style={{ color: "var(--text-secondary)" }}>{enr.course?.instructor?.name}</span>
                    </p>

                    {/* Progress tracking */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="progress-bar" style={{ width: "160px", flexShrink: 0 }}>
                        <div className="progress-fill" style={{ width: `${enr.progress}%` }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>
                        {enr.progress}% Completed
                      </span>
                      {enr.isCompleted && (
                        <span className="badge badge-green" style={{ padding: "2px 8px", fontSize: "10px" }}>
                          <CheckCircle size={10} style={{ marginRight: 3 }} /> Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    flexShrink: 0,
                    marginLeft: "auto"
                  }} className="mobile-full-width-buttons">
                    {enr.isCompleted && (
                      <a
                        href={`/api/certificates/${enr.course?._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: "8px 18px", fontSize: "13px" }}
                      >
                        <Award size={14} /> Certificate
                      </a>
                    )}
                    <Link
                      to={`/learn/${enr.course?._id}`}
                      className="btn btn-primary"
                      style={{ padding: "8px 20px" }}
                    >
                      <PlayCircle size={15} /> {enr.progress > 0 ? "Continue" : "Start Learning"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}