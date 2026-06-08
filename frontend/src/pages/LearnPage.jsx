import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";
import { CheckCircle, Circle, Award, ArrowLeft, ExternalLink, FileText } from "lucide-react";

export default function LearnPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchData();
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", flex: 1, maxHeight: "calc(100vh - 64px)", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          background: "var(--bg-secondary)", borderRight: "1px solid var(--border)",
          overflowY: "auto", padding: "24px 0",
        }}>
          <div style={{ padding: "0 20px 20px" }}>
            <Link to="/my-courses" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              <ArrowLeft size={14} /> My Courses
            </Link>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{course?.title}</h2>

            {/* Progress */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{enrollment?.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${enrollment?.progress || 0}%` }} />
              </div>
            </div>

            {enrollment?.isCompleted && (
              <button onClick={handleCertificate} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16, fontSize: 13 }}>
                <Award size={15} /> Download Certificate
              </button>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8 }}>
            <p style={{ padding: "8px 20px", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Lessons
            </p>
            {course?.lessons?.map((lesson, i) => {
              const done = isLessonCompleted(lesson._id);
              const active = activeLesson?._id === lesson._id;
              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  style={{
                    width: "100%", textAlign: "left", padding: "12px 20px",
                    background: active ? "var(--accent-dim)" : "transparent",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                    borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {done
                    ? <CheckCircle size={16} color="var(--success)" />
                    : <Circle size={16} color="var(--text-muted)" />}
                  <span style={{ fontSize: 13, color: active ? "var(--accent)" : done ? "var(--text-secondary)" : "var(--text-primary)", flex: 1, lineHeight: 1.3 }}>
                    {i + 1}. {lesson.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div style={{ overflowY: "auto", padding: 40 }}>
          {activeLesson ? (
            <div className="fade-up">
              <h1 style={{ fontSize: 28, marginBottom: 8 }}>{activeLesson.title}</h1>
              <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: 15 }}>{activeLesson.description}</p>

              {/* Video embed */}
              {activeLesson.videoUrl && (
                <div style={{ marginBottom: 32, borderRadius: 12, overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    width="100%" height="100%"
                    style={{ border: "none", display: "block" }}
                    allowFullScreen
                  />
                </div>
              )}

              {/* File attachment */}
              {activeLesson.fileUrl && (
                <a
                  href={activeLesson.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ marginBottom: 32 }}
                >
                  <FileText size={16} /> {activeLesson.fileName || "Download Material"}
                  <ExternalLink size={14} />
                </a>
              )}

              {/* Mark complete */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
                {isLessonCompleted(activeLesson._id) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)" }}>
                    <CheckCircle size={18} /> Lesson completed
                  </div>
                ) : (
                  <button
                    onClick={() => handleComplete(activeLesson._id)}
                    disabled={completing}
                    className="btn btn-primary"
                  >
                    {completing ? "Saving..." : "Mark as Complete"}
                  </button>
                )}

                {/* Next lesson */}
                {(() => {
                  const idx = course?.lessons?.findIndex(l => l._id === activeLesson._id);
                  const next = course?.lessons?.[idx + 1];
                  return next ? (
                    <button onClick={() => setActiveLesson(next)} className="btn btn-outline">
                      Next Lesson →
                    </button>
                  ) : null;
                })()}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <p>Select a lesson to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}