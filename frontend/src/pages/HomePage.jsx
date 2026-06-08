import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: <BookOpen size={24} />, title: "Curated Courses", desc: "Expert-crafted content across multiple disciplines." },
  { icon: <Users size={24} />, title: "Learn Together", desc: "Join thousands of students growing their skills daily." },
  { icon: <Award size={24} />, title: "Earn Certificates", desc: "Complete courses and receive shareable certificates." },
  { icon: <TrendingUp size={24} />, title: "Track Progress", desc: "Visual progress tracking on every course you take." },
];

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(240,192,64,0.12) 0%, transparent 60%), var(--bg-primary)",
        padding: "100px 0 80px",
        textAlign: "center",
      }}>
        <div className="container">
          <div className="fade-up">
            <span className="badge badge-gold" style={{ marginBottom: 20 }}>🎓 Online Learning Platform</span>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", marginBottom: 20, lineHeight: 1.1 }}>
              Unlock Your <span style={{ color: "var(--accent)" }}>Potential</span>
              <br />Learn Anything Online
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 36px" }}>
              Explore courses taught by expert instructors. Track your progress,
              earn certificates, and advance your career.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/courses" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: 16 }}>
                Browse Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: "14px 28px", fontSize: 16 }}>
                Start Teaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "60px 0", background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: 32 }}>
            Browse by <span style={{ color: "var(--accent)" }}>Category</span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/courses?category=${encodeURIComponent(cat)}`}
                className="btn btn-outline"
                style={{ borderRadius: 999 }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 60, fontSize: 32 }}>
            Why Choose <span style={{ color: "var(--accent)" }}>CoursePortal?</span>
          </h2>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, background: "var(--accent-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", margin: "0 auto 16px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", background: "var(--bg-secondary)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>Ready to Start Learning?</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: 16 }}>
            Join thousands of students already learning on CoursePortal
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: 16 }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--bg-primary)", borderTop: "1px solid var(--border)",
        padding: "32px 0", textAlign: "center",
      }}>
        <div className="container">
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            © 2025 CoursePortal — Built with MERN Stack
          </p>
        </div>
      </footer>
    </div>
  );
}   