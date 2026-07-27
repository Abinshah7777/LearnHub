import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, Sparkles, BookOpen, AlertCircle } from "lucide-react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "Web Development", level: "Beginner", price: 0, tags: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbnail) fd.append("thumbnail", thumbnail);

      const { data } = await api.post("/courses", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Course created! Add some lessons next. 🎉");
      navigate(`/instructor/courses/${data._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 760 }}>
        {/* Back Link */}
        <Link to="/instructor" className="btn btn-ghost fade-up" style={{ marginBottom: 24, paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: "32px", marginBottom: 32, fontFamily: "var(--font-heading)", fontWeight: 800 }} className="fade-up">
          Create <span style={{ color: "var(--accent)" }}>New Course</span>
        </h1>

        <form onSubmit={handleSubmit} className="fade-up">
          {/* Main Course Info Card */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: "18px", marginBottom: 20, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--accent)" /> Course Details
            </h2>

            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Complete React Developer Bootcamp"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will students learn in this course? What are the key takeaways?"
                required
                rows={5}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Level</label>
                <select className="form-input" name="level" value={form.level} onChange={handleChange}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Price (USD, 0 = Free)</label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  className="form-input"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="react, javascript, web"
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Upload Card */}
          <div className="card" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "18px", marginBottom: 20, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={18} color="var(--accent)" /> Course Cover Image
            </h2>

            <label style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed var(--border)",
              borderRadius: "var(--radius)",
              padding: "40px 20px",
              cursor: "pointer",
              transition: "var(--transition)",
              minHeight: 180,
              position: "relative",
              overflow: "hidden",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.25,
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Upload size={32} color="var(--accent)" style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 600, fontSize: "14px" }}>Cover Image Selected</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: 4 }}>Click here to replace the selected file</p>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>Click to upload cover thumbnail</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: 4 }}>Supports JPG, PNG, or WebP files</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "12px 32px" }}>
              {loading ? "Creating..." : "Create Course"}
            </button>
            <Link to="/instructor" className="btn btn-outline" style={{ padding: "12px 24px" }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}