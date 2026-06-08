import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { BookOpen, PlayCircle, Award, CheckCircle } from "lucide-react";

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/my-courses").then(({ data }) => setEnrollments(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 32, marginBottom: 32 }}>My <span style={{ color: "var(--accent)" }}>Courses</span></h1>

        {enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "80px 0" }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 24 }}>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {enrollments.map((enr) => (
              <div key={enr._id} className="card" style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 20, alignItems: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 10,
                  background: enr.course?.thumbnail ? `url(${enr.course.thumbnail}) center/cover` : "var(--accent-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {!enr.course?.thumbnail && <BookOpen size={24} color="var(--accent)" />}
                </div>

                <div>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{enr.course?.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                    by {enr.course?.instructor?.name} · {enr.course?.category}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="progress-bar" style={{ width: 200 }}>
                      <div className="progress-fill" style={{ width: `${enr.progress}%` }} />
                    </div>
                    <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>{enr.progress}%</span>
                    {enr.isCompleted && <span className="badge badge-green"><CheckCircle size={10} /> Done</span>}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <Link to={`/learn/${enr.course?._id}`} className="btn btn-primary" style={{ padding: "8px 18px" }}>
                    <PlayCircle size={15} /> {enr.progress > 0 ? "Continue" : "Start"}
                  </Link>
                  {enr.isCompleted && (
                    <a href={`/api/certificates/${enr.course?._id}`} target="_blank" className="btn btn-outline" style={{ padding: "8px 18px", fontSize: 13 }}>
                      <Award size={14} /> Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}