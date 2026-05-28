"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Download,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Gamepad2,
  Camera,
  Music,
  Share2,
  Wrench,
  DollarSign,
  BookOpen,
  Video,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";

const CATEGORIES = [
  { name: "Games", slug: "games", icon: Gamepad2, color: "#FF6B6B" },
  { name: "Photography", slug: "photography", icon: Camera, color: "#4ECDC4" },
  { name: "Music", slug: "music", icon: Music, color: "#45B7D1" },
  { name: "Social", slug: "social-media", icon: Share2, color: "#96CEB4" },
  { name: "Tools", slug: "tools", icon: Wrench, color: "#FFEAA7" },
  { name: "Finance", slug: "finance", icon: DollarSign, color: "#DDA0DD" },
  { name: "Education", slug: "education", icon: BookOpen, color: "#98D8C8" },
  { name: "Video", slug: "video", icon: Video, color: "#F7DC6F" },
  { name: "VPN", slug: "vpn", icon: Shield, color: "#82E0AA" },
  {
    name: "Chat",
    slug: "communication",
    icon: MessageCircle,
    color: "#AED6F1",
  },
];

function useApps(params) {
  const qs = new URLSearchParams(params).toString();
  return useQuery({
    queryKey: ["apps", params],
    queryFn: async () => {
      const res = await fetch(`/api/apps?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch apps");
      return res.json();
    },
  });
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#16213E",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.05)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: "16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              marginBottom: "8px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: "12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "6px",
              width: "60%",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: "12px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "6px",
          marginBottom: "8px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: "38px",
          background: "rgba(61,220,132,0.05)",
          borderRadius: "10px",
          animation: "pulse 1.5s ease-in-out infinite",
          marginTop: "16px",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const particleRef = useRef(null);

  const { data: trendingData, isLoading: trendingLoading } = useApps({
    trending: "true",
    limit: "8",
  });
  const { data: latestData, isLoading: latestLoading } = useApps({
    sort: "created_at",
    limit: "12",
  });
  const { data: topData } = useApps({ sort: "download_count", limit: "10" });
  const { data: featuredData } = useApps({ featured: "true", limit: "3" });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
          paddingTop: "80px",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(61,220,132,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,220,132,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "rgba(61,220,132,0.06)",
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(15,52,96,0.5)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: "860px",
            margin: "0 auto",
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
              marginBottom: "24px",
            }}
          >
            <Zap size={14} color="#3DDC84" />
            <span
              style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}
            >
              10+ Premium MOD APKs Available
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 24px",
            }}
          >
            Download Premium{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MOD APKs
            </span>
            <br />— Safe, Fast & Free
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 20px)",
              color: "#888",
              marginBottom: "40px",
              lineHeight: 1.7,
            }}
          >
            Unlock premium features for your favourite apps.
            <br />
            All mods are tested, verified & 100% safe.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch}>
            <div
              style={{
                position: "relative",
                maxWidth: "560px",
                margin: "0 auto 20px",
              }}
            >
              <Search
                size={22}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#3DDC84",
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Spotify, YouTube, Minecraft..."
                style={{
                  width: "100%",
                  padding: "20px 160px 20px 56px",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(61,220,132,0.3)",
                  borderRadius: "16px",
                  color: "#fff",
                  fontSize: "17px",
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
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#3DDC84",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Search
              </button>
            </div>
          </form>

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Spotify", "YouTube", "Minecraft", "Instagram", "TikTok"].map(
              (term) => (
                <a
                  key={term}
                  href={`/search?q=${term}`}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#888",
                    textDecoration: "none",
                    fontSize: "13px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,220,132,0.4)";
                    e.currentTarget.style.color = "#3DDC84";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  {term}
                </a>
              ),
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              justifyContent: "center",
              marginTop: "60px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "10+", label: "Premium Apps" },
              { value: "5M+", label: "Total Downloads" },
              { value: "100%", label: "Safe & Tested" },
              { value: "4.8★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#3DDC84",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px 0" }}
      >
        {/* Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "80px",
          }}
        >
          {[
            {
              icon: Shield,
              title: "Virus Scanned",
              desc: "Every APK scanned before publishing",
              color: "#3DDC84",
            },
            {
              icon: Zap,
              title: "Fast Downloads",
              desc: "Multiple mirrors for maximum speed",
              color: "#FFD700",
            },
            {
              icon: Download,
              title: "Free Forever",
              desc: "Premium features at zero cost",
              color: "#4ECDC4",
            },
            {
              icon: Star,
              title: "Top Rated",
              desc: "Community verified & trusted",
              color: "#FF6B6B",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                style={{
                  padding: "24px",
                  background: "#16213E",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${f.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color={f.color} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#fff",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "#666",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trending Apps */}
        <SectionHeader
          title="🔥 Trending Apps"
          subtitle="Most popular this week"
          href="/top-downloads"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "80px",
          }}
        >
          {trendingLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : trendingData?.apps?.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
        </div>

        {/* Categories */}
        <SectionHeader
          title="📱 Browse Categories"
          subtitle="Find apps by category"
          href="/search"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "12px",
            marginBottom: "80px",
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "20px 12px",
                    background: "#16213E",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = cat.color + "60";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${cat.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px",
                    }}
                  >
                    <Icon size={22} color={cat.color} />
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#C0C0C0",
                    }}
                  >
                    {cat.name}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Latest Updates */}
        <SectionHeader
          title="🆕 Latest Updates"
          subtitle="Recently added or updated"
          href="/latest"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "80px",
          }}
        >
          {latestLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : latestData?.apps
                ?.slice(0, 6)
                .map((app) => <AppCard key={app.id} app={app} />)}
        </div>

        {/* Top Downloads */}
        <SectionHeader
          title="⬇️ Top Downloads"
          subtitle="Most downloaded of all time"
          href="/top-downloads"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
            marginBottom: "80px",
          }}
        >
          {topData?.apps?.slice(0, 10).map((app, idx) => (
            <a
              key={app.id}
              href={`/app/${app.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  background: "#16213E",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(61,220,132,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    flexShrink: 0,
                    background:
                      idx < 3
                        ? "linear-gradient(135deg, #3DDC84, #2BA861)"
                        : "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: "15px",
                    color: idx < 3 ? "#1A1A2E" : "#555",
                  }}
                >
                  {idx + 1}
                </div>
                <img
                  src={app.icon_url}
                  alt={app.name}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    objectFit: "contain",
                    background: "#1A1A2E",
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=42`;
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
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
                      fontSize: "12px",
                      color: "#555",
                      marginTop: "2px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Download size={11} />
                    {app.download_count?.toLocaleString()} downloads
                  </div>
                </div>
                <div
                  style={{
                    color: "#3DDC84",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  {app.rating > 0
                    ? `★${parseFloat(app.rating).toFixed(1)}`
                    : ""}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ title, subtitle, href }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 800,
            margin: "0 0 6px",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            {subtitle}
          </p>
        )}
      </div>
      <a
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#3DDC84",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        View All <ChevronRight size={16} />
      </a>
    </div>
  );
}
