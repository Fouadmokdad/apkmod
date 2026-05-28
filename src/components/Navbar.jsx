"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  Download,
  ChevronDown,
  Gamepad2,
  Camera,
  Music,
  Share2,
  Wrench,
  DollarSign,
  BookOpen,
  Video,
  Shield,
  MessageCircle,
} from "lucide-react";

const CATEGORIES = [
  { name: "Games", slug: "games", icon: Gamepad2 },
  { name: "Photography", slug: "photography", icon: Camera },
  { name: "Music", slug: "music", icon: Music },
  { name: "Social Media", slug: "social-media", icon: Share2 },
  { name: "Tools", slug: "tools", icon: Wrench },
  { name: "Finance", slug: "finance", icon: DollarSign },
  { name: "Education", slug: "education", icon: BookOpen },
  { name: "Video", slug: "video", icon: Video },
  { name: "VPN", slug: "vpn", icon: Shield },
  { name: "Communication", slug: "communication", icon: MessageCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "rgba(22,33,62,0.98)" : "#16213E",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(61,220,132,0.1)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 16px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(61,220,132,0.4)",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "1px" }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: "18px",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  M
                </span>
                <Download size={10} color="#fff" style={{ marginTop: "4px" }} />
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                Mod Apk
              </div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: "10px",
                  color: "#3DDC84",
                  lineHeight: 1,
                }}
              >
                STORE
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
            className="desktop-nav"
          >
            <a href="/" style={navLinkStyle}>
              Home
            </a>
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button
                style={{
                  ...navLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Categories{" "}
                <ChevronDown
                  size={14}
                  style={{
                    transition: "transform 0.2s",
                    transform: catOpen ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </button>
              {catOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#16213E",
                    border: "1px solid rgba(61,220,132,0.2)",
                    borderRadius: "12px",
                    padding: "12px",
                    minWidth: "520px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    zIndex: 100,
                  }}
                >
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <a
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          color: "#C0C0C0",
                          fontSize: "13px",
                          fontWeight: 500,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(61,220,132,0.1)";
                          e.currentTarget.style.color = "#3DDC84";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#C0C0C0";
                        }}
                      >
                        <Icon size={16} color="#3DDC84" />
                        {cat.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <a href="/top-downloads" style={navLinkStyle}>
              Top Downloads
            </a>
            <a href="/latest" style={navLinkStyle}>
              Latest
            </a>
            <a href="/submit-app" style={navLinkStyle}>
              Submit App
            </a>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: "rgba(61,220,132,0.1)",
                border: "1px solid rgba(61,220,132,0.2)",
                borderRadius: "8px",
                padding: "8px",
                color: "#3DDC84",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(61,220,132,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(61,220,132,0.1)")
              }
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                color: "#C0C0C0",
                cursor: "pointer",
                padding: "8px",
                display: "none",
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              background: "#16213E",
              borderTop: "1px solid rgba(61,220,132,0.1)",
              padding: "16px",
            }}
          >
            {[
              ["/", "Home"],
              ["/top-downloads", "Top Downloads"],
              ["/latest", "Latest"],
              ["/submit-app", "Submit App"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  color: "#C0C0C0",
                  textDecoration: "none",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3DDC84")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#C0C0C0")}
              >
                {label}
              </a>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                marginTop: "12px",
                paddingTop: "12px",
              }}
            >
              <div
                style={{
                  color: "#3DDC84",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                  padding: "0 16px",
                }}
              >
                CATEGORIES
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                }}
              >
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <a
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 12px",
                        color: "#C0C0C0",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#3DDC84")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#C0C0C0")
                      }
                    >
                      <Icon size={14} color="#3DDC84" />
                      {cat.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(26,26,46,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "80px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <button
            onClick={() => setSearchOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "#C0C0C0",
              cursor: "pointer",
            }}
          >
            <X size={28} />
          </button>
          <div style={{ width: "100%", maxWidth: "640px", padding: "0 24px" }}>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Search <span style={{ color: "#3DDC84" }}>MOD APKs</span>
            </h2>
            <form onSubmit={handleSearch}>
              <div style={{ position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#3DDC84",
                  }}
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps, games, tools..."
                  style={{
                    width: "100%",
                    padding: "18px 60px 18px 50px",
                    fontSize: "18px",
                    background: "rgba(255,255,255,0.07)",
                    border: "2px solid rgba(61,220,132,0.3)",
                    borderRadius: "14px",
                    color: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#3DDC84",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Go
                </button>
              </div>
            </form>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "16px",
                justifyContent: "center",
              }}
            >
              {["Spotify", "YouTube", "Instagram", "Minecraft", "TikTok"].map(
                (term) => (
                  <a
                    key={term}
                    href={`/search?q=${term}`}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: "rgba(61,220,132,0.1)",
                      border: "1px solid rgba(61,220,132,0.2)",
                      color: "#3DDC84",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    #{term}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

const navLinkStyle = {
  color: "#C0C0C0",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 500,
  padding: "8px 12px",
  borderRadius: "8px",
  transition: "all 0.2s",
  onMouseEnter: undefined,
};
