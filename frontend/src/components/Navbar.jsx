import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LayoutDashboard, LogOut, User, GraduationCap, PlusCircle, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

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
      background: "var(--bg-card)",
      backdropFilter: "var(--backdrop)",
      WebkitBackdropFilter: "var(--backdrop)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      transition: "var(--transition)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "var(--accent)", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={20} color="var(--bg-primary)" />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "var(--text-primary)" }}>
            Course<span style={{ color: "var(--accent)" }}>Portal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
          <NavLink to="/courses" active={isActive("/courses")}>Browse</NavLink>
          {user && <NavLink to="/my-courses" active={isActive("/my-courses")}>My Courses</NavLink>}
          {user?.role === "instructor" && <NavLink to="/instructor" active={location.pathname.startsWith("/instructor")}>Instructor</NavLink>}
        </div>

        {/* Action Controls & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Auth Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost" style={{ padding: "8px 14px", height: "38px" }}>
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--accent-dim)", border: "2px solid var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", overflow: "hidden",
                  transition: "var(--transition-fast)",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <User size={16} />}
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: "8px", borderRadius: "50%", width: "38px", height: "38px", minWidth: "auto" }}>
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log In</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: "8px 16px" }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger button for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost mobile-menu-btn"
            style={{
              display: "none",
              padding: "8px",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              minWidth: "auto",
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(7, 11, 25, 0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 90,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderBottom: "1px solid var(--border)",
              padding: "24px 16px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <Link to="/courses" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 8, background: isActive("/courses") ? "var(--bg-hover)" : "transparent" }}>
              <BookOpen size={18} color="var(--accent)" />
              <span style={{ fontWeight: 600 }}>Browse Courses</span>
            </Link>
            {user && (
              <Link to="/my-courses" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 8, background: isActive("/my-courses") ? "var(--bg-hover)" : "transparent" }}>
                <GraduationCap size={18} color="var(--accent)" />
                <span style={{ fontWeight: 600 }}>My Courses</span>
              </Link>
            )}
            {user?.role === "instructor" && (
              <Link to="/instructor" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 8, background: location.pathname.startsWith("/instructor") ? "var(--bg-hover)" : "transparent" }}>
                <PlusCircle size={18} color="var(--accent)" />
                <span style={{ fontWeight: 600 }}>Instructor Dashboard</span>
              </Link>
            )}
            
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 8, background: isActive("/dashboard") ? "var(--bg-hover)" : "transparent" }}>
                  <LayoutDashboard size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600 }}>Dashboard</span>
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 8, background: isActive("/profile") ? "var(--bg-hover)" : "transparent" }}>
                  <User size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 600 }}>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{ width: "100%", padding: "12px", justifyContent: "flex-start" }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline" style={{ width: "100%", padding: "12px", justifyContent: "center" }}>Log In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ width: "100%", padding: "12px", justifyContent: "center" }}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: "8px 16px",
      borderRadius: "var(--radius-sm)",
      fontSize: 14,
      fontWeight: 600,
      color: active ? "var(--accent)" : "var(--text-secondary)",
      background: active ? "var(--accent-dim)" : "transparent",
      transition: "var(--transition-fast)",
    }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = "var(--text-primary)";
          e.currentTarget.style.background = "var(--bg-hover)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
    </Link>
  );
}