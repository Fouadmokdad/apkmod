"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Star,
  FileText,
  Users,
  BarChart2,
  Settings,
  MessageSquare,
  Bell,
  FolderOpen,
  Globe,
  Database,
  Menu,
  X,
  LogOut,
  Download,
  ChevronRight,
  Send,
  Radio,
  BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apps", label: "Apps", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/requests", label: "App Requests", icon: Bell },
  { href: "/admin/newsletter", label: "Newsletter", icon: Globe },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  // separator marker
  { divider: true },
  {
    href: "/admin/settings/telegram",
    label: "Telegram Setup",
    icon: Send,
    accent: true,
  },
  { href: "/admin/telegram", label: "Telegram Logs", icon: Radio },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_user");
      if (stored) setUser(JSON.parse(stored));
      else if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
  };

  // Don't show layout on login page
  if (
    typeof window !== "undefined" &&
    window.location.pathname === "/admin/login"
  ) {
    return children;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0D1A",
        display: "flex",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "256px" : "72px",
          flexShrink: 0,
          background: "#16213E",
          borderRight: "1px solid rgba(61,220,132,0.1)",
          transition: "width 0.3s ease",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minHeight: "72px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#3DDC84,#2BA861)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 15px rgba(61,220,132,0.3)",
            }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "16px",
                color: "#fff",
              }}
            >
              M
            </span>
          </div>
          {sidebarOpen && (
            <div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                Mod Apk Admin
              </div>
              <div style={{ fontSize: "11px", color: "#3DDC84" }}>
                Control Panel
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_ITEMS.map((item, idx) => {
            // Divider
            if (item.divider) {
              return (
                <div key={`div-${idx}`}>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.06)",
                      margin: "10px 8px 6px",
                    }}
                  />
                  {sidebarOpen && (
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#3DDC84",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        padding: "4px 12px 6px",
                        opacity: 0.8,
                      }}
                    >
                      Telegram
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive =
              currentPath === item.href ||
              currentPath.startsWith(item.href + "/");
            const accentColor = item.accent ? "#3DDC84" : null;

            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  marginBottom: "4px",
                  transition: "all 0.2s",
                  background: isActive
                    ? accentColor
                      ? "rgba(61,220,132,0.15)"
                      : "rgba(61,220,132,0.15)"
                    : "transparent",
                  color: isActive
                    ? "#3DDC84"
                    : accentColor
                      ? "rgba(61,220,132,0.7)"
                      : "#666",
                  borderLeft: isActive
                    ? "3px solid #3DDC84"
                    : accentColor
                      ? "3px solid rgba(61,220,132,0.3)"
                      : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = accentColor
                      ? "rgba(61,220,132,0.08)"
                      : "rgba(255,255,255,0.04)";
                    e.currentTarget.style.color = accentColor
                      ? "#3DDC84"
                      : "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = accentColor
                      ? "rgba(61,220,132,0.7)"
                      : "#666";
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: item.accent ? 600 : 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                )}
                {sidebarOpen && item.accent && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#3DDC84",
                      background: "rgba(61,220,132,0.15)",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    NEW
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User */}
        <div
          style={{
            padding: "12px 8px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {sidebarOpen && user && (
            <div
              style={{
                padding: "10px 12px",
                marginBottom: "8px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.username}
              </div>
              <div style={{ fontSize: "11px", color: "#3DDC84" }}>
                {user.role}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 12px",
              borderRadius: "10px",
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,107,107,0.1)";
              e.currentTarget.style.color = "#ff6b6b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#555";
            }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {sidebarOpen && (
              <span style={{ fontSize: "14px", fontWeight: 500 }}>Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "256px" : "72px",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            height: "72px",
            background: "#16213E",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              borderRadius: "8px",
              padding: "8px",
              color: "#C0C0C0",
              cursor: "pointer",
              display: "flex",
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#3DDC84",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Globe size={15} /> View Site
            </a>
          </div>
        </header>
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
