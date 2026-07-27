import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    // Set theme on mount
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        width: "38px",
        height: "38px",
        minWidth: "auto",
        transition: "var(--transition)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
    >
      {theme === "dark" ? (
        <Sun size={18} className="fade-in" style={{ color: "var(--accent)" }} />
      ) : (
        <Moon size={18} className="fade-in" style={{ color: "var(--accent)" }} />
      )}
    </button>
  );
}
