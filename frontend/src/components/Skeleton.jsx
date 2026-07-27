import React from "react";

export function Skeleton({ className, style, width, height, borderRadius }) {
  return (
    <div
      className={`skeleton ${className || ""}`}
      style={{
        width: width || "100%",
        height: height || "16px",
        borderRadius: borderRadius || "8px",
        ...style,
      }}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="card" style={{ height: "100%", minHeight: "360px", padding: 0 }}>
      {/* Thumbnail */}
      <Skeleton height="180px" borderRadius="16px 16px 0 0" />
      {/* Content */}
      <div style={{ padding: "20px" }}>
        <Skeleton width="40%" height="12px" style={{ marginBottom: "12px" }} />
        <Skeleton width="90%" height="18px" style={{ marginBottom: "12px" }} />
        <Skeleton width="100%" height="14px" style={{ marginBottom: "6px" }} />
        <Skeleton width="75%" height="14px" style={{ marginBottom: "20px" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          <Skeleton width="50%" height="12px" />
          <Skeleton width="20%" height="12px" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" height="12px" style={{ marginBottom: "8px" }} />
        <Skeleton width="60%" height="24px" />
      </div>
    </div>
  );
}
