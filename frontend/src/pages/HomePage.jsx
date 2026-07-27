import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

const FEATURES = [
  { icon: <BookOpen size={24} />, title: "Curated Courses", desc: "Expert-crafted content across multiple disciplines." },
  { icon: <Users size={24} />, title: "Learn Together", desc: "Join thousands of students growing their skills daily." },
  { icon: <Award size={24} />, title: "Earn Certificates", desc: "Complete courses and receive shareable certificates." },
  { icon: <TrendingUp size={24} />, title: "Track Progress", desc: "Visual progress tracking on every course you take." },
];

const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];

// Helper component for animated numbers
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    const totalSteps = 60;
    const stepTime = duration / totalSteps;
    const increment = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(start + (typeof value === "string" && value.includes("+") ? "+" : ""));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
}

export default function HomePage() {
  return (
    <div className="bg-glow-wrapper" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Radial Gradient Glow Effect */}
      <div className="bg-glow" />

      {/* Hero Section */}
      <section style={{
        padding: "100px 0 80px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <div className="container">
          <div className="fade-up">
            <span className="badge badge-gold" style={{ marginBottom: 24, padding: "6px 14px" }}>
              <Sparkles size={12} style={{ marginRight: 6 }} /> Learn on Your Own Schedule
            </span>
            <h1 style={{
              fontSize: "clamp(38px, 6vw, 76px)",
              marginBottom: 24,
              lineHeight: 1.1,
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
            }}>
              Unlock Your <span style={{
                background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-hover) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Potential</span>
              <br />Learn Anything Online
            </h1>
            <p style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "var(--text-secondary)",
              maxWidth: 580,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}>
              Explore courses taught by expert instructors. Track your progress,
              earn certificates, and advance your career.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/courses" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
                Browse Courses <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: "14px 32px", fontSize: "16px" }}>
                Start Teaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Metrics Bar */}
      <section style={{ padding: "40px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 1 }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: "center" }}>
            {[
              { label: "Active Learners", val: "15,000+" },
              { label: "Expert Instructors", val: "250+" },
              { label: "Success Guarantee", val: "99%" }
            ].map((stat, i) => (
              <div key={i} style={{ padding: "12px" }}>
                <p style={{
                  fontSize: "clamp(32px, 4vw, 44px)",
                  fontWeight: 800,
                  fontFamily: "var(--font-heading)",
                  color: "var(--accent)",
                  marginBottom: "4px"
                }}>
                  <AnimatedCounter value={stat.val} />
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "80px 0", background: "var(--bg-primary)", position: "relative", zIndex: 1 }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 12, fontSize: "36px", fontFamily: "var(--font-heading)" }}>
            Browse by <span style={{ color: "var(--accent)" }}>Category</span>
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48, fontSize: "15px" }}>
            Find the right program to level up your professional skills.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/courses?category=${encodeURIComponent(cat)}`}
                className="btn btn-outline"
                style={{ borderRadius: "9999px", padding: "10px 24px" }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 1 }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 12, fontSize: "36px", fontFamily: "var(--font-heading)" }}>
            Why Choose <span style={{ color: "var(--accent)" }}>CoursePortal?</span>
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 60, fontSize: "15px" }}>
            A complete suite of learning resources designed for optimal knowledge retention.
          </p>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card card-interactive" style={{ textAlign: "center", padding: "32px 24px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: "var(--accent-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", margin: "0 auto 20px",
                  border: "1px solid rgba(245, 199, 71, 0.25)",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "18px", marginBottom: "10px", fontWeight: 700 }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "100px 0",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
      }}>
        <div className="container">
          <div className="card" style={{
            maxWidth: "840px",
            margin: "0 auto",
            padding: "60px 40px",
            background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(20, 27, 54, 0.4) 100%)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-lg)",
          }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", marginBottom: 16, fontFamily: "var(--font-heading)" }}>
              Ready to Start Learning?
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 36, fontSize: "16px", maxWidth: "480px", margin: "0 auto 36px" }}>
              Join thousands of students already expanding their horizons on CoursePortal.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ padding: "14px 40px", fontSize: "16px" }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
        padding: "36px 0",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <div className="container">
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            © 2026 CoursePortal — Built with MERN Stack
          </p>
        </div>
      </footer>
    </div>
  );
}