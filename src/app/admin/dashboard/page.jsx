"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Download,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  Bell,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const stats = [
    {
      label: "Total Apps",
      value: data?.appStats?.total_apps || 0,
      icon: Package,
      color: "#3DDC84",
      sub: `${data?.appStats?.published || 0} published`,
    },
    {
      label: "Total Downloads",
      value: Number(data?.totalDownloads || 0).toLocaleString(),
      icon: Download,
      color: "#4ECDC4",
      sub: "All time",
    },
    {
      label: "Pending Reviews",
      value: data?.reviewStats?.pending || 0,
      icon: Star,
      color: "#FFD700",
      sub: `${data?.reviewStats?.approved || 0} approved`,
    },
    {
      label: "Subscribers",
      value: data?.subscriberCount || 0,
      icon: Users,
      color: "#FF6B6B",
      sub: "Newsletter",
    },
    {
      label: "Unread Messages",
      value: data?.unreadMessages || 0,
      icon: MessageSquare,
      color: "#DDA0DD",
      sub: "Contact form",
    },
    {
      label: "Featured Apps",
      value: data?.appStats?.featured || 0,
      icon: TrendingUp,
      color: "#98D8C8",
      sub: "On homepage",
    },
  ];

  const chartData =
    data?.downloadStats?.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      downloads: parseInt(d.count),
    })) || [];

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "28px",
            fontWeight: 800,
            margin: "0 0 6px",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "#555", margin: 0, fontSize: "15px" }}>
          Welcome back! Here's what's happening on your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} color={stat.color} />
                </div>
              </div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "28px",
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: "4px",
                }}
              >
                {isLoading ? "..." : stat.value}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#16213E",
            borderRadius: "16px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            Downloads (Last 30 Days)
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3DDC84" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3DDC84" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  stroke="#444"
                  tick={{ fill: "#555", fontSize: 12 }}
                />
                <YAxis stroke="#444" tick={{ fill: "#555", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0D0D1A",
                    border: "1px solid rgba(61,220,132,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="#3DDC84"
                  fill="url(#dlGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#444",
                fontSize: "14px",
              }}
            >
              No download data yet
            </div>
          )}
        </div>

        <div
          style={{
            background: "#16213E",
            borderRadius: "16px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            Apps by Category
          </h2>
          {data?.categoryStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.categoryStats.slice(0, 6)} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#444"
                  tick={{ fill: "#555", fontSize: 11 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#444"
                  tick={{ fill: "#555", fontSize: 11 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0D0D1A",
                    border: "1px solid rgba(61,220,132,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#3DDC84" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#444",
                fontSize: "14px",
              }}
            >
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Downloads + Top Apps */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div
          style={{
            background: "#16213E",
            borderRadius: "16px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Recent Downloads
          </h2>
          {data?.recentDownloads?.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: 500, color: "#C0C0C0" }}
              >
                {d.app_name}
              </span>
              <span style={{ fontSize: "12px", color: "#555" }}>
                {new Date(d.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#16213E",
            borderRadius: "16px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Top Apps
          </h2>
          {data?.topApps?.map((app, i) => (
            <div
              key={app.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: i < 3 ? "#3DDC84" : "#555",
                  minWidth: "20px",
                }}
              >
                #{i + 1}
              </span>
              <img
                src={app.icon_url}
                alt={app.name}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  background: "#1A1A2E",
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=32`;
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: "#C0C0C0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {app.name}
              </span>
              <span
                style={{ fontSize: "12px", color: "#3DDC84", fontWeight: 600 }}
              >
                {Number(app.download_count).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {[
          { href: "/admin/apps/new", label: "+ Add New App", color: "#3DDC84" },
          {
            href: "/admin/reviews",
            label: "Approve Reviews",
            color: "#FFD700",
          },
          { href: "/admin/messages", label: "View Messages", color: "#4ECDC4" },
          { href: "/admin/requests", label: "App Requests", color: "#FF6B6B" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              padding: "16px 20px",
              background: `${link.color}15`,
              border: `1px solid ${link.color}30`,
              borderRadius: "12px",
              color: link.color,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
              textAlign: "center",
              transition: "all 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `${link.color}25`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `${link.color}15`)
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
