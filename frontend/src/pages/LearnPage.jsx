import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";
import { CheckCircle, Circle, Award, ArrowLeft, ExternalLink, FileText, Menu, X, Play, BookOpen } from "lucide-react";

export default function LearnPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Responsive Sidebar States
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseRes, enrollRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/enrollments/${courseId}`),
      ]);
      setCourse(courseRes.data);
      setEnrollment(enrollRes.data);
      if (courseRes.data.lessons?.length > 0) {
        setActiveLesson(courseRes.data.lessons[0]);
      }
    } catch {
      navigate("/my-courses");
    } finally {
      setLoading(false);
    }
  };

  const isLessonCompleted = (lessonId) =>
    enrollment?.completedLessons?.some((id) => id.toString() === lessonId.toString());

  const handleComplete = async (lessonId) => {
    if (isLessonCompleted(lessonId) || completing) return;
    setCompleting(true);
    try {
      const { data } = await api.put(`/enrollments/${courseId}/lessons/${lessonId}`);
      setEnrollment(data);
      if (data.isCompleted) {
        toast.success("🎉 Course completed! Check your certificate.");
      } else {
        toast.success("Lesson marked complete!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark lesson");
    } finally {
      setCompleting(false);
    }
  };

  const handleCertificate = () => {
    window.open(`/api/certificates/${courseId}`, "_blank");
  };

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Mobile Top Control Bar */}
      {isMobile && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          zIndex: 80
        }}>
          <Link to="/my-courses" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-outline"
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            <BookOpen size={14} /> {sidebarOpen ? "Hide Playlist" : "Show Playlist"}
          </button>
        </div>
      )}

      {/* Main Workspace Split Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* Course Sidebar */}
        <div style={{
          width: isMobile ? "280px" : "320px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: isMobile ? "absolute" : "static",
          top: 0,
          bottom: 0,
          left: 0,
          transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 85,
        }}>
          {/* Header Progress Info */}
          <div style={{ padding: "24px 20px 16px" }}>
            {!isMobile && (
              <Link to="/my-courses" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13px", color: "var(--text-secondary)", marginBottom: 16, fontWeight: 500 }}>
                <ArrowLeft size={14} /> Back to My Courses
              </Link>
            )}
            <h2 style={{ fontSize: "16px", fontWeight: 800, marginBottom: 16, lineHeight: 1.4, fontFamily: "var(--font-heading)" }}>
              {course?.title}
            </h2>

            {/* Progress Slider */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Course Progress</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>{enrollment?.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${enrollment?.progress || 0}%` }} />
              </div>
            </div>

            {enrollment?.isCompleted && (
              <button
                onClick={handleCertificate}
                className="btn btn-primary"
                style={{ width: "100%", padding: "10px", fontSize: "12px", marginTop: 12 }}
              >
                <Award size={15} /> Download Certificate
              </button>
            )}
          </div>

          {/* Lessons Scroll List */}
          <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
            <p style={{ padding: "8px 20px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Syllabus Curriculum
            </p>
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              {course?.lessons?.map((lesson, i) => {
                const done = isLessonCompleted(lesson._id);
                const active = activeLesson?._id === lesson._id;
                return (
                  <button
                    key={lesson._id}
                    onClick={() => {
                      setActiveLesson(lesson);
                      if (isMobile) setSidebarOpen(false); // auto-collapse sidebar drawer on select
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "14px 20px",
                      background: active ? "var(--accent-dim)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderLeft: active ? "4px solid var(--accent)" : "4px solid transparent",
                      transition: "var(--transition-fast)",
                    }}
                    onMouseEnter={e => {
                      if (!active) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    }}
                    onMouseLeave={e => {
                      if (!active) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done ? (
                        <CheckCircle size={16} color="var(--success)" />
                      ) : (
                        <Circle size={16} color="var(--text-muted)" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "13px",
                        fontWeight: active ? 700 : 500,
                        color: active ? "var(--accent)" : done ? "var(--text-secondary)" : "var(--text-primary)",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {i + 1}. {lesson.title}
                      </p>
                      {lesson.duration > 0 && (
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{lesson.duration}m</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Backdrop for mobile drawer overlay */}
        {isMobile && sidebarOpen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 82,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Workspace Panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "24px 16px" : "40px", position: "relative" }}>
          {activeLesson ? (
            <div className="fade-up" style={{ maxWidth: "880px", margin: "0 auto" }}>
              
              {/* Header Title */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, marginBottom: 8, fontFamily: "var(--font-heading)" }}>
                  {activeLesson.title}
                </h1>
                {activeLesson.description && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                    {activeLesson.description}
                  </p>
                )}
              </div>

              {/* Video Player */}
              {activeLesson.videoUrl ? (
                <div style={{
                  marginBottom: 32,
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg)",
                  background: "#000",
                  aspectRatio: "16/9",
                  border: "1px solid var(--border)",
                }}>
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    width="100%"
                    height="100%"
                    style={{ border: "none", display: "block" }}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{
                  marginBottom: 32,
                  borderRadius: "var(--radius-lg)",
                  border: "2px dashed var(--border)",
                  aspectRatio: "16/9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  padding: 24,
                  textAlign: "center"
                }}>
                  <Play size={44} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>No video attachment for this lesson.</p>
                </div>
              )}

              {/* File Attachment & Downloader */}
              {activeLesson.fileUrl && (
                <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", marginBottom: 32, gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {activeLesson.fileName || "Lesson Materials"}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Downloadable helper files</p>
                    </div>
                  </div>
                  <a
                    href={activeLesson.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                  >
                    Download <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* Actions & Navigation Controls */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
                marginTop: 40
              }}>
                <div>
                  {isLessonCompleted(activeLesson._id) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontWeight: 600, fontSize: "14px" }}>
                      <CheckCircle size={18} /> Complete
                    </div>
                  ) : (
                    <button
                      onClick={() => handleComplete(activeLesson._id)}
                      disabled={completing}
                      className="btn btn-primary"
                      style={{ padding: "10px 24px" }}
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>

                {/* Next lesson button */}
                {(() => {
                  const idx = course?.lessons?.findIndex(l => l._id === activeLesson._id);
                  const next = course?.lessons?.[idx + 1];
                  return next ? (
                    <button
                      onClick={() => setActiveLesson(next)}
                      className="btn btn-outline"
                      style={{ padding: "10px 24px" }}
                    >
                      Next Lesson →
                    </button>
                  ) : null;
                })()}
              </div>

            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "var(--text-muted)", textAlign: "center" }}>
              <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <h3 style={{ fontSize: "18px", color: "var(--text-primary)", marginBottom: 6 }}>Select a Lesson</h3>
              <p style={{ fontSize: "14px" }}>Expand the course menu and pick a lesson to start learning.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}