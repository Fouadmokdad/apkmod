"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
} from "lucide-react";

function StatusBadge({ status }) {
  const cfg = {
    posted: {
      bg: "rgba(61,220,132,0.1)",
      border: "rgba(61,220,132,0.3)",
      color: "#3DDC84",
      label: "✓ Posted",
    },
    failed: {
      bg: "rgba(255,107,107,0.1)",
      border: "rgba(255,107,107,0.3)",
      color: "#FF6B6B",
      label: "✕ Failed",
    },
    pending: {
      bg: "rgba(255,215,0,0.1)",
      border: "rgba(255,215,0,0.3)",
      color: "#FFD700",
      label: "⏳ Pending",
    },
    retrying: {
      bg: "rgba(78,205,196,0.1)",
      border: "rgba(78,205,196,0.3)",
      color: "#4ECDC4",
      label: "↻ Retrying",
    },
  };
  const s = cfg[status] || cfg.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "20px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function PayloadModal({ log, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#16213E",
          borderRadius: "20px",
          padding: "28px",
          maxWidth: "640px",
          width: "100%",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Log Details — {log.app_name}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#888",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "6px 12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ✕ Close
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            ["Status", <StatusBadge key="s" status={log.status} />],
            ["Version", log.app_version || "N/A"],
            ["Triggered By", log.triggered_by || "auto"],
            ["Retry Count", log.retry_count || 0],
            ["Message ID", log.telegram_message_id || "—"],
            ["Chat ID", log.telegram_chat_id || "—"],
            [
              "Created",
              log.created_at ? new Date(log.created_at).toLocaleString() : "—",
            ],
            [
              "Posted At",
              log.posted_at ? new Date(log.posted_at).toLocaleString() : "—",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#555",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "13px", color: "#C0C0C0" }}>{value}</div>
            </div>
          ))}
        </div>
        {log.error_message && (
          <div
            style={{
              padding: "14px",
              background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.2)",
              borderRadius: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#FF6B6B",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Error Message
            </div>
            <div style={{ fontSize: "13px", color: "#888" }}>
              {log.error_message}
            </div>
          </div>
        )}
        {log.payload && (
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#555",
                fontWeight: 600,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Message Payload
            </div>
            <pre
              style={{
                margin: 0,
                padding: "14px",
                background: "rgba(0,0,0,0.4)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#888",
                overflowX: "auto",
                lineHeight: 1.7,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {log.payload}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TelegramLogsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewLog, setViewLog] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["telegram-logs", statusFilter, page],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page,
        limit: 20,
        ...(statusFilter !== "all" && { status: statusFilter }),
      }).toString();
      const res = await fetch(`/api/telegram/logs?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const handleRetry = async (log) => {
    setRetryingId(log.id);
    try {
      const res = await fetch(`/api/telegram/logs/${log.id}`, {
        method: "POST",
      });
      const result = await res.json();
      refetch();
    } catch (err) {
      console.error(err);
    }
    setRetryingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this log?")) return;
    await fetch(`/api/telegram/logs?id=${id}`, { method: "DELETE" });
    refetch();
  };

  const handleClearFailed = async () => {
    if (!confirm("Delete all failed logs?")) return;
    await fetch("/api/telegram/logs?all=true", { method: "DELETE" });
    refetch();
  };

  const logs = data?.logs || [];
  const stats = data?.stats || {};
  const pagination = data?.pagination || {};

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3DDC84, #2BA861)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            📨
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Telegram Logs
          </h1>
        </div>
        <p style={{ color: "#555", margin: 0, fontSize: "14px" }}>
          Track all auto-posting activity, retry failed posts, view payloads.
        </p>
      </div>

      {/* Stat summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Posts",
            value: stats.total || 0,
            color: "#C0C0C0",
            icon: "📊",
          },
          {
            label: "Posted",
            value: stats.posted || 0,
            color: "#3DDC84",
            icon: "✅",
          },
          {
            label: "Failed",
            value: stats.failed || 0,
            color: "#FF6B6B",
            icon: "❌",
          },
          {
            label: "Pending",
            value: stats.pending || 0,
            color: "#FFD700",
            icon: "⏳",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>
              {s.icon}
            </div>
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "11px", color: "#555" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Status filter */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
            padding: "4px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            ["all", "All"],
            ["posted", "Posted"],
            ["failed", "Failed"],
            ["pending", "Pending"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => {
                setStatusFilter(val);
                setPage(1);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                background:
                  statusFilter === val ? "rgba(61,220,132,0.2)" : "transparent",
                color: statusFilter === val ? "#3DDC84" : "#555",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {stats.failed > 0 && (
            <button
              onClick={handleClearFailed}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.25)",
                borderRadius: "8px",
                color: "#FF6B6B",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Trash2 size={14} /> Clear Failed
            </button>
          )}
          <button
            onClick={() => refetch()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#888",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <RefreshCw
              size={14}
              style={{
                animation: isLoading ? "spin 0.8s linear infinite" : "none",
              }}
            />{" "}
            Refresh
          </button>
          <a
            href="/admin/settings/telegram"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "rgba(61,220,132,0.1)",
              border: "1px solid rgba(61,220,132,0.25)",
              borderRadius: "8px",
              color: "#3DDC84",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ⚙️ Settings
          </a>
        </div>
      </div>

      {/* Logs table */}
      <div
        style={{
          background: "#16213E",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 120px 100px",
            gap: "0",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {["App", "Version", "Status", "Posted At", "Retries", "Actions"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {h}
              </div>
            ),
          )}
        </div>

        {/* Loading */}
        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 120px 100px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {[100, 60, 80, 80, 40, 70].map((w, j) => (
                  <div
                    key={j}
                    style={{
                      height: "14px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                      width: `${w}%`,
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${j * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ))}

        {/* Empty state */}
        {!isLoading && logs.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              No Posts Yet
            </h3>
            <p
              style={{ color: "#555", marginBottom: "24px", fontSize: "14px" }}
            >
              Enable Telegram and publish an app to see posts here.
            </p>
            <a
              href="/admin/settings/telegram"
              style={{
                padding: "12px 28px",
                background: "#3DDC84",
                borderRadius: "10px",
                color: "#1A1A2E",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              ⚙️ Configure Telegram
            </a>
          </div>
        )}

        {/* Rows */}
        {!isLoading &&
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 120px 100px",
                gap: "0",
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                alignItems: "center",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* App */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                }}
              >
                {log.app_icon && (
                  <img
                    src={log.app_icon}
                    alt=""
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      objectFit: "contain",
                      background: "#1A1A2E",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#C0C0C0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {log.app_name || "Unknown"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#444" }}>
                    {log.triggered_by || "auto"} · #{log.id}
                  </div>
                </div>
              </div>
              {/* Version */}
              <div
                style={{
                  fontSize: "12px",
                  color: "#3DDC84",
                  fontFamily: "monospace",
                }}
              >
                {log.app_version || "—"}
              </div>
              {/* Status */}
              <div>
                <StatusBadge status={log.status} />
              </div>
              {/* Posted At */}
              <div style={{ fontSize: "12px", color: "#555" }}>
                {log.posted_at
                  ? new Date(log.posted_at).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : log.created_at
                    ? new Date(log.created_at).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
              </div>
              {/* Retries */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div style={{ display: "flex", gap: "3px" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background:
                          i < (log.retry_count || 0)
                            ? "#FF6B6B"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: "#444" }}>
                  {log.retry_count || 0}/3
                </span>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setViewLog(log)}
                  title="View payload"
                  style={tinyBtn("#4ECDC4")}
                >
                  <Eye size={13} />
                </button>
                {(log.status === "failed" || log.status === "pending") && (
                  <button
                    onClick={() => handleRetry(log)}
                    disabled={retryingId === log.id}
                    title="Retry"
                    style={tinyBtn("#3DDC84", retryingId === log.id)}
                  >
                    <RefreshCw
                      size={13}
                      style={{
                        animation:
                          retryingId === log.id
                            ? "spin 0.8s linear infinite"
                            : "none",
                      }}
                    />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(log.id)}
                  title="Delete"
                  style={tinyBtn("#FF6B6B")}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginTop: "24px",
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
            { length: Math.min(pagination.totalPages, 5) },
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
            disabled={page === pagination.totalPages}
            style={pageBtn(false)}
          >
            Next →
          </button>
        </div>
      )}

      {viewLog && (
        <PayloadModal log={viewLog} onClose={() => setViewLog(null)} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
      `}</style>
    </div>
  );
}

const tinyBtn = (color, disabled) => ({
  width: "28px",
  height: "28px",
  borderRadius: "7px",
  border: `1px solid ${color}25`,
  background: `${color}10`,
  color,
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.15s",
});
const pageBtn = (active) => ({
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: active ? "#3DDC84" : "rgba(255,255,255,0.06)",
  color: active ? "#1A1A2E" : "#666",
  fontWeight: active ? 700 : 400,
  fontSize: "13px",
  fontFamily: "'Inter', sans-serif",
});
