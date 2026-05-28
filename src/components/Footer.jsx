import { Download, Github, Twitter, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0D0D1A",
        borderTop: "1px solid rgba(61,220,132,0.1)",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "60px 24px 30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: "18px",
                      color: "#fff",
                    }}
                  >
                    M
                  </span>
                  <Download
                    size={10}
                    color="#fff"
                    style={{ marginTop: "4px" }}
                  />
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  Mod Apk Store
                </div>
                <div style={{ fontSize: "11px", color: "#3DDC84" }}>
                  modapkstore.pro
                </div>
              </div>
            </div>
            <p
              style={{
                color: "#666",
                fontSize: "13px",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              Your trusted source for premium MOD APKs. Safe, fast, and always
              free.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[Twitter, Github, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(61,220,132,0.1)",
                    border: "1px solid rgba(61,220,132,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3DDC84",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(61,220,132,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(61,220,132,0.1)")
                  }
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={sectionTitle}>Quick Links</h4>
            {[
              ["/", "Home"],
              ["/top-downloads", "Top Downloads"],
              ["/latest", "Latest Apps"],
              ["/search", "Search Apps"],
              ["/submit-app", "Submit an App"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3DDC84")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={sectionTitle}>Categories</h4>
            {[
              ["games", "Games"],
              ["music", "Music"],
              ["video", "Video"],
              ["social-media", "Social Media"],
              ["tools", "Tools"],
              ["vpn", "VPN"],
            ].map(([slug, label]) => (
              <a
                key={slug}
                href={`/category/${slug}`}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3DDC84")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={sectionTitle}>Legal & Info</h4>
            {[
              ["/about", "About Us"],
              ["/contact", "Contact"],
              ["/privacy-policy", "Privacy Policy"],
              ["/terms-of-service", "Terms of Service"],
              ["/dmca", "DMCA"],
              ["/disclaimer", "Disclaimer"],
              ["/faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3DDC84")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div
          style={{
            background: "rgba(61,220,132,0.05)",
            border: "1px solid rgba(61,220,132,0.15)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                margin: "0 0 8px",
              }}
            >
              Stay Updated <span style={{ color: "#3DDC84" }}>🚀</span>
            </h3>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
              Get notified when new MOD APKs are available
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>
            © 2024 Mod Apk Store. All rights reserved.
          </p>
          <p style={{ color: "#333", fontSize: "12px", margin: 0 }}>
            ⚠️ For educational purposes only. We do not host any APK files.
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: data.message });
        setEmail("");
      } else setStatus({ type: "error", message: data.error });
    } catch {
      setStatus({ type: "error", message: "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        style={{
          padding: "12px 18px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(61,220,132,0.3)",
          borderRadius: "10px",
          color: "#fff",
          outline: "none",
          fontSize: "14px",
          minWidth: "220px",
          fontFamily: "'Inter', sans-serif",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px 24px",
          background: "#3DDC84",
          border: "none",
          borderRadius: "10px",
          color: "#1A1A2E",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: "'Inter', sans-serif",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "..." : "Subscribe"}
      </button>
      {status && (
        <div
          style={{
            width: "100%",
            fontSize: "13px",
            color: status.type === "success" ? "#3DDC84" : "#ff6b6b",
            marginTop: "4px",
          }}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}

// Need useState for the form
import { useState } from "react";

const sectionTitle = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  color: "#fff",
  marginBottom: "16px",
  letterSpacing: "0.05em",
};
const linkStyle = {
  display: "block",
  color: "#666",
  textDecoration: "none",
  fontSize: "14px",
  marginBottom: "8px",
  transition: "color 0.2s",
};
