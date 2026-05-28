"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Download, Star, Medal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatDownloads(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function TopDownloadsPage() {
  const [view, setView] = useState("grid");
  const [category, setCategory] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["top-downloads", category],
    queryFn: async () => {
      const qs = new URLSearchParams({
        sort: "download_count",
        order: "DESC",
        limit: "50",
        ...(category && { category }),
      }).toString();
      const res = await fetch(`/api/apps?${qs}`);
      return res.json();
    },
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const getMedalColor = (idx) => {
    if (idx === 0) return "#FFD700";
    if (idx === 1) return "#C0C0C0";
    if (idx === 2) return "#CD7F32";
    return null;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />

      <div
        style={{
          background: "linear-gradient(135deg, #16213E, #0F3460)",
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
            <TrendingUp size={14} color="#3DDC84" />
            <span
              style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}
            >
              All Time Rankings
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              margin: "0 0 16px",
            }}
          >
            🏆 Top Downloads
          </h1>
          <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
            The most downloaded MOD APKs of all time
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
        {/* Filter */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => setCategory("")}
            style={{
              padding: "8px 18px",
              borderRadius: "24px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background: !category ? "#3DDC84" : "rgba(255,255,255,0.06)",
              color: !category ? "#1A1A2E" : "#888",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            All
          </button>
          {catData?.categories?.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              style={{
                padding: "8px 18px",
                borderRadius: "24px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                background:
                  category === c.slug ? "#3DDC84" : "rgba(255,255,255,0.06)",
                color: category === c.slug ? "#1A1A2E" : "#888",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Top 3 */}
        {data?.apps?.length >= 3 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {data.apps.slice(0, 3).map((app, idx) => {
              const medalColor = getMedalColor(idx);
              return (
                <a
                  key={app.id}
                  href={`/app/${app.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#16213E",
                      borderRadius: "20px",
                      padding: "28px",
                      border: `2px solid ${medalColor}40`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "80px",
                        height: "80px",
                        background: `${medalColor}15`,
                        borderRadius: "50%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "40px",
                          fontWeight: 800,
                          color: medalColor,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        #{idx + 1}
                      </div>
                      <Medal size={32} color={medalColor} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={app.icon_url}
                        alt={app.name}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "14px",
                          objectFit: "contain",
                          background: "#1A1A2E",
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=56`;
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "#fff",
                          }}
                        >
                          {app.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#3DDC84",
                            marginTop: "4px",
                          }}
                        >
                          {app.mod_version || "MOD"}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#FFD700",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <Star size={14} fill="#FFD700" color="#FFD700" />
                        {parseFloat(app.rating || 0).toFixed(1)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#3DDC84",
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        <Download size={14} />
                        {formatDownloads(app.download_count)}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Ranked list */}
        <div style={{ display: "grid", gap: "10px" }}>
          {isLoading
            ? Array(10)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "72px",
                      background: "#16213E",
                      borderRadius: "12px",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                ))
            : data?.apps?.map((app, idx) => (
                <a
                  key={app.id}
                  href={`/app/${app.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      background: "#16213E",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "14px",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(61,220,132,0.3)";
                      e.currentTarget.style.background = "#1a2540";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "#16213E";
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        flexShrink: 0,
                        background: getMedalColor(idx)
                          ? `${getMedalColor(idx)}20`
                          : "rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 800,
                        fontSize: "16px",
                        color: getMedalColor(idx) || "#555",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <img
                      src={app.icon_url}
                      alt={app.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        objectFit: "contain",
                        background: "#1A1A2E",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=48`;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {app.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#555",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <span>{app.category_name}</span>
                        <span>{app.size}</span>
                        <span style={{ color: "#3DDC84" }}>
                          {app.mod_version || "MOD"}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#FFD700",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <Star size={13} fill="#FFD700" color="#FFD700" />
                        {parseFloat(app.rating || 0).toFixed(1)}
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#3DDC84",
                          fontSize: "15px",
                          fontWeight: 700,
                        }}
                      >
                        <Download size={14} />
                        {formatDownloads(app.download_count)}
                      </div>
                      <div
                        style={{
                          padding: "8px 16px",
                          background: "rgba(61,220,132,0.1)",
                          border: "1px solid rgba(61,220,132,0.3)",
                          borderRadius: "8px",
                          color: "#3DDC84",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        Download
                      </div>
                    </div>
                  </div>
                </a>
              ))}
        </div>
      </div>

      <Footer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
