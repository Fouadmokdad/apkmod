"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminRequestsPage() {
  const [filter, setFilter] = useState("pending");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-requests", filter],
    queryFn: async () => {
      const qs = new URLSearchParams(
        filter !== "all" ? { status: filter } : {},
      ).toString();
      const res = await fetch(`/api/submit-app?${qs}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/submit-app/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => qc.invalidateQueries(["admin-requests"]),
  });

  return (
    <div>
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "24px",
          fontWeight: 800,
          marginBottom: "24px",
        }}
      >
        App Requests
      </h1>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "9px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background: filter === f ? "#3DDC84" : "rgba(255,255,255,0.06)",
              color: filter === f ? "#1A1A2E" : "#888",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  height: "100px",
                  background: "#16213E",
                  borderRadius: "14px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))
        ) : data?.requests?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#555" }}>
            No requests
          </div>
        ) : (
          data?.requests?.map((req) => (
            <div
              key={req.id}
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(61,220,132,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Package size={22} color="#3DDC84" />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {req.app_name}
                  </div>
                  {req.package_name && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#3DDC84",
                        marginBottom: "4px",
                      }}
                    >
                      {req.package_name}
                    </div>
                  )}
                  {req.requester_email && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#555",
                        marginBottom: "8px",
                      }}
                    >
                      By: {req.requester_email}
                    </div>
                  )}
                  {req.note && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#888",
                        lineHeight: 1.6,
                      }}
                    >
                      {req.note}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#444",
                      marginTop: "8px",
                    }}
                  >
                    {new Date(req.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    background:
                      req.status === "pending"
                        ? "rgba(255,200,0,0.15)"
                        : req.status === "approved"
                          ? "rgba(61,220,132,0.15)"
                          : "rgba(255,107,107,0.15)",
                    color:
                      req.status === "pending"
                        ? "#FFD700"
                        : req.status === "approved"
                          ? "#3DDC84"
                          : "#ff6b6b",
                    fontWeight: 600,
                  }}
                >
                  {req.status}
                </span>
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus.mutate({ id: req.id, status: "approved" })
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        background: "rgba(61,220,132,0.1)",
                        border: "1px solid rgba(61,220,132,0.3)",
                        borderRadius: "8px",
                        color: "#3DDC84",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        updateStatus.mutate({ id: req.id, status: "rejected" })
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        background: "rgba(255,107,107,0.1)",
                        border: "1px solid rgba(255,107,107,0.3)",
                        borderRadius: "8px",
                        color: "#ff6b6b",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
