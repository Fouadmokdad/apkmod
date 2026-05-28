"use client";
import { useState } from "react";
import { Download, Lock, User, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1A1A2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(rgba(61,220,132,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,220,132,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "300px",
          height: "300px",
          background: "rgba(61,220,132,0.05)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 30px rgba(61,220,132,0.4)",
              }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "22px",
                  color: "#fff",
                }}
              >
                M
              </span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "20px",
                }}
              >
                Mod Apk Store
              </div>
              <div style={{ fontSize: "12px", color: "#3DDC84" }}>
                Admin Dashboard
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
              color: "#555",
              fontSize: "14px",
            }}
          >
            <Shield size={14} color="#3DDC84" />
            <span>Secure admin access</span>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#16213E",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(61,220,132,0.15)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 800,
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              color: "#555",
              textAlign: "center",
              marginBottom: "32px",
              fontSize: "14px",
            }}
          >
            Sign in to manage your platform
          </p>

          {error && (
            <div
              style={{
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "24px",
                color: "#ff6b6b",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Username or Email</label>
              <div style={{ position: "relative" }}>
                <User
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
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  placeholder="admin"
                  required
                  autoComplete="username"
                  style={{ ...inputStyle, paddingLeft: "42px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock
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
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    ...inputStyle,
                    paddingLeft: "42px",
                    paddingRight: "44px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                border: "none",
                borderRadius: "14px",
                color: "#1A1A2E",
                fontWeight: 800,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 8px 30px rgba(61,220,132,0.3)",
                transition: "all 0.2s",
                fontFamily: "'Poppins', sans-serif",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#444", marginBottom: "4px" }}
            >
              Default credentials
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              admin / admin123
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a
            href="/"
            style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}
          >
            ← Back to Site
          </a>
        </div>
      </div>
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
  padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "'Inter', sans-serif",
};
