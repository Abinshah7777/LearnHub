import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GraduationCap, Sparkles, User, ShieldAlert } from "lucide-react";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue learning">
      <form onSubmit={handleSubmit} className="fade-in">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <label className="form-label">Password</label>
          </div>
          <input
            className="form-input"
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: 24, fontSize: "14px", color: "var(--text-secondary)" }}>
        Don't have an account? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up</Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Welcome to LearnHub! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join thousands of learners today">
      <form onSubmit={handleSubmit} className="fade-in">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Min 6 characters"
          />
        </div>
        <div className="form-group" style={{ marginBottom: 28 }}>
          <label className="form-label">I want to</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["student", "Learn (Student)"], ["instructor", "Teach (Instructor)"]].map(([val, label]) => {
              const selected = form.role === val;
              return (
                <label key={val} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 16px",
                  border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius)",
                  cursor: "pointer",
                  background: selected ? "var(--accent-dim)" : "transparent",
                  transition: "var(--transition-fast)",
                  userSelect: "none",
                }}>
                  <input
                    type="radio"
                    name="role"
                    value={val}
                    checked={selected}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ accentColor: "var(--accent)", cursor: "pointer" }}
                  />
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: selected ? "var(--accent)" : "var(--text-secondary)",
                  }}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: 24, fontSize: "14px", color: "var(--text-secondary)" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="bg-glow-wrapper" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      background: "var(--bg-primary)"
    }}>
      {/* Background Glow */}
      <div className="bg-glow" style={{ opacity: 0.8 }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }} className="fade-up">
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 42, height: 42, background: "var(--accent)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={24} color="var(--bg-primary)" />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "var(--text-primary)" }}>
            Course<span style={{ color: "var(--accent)" }}>Portal</span>
          </span>
        </Link>

        {/* Form Card */}
        <div className="card" style={{
          padding: "36px 40px",
          background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(20, 27, 54, 0.45) 100%)",
        }}>
          <h1 style={{ fontSize: "28px", marginBottom: "6px", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
            {title}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: "14px" }}>
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;