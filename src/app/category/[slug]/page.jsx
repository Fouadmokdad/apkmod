"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";

const ICON_MAP = {
  games: "🎮",
  photography: "📷",
  music: "🎵",
  "social-media": "📱",
  tools: "🔧",
  finance: "💰",
  education: "📚",
  video: "🎬",
  vpn: "🛡️",
  communication: "💬",
};

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#16213E",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
        animation: "pulse 1.5s infinite",
      }}
    >
      <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: "16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              height: "12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              width: "60%",
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: "38px",
          background: "rgba(61,220,132,0.05)",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [sort, setSort] = useState("download_count");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["apps", "category", slug, sort, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/apps?category=${slug}&sort=${sort}&order=DESC&page=${page}&limit=12`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const category = catData?.categories?.find((c) => c.slug === slug);
  const emoji = ICON_MAP[slug] || "📱";

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #16213E, #0F3460)",
          paddingTop: "100px",
          paddingBottom: "60px",
          borderBottom: "1px solid rgba(61,220,132,0.1)",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
        >
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            <a
              href="/"
              style={{
                color: "#3DDC84",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Home
            </a>
            <ChevronRight size={14} color="#444" />
            <span style={{ color: "#666", fontSize: "14px" }}>Categories</span>
            <ChevronRight size={14} color="#444" />
            <span style={{ color: "#666", fontSize: "14px" }}>
              {category?.name || slug}
            </span>
          </nav>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "56px" }}>{emoji}</div>
            <div>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  fontWeight: 800,
                  margin: "0 0 8px",
                }}
              >
                {category?.name || slug} MOD APKs
              </h1>
              <p style={{ color: "#666", margin: 0, fontSize: "16px" }}>
                {category?.description ||
                  `Premium modded ${category?.name || slug} apps with unlocked features`}
              </p>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <span
                  style={{
                    background: "rgba(61,220,132,0.1)",
                    border: "1px solid rgba(61,220,132,0.2)",
                    color: "#3DDC84",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {data?.pagination?.total || 0} Apps
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Sort bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "15px", color: "#666" }}>
            Showing{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>
              {data?.apps?.length || 0}
            </span>{" "}
            of{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>
              {data?.pagination?.total || 0}
            </span>{" "}
            apps
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SlidersHorizontal size={16} color="#3DDC84" />
            <span
              style={{ fontSize: "14px", color: "#666", marginRight: "4px" }}
            >
              Sort:
            </span>
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
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  background:
                    sort === val ? "#3DDC84" : "rgba(255,255,255,0.06)",
                  color: sort === val ? "#1A1A2E" : "#888",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {isLoading
            ? Array(12)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : data?.apps?.map((app) => <AppCard key={app.id} app={app} />)}
        </div>

        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
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
              { length: Math.min(data.pagination.totalPages, 7) },
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
              onClick={() =>
                setPage((p) => Math.min(data.pagination.totalPages, p + 1))
              }
              disabled={page === data.pagination.totalPages}
              style={pageBtn(false)}
            >
              Next →
            </button>
          </div>
        )}

        {/* All categories */}
        <div
          style={{
            marginTop: "60px",
            padding: "32px",
            background: "#16213E",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Browse Other Categories
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Object.entries(ICON_MAP)
              .filter(([s]) => s !== slug)
              .map(([s, emoji]) => (
                <a
                  key={s}
                  href={`/category/${s}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 18px",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#888",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,220,132,0.4)";
                    e.currentTarget.style.color = "#3DDC84";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  {emoji}{" "}
                  {s
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </a>
              ))}
          </div>
        </div>
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
    transition: "all 0.2s",
  };
}
