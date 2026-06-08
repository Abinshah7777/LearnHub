import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Upload, Save } from "lucide-react";

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson form
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", videoUrl: "", duration: "" });
  const [lessonFile, setLessonFile] = useState(null);
  const [addingLesson, setAddingLesson] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`).then(({ data }) => {
      setCourse(data);
      setForm({
        title: data.title, description: data.description,
        category: data.category, level: data.level,
        price: data.price, tags: data.tags?.join(", ") || "",
        isPublished: data.isPublished,
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
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
      toast.success("Course updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAddingLesson(true);
    try {
      const fd = new FormData();
      Object.entries(lessonForm).forEach(([k, v]) => fd.append(k, v));
      if (lessonFile) fd.append("file", lessonFile);
      const { data } = await api.post(`/courses/${id}/lessons`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setCourse(data);
      setLessonForm({ title: "", description: "", videoUrl: "", duration: "" });
      setLessonFile(null);
      toast.success("Lesson added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add lesson");
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const { data } = await api.delete(`/courses/${id}/lessons/${lessonId}`);
      setCourse(data);
      toast.success("Lesson deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link to="/instructor" className="btn btn-ghost" style={{ marginBottom: 24, paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 style={{ fontSize: 32, marginBottom: 32 }}>Edit <span style={{ color: "var(--accent)" }}>Course</span></h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Left: Course info */}
          <form onSubmit={handleSave}>
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, marginBottom: 20 }}>Course Details</h2>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" name="title" value={form.title || ""} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" name="description" value={form.description || ""} onChange={handleChange} rows={4} required />
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
                  <input className="form-input" type="number" name="price" value={form.price || 0} onChange={handleChange} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input className="form-input" name="tags" value={form.tags || ""} onChange={handleChange} placeholder="react, js" />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="pub" name="isPublished" checked={!!form.isPublished} onChange={handleChange} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                <label htmlFor="pub" style={{ fontSize: 14, cursor: "pointer" }}>Published (visible to students)</label>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, marginBottom: 16 }}>Thumbnail</h2>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, background: "var(--bg-secondary)", border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {thumbnail
                    ? <img src={URL.createObjectURL(thumbnail)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : course?.thumbnail
                      ? <img src={course.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <Upload size={20} color="var(--text-muted)" />}
                </div>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Click to change thumbnail</span>
                <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} style={{ display: "none" }} />
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: "12px 28px" }}>
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* Right: Lessons */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, marginBottom: 20 }}>Add Lesson</h2>
              <form onSubmit={handleAddLesson}>
                <div className="form-group">
                  <label className="form-label">Lesson Title *</label>
                  <input className="form-input" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g. Introduction to React" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={2} value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Video URL (YouTube embed, etc.)</label>
                  <input className="form-input" value={lessonForm.videoUrl} onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input className="form-input" type="number" min={0} value={lessonForm.duration} onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Material</label>
                    <input type="file" onChange={e => setLessonFile(e.target.files[0])} style={{ fontSize: 12, color: "var(--text-secondary)" }} />
                  </div>
                </div>
                <button type="submit" disabled={addingLesson} className="btn btn-primary">
                  <Plus size={16} /> {addingLesson ? "Adding..." : "Add Lesson"}
                </button>
              </form>
            </div>

            {/* Lessons list */}
            <div className="card">
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>
                Lessons <span style={{ color: "var(--accent)" }}>({course?.lessons?.length || 0})</span>
              </h2>
              {course?.lessons?.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No lessons yet. Add your first lesson.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {course?.lessons?.map((lesson, i) => (
                    <div key={lesson._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg-secondary)", borderRadius: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", width: 20 }}>{i + 1}.</span>
                      <span style={{ flex: 1, fontSize: 14 }}>{lesson.title}</span>
                      {lesson.duration > 0 && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{lesson.duration}m</span>}
                      <button onClick={() => handleDeleteLesson(lesson._id)} className="btn btn-danger" style={{ padding: "4px 8px" }}>
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