"use client";
import { useQuery } from "@tanstack/react-query";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Download, Search, Star } from "lucide-react";

const COLORS = [
  "#3DDC84",
  "#4ECDC4",
  "#FFD700",
  "#FF6B6B",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#AED6F1",
  "#82E0AA",
  "#F0B27A",
];

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics-full"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const downloadChartData =
    data?.downloadStats?.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      downloads: parseInt(d.count),
    })) || [];

  const categoryPieData =
    data?.categoryStats
      ?.map((c) => ({
        name: c.name,
        value: parseInt(c.count),
      }))
      .filter((c) => c.value > 0) || [];

  return (
    <div>
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "24px",
          fontWeight: 800,
          marginBottom: "28px",
        }}
      >
        Analytics
      </h1>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Total Downloads",
            value: Number(data?.totalDownloads || 0).toLocaleString(),
            icon: Download,
            color: "#3DDC84",
          },
          {
            label: "Total Apps",
            value: data?.appStats?.total_apps || 0,
            icon: TrendingUp,
            color: "#4ECDC4",
          },
          {
            label: "Total Reviews",
            value: data?.reviewStats?.total || 0,
            icon: Star,
            color: "#FFD700",
          },
          {
            label: "Search Queries",
            value: data?.searchStats?.length || 0,
            icon: Search,
            color: "#FF6B6B",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: "#16213E",
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
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
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: stat.color,
                  }}
                >
                  {isLoading ? "..." : stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  {stat.label}
                </div>
              </div>
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
            Daily Downloads (30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={downloadChartData}>
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
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
                stroke="#333"
                tick={{ fill: "#555", fontSize: 11 }}
              />
              <YAxis stroke="#333" tick={{ fill: "#555", fontSize: 11 }} />
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
                fill="url(#dlGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
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
          {categoryPieData.length > 0 ? (
            <>
              <PieChart width={240} height={200}>
                <Pie
                  data={categoryPieData}
                  cx={120}
                  cy={100}
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                >
                  {categoryPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0D0D1A",
                    border: "1px solid rgba(61,220,132,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                  marginTop: "12px",
                }}
              >
                {categoryPieData.slice(0, 6).map((c, i) => (
                  <div
                    key={c.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: COLORS[i % COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#444",
              }}
            >
              No data
            </div>
          )}
        </div>
      </div>

      {/* Top searches & Top apps */}
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
            Top Searches (7 Days)
          </h2>
          {data?.searchStats?.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px", color: "#C0C0C0" }}>
                "{s.query}"
              </span>
              <span
                style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 700 }}
              >
                {s.count}x
              </span>
            </div>
          ))}
          {!data?.searchStats?.length && (
            <div style={{ color: "#444", fontSize: "14px" }}>
              No search data yet
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
              marginBottom: "20px",
            }}
          >
            Top Apps by Downloads
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
                  minWidth: "24px",
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
                style={{ fontSize: "12px", color: "#3DDC84", fontWeight: 700 }}
              >
                {Number(app.download_count).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
