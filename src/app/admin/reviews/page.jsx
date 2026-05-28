"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Trash2,
} from "lucide-react";

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState("pending");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", filter],
    queryFn: async () => {
      const approved =
        filter === "approved"
          ? "true"
          : filter === "pending"
            ? "false"
            : undefined;
      const qs = new URLSearchParams({
        limit: 50,
        ...(approved !== undefined && { approved }),
      }).toString();
      const res = await fetch(`/api/reviews?${qs}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const approveReview = useMutation({
    mutationFn: async ({ id, is_approved }) => {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_approved }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => queryClient.invalidateQueries(["admin-reviews"]),
  });

  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const submitReply = useMutation({
    mutationFn: async ({ id, admin_reply }) => {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, admin_reply }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
      setReplyId(null);
      setReplyText("");
    },
  });

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            margin: "0 0 16px",
          }}
        >
          Reviews
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          {["pending", "approved", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "9px 18px",
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
              {f.charAt(0).toUpperCase() + f.slice(1)}{" "}
              {filter === f && `(${data?.total || 0})`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  height: "120px",
                  background: "#16213E",
                  borderRadius: "16px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))
        ) : data?.reviews?.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#555",
              fontSize: "15px",
            }}
          >
            No reviews found
          </div>
        ) : (
          data?.reviews?.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${review.is_approved ? "rgba(61,220,132,0.15)" : "rgba(255,200,0,0.15)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#3DDC84,#2BA861)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#1A1A2E",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {review.user_name[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>
                      {review.user_name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#555" }}>
                      {review.user_email || "No email"}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#3DDC84",
                        marginTop: "2px",
                      }}
                    >
                      App:{" "}
                      <a
                        href={`/app/${review.app_slug}`}
                        target="_blank"
                        style={{ color: "#3DDC84", textDecoration: "none" }}
                      >
                        {review.app_name}
                      </a>
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
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i <= review.rating ? "#FFD700" : "transparent"}
                        color={i <= review.rating ? "#FFD700" : "#444"}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      background: review.is_approved
                        ? "rgba(61,220,132,0.15)"
                        : "rgba(255,200,0,0.15)",
                      color: review.is_approved ? "#3DDC84" : "#FFD700",
                    }}
                  >
                    {review.is_approved ? "Approved" : "Pending"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#555" }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p
                style={{
                  color: "#888",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                  paddingLeft: "56px",
                }}
              >
                {review.comment}
              </p>

              {review.admin_reply && (
                <div
                  style={{
                    marginLeft: "56px",
                    background: "rgba(61,220,132,0.07)",
                    borderRadius: "10px",
                    padding: "14px",
                    borderLeft: "3px solid #3DDC84",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#3DDC84",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    Admin Reply
                  </div>
                  <div style={{ fontSize: "14px", color: "#888" }}>
                    {review.admin_reply}
                  </div>
                </div>
              )}

              {replyId === review.id && (
                <div style={{ marginLeft: "56px", marginBottom: "16px" }}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Write your reply..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      marginBottom: "8px",
                      fontFamily: "'Inter', sans-serif",
                      resize: "vertical",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() =>
                        submitReply.mutate({
                          id: review.id,
                          admin_reply: replyText,
                        })
                      }
                      style={{
                        padding: "9px 18px",
                        background: "#3DDC84",
                        border: "none",
                        borderRadius: "8px",
                        color: "#1A1A2E",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "13px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Submit Reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyId(null);
                        setReplyText("");
                      }}
                      style={{
                        padding: "9px 18px",
                        background: "rgba(255,255,255,0.07)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#888",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  paddingLeft: "56px",
                  flexWrap: "wrap",
                }}
              >
                {!review.is_approved && (
                  <button
                    onClick={() =>
                      approveReview.mutate({ id: review.id, is_approved: true })
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "rgba(61,220,132,0.15)",
                      border: "1px solid rgba(61,220,132,0.3)",
                      borderRadius: "8px",
                      color: "#3DDC84",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                )}
                {review.is_approved && (
                  <button
                    onClick={() =>
                      approveReview.mutate({
                        id: review.id,
                        is_approved: false,
                      })
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "rgba(255,200,0,0.1)",
                      border: "1px solid rgba(255,200,0,0.3)",
                      borderRadius: "8px",
                      color: "#FFD700",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <XCircle size={14} /> Unapprove
                  </button>
                )}
                <button
                  onClick={() => {
                    setReplyId(replyId === review.id ? null : review.id);
                    setReplyText(review.admin_reply || "");
                  }}
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
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <MessageSquare size={14} />{" "}
                  {review.admin_reply ? "Edit Reply" : "Reply"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
