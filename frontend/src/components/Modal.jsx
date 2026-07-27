import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: type === "danger" ? "var(--danger)" : "var(--accent)"
          }}>
            <AlertTriangle size={24} />
            <h3 style={{ fontSize: "20px" }}>{title}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "4px", borderRadius: "50%", minWidth: "auto" }}>
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: "10px 20px" }}>
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${type === "danger" ? "btn-danger" : "btn-primary"}`}
            style={{ padding: "10px 20px" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
