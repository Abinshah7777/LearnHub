import React from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen } from "lucide-react";

const LEVEL_COLORS = {
  Beginner: "badge-green",
  Intermediate: "badge-blue",
  Advanced: "badge-red",
};

export default function CourseCard({ course }) {
  const hasThumbnail = !!course.thumbnail;

  return (
    <Link to={`/courses/${course._id}`} className="course-card-link">
      <div className="card card-interactive course-card">
        {/* Thumbnail */}
        <div className="course-card-thumbnail-wrapper">
          {hasThumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="course-card-thumbnail"
              loading="lazy"
            />
          ) : (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--bg-secondary) 0%, rgba(20, 27, 54, 0.4) 100%)",
            }}>
              <BookOpen size={44} color="var(--accent)" style={{ opacity: 0.35 }} />
            </div>
          )}
          
          {/* Tags */}
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>
            <span className={`badge ${LEVEL_COLORS[course.level] || "badge-gold"}`}>
              {course.level}
            </span>
          </div>

          {course.price > 0 && (
            <div style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "var(--accent)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              boxShadow: "var(--shadow-sm)",
              zIndex: 1,
            }}>
              ${course.price.toFixed(2)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="course-card-content">
          <p style={{
            fontSize: "11px",
            color: "var(--accent)",
            fontWeight: 700,
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {course.category}
          </p>
          <h3 style={{
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "8px",
            color: "var(--text-primary)",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: "44px", /* fixed height to ensure perfect card alignment */
          }}>
            {course.title}
          </h3>
          <p style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            marginBottom: "16px",
          }}>
            {course.description}
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
              by <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{course.instructor?.name || "Instructor"}</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Users size={14} color="var(--text-muted)" />
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>
                {course.enrollmentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}