"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, CheckCircle, Clock } from "lucide-react";

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const markRead = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/contact/${id}/read`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => qc.invalidateQueries(["admin-messages"]),
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
        Contact Messages
      </h1>
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
        ) : data?.messages?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#555" }}>
            No messages yet
          </div>
        ) : (
          data?.messages?.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${msg.is_read ? "rgba(255,255,255,0.06)" : "rgba(61,220,132,0.2)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(61,220,132,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Mail size={18} color="#3DDC84" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>
                      {msg.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#3DDC84" }}>
                      {msg.email}
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {!msg.is_read && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        background: "rgba(61,220,132,0.15)",
                        color: "#3DDC84",
                        fontWeight: 700,
                      }}
                    >
                      NEW
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={12} />{" "}
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {msg.subject && (
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#C0C0C0",
                    marginBottom: "8px",
                  }}
                >
                  Subject: {msg.subject}
                </div>
              )}
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                {msg.message}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={`mailto:${msg.email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "#3DDC84",
                    borderRadius: "8px",
                    color: "#1A1A2E",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "13px",
                  }}
                >
                  <Mail size={14} /> Reply
                </a>
                {!msg.is_read && (
                  <button
                    onClick={() => markRead.mutate(msg.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "rgba(255,255,255,0.07)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#888",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <CheckCircle size={14} /> Mark Read
                  </button>
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
