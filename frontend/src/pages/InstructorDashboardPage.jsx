import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BookOpen, Users, CheckCircle, Eye, Plus, Edit, Trash2, TrendingUp } from "lucide-react";

export default function InstructorDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await api.get("/dashboard/instructor");
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      toast.success("Course deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleTogglePublish = async (courseId, current) => {
    try {
      await api.put(`/courses/${courseId}`, { isPublished: !current });
      toast.success(current ? "Course unpublished" : "Course published!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, marginBottom: 4 }}>Instructor <span style={{ color: "var(--accent)" }}>Dashboard</span></h1>
            <p style={{ color: "var(--text-secondary)" }}>Manage your courses and track student progress</p>
          </div>
          <Link to="/instructor/courses/create" className="btn btn-primary">
            <Plus size={18} /> Create Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 48 }}>
          <StatCard icon={<BookOpen size={22} />} label="Total Courses" value={data?.stats?.totalCourses || 0} />
          <StatCard icon={<Eye size={22} />} label="Published" value={data?.stats?.publishedCourses || 0} color="var(--success)" />
          <StatCard icon={<Users size={22} />} label="Total Students" value={data?.stats?.totalEnrollments || 0} color="var(--info)" />
          <StatCard icon={<CheckCircle size={22} />} label="Completions" value={data?.stats?.completedStudents || 0} color="#a78bfa" />
        </div>

        {/* Courses table */}
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Your Courses</h2>
        {data?.courseStats?.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>No courses yet. Create your first one!</p>
            <Link to="/instructor/courses/create" className="btn btn-primary"><Plus size={16} /> Create Course</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data?.courseStats?.map((course) => (
              <div key={course._id} className="card" style={{ display: "grid", gridTemplateColumns: "52px 1fr auto auto auto", gap: 20, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 8, background: course.thumbnail ? `url(${course.thumbnail}) center/cover` : "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!course.thumbnail && <BookOpen size={20} color="var(--accent)" />}
                </div>

                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{course.title}</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{course.enrollmentCount} students</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{course.completions} completions</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Avg {course.avgProgress}%</span>
                  </div>
                </div>

                <span className={`badge ${course.isPublished ? "badge-green" : "badge-red"}`}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleTogglePublish(course._id, course.isPublished)}
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                    title={course.isPublished ? "Unpublish" : "Publish"}
                  >
                    <Eye size={14} /> {course.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <Link to={`/instructor/courses/${course._id}/edit`} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }}>
                    <Edit size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(course._id)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: 12 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}