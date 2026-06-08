import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { User, Upload, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("bio", form.bio);
      if (form.password) fd.append("password", form.password);
      if (avatar) fd.append("avatar", avatar);

      const { data } = await api.put("/auth/profile", fd, { headers: { "Content-Type": "multipart/form-data" } });
      updateUser(data);
      toast.success("Profile updated!");
      setForm(f => ({ ...f, password: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 640 }}>
        <h1 style={{ fontSize: 32, marginBottom: 32 }}>Your <span style={{ color: "var(--accent)" }}>Profile</span></h1>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 24, textAlign: "center" }}>
            <label style={{ cursor: "pointer" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px",
                background: "var(--accent-dim)", border: "3px solid var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", position: "relative",
              }}>
                {avatar
                  ? <img src={URL.createObjectURL(avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : user?.avatar
                    ? <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <User size={40} color="var(--accent)" />}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}><Upload size={14} style={{ verticalAlign: "middle" }} /> Click to change photo</p>
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} style={{ display: "none" }} />
            </label>

            <p style={{ marginTop: 8 }}>
              <span className={`badge ${user?.role === "instructor" ? "badge-gold" : "badge-blue"}`}>
                {user?.role}
              </span>
            </p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 18, marginBottom: 20 }}>Account Info</h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell students about yourself..." />
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input className="form-input" type="password" minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="New password (optional)" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "12px 28px" }}>
              <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}