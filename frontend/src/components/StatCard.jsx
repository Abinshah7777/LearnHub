export default function StatCard({ icon, label, value, color = "var(--accent)", subtitle }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        color,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontFamily: "Syne", fontWeight: 800, color: "var(--text-primary)" }}>{value}</p>
        {subtitle && <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  );
}