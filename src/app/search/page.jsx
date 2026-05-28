"use client";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("download_count");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setQuery(sp.get("q") || "");
      setSearchParams(sp);
    }
  }, []);

  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, category, sort, page],
    queryFn: async () => {
      if (!debouncedQuery.trim())
        return { apps: [], pagination: { total: 0 }, query: "" };
      const qs = new URLSearchParams({
        q: debouncedQuery,
        category,
        sort,
        page,
      }).toString();
      const res = await fetch(`/api/search?${qs}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: !!debouncedQuery.trim(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setQuery("");
    setPage(1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        {/* Search header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              margin: "0 0 24px",
            }}
          >
            {query ? (
              <>
                Results for <span style={{ color: "#3DDC84" }}>"{query}"</span>
              </>
            ) : (
              "Search MOD APKs"
            )}
          </h1>

          <form onSubmit={handleSearch}>
            <div style={{ position: "relative", maxWidth: "640px" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#3DDC84",
                }}
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search apps, games, tools..."
                style={{
                  width: "100%",
                  padding: "16px 52px 16px 52px",
                  background: "#16213E",
                  border: "2px solid rgba(61,220,132,0.3)",
                  borderRadius: "14px",
                  color: "#fff",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3DDC84")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(61,220,132,0.3)")
                }
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "28px",
            alignItems: "center",
          }}
        >
          <SlidersHorizontal size={16} color="#3DDC84" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "9px 14px",
              background: "#16213E",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#C0C0C0",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="">All Categories</option>
            {categoriesData?.categories?.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {[
            ["download_count", "Most Downloaded"],
            ["rating", "Top Rated"],
            ["created_at", "Newest"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => {
                setSort(val);
                setPage(1);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                background: sort === val ? "#3DDC84" : "rgba(255,255,255,0.06)",
                color: sort === val ? "#1A1A2E" : "#888",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {data && query && (
          <div
            style={{ marginBottom: "24px", color: "#666", fontSize: "15px" }}
          >
            Found{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>
              {data.pagination?.total || 0}
            </span>{" "}
            results
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🔍</div>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Search for MOD APKs
            </h2>
            <p style={{ color: "#666", marginBottom: "32px" }}>
              Find your favorite apps with premium features unlocked
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                "Spotify",
                "YouTube",
                "Minecraft",
                "Instagram",
                "TikTok",
                "CapCut",
                "Duolingo",
                "NordVPN",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "24px",
                    border: "1px solid rgba(61,220,132,0.3)",
                    background: "rgba(61,220,132,0.07)",
                    color: "#3DDC84",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "220px",
                    background: "#16213E",
                    borderRadius: "16px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && query && data?.apps?.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              No results found
            </h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Try a different search term or browse our categories
            </p>
            <a
              href="/"
              style={{
                padding: "12px 28px",
                background: "#3DDC84",
                borderRadius: "10px",
                color: "#1A1A2E",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Browse Apps
            </a>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && data?.apps?.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              {data.apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
            {data.pagination?.totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={pageBtn(false)}
                >
                  ← Prev
                </button>
                {Array.from(
                  { length: Math.min(data.pagination.totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={pageBtn(p === page)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === data.pagination.totalPages}
                  style={pageBtn(false)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function pageBtn(active) {
  return {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: active ? "#3DDC84" : "rgba(255,255,255,0.06)",
    color: active ? "#1A1A2E" : "#888",
    fontWeight: active ? 700 : 400,
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
  };
}
