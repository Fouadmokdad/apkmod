"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

function formatDownloads(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function AdminAppsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-apps", page, search],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { q: search }),
      }).toString();
      const url = search
        ? `/api/search?${qs}`
        : `/api/apps?page=${page}&limit=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteApp = useMutation({
    mutationFn: async (slug) => {
      const res = await fetch(`/api/apps/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-apps"]);
      setConfirmDelete(null);
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ slug, is_published }) => {
      const res = await fetch(`/api/apps/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-apps"]),
  });

  const apps = data?.apps || [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 800,
              margin: "0 0 4px",
            }}
          >
            Apps Management
          </h1>
          <p style={{ color: "#555", margin: 0, fontSize: "14px" }}>
            {data?.pagination?.total || 0} total apps
          </p>
        </div>
        <a
          href="/admin/apps/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#3DDC84",
            borderRadius: "10px",
            color: "#1A1A2E",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          <Plus size={18} /> Add New App
        </a>
      </div>

      <div
        style={{
          background: "#16213E",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Search */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ position: "relative", maxWidth: "380px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#555",
              }}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search apps..."
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "App",
                  "Category",
                  "Version",
                  "Downloads",
                  "Rating",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#555",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} style={{ padding: "20px 16px" }}>
                          <div
                            style={{
                              height: "40px",
                              background: "rgba(255,255,255,0.03)",
                              borderRadius: "8px",
                              animation: "pulse 1.5s infinite",
                            }}
                          />
                        </td>
                      </tr>
                    ))
                : apps.map((app) => (
                    <tr
                      key={app.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <img
                            src={app.icon_url}
                            alt={app.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              objectFit: "contain",
                              background: "#1A1A2E",
                            }}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=40`;
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#fff",
                              }}
                            >
                              {app.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#555" }}>
                              {app.developer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            background: "rgba(255,255,255,0.06)",
                            color: "#888",
                          }}
                        >
                          {app.category_name || "N/A"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "13px",
                          color: "#3DDC84",
                          fontWeight: 600,
                        }}
                      >
                        {app.mod_version || app.version || "N/A"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            color: "#C0C0C0",
                          }}
                        >
                          <Download size={13} color="#555" />
                          {formatDownloads(app.download_count)}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                            color: "#FFD700",
                          }}
                        >
                          <Star size={13} fill="#FFD700" color="#FFD700" />
                          {parseFloat(app.rating || 0).toFixed(1)}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() =>
                            togglePublish.mutate({
                              slug: app.slug,
                              is_published: !app.is_published,
                            })
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: app.is_published
                              ? "rgba(61,220,132,0.15)"
                              : "rgba(255,107,107,0.15)",
                            color: app.is_published ? "#3DDC84" : "#ff6b6b",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {app.is_published ? (
                            <>
                              <CheckCircle size={13} /> Live
                            </>
                          ) : (
                            <>
                              <XCircle size={13} /> Hidden
                            </>
                          )}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <a
                            href={`/app/${app.slug}`}
                            target="_blank"
                            style={iconBtn("#555")}
                            title="View"
                          >
                            <Eye size={15} />
                          </a>
                          <a
                            href={`/admin/apps/${app.id}/edit`}
                            style={iconBtn("#4ECDC4")}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </a>
                          <button
                            onClick={() => setConfirmDelete(app)}
                            style={{
                              ...iconBtn("#ff6b6b"),
                              background: "none",
                              border: `1px solid rgba(255,107,107,0.3)`,
                              cursor: "pointer",
                            }}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {Array.from(
              { length: Math.min(data.pagination.totalPages, 7) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: p === page ? "#3DDC84" : "rgba(255,255,255,0.06)",
                  color: p === page ? "#1A1A2E" : "#888",
                  fontWeight: p === page ? 700 : 400,
                  fontSize: "13px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "#16213E",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid rgba(255,107,107,0.3)",
              maxWidth: "420px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              Delete App?
            </h2>
            <p
              style={{
                color: "#888",
                textAlign: "center",
                marginBottom: "28px",
                fontSize: "15px",
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "#fff" }}>{confirmDelete.name}</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "rgba(255,255,255,0.07)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#C0C0C0",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteApp.mutate(confirmDelete.slug)}
                disabled={deleteApp.isPending}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "#ff6b6b",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  opacity: deleteApp.isPending ? 0.7 : 1,
                }}
              >
                {deleteApp.isPending ? "Deleting..." : "Delete App"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function iconBtn(color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    border: `1px solid ${color}40`,
    color,
    textDecoration: "none",
    background: `${color}10`,
    transition: "all 0.2s",
  };
}
