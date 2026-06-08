import { Link } from "react-router-dom";
import { Users, BookOpen, Star } from "lucide-react";

const LEVEL_COLORS = {
  Beginner: "badge-green",
  Intermediate: "badge-blue",
  Advanced: "badge-red",
};

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "var(--shadow-accent)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Thumbnail */}
        <div style={{
          height: 180,
          background: course.thumbnail
            ? `url(${course.thumbnail}) center/cover`
            : `linear-gradient(135deg, #1a2236 0%, #0f1a2e 100%)`,
          position: "relative",
        }}>
          {!course.thumbnail && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={48} color="var(--accent)" opacity={0.4} />
            </div>
          )}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span className={`badge ${LEVEL_COLORS[course.level] || "badge-gold"}`}>
              {course.level}
            </span>
          </div>
          {course.price > 0 && (
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "var(--accent)", color: "#0a0f1e",
              fontWeight: 700, fontSize: 13, padding: "4px 10px",
              borderRadius: 8,
            }}>
              ${course.price}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {course.category}
          </p>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)", lineHeight: 1.4 }}>
            {course.title}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {course.description}
          </p>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              by <span style={{ color: "var(--text-primary)" }}>{course.instructor?.name || "Instructor"}</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Users size={13} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{course.enrollmentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}