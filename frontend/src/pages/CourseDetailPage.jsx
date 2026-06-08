import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BookOpen, Clock, Users, PlayCircle, CheckCircle, Lock, ArrowLeft } from "lucide-react";

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="badge badge-gold">{course.category}</span>
              <span className="badge badge-blue">{course.level}</span>
            </div>

            <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", marginBottom: 16 }}>{course.title}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 24, lineHeight: 1.7 }}>
              {course.description}
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={16} color="var(--accent)" />
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{course.enrollmentCount} enrolled</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={16} color="var(--accent)" />
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{course.lessons?.length || 0} lessons</span>
              </div>
              {totalMinutes > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={16} color="var(--accent)" />
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                {course.instructor?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Instructor</p>
                <p style={{ fontWeight: 600 }}>{course.instructor?.name}</p>
              </div>
            </div>

            {/* Lessons */}
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Course Curriculum</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {course.lessons?.length === 0 && (
                <p style={{ color: "var(--text-muted)" }}>No lessons added yet.</p>
              )}
              {course.lessons?.map((lesson, i) => (
                <div key={lesson._id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: 10,
                }}>
                  {enrollment ? (
                    <PlayCircle size={18} color="var(--accent)" />
                  ) : (
                    <Lock size={18} color="var(--text-muted)" />
                  )}
                  <span style={{ flex: 1, fontSize: 14 }}>{lesson.title}</span>
                  {lesson.duration > 0 && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{lesson.duration}m</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Enroll card */}
          <div style={{ position: "sticky", top: 84 }}>
            <div className="card">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
              )}
              <div style={{ fontSize: 32, fontFamily: "Syne", fontWeight: 800, marginBottom: 20, color: "var(--accent)" }}>
                {course.price > 0 ? `$${course.price}` : "Free"}
              </div>

              {enrollment ? (
                <Link to={`/learn/${id}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                  <PlayCircle size={18} /> Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  `${course.lessons?.length || 0} lessons`,
                  `Level: ${course.level}`,
                  "Certificate on completion",
                  "Lifetime access",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <CheckCircle size={14} color="var(--success)" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}