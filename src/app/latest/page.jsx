"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";

export default function LatestPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["latest", page, category],
    queryFn: async () => {
      const qs = new URLSearchParams({
        sort: "created_at",
        order: "DESC",
        limit: "12",
        page,
        ...(category && { category }),
      }).toString();
      const res = await fetch(`/api/apps?${qs}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          background: "linear-gradient(135deg,#16213E,#0F3460)",
          paddingTop: "100px",
          paddingBottom: "60px",
          borderBottom: "1px solid rgba(61,220,132,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(61,220,132,0.1)",
              border: "1px solid rgba(61,220,132,0.3)",
              borderRadius: "20px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}
          >
            <Clock size={14} color="#3DDC84" />
            <span
              style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}
            >
              Fresh Releases
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px,5vw,48px)",
              fontWeight: 800,
              margin: "0 0 16px",
            }}
          >
            🆕 Latest MOD APKs
          </h1>
          <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
            The newest modded apps, updated daily
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            style={catBtn(!category)}
          >
            All
          </button>
          {catData?.categories?.map((c) => (
            <button
              key={c.slug}
              onClick={() => {
                setCategory(c.slug);
                setPage(1);
              }}
              style={catBtn(category === c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>

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
                ))
            : data?.apps?.map((app) => <AppCard key={app.id} app={app} />)}
        </div>

        {data?.pagination?.totalPages > 1 && (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
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
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data?.pagination?.totalPages}
              style={pageBtn(false)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function catBtn(active) {
  return {
    padding: "8px 18px",
    borderRadius: "24px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: active ? "#3DDC84" : "rgba(255,255,255,0.06)",
    color: active ? "#1A1A2E" : "#888",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
  };
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
