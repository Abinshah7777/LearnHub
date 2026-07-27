import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Upload, Save, Sparkles, BookOpen, Settings } from "lucide-react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson states
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", videoUrl: "", duration: "" });
  const [lessonFile, setLessonFile] = useState(null);
  const [addingLesson, setAddingLesson] = useState(false);

  // Custom Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    api.get(`/courses/${id}`).then(({ data }) => {
      setCourse(data);
      setForm({
        title: data.title, description: data.description,
        category: data.category, level: data.level,
        price: data.price, tags: data.tags?.join(", ") || "",
        isPublished: data.isPublished,
      });
    }).catch(() => {
      toast.error("Failed to load course details");
      navigate("/instructor");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append("thumbnail", thumbnail);
      const { data } = await api.put(`/courses/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCourse(data);
      toast.success("Course details updated successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save details");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }
    setAddingLesson(true);
    try {
      const fd = new FormData();
      Object.entries(lessonForm).forEach(([k, v]) => fd.append(k, v));
      if (lessonFile) fd.append("file", lessonFile);
      const { data } = await api.post(`/courses/${id}/lessons`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCourse(data);
      setLessonForm({ title: "", description: "", videoUrl: "", duration: "" });
      setLessonFile(null);
      // Reset file input element visually
      const fileInput = document.getElementById("lesson-file");
      if (fileInput) fileInput.value = "";
      
      toast.success("New lesson added successfully! 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add lesson");
    } finally {
      setAddingLesson(false);
    }
  };

  const openDeleteModal = (lessonId) => {
    setSelectedLessonId(lessonId);
    setDeleteModalOpen(true);
  };

  const handleDeleteLessonConfirm = async () => {
    if (!selectedLessonId) return;
    try {
      const { data } = await api.delete(`/courses/${id}/lessons/${selectedLessonId}`);
      setCourse(data);
      toast.success("Lesson deleted successfully");
    } catch {
      toast.error("Failed to delete lesson");
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
        onConfirm={handleDeleteLessonConfirm}
        title="Delete Lesson?"
        message="Are you sure you want to delete this lesson? This will remove all materials and video connections associated with it permanently. This cannot be undone."
        confirmText="Delete permanently"
        cancelText="Keep Lesson"
        type="danger"
      />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Back navigation */}
        <Link to="/instructor" className="btn btn-ghost fade-up" style={{ marginBottom: 24, paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <h1 style={{ fontSize: "32px", marginBottom: 32, fontFamily: "var(--font-heading)", fontWeight: 800 }} className="fade-up">
          Edit <span style={{ color: "var(--accent)" }}>Course</span>
        </h1>

        {/* Split Grid */}
        <div className="detail-grid-container fade-up">
          
          {/* Left Column: Course details form */}
          <div>
            <form onSubmit={handleSave}>
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: "18px", marginBottom: 20, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Settings size={18} color="var(--accent)" /> Course Information
                </h2>
                
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input className="form-input" name="title" value={form.title || ""} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" name="description" value={form.description || ""} onChange={handleChange} rows={5} required />
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" name="category" value={form.category || ""} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-input" name="level" value={form.level || ""} onChange={handleChange}>
                      {LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Price (USD)</label>
                    <input className="form-input" type="number" name="price" value={form.price || 0} onChange={handleChange} min={0} step={0.01} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input className="form-input" name="tags" value={form.tags || ""} onChange={handleChange} placeholder="react, hooks, JS" />
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: "var(--radius)",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  marginTop: 10
                }}>
                  <input
                    type="checkbox"
                    id="pub"
                    name="isPublished"
                    checked={!!form.isPublished}
                    onChange={handleChange}
                    style={{ width: 18, height: 18, accentColor: "var(--accent)", cursor: "pointer" }}
                  />
                  <label htmlFor="pub" style={{ fontSize: "14px", cursor: "pointer", fontWeight: 600, color: "var(--text-primary)" }}>
                    Publish Course (visible on public browse list)
                  </label>
                </div>
              </div>

              {/* Cover thumbnail selection */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: "16px", marginBottom: 16, fontFamily: "var(--font-heading)" }}>Course Cover Image</h2>
                <label style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                  <div style={{
                    width: 90,
                    height: 90,
                    borderRadius: 10,
                    background: "var(--bg-secondary)",
                    border: "2px dashed var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0
                  }}>
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : course?.thumbnail ? (
                      <img src={course.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Upload size={22} color="var(--text-muted)" />
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>Upload Cover</span>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: 2 }}>JPG, PNG or WebP files. Click to browse.</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: "none" }} />
                </label>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: "12px 32px" }}>
                <Save size={16} /> {saving ? "Saving Changes..." : "Save Details"}
              </button>
            </form>
          </div>

          {/* Right Column: Lesson management */}
          <div>
            
            {/* Add Lesson Form */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "18px", marginBottom: 20, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} color="var(--accent)" /> Add New Lesson
              </h2>
              
              <form onSubmit={handleAddLesson}>
                <div className="form-group">
                  <label className="form-label">Lesson Title *</label>
                  <input
                    className="form-input"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="e.g. Introduction & Setup"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description / Lesson Summary</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={lessonForm.description}
                    onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                    placeholder="Brief overview of what's covered in this video."
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Video URL (YouTube/Vimeo Embed Link)</label>
                  <input
                    className="form-input"
                    value={lessonForm.videoUrl}
                    onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      className="form-input"
                      type="number"
                      min={0}
                      value={lessonForm.duration}
                      onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      placeholder="e.g. 15"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Upload Material File</label>
                    <input
                      type="file"
                      id="lesson-file"
                      onChange={e => setLessonFile(e.target.files[0])}
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: 6
                      }}
                    />
                  </div>
                </div>
                
                <button type="submit" disabled={addingLesson} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>
                  <Plus size={16} /> {addingLesson ? "Adding Lesson..." : "Add Lesson"}
                </button>
              </form>
            </div>

            {/* Curriculum Lessons Listing */}
            <div className="card">
              <h2 style={{ fontSize: "18px", marginBottom: 16, fontFamily: "var(--font-heading)" }}>
                Curriculum Lessons <span style={{ color: "var(--accent)" }}>({course?.lessons?.length || 0})</span>
              </h2>
              
              {course?.lessons?.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                  No lessons added yet. Create a lesson above to build your curriculum list.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {course?.lessons?.map((lesson, i) => (
                    <div
                      key={lesson._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        transition: "var(--transition-fast)",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", width: 20, fontWeight: 700 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lesson.title}
                      </span>
                      {lesson.duration > 0 && (
                        <span className="badge badge-gold" style={{ fontSize: "10px", flexShrink: 0 }}>
                          {lesson.duration}m
                        </span>
                      )}
                      <button
                        onClick={() => openDeleteModal(lesson._id)}
                        className="btn btn-danger"
                        style={{ padding: "6px 10px", minWidth: "auto", flexShrink: 0 }}
                        title="Delete Lesson"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}