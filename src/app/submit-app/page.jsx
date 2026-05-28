"use client";
import { useState } from "react";
import { Send, Package, Mail, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SubmitAppPage() {
  const [form, setForm] = useState({
    app_name: "",
    package_name: "",
    requester_email: "",
    note: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/submit-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: "success",
          message: "Request submitted! We'll review it within 48 hours.",
        });
        setForm({
          app_name: "",
          package_name: "",
          requester_email: "",
          note: "",
        });
      } else
        setStatus({
          type: "error",
          message: data.error || "Failed to submit request",
        });
    } catch {
      setStatus({ type: "error", message: "Failed to submit request" });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(61,220,132,0.1)",
              border: "1px solid rgba(61,220,132,0.3)",
              borderRadius: "20px",
              padding: "6px 16px",
              marginBottom: "20px",
            }}
          >
            <Package size={14} color="#3DDC84" />
            <span
              style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}
            >
              App Request
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px,5vw,44px)",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Request a <span style={{ color: "#3DDC84" }}>MOD APK</span>
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Can't find the app you're looking for? Let us know and we'll try to
            add it!
          </p>
        </div>

        <div
          style={{
            background: "#16213E",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>App Name *</label>
              <div style={{ position: "relative" }}>
                <Package
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#3DDC84",
                  }}
                />
                <input
                  value={form.app_name}
                  onChange={(e) =>
                    setForm({ ...form, app_name: e.target.value })
                  }
                  required
                  placeholder="e.g. Spotify, WhatsApp Plus..."
                  style={{ ...inputStyle, paddingLeft: "42px" }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Package Name (optional)</label>
              <input
                value={form.package_name}
                onChange={(e) =>
                  setForm({ ...form, package_name: e.target.value })
                }
                placeholder="e.g. com.spotify.music"
                style={inputStyle}
              />
              <div
                style={{ fontSize: "12px", color: "#555", marginTop: "6px" }}
              >
                Find it in Play Store URL or app settings
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Your Email (optional)</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#3DDC84",
                  }}
                />
                <input
                  value={form.requester_email}
                  onChange={(e) =>
                    setForm({ ...form, requester_email: e.target.value })
                  }
                  type="email"
                  placeholder="Get notified when added"
                  style={{ ...inputStyle, paddingLeft: "42px" }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="What MOD features would you like? Any specific version?"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                border: "none",
                borderRadius: "12px",
                color: "#1A1A2E",
                fontWeight: 800,
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontFamily: "'Poppins', sans-serif",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            {status && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  background:
                    status.type === "success"
                      ? "rgba(61,220,132,0.1)"
                      : "rgba(255,107,107,0.1)",
                  color: status.type === "success" ? "#3DDC84" : "#ff6b6b",
                  fontSize: "14px",
                }}
              >
                {status.message}
              </div>
            )}
          </form>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          {[
            {
              title: "⚡ Fast Review",
              desc: "We review all requests within 48 hours",
            },
            {
              title: "🔒 Safe Downloads",
              desc: "All apps are scanned before publishing",
            },
            {
              title: "🎯 Priority Handling",
              desc: "Most requested apps get added first",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "rgba(61,220,132,0.05)",
                border: "1px solid rgba(61,220,132,0.1)",
                borderRadius: "14px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </div>
              <div style={{ color: "#666", fontSize: "13px" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#888",
  marginBottom: "8px",
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
