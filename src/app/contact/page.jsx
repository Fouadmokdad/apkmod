"use client";
import { useState } from "react";
import { Mail, MessageSquare, Send, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: data.message });
        setForm({ name: "", email: "", subject: "", message: "" });
      } else setStatus({ type: "error", message: data.error });
    } catch {
      setStatus({ type: "error", message: "Failed to send message" });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px,5vw,48px)",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Contact <span style={{ color: "#3DDC84" }}>Us</span>
          </h1>
          <p style={{ color: "#666", fontSize: "17px" }}>
            Have a question? We'd love to hear from you.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "40px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#16213E",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "28px",
              }}
            >
              Send a Message
            </h2>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={inputStyle}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    type="email"
                    style={inputStyle}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option value="">Select a topic</option>
                  <option>App Request</option>
                  <option>Broken Link</option>
                  <option>DMCA Takedown</option>
                  <option>Advertising</option>
                  <option>General Inquiry</option>
                  <option>Bug Report</option>
                </select>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={6}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 32px",
                  background: "#3DDC84",
                  border: "none",
                  borderRadius: "12px",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Message"}
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

          <div style={{ display: "grid", gap: "16px" }}>
            {[
              {
                icon: Mail,
                title: "Email Us",
                value: "contact@modapkstore.pro",
                desc: "We reply within 24 hours",
              },
              {
                icon: MessageSquare,
                title: "Telegram",
                value: "@modapkstore",
                desc: "Instant support",
              },
              {
                icon: Clock,
                title: "Response Time",
                value: "< 24 hours",
                desc: "Monday - Saturday",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: "#16213E",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    gap: "16px",
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
                    <Icon size={20} color="#3DDC84" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        color: "#3DDC84",
                        fontSize: "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {item.value}
                    </div>
                    <div style={{ color: "#555", fontSize: "13px" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              style={{
                background: "rgba(61,220,132,0.07)",
                border: "1px solid rgba(61,220,132,0.2)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  marginBottom: "12px",
                  color: "#3DDC84",
                }}
              >
                DMCA Notice?
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  margin: "0 0 12px",
                }}
              >
                For copyright removal requests, please use our dedicated DMCA
                page.
              </p>
              <a
                href="/dmca"
                style={{
                  color: "#3DDC84",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                Submit DMCA Request →
              </a>
            </div>
          </div>
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
