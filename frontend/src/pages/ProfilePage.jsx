import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { User, Upload, Save, Sparkles, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("bio", form.bio);
      if (form.password) fd.append("password", form.password);
      if (avatar) fd.append("avatar", avatar);

      const { data } = await api.put("/auth/profile", fd, { headers: { "Content-Type": "multipart/form-data" } });
      updateUser(data);
      toast.success("Profile updated successfully! 🎉");
      setForm(f => ({ ...f, password: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 680 }}>
        
        <h1 style={{ fontSize: "32px", marginBottom: 32, fontFamily: "var(--font-heading)", fontWeight: 800 }} className="fade-up">
          Your <span style={{ color: "var(--accent)" }}>Profile</span>
        </h1>

        <form onSubmit={handleSubmit} className="fade-up">
          {/* Avatar upload card */}
          <div className="card" style={{ marginBottom: 24, textAlign: "center", padding: "36px 24px" }}>
            <label style={{ cursor: "pointer", display: "inline-block" }}>
              <div style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                margin: "0 auto 16px",
                background: "var(--bg-secondary)",
                border: "3px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-lg)",
                transition: "var(--transition)",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-hover)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--accent)"}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : user?.avatar ? (
                  <img src={user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={48} color="var(--accent)" />
                )}
                
                {/* Upload hover overlay banner */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(7, 11, 25, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  color: "#fff",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <Upload size={18} />
                </div>
              </div>
              
              <span className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "99px" }}>
                <Upload size={12} /> Change photo
              </span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </label>

            <p style={{ marginTop: 16 }}>
              <span className={`badge ${user?.role === "instructor" ? "badge-gold" : "badge-blue"}`} style={{ padding: "6px 14px", fontWeight: 700 }}>
                <Shield size={12} style={{ marginRight: 4 }} /> {user?.role}
              </span>
            </p>
          </div>

          {/* Form details card */}
          <div className="card">
            <h2 style={{ fontSize: "18px", marginBottom: 24, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={18} color="var(--accent)" /> Account Settings
            </h2>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group" style={{ position: "relative" }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  className="form-input"
                  value={user?.email || ""}
                  disabled
                  style={{
                    opacity: 0.6,
                    cursor: "not-allowed",
                    paddingLeft: 40,
                    backgroundColor: "rgba(0, 0, 0, 0.15)"
                  }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Bio Description</label>
              <textarea
                className="form-input"
                rows={4}
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell your students or classmates about yourself, your background, or experience..."
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 32 }}>
              <label className="form-label">Update Password (leave empty to keep current)</label>
              <input
                className="form-input"
                type="password"
                minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter new password (minimum 6 characters)"
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: "12px 28px" }}>
              <Save size={16} /> {loading ? "Saving changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}