import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { BookOpen, CheckCircle, TrendingUp, Clock, PlayCircle } from "lucide-react";

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

  if (loading) return <><Navbar /><div className="page-loader"><div className="spinner" /></div></>;

  if (user?.role === "instructor") {
    return <><Navbar /><div className="container" style={{ paddingTop: 40 }}>
      <p style={{ color: "var(--text-secondary)" }}>Visit <Link to="/instructor" style={{ color: "var(--accent)" }}>Instructor Dashboard</Link> for full stats.</p>
    </div></>;
  }

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>
          Welcome back, <span style={{ color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Here's your learning summary</p>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 48 }}>
          <StatCard icon={<BookOpen size={22} />} label="Enrolled" value={data?.stats?.totalEnrolled || 0} />
          <StatCard icon={<CheckCircle size={22} />} label="Completed" value={data?.stats?.completed || 0} color="var(--success)" />
          <StatCard icon={<Clock size={22} />} label="In Progress" value={data?.stats?.inProgress || 0} color="var(--info)" />
          <StatCard icon={<TrendingUp size={22} />} label="Avg Progress" value={`${data?.stats?.avgProgress || 0}%`} color="#a78bfa" />
        </div>

        {/* Recent */}
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Recent Activity</h2>
        {data?.recentEnrollments?.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>No courses yet. Start learning!</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data?.recentEnrollments?.map((enr) => (
              <div key={enr._id} className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                  <BookOpen size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {enr.course?.title}
                  </p>
                  <div className="progress-bar" style={{ width: "100%", maxWidth: 280 }}>
                    <div className="progress-fill" style={{ width: `${enr.progress}%` }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 800, fontFamily: "Syne", color: "var(--accent)" }}>{enr.progress}%</p>
                  {enr.isCompleted
                    ? <span className="badge badge-green">Completed</span>
                    : <Link to={`/learn/${enr.course?._id}`} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>
                      <PlayCircle size={13} /> Resume
                    </Link>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}