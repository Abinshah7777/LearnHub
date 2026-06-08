import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GraduationCap } from "lucide-react";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue learning">
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      </div>
      <div className="form-group" style={{ marginBottom: 24 }}>
        <label className="form-label">Password</label>
        <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
    <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
      Don't have an account? <Link to="/register" style={{ color: "var(--accent)" }}>Sign up</Link>
    </p>
  </AuthLayout>;
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Account created! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return <AuthLayout title="Create account" subtitle="Join thousands of learners today">
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
      </div>
      <div className="form-group" style={{ marginBottom: 24 }}>
        <label className="form-label">I want to</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["student", "Learn — Student"], ["instructor", "Teach — Instructor"]].map(([val, label]) => (
            <label key={val} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
              border: `2px solid ${form.role === val ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 10, cursor: "pointer",
              background: form.role === val ? "var(--accent-dim)" : "transparent",
              transition: "all 0.2s",
            }}>
              <input type="radio" name="role" value={val} checked={form.role === val} onChange={e => setForm({ ...form, role: e.target.value })} style={{ accentColor: "var(--accent)" }} />
              <span style={{ fontSize: 13, color: form.role === val ? "var(--accent)" : "var(--text-secondary)" }}>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
    <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
      Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
    </p>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-primary)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, background: "var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={22} color="#0a0f1e" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>
            Course<span style={{ color: "var(--accent)" }}>Portal</span>
          </span>
        </Link>

        <div className="card">
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>{title}</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: 14 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;