"use client";
import { useState } from "react";
import {
  Download,
  Globe,
  Zap,
  ArrowRight,
  Star,
  ExternalLink,
} from "lucide-react";

const ICON_OPTIONS = [
  { id: "none", label: "None", render: "" },
  { id: "download", label: "⬇️", render: "⬇️" },
  { id: "arrow", label: "➤", render: "➤" },
  { id: "star", label: "⭐", render: "⭐" },
  { id: "fire", label: "🔥", render: "🔥" },
  { id: "zap", label: "⚡", render: "⚡" },
  { id: "link", label: "🔗", render: "🔗" },
  { id: "globe", label: "🌐", render: "🌐" },
  { id: "check", label: "✅", render: "✅" },
  { id: "gem", label: "💎", render: "💎" },
];

const BUTTON_STYLES = [
  {
    id: "native",
    label: "Native",
    desc: "Telegram default inline keyboard",
    color: "#54A4F3",
  },
  {
    id: "ghost",
    label: "Ghost",
    desc: "Transparent with border",
    color: "transparent",
  },
  {
    id: "gradient",
    label: "Gradient",
    desc: "Green to teal gradient",
    color: "linear-gradient(135deg, #3DDC84, #4ECDC4)",
  },
  {
    id: "glow",
    label: "Glow",
    desc: "Green with glow shadow",
    color: "#3DDC84",
  },
];

