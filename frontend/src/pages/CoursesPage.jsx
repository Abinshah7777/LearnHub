import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { CourseCardSkeleton } from "../components/Skeleton";
import api from "../utils/api";
import { Search, Info } from "lucide-react";

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
        <div className="fade-up">
          <h1 style={{ fontSize: "36px", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>
            Browse <span style={{ color: "var(--accent)" }}>Courses</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
            {loading ? "Discovering courses..." : `${total} course${total !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card fade-up" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 36,
          alignItems: "center",
          padding: "16px 20px"
        }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, flex: 1, minWidth: "260px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={18} style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }} />
              <input
                className="form-input"
                style={{ paddingLeft: 42, width: "100%" }}
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "10px 24px" }}>Search</button>
          </form>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: "auto", flex: "none" }} className="mobile-full-width">
            <select
              className="form-input"
              style={{ width: "auto", minWidth: "160px" }}
              value={category}
              onChange={e => updateFilter("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              className="form-input"
              style={{ width: "auto", minWidth: "140px" }}
              value={level}
              onChange={e => updateFilter("level", e.target.value)}
            >
              <option value="">All Levels</option>
              {LEVELS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }} className="fade-in">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card fade-in" style={{
            textAlign: "center",
            padding: "80px 40px",
            maxWidth: "500px",
            margin: "0 auto",
            borderStyle: "dashed"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: "var(--accent-dim)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)", margin: "0 auto 20px"
            }}>
              <Info size={24} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>No Courses Found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              We couldn't find any courses matching your filters. Try selecting a different category or search term.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSearchParams({});
                setPage(1);
              }}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }} className="fade-in">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 12 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 54 }}>
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