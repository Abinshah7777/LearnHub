import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LayoutDashboard, LogOut, User, GraduationCap, PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "rgba(10,15,30,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "var(--accent)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={20} color="#0a0f1e" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: "var(--text-primary)" }}>
            Course<span style={{ color: "var(--accent)" }}>Portal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
          <NavLink to="/courses" active={isActive("/courses")}>Browse</NavLink>
          {user && <NavLink to="/my-courses" active={isActive("/my-courses")}>My Courses</NavLink>}
          {user?.role === "instructor" && <NavLink to="/instructor" active={location.pathname.startsWith("/instructor")}>Instructor</NavLink>}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost" style={{ padding: "8px 12px" }}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "var(--accent-dim)", border: "2px solid var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)", overflow: "hidden",
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <User size={16} />}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: "8px 12px" }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "6px 14px",
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      color: active ? "var(--accent)" : "var(--text-secondary)",
      background: active ? "var(--accent-dim)" : "transparent",
      transition: "all 0.2s",
    }}>
      {children}
    </Link>
  );
}