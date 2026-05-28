"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

function StatCard({ label, value, icon: Icon, color, sub, trend }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "14px",
        padding: "18px",
        border: "1px solid rgba(255,255,255,0.07)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}40`)}
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
      }
    >
      <div
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: `${color}10`,
          filter: "blur(14px)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={17} color={color} />
        </div>
        {sub !== undefined && (
          <span
            style={{
              fontSize: "10px",
              color,
              background: `${color}15`,
              padding: "2px 7px",
              borderRadius: "8px",
              fontWeight: 700,
            }}
          >
            {sub}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: "26px",
          fontWeight: 800,
          color: "#fff",
          fontFamily: "Poppins, sans-serif",
          marginBottom: "2px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#555",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {label}
        {trend !== undefined && (
          <span
            style={{
              fontSize: "10px",
              color: trend >= 0 ? "#3DDC84" : "#FF6B6B",
            }}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

function StatusRing({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <svg width="64" height="64" style={{ flexShrink: 0 }}>
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text
          x="32"
          y="36"
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontWeight="700"
        >
          {pct}%
        </text>
      </svg>
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "11px", color: "#555" }}>
          {value} of {total} posts
        </div>
      </div>
    </div>
  );
}

function CSSBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count || 0), 1);
  const today = new Date().toLocaleDateString("en", { weekday: "short" });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "80px",
        padding: "0 2px",
      }}
    >
      {data.map((d, i) => {
        const h = Math.max(4, (d.count / max) * 76);
        const isToday = d.label === today;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}
            title={`${d.label}: ${d.count} posts`}
          >
            <div
              style={{
                fontSize: "9px",
                color: isToday ? "#3DDC84" : "#555",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {d.count || ""}
            </div>
            <div
              style={{
                width: "100%",
                height: `${h}px`,
                borderRadius: "3px 3px 0 0",
                background:
                  d.count > 0
                    ? isToday
                      ? "linear-gradient(180deg, #3DDC84, #2BA861)"
                      : "linear-gradient(180deg, #4ECDC4, #2BA897)"
                    : "rgba(255,255,255,0.04)",
                transition: "height 0.6s ease",
                minHeight: "4px",
                boxShadow:
                  isToday && d.count > 0
                    ? "0 0 8px rgba(61,220,132,0.3)"
                    : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function TelegramAnalytics() {
  const [period, setPeriod] = useState("7d");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["telegram-analytics", period],
    queryFn: async () => {
      const res = await fetch("/api/telegram/logs?limit=200");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const stats = data?.stats || {
    posted: 0,
    failed: 0,
    pending: 0,
    retrying: 0,
    total: 0,
  };
  const logs = data?.logs || [];

  // Posts today
  const todayStr = new Date().toISOString().split("T")[0];
  const postsToday = logs.filter(
    (l) => l.created_at?.startsWith(todayStr) && l.status === "posted",
  ).length;

  // Chart data
  const chartData = (() => {
    const days = parseInt(period) || 7;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLogs = logs.filter(
        (l) => l.created_at?.startsWith(dateStr) && l.status === "posted",
      );
      result.push({
        label: d.toLocaleDateString("en", { weekday: "short" }),
        count: dayLogs.length,
        date: dateStr,
      });
    }
    return result;
  })();

  const successRate = stats.total
    ? Math.round((stats.posted / stats.total) * 100)
    : 0;

  const hashtagCounts = {};
  logs.forEach((log) => {
    const matches = (log.payload || "").match(/#[A-Za-z0-9]+/g) || [];
    matches.forEach((tag) => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
  });
  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(61,220,132,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={18} color="#3DDC84" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>
            Posting Analytics
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[
            ["7d", "7 Days"],
            ["14d", "14 Days"],
            ["30d", "30 Days"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPeriod(val)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                background:
                  period === val
                    ? "rgba(61,220,132,0.15)"
                    : "rgba(255,255,255,0.05)",
                color: period === val ? "#3DDC84" : "#666",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#555",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: isLoading ? "spin 0.8s linear infinite" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Stat cards — 5 cards including Posts Today */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <StatCard
          label="Posts Today"
          value={postsToday}
          icon={Zap}
          color="#FFD700"
          sub="Today"
        />
        <StatCard
          label="Total Posted"
          value={stats.posted}
          icon={CheckCircle}
          color="#3DDC84"
          sub="✓ OK"
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={XCircle}
          color="#FF6B6B"
          sub={stats.failed > 0 ? "Check" : "✓ OK"}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          color="#4FC3F7"
          sub="Queue"
        />
        <StatCard
          label="Success Rate"
          value={`${successRate}%`}
          icon={TrendingUp}
          color="#4ECDC4"
          sub={successRate >= 90 ? "🔥 Great" : "📈"}
        />
      </div>

      {/* Chart + Status rings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            padding: "18px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            <BarChart3 size={15} color="#3DDC84" />
            <span
              style={{ fontSize: "13px", fontWeight: 600, color: "#C0C0C0" }}
            >
              Daily Post Volume
            </span>
            <span
              style={{ marginLeft: "auto", fontSize: "10px", color: "#444" }}
            >
              {chartData.reduce((sum, d) => sum + d.count, 0)} total in period
            </span>
          </div>
          {isLoading ? (
            <div
              style={{
                height: "80px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
          ) : (
            <>
              <CSSBarChart data={chartData} />
              <div style={{ display: "flex", gap: "4px", marginTop: "5px" }}>
                {chartData.map((d, i) => {
                  const isToday =
                    d.label ===
                    new Date().toLocaleDateString("en", { weekday: "short" });
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "9px",
                        color: isToday ? "#3DDC84" : "#444",
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {d.label}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            padding: "18px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#C0C0C0",
              marginBottom: "14px",
            }}
          >
            Status Breakdown
          </div>
          {isLoading ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: "56px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              <StatusRing
                label="Posted"
                value={stats.posted}
                total={stats.total}
                color="#3DDC84"
              />
              <StatusRing
                label="Failed"
                value={stats.failed}
                total={stats.total}
                color="#FF6B6B"
              />
              <StatusRing
                label="Pending"
                value={stats.pending}
                total={stats.total}
                color="#FFD700"
              />
            </>
          )}
        </div>
      </div>

      {/* Recent posts timeline */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          padding: "18px",
          border: "1px solid rgba(255,255,255,0.07)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#C0C0C0",
            marginBottom: "14px",
          }}
        >
          Recent Post Timeline
        </div>
        {logs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "28px",
              color: "#555",
              fontSize: "14px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
            No posts yet — publish an app to start seeing data.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "6px" }}>
            {logs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      log.status === "posted"
                        ? "#3DDC84"
                        : log.status === "failed"
                          ? "#FF6B6B"
                          : "#FFD700",
                    boxShadow:
                      log.status === "posted"
                        ? "0 0 5px rgba(61,220,132,0.5)"
                        : "none",
                  }}
                />
                {log.app_icon ? (
                  <img
                    src={log.app_icon}
                    alt=""
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      objectFit: "contain",
                      background: "#1A1A2E",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      background: "rgba(61,220,132,0.1)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    📦
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#C0C0C0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {log.app_name || "Unknown"}
                  </div>
                  <div style={{ fontSize: "10px", color: "#444" }}>
                    {log.app_version} · {log.triggered_by}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      background:
                        log.status === "posted"
                          ? "rgba(61,220,132,0.12)"
                          : log.status === "failed"
                            ? "rgba(255,107,107,0.12)"
                            : "rgba(255,215,0,0.12)",
                      color:
                        log.status === "posted"
                          ? "#3DDC84"
                          : log.status === "failed"
                            ? "#FF6B6B"
                            : "#FFD700",
                    }}
                  >
                    {log.status}
                  </span>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#444",
                      marginTop: "2px",
                    }}
                  >
                    {log.created_at
                      ? new Date(log.created_at).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top hashtags */}
      {topHashtags.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "14px",
            padding: "18px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#C0C0C0",
              marginBottom: "14px",
            }}
          >
            Top Hashtags
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {topHashtags.map(([tag, count], i) => (
              <div
                key={tag}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#444",
                    fontWeight: 700,
                    minWidth: "18px",
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "12px",
                    color: "#3DDC84",
                    fontFamily: "monospace",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
                <div
                  style={{
                    flex: 2,
                    height: "5px",
                    borderRadius: "3px",
                    background: "rgba(255,255,255,0.05)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      borderRadius: "3px",
                      background: "linear-gradient(90deg, #3DDC84, #4ECDC4)",
                      width: `${Math.min(100, (count / topHashtags[0][1]) * 100)}%`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    minWidth: "22px",
                    textAlign: "right",
                  }}
                >
                  {count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}
