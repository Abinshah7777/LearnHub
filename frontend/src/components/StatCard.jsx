import React from "react";

export default function StatCard({ icon, label, value, color = "var(--accent)", subtitle }) {
  // Extract RGB or use directly with opacity values
  const hasCustomColor = color !== "var(--accent)";
  const bgOpacity = hasCustomColor ? `${color}15` : "var(--accent-dim)";
  const borderOpacity = hasCustomColor ? `${color}30` : "var(--border-light)";

  return (
    <div
      className="card card-interactive"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 24px",
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: bgOpacity,
        border: `1px solid ${borderOpacity}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: color,
        boxShadow: "var(--shadow-sm)",
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>
          {label}
        </p>
        <p style={{
          fontSize: "26px",
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.1,
        }}>
          {value}
        </p>
        {subtitle && (
          <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}