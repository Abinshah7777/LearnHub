import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import api from "../utils/api";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["", "Web Development", "Data Science", "Design", "Business", "Marketing", "Photography", "Music", "Other"];
const LEVELS = ["", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";

  useEffect(() => {
    fetchCourses();
  }, [category, level, page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (category) params.set("category", category);
      if (level) params.set("level", level);
      if (search) params.set("search", search);

      const { data } = await api.get(`/courses?${params}`);
      setCourses(data.courses);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Browse <span style={{ color: "var(--accent)" }}>Courses</span></h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
          {total} course{total !== 1 ? "s" : ""} available
        </p>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36, alignItems: "center" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flex: 1, minWidth: 240 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="form-input"
                style={{ paddingLeft: 36, width: "100%" }}
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <select
            className="form-input"
            style={{ width: "auto", minWidth: 160 }}
            value={category}
            onChange={e => updateFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="form-input"
            style={{ width: "auto", minWidth: 140 }}
            value={level}
            onChange={e => updateFilter("level", e.target.value)}
          >
            <option value="">All Levels</option>
            {LEVELS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 18 }}>No courses found. Try different filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48 }}>
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "btn btn-primary" : "btn btn-outline"}
                style={{ padding: "8px 16px", minWidth: 40 }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}