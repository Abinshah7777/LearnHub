import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { StatCardSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { BookOpen, CheckCircle, TrendingUp, Clock, PlayCircle, Award } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const endpoint = user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";
      const { data: res } = await api.get(endpoint);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div style={{ marginBottom: 40 }}>
            <div className="skeleton" style={{ width: "240px", height: "32px", marginBottom: "8px" }} />
            <div className="skeleton" style={{ width: "160px", height: "16px" }} />
          </div>
          <div className="grid-4" style={{ marginBottom: 48 }}>
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        </div>
      </>
    );
  }

  if (user?.role === "instructor") {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="card" style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center", padding: "40px" }}>
            <TrendingUp size={48} color="var(--accent)" style={{ marginBottom: 20 }} />
            <h2 style={{ fontSize: "22px", marginBottom: 12, fontFamily: "var(--font-heading)" }}>Instructor Dashboard Redirect</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "14px" }}>
              You are signed in as an instructor. Please visit the instructor hub to view analytics and manage your courses.
            </p>
            <Link to="/instructor" className="btn btn-primary">Go to Instructor Hub</Link>
          </div>
        </div>
      </>
    );
  }

  // Calculate SVG circular progress attributes
  const percentage = data?.stats?.avgProgress || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Welcome Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "32px", marginBottom: 6, fontFamily: "var(--font-heading)", fontWeight: 800 }}>
            Welcome back, <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Here is your learning summary and recent progress</p>
        </div>

        {/* Dashboard Grid split into Stats & Circle Progress */}
        <div className="detail-grid-container fade-up" style={{ marginBottom: 48 }}>
          
          {/* Left: Stat Cards Grid */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              <StatCard icon={<BookOpen size={20} />} label="Enrolled Courses" value={data?.stats?.totalEnrolled || 0} />
              <StatCard icon={<CheckCircle size={20} />} label="Completed Courses" value={data?.stats?.completed || 0} color="var(--success)" />
              <StatCard icon={<Clock size={20} />} label="In Progress" value={data?.stats?.inProgress || 0} color="var(--info)" />
            </div>
            
            {/* Additional Sub-message card */}
            <div className="card" style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16, background: "linear-gradient(135deg, rgba(20,27,54,0.3) 0%, rgba(13,17,39,0.5) 100%)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyCenter: "center", color: "var(--accent)", flexShrink: 0, paddingLeft: 12 }}>
                <Award size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Certifications Track</h4>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: 2 }}>
                  Complete courses to earn official PDF credentials that you can share.
                </p>
              </div>
            </div>
          </div>

          {/* Right: SVG Completion Rate Tracker */}
          <div className="card" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: 20 }}>
              Average Completion
            </h3>
            
            {/* SVG Ring Progress */}
            <div style={{ position: "relative", width: 140, height: 140, marginBottom: 16 }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                {/* Track circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              {/* Central Text */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                  {percentage}%
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.02em" }}>
                  Average
                </span>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Keep learning to boost your overall success score!
            </p>
          </div>

        </div>

        {/* Recent Activity List */}
        <div className="fade-up">
          <h2 style={{ fontSize: "20px", marginBottom: 20, fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            Recent Activity
          </h2>
          
          {data?.recentEnrollments?.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: 20, fontSize: "14px" }}>
                You haven't enrolled in any courses yet. Start your learning journey today!
              </p>
              <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {data?.recentEnrollments?.map((enr) => (
                <div
                  key={enr._id}
                  className="card"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 20,
                    padding: "16px 24px",
                  }}
                >
                  {/* Thumbnail Placeholder Icon */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "var(--accent-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0
                  }}>
                    <BookOpen size={20} />
                  </div>
                  
                  {/* Course Title & Progress Bar */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", marginBottom: 6, color: "var(--text-primary)" }}>
                      {enr.course?.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="progress-bar" style={{ width: "100%", maxWidth: "320px" }}>
                        <div className="progress-fill" style={{ width: `${enr.progress}%` }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>
                        {enr.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Actions & Complete badge */}
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "auto" }}>
                    {enr.isCompleted ? (
                      <span className="badge badge-green" style={{ padding: "6px 12px" }}>
                        Completed
                      </span>
                    ) : (
                      <Link
                        to={`/learn/${enr.course?._id}`}
                        className="btn btn-outline"
                        style={{ padding: "8px 16px", fontSize: "12px" }}
                      >
                        <PlayCircle size={14} /> Resume Course
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}