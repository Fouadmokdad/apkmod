"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Download,
  Star,
  Shield,
  Clock,
  Smartphone,
  HardDrive,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Copy,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";

function formatDownloads(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function StarRating({ rating, interactive, onRate, size = 16 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={
            i <= (interactive ? hover || rating : Math.round(rating))
              ? "#FFD700"
              : "transparent"
          }
          color={
            i <= (interactive ? hover || rating : Math.round(rating))
              ? "#FFD700"
              : "#444"
          }
          style={{
            cursor: interactive ? "pointer" : "default",
            transition: "all 0.1s",
          }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        />
      ))}
    </div>
  );
}

export default function AppDetailPage({ params }) {
  const { slug } = params;
  const [countdown, setCountdown] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({
    user_name: "",
    user_email: "",
    rating: 5,
    comment: "",
  });
  const [reviewStatus, setReviewStatus] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["app", slug],
    queryFn: async () => {
      const res = await fetch(`/api/apps/${slug}`);
      if (!res.ok) throw new Error("App not found");
      return res.json();
    },
  });

  const submitReview = useMutation({
    mutationFn: async (review) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      return res.json();
    },
    onSuccess: () => {
      setReviewStatus({
        type: "success",
        message: "Review submitted for approval!",
      });
      setReviewForm({ user_name: "", user_email: "", rating: 5, comment: "" });
    },
    onError: () =>
      setReviewStatus({ type: "error", message: "Failed to submit review" }),
  });

  const startDownload = async () => {
    setDownloading(true);
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleActualDownload();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleActualDownload = async () => {
    try {
      const res = await fetch(`/api/apps/${slug}/download`, { method: "POST" });
      const data = await res.json();
      if (data.download_url) window.open(data.download_url, "_blank");
    } catch {}
    setDownloading(false);
  };

  const copyMd5 = (md5) => {
    if (typeof navigator !== "undefined") navigator.clipboard.writeText(md5);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading)
    return (
      <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
        <Navbar />
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "120px 24px 80px",
          }}
        >
          <div
            style={{
              height: "200px",
              background: "#16213E",
              borderRadius: "20px",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
        <Navbar />
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "120px 24px 80px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>📱</div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}>
            App Not Found
          </h1>
          <p style={{ color: "#666" }}>
            The app you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "12px 28px",
              background: "#3DDC84",
              borderRadius: "10px",
              color: "#1A1A2E",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    );

  const { app, reviews, related } = data;

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        {/* Breadcrumbs */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            ["/", "Home"],
            [`/category/${app.category_slug}`, app.category_name],
            [null, app.name],
          ].map(([href, label], i) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {i > 0 && <ChevronRight size={14} color="#444" />}
              {href ? (
                <a
                  href={href}
                  style={{
                    color: "#3DDC84",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  {label}
                </a>
              ) : (
                <span style={{ color: "#666", fontSize: "14px" }}>{label}</span>
              )}
            </span>
          ))}
        </nav>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Main Content */}
          <div>
            {/* App Header */}
            <div
              style={{
                background: "#16213E",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid rgba(255,255,255,0.07)",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={app.icon_url}
                  alt={app.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "24px",
                    objectFit: "contain",
                    background: "#1A1A2E",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=100`;
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "8px",
                    }}
                  >
                    <h1
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "clamp(22px, 4vw, 32px)",
                        fontWeight: 800,
                        margin: 0,
                      }}
                    >
                      {app.name}
                    </h1>
                    <span
                      style={{
                        background: "rgba(61,220,132,0.15)",
                        border: "1px solid rgba(61,220,132,0.4)",
                        color: "#3DDC84",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                      }}
                    >
                      MOD APK
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#666",
                      marginBottom: "16px",
                      fontSize: "15px",
                    }}
                  >
                    {app.developer}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <StarRating rating={app.rating} />
                      <span style={{ color: "#FFD700", fontWeight: 700 }}>
                        {parseFloat(app.rating || 0).toFixed(1)}
                      </span>
                      <span style={{ color: "#555", fontSize: "13px" }}>
                        ({(app.total_ratings || 0).toLocaleString()} reviews)
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      <Download size={14} />{" "}
                      {formatDownloads(app.download_count)} downloads
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {app.tags?.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "12px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          background: "rgba(255,255,255,0.06)",
                          color: "#888",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info chips */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                {[
                  {
                    icon: Smartphone,
                    label: "Version",
                    value: app.mod_version || app.version,
                  },
                  { icon: HardDrive, label: "Size", value: app.size },
                  {
                    icon: Clock,
                    label: "Android",
                    value: app.android_version
                      ? `${app.android_version}+`
                      : "N/A",
                  },
                  {
                    icon: Shield,
                    label: "Status",
                    value: app.is_virus_scanned ? "✓ Safe" : "Unverified",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                          color: "#555",
                          fontSize: "12px",
                        }}
                      >
                        <Icon size={13} /> {item.label}
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: item.label === "Status" ? "#3DDC84" : "#fff",
                        }}
                      >
                        {item.value || "N/A"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Screenshots */}
            {app.screenshots?.length > 0 && (
              <div
                style={{
                  background: "#16213E",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: "24px",
                }}
              >
                <h2 style={sectionTitle}>Screenshots</h2>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                  }}
                >
                  {app.screenshots.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      style={{
                        height: "220px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        flexShrink: 0,
                        border: "2px solid transparent",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.borderColor = "#3DDC84")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.borderColor = "transparent")
                      }
                      onClick={() => setSelectedImg(url)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div
              style={{
                background: "#16213E",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.07)",
                marginBottom: "24px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  overflowX: "auto",
                }}
              >
                {[
                  ["description", "Description"],
                  ["mod-features", "MOD Features"],
                  ["installation", "Installation"],
                  ["changelog", "Changelog"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      padding: "16px 24px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: activeTab === id ? "#3DDC84" : "#666",
                      fontWeight: 600,
                      fontSize: "14px",
                      borderBottom:
                        activeTab === id
                          ? "2px solid #3DDC84"
                          : "2px solid transparent",
                      whiteSpace: "nowrap",
                      fontFamily: "'Inter', sans-serif",
                      transition: "color 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ padding: "28px" }}>
                {activeTab === "description" && (
                  <div
                    style={{ color: "#888", lineHeight: 1.8, fontSize: "15px" }}
                  >
                    {app.description}
                  </div>
                )}
                {activeTab === "mod-features" && (
                  <div>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {app.mod_features?.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            background: "rgba(61,220,132,0.05)",
                            borderRadius: "10px",
                            border: "1px solid rgba(61,220,132,0.1)",
                          }}
                        >
                          <CheckCircle size={18} color="#3DDC84" />
                          <span style={{ fontSize: "15px", color: "#C0C0C0" }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "installation" && (
                  <div
                    style={{
                      color: "#888",
                      lineHeight: 2,
                      fontSize: "15px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255,200,0,0.08)",
                        border: "1px solid rgba(255,200,0,0.2)",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "20px",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <AlertTriangle
                        size={18}
                        color="#FFD700"
                        style={{ flexShrink: 0, marginTop: "2px" }}
                      />
                      <span style={{ color: "#FFD700", fontSize: "14px" }}>
                        Enable "Install from Unknown Sources" in Android
                        Settings → Security before installing.
                      </span>
                    </div>
                    {app.installation_guide}
                  </div>
                )}
                {activeTab === "changelog" && (
                  <div
                    style={{
                      color: "#888",
                      lineHeight: 2,
                      fontSize: "15px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {app.changelog}
                  </div>
                )}
              </div>
            </div>

            {/* MD5 */}
            {app.md5_checksum && (
              <div
                style={{
                  background: "#16213E",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Shield size={18} color="#3DDC84" />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      marginBottom: "4px",
                    }}
                  >
                    MD5 Checksum
                  </div>
                  <code
                    style={{
                      fontSize: "13px",
                      color: "#C0C0C0",
                      fontFamily: "monospace",
                    }}
                  >
                    {app.md5_checksum}
                  </code>
                </div>
                <button
                  onClick={() => copyMd5(app.md5_checksum)}
                  style={{
                    background: "rgba(61,220,132,0.1)",
                    border: "1px solid rgba(61,220,132,0.3)",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    color: "#3DDC84",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            {/* Reviews */}
            <div
              style={{
                background: "#16213E",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.07)",
                marginBottom: "24px",
              }}
            >
              <h2 style={sectionTitle}>
                User Reviews ({reviews?.length || 0})
              </h2>
              {reviews?.length === 0 && (
                <p
                  style={{
                    color: "#555",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  No reviews yet. Be the first!
                </p>
              )}
              <div
                style={{ display: "grid", gap: "16px", marginBottom: "32px" }}
              >
                {reviews?.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      padding: "20px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg,#3DDC84,#2BA861)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            color: "#1A1A2E",
                            fontSize: "16px",
                          }}
                        >
                          {review.user_name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "15px" }}>
                            {review.user_name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#555" }}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "#888",
                        fontSize: "14px",
                        lineHeight: 1.7,
                      }}
                    >
                      {review.comment}
                    </p>
                    {review.admin_reply && (
                      <div
                        style={{
                          background: "rgba(61,220,132,0.07)",
                          borderRadius: "10px",
                          padding: "14px",
                          borderLeft: "3px solid #3DDC84",
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
                  </div>
                ))}
              </div>

              {/* Review Form */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  <MessageSquare size={18} style={{ marginRight: "8px" }} />
                  Write a Review
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitReview.mutate({ ...reviewForm, app_id: app.id });
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    <input
                      value={reviewForm.user_name}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          user_name: e.target.value,
                        })
                      }
                      placeholder="Your name *"
                      required
                      style={inputStyle}
                    />
                    <input
                      value={reviewForm.user_email}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          user_email: e.target.value,
                        })
                      }
                      placeholder="Email (optional)"
                      type="email"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: "#888",
                      }}
                    >
                      Your Rating
                    </div>
                    <StarRating
                      rating={reviewForm.rating}
                      interactive
                      onRate={(r) =>
                        setReviewForm({ ...reviewForm, rating: r })
                      }
                      size={24}
                    />
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    placeholder="Share your experience with this MOD APK..."
                    required
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      marginBottom: "14px",
                      width: "100%",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitReview.isPending}
                    style={{
                      padding: "14px 32px",
                      background: "#3DDC84",
                      border: "none",
                      borderRadius: "12px",
                      color: "#1A1A2E",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      opacity: submitReview.isPending ? 0.7 : 1,
                    }}
                  >
                    {submitReview.isPending ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewStatus && (
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "14px",
                        color:
                          reviewStatus.type === "success"
                            ? "#3DDC84"
                            : "#ff6b6b",
                      }}
                    >
                      {reviewStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Related Apps */}
            {related?.length > 0 && (
              <div>
                <h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    marginBottom: "20px",
                  }}
                >
                  Related Apps
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {related.map((a) => (
                    <AppCard key={a.id} app={a} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Download */}
          <div style={{ position: "sticky", top: "84px" }}>
            <div
              style={{
                background: "#16213E",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid rgba(255,255,255,0.07)",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Download MOD APK
              </h3>

              {countdown !== null ? (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto 16px",
                      borderRadius: "50%",
                      background: "rgba(61,220,132,0.1)",
                      border: "3px solid #3DDC84",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "32px",
                        fontWeight: 800,
                        color: "#3DDC84",
                      }}
                    >
                      {countdown}
                    </span>
                  </div>
                  <p style={{ color: "#888", fontSize: "14px" }}>
                    Download starts in {countdown}s...
                  </p>
                </div>
              ) : (
                <button
                  onClick={startDownload}
                  disabled={downloading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg,#3DDC84,#2BA861)",
                    border: "none",
                    borderRadius: "14px",
                    color: "#1A1A2E",
                    fontWeight: 800,
                    fontSize: "17px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    boxShadow: "0 8px 30px rgba(61,220,132,0.4)",
                    transition: "all 0.2s",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Download size={22} />
                  Download MOD APK
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <Shield size={14} color="#3DDC84" />
                <span style={{ fontSize: "13px", color: "#666" }}>
                  Virus scanned & safe
                </span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  ["Version", app.mod_version || app.version],
                  ["Size", app.size],
                  [
                    "Android",
                    app.android_version ? `${app.android_version}+` : "N/A",
                  ],
                  ["Downloads", formatDownloads(app.download_count)],
                  [
                    "Updated",
                    app.updated_at
                      ? new Date(app.updated_at).toLocaleDateString()
                      : "N/A",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#555" }}>{label}</span>
                    <span style={{ color: "#C0C0C0", fontWeight: 500 }}>
                      {value || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,165,0,0.07)",
                border: "1px solid rgba(255,165,0,0.2)",
                borderRadius: "14px",
                padding: "18px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <AlertTriangle
                size={18}
                color="#FFA500"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#888",
                  lineHeight: 1.6,
                }}
              >
                Mod APKs are modified apps. Use at your own risk. Uninstall
                official version before installing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <img
            src={selectedImg}
            alt="Screenshot"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              borderRadius: "12px",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

const sectionTitle = {
  fontFamily: "Poppins, sans-serif",
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "20px",
};
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};
