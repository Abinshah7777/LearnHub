import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Modal from "../components/Modal";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BookOpen, Users, CheckCircle, Eye, Plus, Edit, Trash2 } from "lucide-react";

export default function InstructorDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: res } = await api.get("/dashboard/instructor");
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (courseId) => {
    setSelectedCourseId(courseId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourseId) return;
    try {
      await api.delete(`/courses/${selectedCourseId}`);
      toast.success("Course deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleTogglePublish = async (courseId, current) => {
    try {
      await api.put(`/courses/${courseId}`, { isPublished: !current });
      toast.success(current ? "Course unpublished" : "Course published! 🎉");
      fetchData();
    } catch (err) {
      toast.error("Failed to update course status");
    }
  };

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div>
      <Navbar />
      
      {/* Custom Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course?"
        message="Are you sure you want to delete this course? This will remove all associated lessons and enrollments permanently. This action cannot be undone."
        confirmText="Delete permanently"
        cancelText="Keep Course"
        type="danger"
      />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }} className="fade-up">
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: 6, fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              Instructor <span style={{ color: "var(--accent)" }}>Dashboard</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Manage your curricula, view students, and track completions</p>
          </div>
          <Link to="/instructor/courses/create" className="btn btn-primary" style={{ padding: "12px 24px" }}>
            <Plus size={18} /> Create Course
          </Link>
        </div>

        {/* Statistics Widgets Grid */}
        <div className="grid-4 fade-up" style={{ marginBottom: 48 }}>
          <StatCard icon={<BookOpen size={20} />} label="Total Courses" value={data?.stats?.totalCourses || 0} />
          <StatCard icon={<Eye size={20} />} label="Published" value={data?.stats?.publishedCourses || 0} color="var(--success)" />
          <StatCard icon={<Users size={20} />} label="Enrolled Students" value={data?.stats?.totalEnrollments || 0} color="var(--info)" />
          <StatCard icon={<CheckCircle size={20} />} label="Completions" value={data?.stats?.completedStudents || 0} color="#a78bfa" />
        </div>

        {/* Courses Table / List */}
        <h2 style={{ fontSize: "20px", marginBottom: 20, fontFamily: "var(--font-heading)", fontWeight: 700 }} className="fade-up">
          Your Courses
        </h2>

        {data?.courseStats?.length === 0 ? (
          <div className="card fade-up" style={{ textAlign: "center", padding: "80px 40px", borderStyle: "dashed" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "14px" }}>
              You haven't created any courses yet. Share your knowledge with the world!
            </p>
            <Link to="/instructor/courses/create" className="btn btn-primary">
              <Plus size={16} /> Create Your First Course
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="fade-up">
            {data?.courseStats?.map((course) => {
              const hasThumbnail = !!course.thumbnail;
              return (
                <div
                  key={course._id}
                  className="card"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 20,
                    padding: "18px 24px",
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {hasThumbnail ? (
                      <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <BookOpen size={20} color="var(--accent)" style={{ opacity: 0.5 }} />
                    )}
                  </div>

                  {/* Course Info */}
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: 4, color: "var(--text-primary)" }}>
                      {course.title}
                    </p>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        <strong>{course.enrollmentCount}</strong> students
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        <strong>{course.completions}</strong> completions
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Avg progress: <strong style={{ color: "var(--accent)" }}>{course.avgProgress}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ flexShrink: 0 }}>
                    <span className={`badge ${course.isPublished ? "badge-green" : "badge-red"}`} style={{ padding: "6px 12px" }}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {/* Actions Buttons */}
                  <div style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                    marginLeft: "auto"
                  }} className="mobile-full-width-buttons">
                    <button
                      onClick={() => handleTogglePublish(course._id, course.isPublished)}
                      className="btn btn-ghost"
                      style={{ padding: "8px 12px", fontSize: "12px" }}
                      title={course.isPublished ? "Unpublish Course" : "Publish Course"}
                    >
                      <Eye size={14} style={{ marginRight: 4 }} /> {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      to={`/instructor/courses/${course._id}/edit`}
                      className="btn btn-outline"
                      style={{ padding: "8px 14px", fontSize: "12px" }}
                    >
                      <Edit size={14} style={{ marginRight: 4 }} /> Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(course._id)}
                      className="btn btn-danger"
                      style={{ padding: "8px 12px" }}
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
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