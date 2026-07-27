import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BookOpen, Clock, Users, PlayCircle, CheckCircle, Lock, ArrowLeft, ShieldCheck } from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) fetchEnrollment();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch {
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollment = async () => {
    try {
      const { data } = await api.get(`/enrollments/${id}`);
      setEnrollment(data);
    } catch { /* not enrolled */ }
  };

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return; }
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      toast.success("Enrolled successfully! 🎉");
      navigate(`/learn/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;
  if (!course) return null;

  const totalMinutes = course.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link to="/courses" className="btn btn-ghost" style={{ marginBottom: 24, paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        {/* Responsive Detail Grid */}
        <div
          className="grid-layout"
          style={{
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Custom style logic to handle 1024px grid layouts via inline style calculation */}
          <div className="detail-grid-container">
            {/* Left Content */}
            <div style={{ order: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                <span className="badge badge-gold">{course.category}</span>
                <span className="badge badge-blue">{course.level}</span>
              </div>

              <h1 style={{
                fontSize: "clamp(26px, 4vw, 42px)",
                marginBottom: 20,
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                lineHeight: 1.15
              }}>
                {course.title}
              </h1>
              
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                marginBottom: 32,
                lineHeight: 1.7
              }}>
                {course.description}
              </p>

              {/* Stats Row */}
              <div style={{
                display: "flex",
                gap: 20,
                marginBottom: 36,
                flexWrap: "wrap",
                paddingBottom: 24,
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <Users size={16} color="var(--accent)" />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{course.enrollmentCount} enrolled</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <BookOpen size={16} color="var(--accent)" />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{course.lessons?.length || 0} lessons</span>
                </div>
                {totalMinutes > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <Clock size={16} color="var(--accent)" />
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                  </div>
                )}
              </div>

              {/* Instructor Section */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 48,
                background: "var(--bg-card)",
                padding: "16px 20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                maxWidth: "fit-content"
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--accent-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "2px solid var(--accent)"
                }}>
                  {course.instructor?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>Course Instructor</p>
                  <p style={{ fontWeight: 700, fontSize: "15px" }}>{course.instructor?.name}</p>
                </div>
              </div>

              {/* Curriculum */}
              <h2 style={{ fontSize: "22px", marginBottom: 20, fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                Course Curriculum
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                {course.lessons?.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No lessons have been added yet.</p>
                ) : (
                  course.lessons?.map((lesson, i) => (
                    <div
                      key={lesson._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        transition: "var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-light)";
                        e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.backgroundColor = "var(--bg-card)";
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        {enrollment ? (
                          <PlayCircle size={18} color="var(--accent)" />
                        ) : (
                          <Lock size={18} color="var(--text-muted)" />
                        )}
                      </div>
                      <span style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>
                        {i + 1}. {lesson.title}
                      </span>
                      {lesson.duration > 0 && (
                        <span className="badge badge-gold" style={{ fontSize: "10px", flexShrink: 0 }}>
                          {lesson.duration} mins
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Sticky Checkout Card */}
            <div className="checkout-sidebar-card" style={{ order: 2 }}>
              <div className="card" style={{
                position: "sticky",
                top: "100px",
                boxShadow: "var(--shadow-lg)",
                padding: "24px",
                background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(20, 27, 54, 0.4) 100%)",
              }}>
                {course.thumbnail && (
                  <div style={{ width: "100%", height: 180, overflow: "hidden", borderRadius: 12, marginBottom: 20 }}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                
                <div style={{
                  fontSize: "36px",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  marginBottom: 20,
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "baseline",
                }}>
                  {course.price > 0 ? (
                    <>
                      <span style={{ fontSize: "20px", marginRight: "2px" }}>$</span>
                      {course.price.toFixed(2)}
                    </>
                  ) : (
                    "Free"
                  )}
                </div>

                {enrollment ? (
                  <Link to={`/learn/${id}`} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                    <PlayCircle size={18} /> Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}

                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  {[
                    `${course.lessons?.length || 0} expert lessons`,
                    `Difficulty: ${course.level}`,
                    "Certificate of completion",
                    "Full lifetime access",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "13px", color: "var(--text-secondary)" }}>
                      <CheckCircle size={15} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 20,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                  color: "var(--success)"
                }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}