export default function TelegramButtonDesigner({ settings = {}, onUpdate }) {
  const [dlIcon, setDlIcon] = useState("⬇️");
  const [dlText, setDlText] = useState(
    settings.downloadButtonText || "Download APK",
  );
  const [dlSuffix, setDlSuffix] = useState("");
  const [webIcon, setWebIcon] = useState("🌐");
  const [webText, setWebText] = useState(
    settings.websiteButtonText || "Visit Website",
  );
  const [webSuffix, setWebSuffix] = useState("");
  const [mirrorEnabled, setMirrorEnabled] = useState(true);
  const [mirrorText, setMirrorText] = useState("🔄 Mirror");
  const [buttonStyle, setButtonStyle] = useState("native");
  const [borderRadius, setBorderRadius] = useState(8);
  const [fullWidth, setFullWidth] = useState(false);
  const [activeField, setActiveField] = useState("download"); // 'download' | 'website'

  const downloadLabel =
    `${dlIcon} ${dlText}${dlSuffix ? " " + dlSuffix : ""}`.trim();
  const websiteLabel =
    `${webIcon} ${webText}${webSuffix ? " " + webSuffix : ""}`.trim();

  const handleUpdate = () => {
    onUpdate?.({
      downloadButtonText: downloadLabel,
      websiteButtonText: websiteLabel,
      mirrorEnabled,
      mirrorText,
    });
  };

  const styleDef = BUTTON_STYLES.find((s) => s.id === buttonStyle);

  return (
    <div>
      {/* Style Picker */}
      <section style={{ marginBottom: "28px" }}>
        <div style={sectionLabel}>Button Style</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "10px",
          }}
        >
          {BUTTON_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => setButtonStyle(st.id)}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                background:
                  buttonStyle === st.id
                    ? "rgba(61,220,132,0.1)"
                    : "rgba(255,255,255,0.03)",
                outline:
                  buttonStyle === st.id
                    ? "1px solid rgba(61,220,132,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.2s",
              }}
            >
              {/* Mini preview */}
              <div
                style={{
                  height: "28px",
                  borderRadius: `${borderRadius / 2}px`,
                  marginBottom: "8px",
                  background:
                    st.color === "transparent" ? "transparent" : st.color,
                  border: st.id === "ghost" ? "1px solid #3DDC84" : "none",
                  boxShadow:
                    st.id === "glow" ? "0 0 8px rgba(61,220,132,0.5)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: st.id === "ghost" ? "#3DDC84" : "#fff",
                  fontWeight: 700,
                }}
              >
                Sample
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: buttonStyle === st.id ? "#3DDC84" : "#888",
                }}
              >
                {st.label}
              </div>
              <div
                style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}
              >
                {st.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div style={sectionLabel}>Border Radius</div>
          <span style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}>
            {borderRadius}px
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={24}
          value={borderRadius}
          onChange={(e) => setBorderRadius(parseInt(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#3DDC84",
            cursor: "pointer",
            height: "4px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#444",
            marginTop: "4px",
          }}
        >
          <span>Sharp</span>
          <span>Rounded</span>
          <span>Pill</span>
        </div>
      </section>

      {/* Field selector tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {[
          ["download", "Download Button"],
          ["website", "Website Button"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveField(id)}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background:
                activeField === id
                  ? "rgba(61,220,132,0.15)"
                  : "rgba(255,255,255,0.04)",
              color: activeField === id ? "#3DDC84" : "#666",
              fontFamily: "'Inter', sans-serif",
              borderBottom:
                activeField === id
                  ? "2px solid #3DDC84"
                  : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Download button editor */}
      {activeField === "download" && (
        <section
          style={{
            padding: "16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabel}>Prefix Icon</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ICON_OPTIONS.map((ico) => (
                <button
                  key={ico.id}
                  onClick={() => setDlIcon(ico.render)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    background:
                      dlIcon === ico.render
                        ? "rgba(61,220,132,0.2)"
                        : "rgba(255,255,255,0.05)",
                    outline:
                      dlIcon === ico.render
                        ? "1px solid rgba(61,220,132,0.5)"
                        : "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ico.render || "—"}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <div style={fieldLabel}>Button Text</div>
              <input
                value={dlText}
                onChange={(e) => setDlText(e.target.value)}
                style={inputStyle}
                placeholder="Download APK"
              />
            </div>
            <div>
              <div style={fieldLabel}>Suffix Text</div>
              <input
                value={dlSuffix}
                onChange={(e) => setDlSuffix(e.target.value)}
                style={inputStyle}
                placeholder="(50 MB)"
              />
            </div>
          </div>
        </section>
      )}

      {/* Website button editor */}
      {activeField === "website" && (
        <section
          style={{
            padding: "16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div style={fieldLabel}>Prefix Icon</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ICON_OPTIONS.map((ico) => (
                <button
                  key={ico.id}
                  onClick={() => setWebIcon(ico.render)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    background:
                      webIcon === ico.render
                        ? "rgba(61,220,132,0.2)"
                        : "rgba(255,255,255,0.05)",
                    outline:
                      webIcon === ico.render
                        ? "1px solid rgba(61,220,132,0.5)"
                        : "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ico.render || "—"}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <div style={fieldLabel}>Button Text</div>
              <input
                value={webText}
                onChange={(e) => setWebText(e.target.value)}
                style={inputStyle}
                placeholder="Visit Website"
              />
            </div>
            <div>
              <div style={fieldLabel}>Suffix Text</div>
              <input
                value={webSuffix}
                onChange={(e) => setWebSuffix(e.target.value)}
                style={inputStyle}
                placeholder="→"
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <div
              onClick={() => setMirrorEnabled(!mirrorEnabled)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "10px",
                background: mirrorEnabled ? "#3DDC84" : "rgba(255,255,255,0.1)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: mirrorEnabled ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "13px",
                color: mirrorEnabled ? "#C0C0C0" : "#555",
                fontWeight: 500,
              }}
            >
              Show Mirror button
            </span>
            {mirrorEnabled && (
              <input
                value={mirrorText}
                onChange={(e) => setMirrorText(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="🔄 Mirror"
              />
            )}
          </div>
        </section>
      )}

      {/* Full Width + Apply section */}
      <section style={{ marginBottom: "24px" }}>
        <div style={sectionLabel}>Layout Options</div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Full width toggle */}
          <div
            style={{
              flex: 1,
              padding: "14px 16px",
              background: fullWidth
                ? "rgba(61,220,132,0.08)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${fullWidth ? "rgba(61,220,132,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => setFullWidth(!fullWidth)}
          >
            <div
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "10px",
                background: fullWidth ? "#3DDC84" : "rgba(255,255,255,0.1)",
                position: "relative",
                transition: "all 0.2s",
                flexShrink: 0,
                boxShadow: fullWidth ? "0 0 8px rgba(61,220,132,0.3)" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: fullWidth ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: fullWidth ? "#3DDC84" : "#888",
                }}
              >
                Full-Width Buttons
              </div>
              <div style={{ fontSize: "11px", color: "#444" }}>
                {fullWidth
                  ? "Each button spans the full row"
                  : "Buttons side-by-side"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Preview */}
      <section style={{ marginBottom: "24px" }}>
        <div style={sectionLabel}>Live Preview</div>
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #1C2B3A",
            background: "#17212B",
          }}
        >
          {/* Fake chat bubble above keyboard */}
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid #1C2B3A",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                M
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#3DDC84",
                    fontWeight: 700,
                    marginBottom: "4px",
                  }}
                >
                  Mod Apk Store
                </div>
                <div
                  style={{
                    background: "#2B5278",
                    borderRadius: "0 10px 10px 10px",
                    padding: "10px 12px",
                    display: "inline-block",
                    maxWidth: "90%",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#fff",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    🔥 Spotify Premium MOD APK
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#C5D0DC",
                      lineHeight: 1.6,
                    }}
                  >
                    ✨ Premium Unlocked
                    <br />🚫 No Ads
                    <br />📥 Offline Downloads
                    <br />📌 v8.9.12 MOD | 📦 34 MB
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#5F7A8A",
                      textAlign: "right",
                      marginTop: "4px",
                    }}
                  >
                    9:41 AM <span style={{ color: "#4FC3F7" }}>✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Inline keyboard frame */}
          <div style={{ padding: "10px 16px 14px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#5F7A8A",
                marginBottom: "8px",
                fontFamily: "monospace",
              }}
            >
              — inline keyboard —
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: fullWidth ? "column" : "row",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: downloadLabel, primary: true },
                { label: websiteLabel, primary: false },
                ...(mirrorEnabled
                  ? [{ label: mirrorText, primary: false }]
                  : []),
              ].map((btn, i) => (
                <div
                  key={i}
                  style={{
                    flex: fullWidth ? "unset" : 1,
                    padding: "10px 14px",
                    textAlign: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    borderRadius: `${borderRadius}px`,
                    fontSize: "13px",
                    fontWeight: 700,
                    background: btn.primary
                      ? buttonStyle === "gradient"
                        ? "linear-gradient(135deg, #3DDC84, #4ECDC4)"
                        : buttonStyle === "glow"
                          ? "#3DDC84"
                          : buttonStyle === "ghost"
                            ? "transparent"
                            : "#2B5278"
                      : buttonStyle === "ghost"
                        ? "transparent"
                        : "#1C3A5E",
                    color:
                      btn.primary &&
                      (buttonStyle === "gradient" || buttonStyle === "glow")
                        ? "#1A1A2E"
                        : "#fff",
                    border:
                      buttonStyle === "ghost"
                        ? `1px solid ${btn.primary ? "#3DDC84" : "#2B5278"}`
                        : "none",
                    boxShadow:
                      buttonStyle === "glow" && btn.primary
                        ? "0 0 16px rgba(61,220,132,0.4)"
                        : "none",
                    transition: "all 0.2s",
                    minWidth: fullWidth ? "100%" : "auto",
                  }}
                >
                  {btn.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply button */}
      <button
        onClick={handleUpdate}
        style={{
          width: "100%",
          padding: "14px",
          background: "linear-gradient(135deg, #3DDC84, #2BA861)",
          border: "none",
          borderRadius: "12px",
          color: "#1A1A2E",
          fontWeight: 800,
          fontSize: "15px",
          cursor: "pointer",
          fontFamily: "'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 4px 20px rgba(61,220,132,0.3)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 6px 28px rgba(61,220,132,0.45)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,220,132,0.3)")
        }
      >
        <Zap size={18} /> Apply Button Design
      </button>
    </div>
  );
}

const sectionLabel = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#555",
  marginBottom: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};
const fieldLabel = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#666",
  marginBottom: "6px",
};
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};
