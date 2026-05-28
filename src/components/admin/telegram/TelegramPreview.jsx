"use client";
import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Pin,
  Forward,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";

const SAMPLE_APP = {
  name: "Spotify Premium",
  mod_version: "8.9.12 MOD",
  version: "8.9.12",
  size: "34 MB",
  android_version: "6.0",
  icon_url:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png",
  mod_features: [
    "Premium Unlocked",
    "No Ads",
    "Offline Downloads",
    "Unlimited Skips",
  ],
  tags: ["music", "streaming"],
  category_name: "Music",
  developer: "Spotify AB",
  slug: "spotify-premium",
};

function buildPreviewMessage(app, settings) {
  const lines = [];
  lines.push(`🔥 <b>${app.name} MOD APK</b>`);
  if (
    settings.telegram_include_mod_features !== "false" &&
    app.mod_features?.length
  ) {
    const emojis = ["✨", "🚫", "📥", "⚡", "🔓", "💎"];
    app.mod_features
      .slice(0, 4)
      .forEach((f, i) => lines.push(`${emojis[i % emojis.length]} ${f}`));
  }
  lines.push("");
  if (settings.telegram_include_version_info !== "false") {
    if (app.mod_version) lines.push(`📌 <b>Version:</b> ${app.mod_version}`);
    if (settings.telegram_include_apk_size !== "false" && app.size)
      lines.push(`📦 <b>Size:</b> ${app.size}`);
    if (app.android_version)
      lines.push(`📱 <b>Android:</b> ${app.android_version}+`);
    lines.push("");
  }
  lines.push(`🌐 <a href="#">modapkstore.pro/app/${app.slug}</a>`);
  lines.push("");
  const tags =
    settings.telegram_default_hashtags || "#MODAPK #Premium #AndroidApps";
  lines.push(tags);
  return lines.join("\n");
}

function renderHTML(text) {
  return text
    .replace(/<b>(.*?)<\/b>/g, "<strong>$1</strong>")
    .replace(
      /<a href="#">(.*?)<\/a>/g,
      '<span style="color:#4FC3F7;text-decoration:underline;cursor:pointer">$1</span>',
    )
    .replace(/\n/g, "<br/>");
}

// ─── Android Device ────────────────────────────────────────────────────────
function AndroidPreview({
  message,
  darkMode,
  app,
  settings,
  zoom,
  pinnedPost,
  forwardedFrom,
  showTyping,
}) {
  const bg = darkMode ? "#0D1117" : "#FFFFFF";
  const msgBg = darkMode ? "#2B5278" : "#E8F5E9";
  const textColor = darkMode ? "#E1E8ED" : "#1A1A2E";
  const headerBg = darkMode ? "#1C2B3A" : "#54A4F3";
  const scale = zoom / 100;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "300px",
          height: "600px",
          borderRadius: "36px",
          background: "linear-gradient(145deg, #1A1A1A, #0A0A0A)",
          padding: "10px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9), inset 0 0 0 1px #2A2A2A, inset 0 0 0 2px #111",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease",
          position: "relative",
        }}
      >
        {/* Camera hole */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#1A1A1A",
            zIndex: 10,
            boxShadow: "0 0 0 2px #0A0A0A",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "28px",
            overflow: "hidden",
            background: bg,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: "28px",
              background: headerBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              fontSize: "10px",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            <span>9:41</span>
            <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <span>●●●</span>
              <span style={{ fontSize: "12px" }}>🔋</span>
            </span>
          </div>
          {/* Chat header */}
          <div
            style={{
              height: "52px",
              background: headerBg,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "16px" }}>←</div>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              M
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                Mod Apk Store
              </div>
              <div
                style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}
              >
                1,234 subscribers
              </div>
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
              ⋮
            </div>
          </div>
          {/* Pinned post banner */}
          {pinnedPost && (
            <div
              style={{
                padding: "6px 14px",
                background: darkMode ? "#1C2B3A" : "#E8F5FE",
                borderLeft: "3px solid #3DDC84",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10px",
              }}
            >
              <Pin size={11} color="#3DDC84" />
              <div>
                <div
                  style={{ color: "#3DDC84", fontWeight: 700, fontSize: "9px" }}
                >
                  Pinned Message
                </div>
                <div
                  style={{
                    color: darkMode ? "#888" : "#555",
                    fontSize: "10px",
                  }}
                >
                  {app.name} MOD APK — Premium Unlocked
                </div>
              </div>
            </div>
          )}
          {/* Chat area */}
          <div
            style={{
              flex: 1,
              padding: "10px 8px",
              overflowY: "hidden",
              background: darkMode ? "#0D1117" : "#E5DDD5",
              backgroundImage: darkMode
                ? "radial-gradient(circle at 20% 50%, rgba(61,220,132,0.02) 0%, transparent 60%)"
                : "none",
            }}
          >
            {/* Forwarded from */}
            {forwardedFrom && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "6px",
                  fontSize: "10px",
                  color: darkMode ? "#5F7A8A" : "#999",
                }}
              >
                <Forward size={11} />
                <span>
                  Forwarded from{" "}
                  <strong style={{ color: "#4FC3F7" }}>Mod Apk Store</strong>
                </span>
              </div>
            )}
            <div
              style={{
                background: msgBg,
                borderRadius: "12px 12px 12px 0",
                padding: "10px 12px",
                maxWidth: "88%",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            >
              {app.icon_url && settings.telegram_include_image !== "false" && (
                <img
                  src={app.icon_url}
                  alt=""
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    objectFit: "contain",
                    background: darkMode ? "#1A2A3A" : "#F5F5F5",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "11px",
                  lineHeight: 1.65,
                  color: textColor,
                  fontFamily: "sans-serif",
                }}
                dangerouslySetInnerHTML={{ __html: renderHTML(message) }}
              />
              {settings.telegram_include_download_button !== "false" && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {[
                    ["⬇️ Download APK", "#3DDC84", "#1A1A2E"],
                    ["🌐 Website", "#2B5278", "#fff"],
                  ].map(([label, bg2, tc]) => (
                    <div
                      key={label}
                      style={{
                        padding: "7px",
                        borderRadius: "8px",
                        background: bg2,
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: tc,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  fontSize: "9px",
                  color: darkMode ? "#5F7A8A" : "#999",
                  textAlign: "right",
                  marginTop: "6px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                9:41 AM <span style={{ color: "#4FC3F7" }}>✓✓</span>
              </div>
            </div>
            {/* Reactions */}
            <div style={{ marginTop: "5px", display: "flex", gap: "4px" }}>
              {[
                ["👍", "12"],
                ["❤️", "8"],
                ["🔥", "24"],
              ].map(([emoji, count]) => (
                <span
                  key={emoji}
                  style={{
                    fontSize: "10px",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    background: darkMode ? "#1C2B3A" : "#fff",
                    border: `1px solid ${darkMode ? "#2B5278" : "#E0E0E0"}`,
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {emoji}{" "}
                  <span style={{ fontSize: "9px", color: "#888" }}>
                    {count}
                  </span>
                </span>
              ))}
            </div>
            {/* Typing indicator */}
            {showTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "8px",
                  padding: "6px 10px",
                  background: darkMode ? "#1C2B3A" : "#fff",
                  borderRadius: "12px 12px 12px 0",
                  width: "fit-content",
                }}
              >
                <div
                  style={{ display: "flex", gap: "3px", alignItems: "center" }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#3DDC84",
                        animation: `typingDot 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "10px", color: "#888" }}>
                  typing...
                </span>
              </div>
            )}
          </div>
          {/* Input bar */}
          <div
            style={{
              height: "48px",
              background: darkMode ? "#1C2B3A" : "#F0F0F0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 12px",
            }}
          >
            <div
              style={{ fontSize: "14px", color: darkMode ? "#666" : "#999" }}
            >
              😊
            </div>
            <div
              style={{
                flex: 1,
                height: "32px",
                borderRadius: "16px",
                background: darkMode ? "#2B3A4A" : "#fff",
                border: `1px solid ${darkMode ? "#3A5068" : "#DDD"}`,
              }}
            />
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#3DDC84",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              ➤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── iPhone Preview ────────────────────────────────────────────────────────
function IPhonePreview({
  message,
  darkMode,
  app,
  settings,
  zoom,
  pinnedPost,
  forwardedFrom,
  showTyping,
}) {
  const bg = darkMode ? "#000000" : "#FFFFFF";
  const msgBg = darkMode ? "#1C3A5E" : "#DCF8C6";
  const textColor = darkMode ? "#E1E8ED" : "#1A1A2E";
  const headerBg = darkMode ? "#1C1C1E" : "#F5F5F7";
  const scale = zoom / 100;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "300px",
          height: "620px",
          borderRadius: "50px",
          background: "linear-gradient(180deg, #1A1A1A 0%, #111 100%)",
          padding: "10px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9), inset 0 0 0 1px #3A3A3A, 0 0 0 6px #0A0A0A",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "42px",
            overflow: "hidden",
            background: bg,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "108px",
              height: "30px",
              background: "#000",
              borderRadius: "20px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "10px",
              gap: "5px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#1A1A1A",
                border: "2px solid #333",
              }}
            />
          </div>
          {/* Status */}
          <div
            style={{
              height: "48px",
              background: headerBg,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0 28px 8px",
              fontSize: "11px",
              color: darkMode ? "#fff" : "#000",
              fontWeight: 700,
            }}
          >
            <span>9:41</span>
            <span style={{ fontSize: "10px", display: "flex", gap: "3px" }}>
              ●●● 🔋
            </span>
          </div>
          {/* Header */}
          <div
            style={{
              height: "52px",
              background: headerBg,
              borderBottom: `1px solid ${darkMode ? "#2C2C2E" : "#E5E5EA"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              M
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: darkMode ? "#fff" : "#000",
                }}
              >
                Mod Apk Store
              </div>
              <div style={{ fontSize: "10px", color: "#8E8E93" }}>
                1,234 subscribers · Channel
              </div>
            </div>
          </div>
          {/* Pinned */}
          {pinnedPost && (
            <div
              style={{
                padding: "5px 14px",
                background: darkMode ? "#1C1C1E" : "#F0F9FF",
                borderLeft: "3px solid #007AFF",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}
            >
              <Pin size={10} color="#007AFF" />
              <div
                style={{ fontSize: "10px", color: darkMode ? "#888" : "#555" }}
              >
                <span style={{ color: "#007AFF", fontWeight: 700 }}>
                  Pinned:{" "}
                </span>
                {app.name} MOD APK
              </div>
            </div>
          )}
          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px 8px",
              background: darkMode ? "#000" : "#E5DDD5",
              overflow: "hidden",
            }}
          >
            {forwardedFrom && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                  fontSize: "10px",
                  color: "#8E8E93",
                }}
              >
                <Forward size={10} />
                <span>
                  Forwarded from{" "}
                  <strong style={{ color: "#007AFF" }}>Mod Apk Store</strong>
                </span>
              </div>
            )}
            <div
              style={{
                background: msgBg,
                borderRadius: "18px 18px 18px 0",
                padding: "10px 12px",
                maxWidth: "88%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {app.icon_url && settings.telegram_include_image !== "false" && (
                <img
                  src={app.icon_url}
                  alt=""
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    objectFit: "contain",
                    background: darkMode ? "#1A1A1A" : "#F5F5F5",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div
                style={{ fontSize: "11px", lineHeight: 1.65, color: textColor }}
                dangerouslySetInnerHTML={{ __html: renderHTML(message) }}
              />
              {settings.telegram_include_download_button !== "false" && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      padding: "7px",
                      borderRadius: "10px",
                      background: "#3DDC84",
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#1A1A2E",
                    }}
                  >
                    ⬇️ Download
                  </div>
                  <div
                    style={{
                      padding: "7px",
                      borderRadius: "10px",
                      background: "rgba(0,122,255,0.15)",
                      textAlign: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#007AFF",
                    }}
                  >
                    🌐 Site
                  </div>
                </div>
              )}
              <div
                style={{
                  fontSize: "9px",
                  color: "#8E8E93",
                  textAlign: "right",
                  marginTop: "5px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "3px",
                }}
              >
                9:41 AM <span style={{ color: "#34C759" }}>✓✓</span>
              </div>
            </div>
            <div style={{ marginTop: "5px", display: "flex", gap: "4px" }}>
              {["👍", "❤️", "🔥"].map((r) => (
                <span
                  key={r}
                  style={{
                    fontSize: "13px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    background: darkMode ? "#1C1C1E" : "#fff",
                    border: `1px solid ${darkMode ? "#333" : "#E5E5EA"}`,
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
            {showTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "6px",
                  padding: "6px 10px",
                  background: darkMode ? "#1C1C1E" : "#fff",
                  borderRadius: "14px 14px 14px 0",
                  width: "fit-content",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#007AFF",
                      animation: `typingDot 1.2s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            style={{
              height: "52px",
              background: headerBg,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#8E8E93" }}>+</div>
            <div
              style={{
                flex: 1,
                height: "36px",
                borderRadius: "18px",
                background: darkMode ? "#2C2C2E" : "#F2F2F7",
                border: `1px solid ${darkMode ? "#3A3A3C" : "#E5E5EA"}`,
                display: "flex",
                alignItems: "center",
                paddingLeft: "14px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: darkMode ? "#555" : "#999" }}
              >
                Message
              </span>
            </div>
            <div style={{ fontSize: "18px", color: "#3DDC84" }}>🎤</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Preview ───────────────────────────────────────────────────────
function DesktopPreview({
  message,
  darkMode,
  app,
  settings,
  zoom,
  pinnedPost,
  forwardedFrom,
}) {
  const sidebarBg = darkMode ? "#0F1923" : "#F4F4F5";
  const mainBg = darkMode ? "#17212B" : "#FFFFFF";
  const msgBg = darkMode ? "#2B5278" : "#EFFDDE";
  const textColor = darkMode ? "#C5D0DC" : "#1A1A2E";
  const scale = zoom / 100;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "580px",
          height: "400px",
          borderRadius: "12px",
          background: "#1A1A1A",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
          overflow: "hidden",
          border: "1px solid #2A2A2A",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: "28px",
            background: "#111",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 14px",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "11px",
              color: "#555",
              fontFamily: "sans-serif",
            }}
          >
            Telegram — Mod Apk Store (1,234 subscribers)
          </div>
          <div style={{ fontSize: "11px", color: "#444" }}>⊟ ⊞</div>
        </div>
        <div style={{ display: "flex", height: "calc(100% - 28px)" }}>
          {/* Sidebar */}
          <div
            style={{
              width: "200px",
              background: sidebarBg,
              borderRight: `1px solid ${darkMode ? "#1A2A3A" : "#E5E5E5"}`,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderBottom: `1px solid ${darkMode ? "#1A2A3A" : "#E5E5E5"}`,
              }}
            >
              <div
                style={{
                  height: "28px",
                  borderRadius: "6px",
                  background: darkMode ? "#1C2B3A" : "#E5E5E5",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#555" }}>
                  🔍 Search
                </span>
              </div>
            </div>
            {[
              ["🔥 Mod Apk Store", "1.2K", true],
              ["💬 My Channel", "234", false],
              ["📢 Updates", "12", false],
              ["🎮 Gaming APKs", "89", false],
            ].map(([name, count, active]) => (
              <div
                key={name}
                style={{
                  padding: "9px 14px",
                  background: active
                    ? `${darkMode ? "#1C2B3A" : "#E8F5E9"}`
                    : "transparent",
                  borderLeft: active
                    ? "3px solid #3DDC84"
                    : "3px solid transparent",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: active
                      ? darkMode
                        ? "#fff"
                        : "#1A1A2E"
                      : darkMode
                        ? "#8899AA"
                        : "#666",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "1px 6px",
                    borderRadius: "8px",
                    background: active
                      ? "rgba(61,220,132,0.15)"
                      : "transparent",
                    color: active ? "#3DDC84" : darkMode ? "#566778" : "#999",
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
          {/* Chat */}
          <div
            style={{
              flex: 1,
              background: mainBg,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "44px",
                borderBottom: `1px solid ${darkMode ? "#1A2A3A" : "#E5E5E5"}`,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3DDC84, #2BA861)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                M
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: darkMode ? "#fff" : "#000",
                  }}
                >
                  Mod Apk Store
                </div>
                <div style={{ fontSize: "10px", color: "#8899AA" }}>
                  1,234 subscribers
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: "12px",
                  fontSize: "14px",
                  color: darkMode ? "#4A6278" : "#999",
                }}
              >
                <span title="Search">🔍</span>
                <span title="More">⋮</span>
              </div>
            </div>
            {/* Pinned banner */}
            {pinnedPost && (
              <div
                style={{
                  padding: "6px 14px",
                  background: darkMode ? "#1C2B3A" : "#F0F9FF",
                  borderBottom: `1px solid ${darkMode ? "#1A2A3A" : "#E5E5E5"}`,
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  cursor: "default",
                }}
              >
                <Pin size={12} color="#3DDC84" />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#3DDC84",
                      fontWeight: 700,
                    }}
                  >
                    Pinned Message
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: darkMode ? "#888" : "#555",
                    }}
                  >
                    {app.name} MOD APK — Premium features unlocked
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                flex: 1,
                padding: "10px",
                background: darkMode ? "#0D1117" : "#E5DDD5",
                overflow: "hidden",
              }}
            >
              {forwardedFrom && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginBottom: "5px",
                    fontSize: "10px",
                    color: darkMode ? "#5F7A8A" : "#999",
                  }}
                >
                  <Forward size={10} />
                  <span>
                    Forwarded from{" "}
                    <strong style={{ color: "#4FC3F7" }}>Mod Apk Store</strong>
                  </span>
                </div>
              )}
              <div
                style={{
                  background: msgBg,
                  borderRadius: "10px 10px 10px 0",
                  padding: "10px 12px",
                  maxWidth: "75%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              >
                {app.icon_url && (
                  <img
                    src={app.icon_url}
                    alt=""
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "7px",
                      marginBottom: "5px",
                      objectFit: "contain",
                      float: "left",
                      marginRight: "8px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: "11px",
                    lineHeight: 1.65,
                    color: textColor,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderHTML(message) }}
                />
                {settings.telegram_include_download_button !== "false" && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      gap: "5px",
                      clear: "both",
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        background: "#3DDC84",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#1A1A2E",
                      }}
                    >
                      ⬇️ Download APK
                    </div>
                    <div
                      style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        background: "rgba(61,220,132,0.1)",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#3DDC84",
                        border: "1px solid rgba(61,220,132,0.3)",
                      }}
                    >
                      🌐 Website
                    </div>
                  </div>
                )}
                <div
                  style={{
                    fontSize: "9px",
                    color: darkMode ? "#5F7A8A" : "#999",
                    textAlign: "right",
                    marginTop: "5px",
                    clear: "both",
                  }}
                >
                  9:41 AM ✓✓ · 12.4K views
                </div>
              </div>
              <div style={{ marginTop: "5px", display: "flex", gap: "4px" }}>
                {[
                  ["👍", "12"],
                  ["❤️", "8"],
                  ["🔥", "24"],
                ].map(([emoji, count]) => (
                  <span
                    key={emoji}
                    style={{
                      fontSize: "10px",
                      padding: "2px 7px",
                      borderRadius: "10px",
                      background: darkMode ? "#1C2B3A" : "#fff",
                      border: `1px solid ${darkMode ? "#2B5278" : "#E0E0E0"}`,
                      color: textColor,
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    {emoji}{" "}
                    <span style={{ color: "#888", fontSize: "9px" }}>
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tablet (iPad) Preview ─────────────────────────────────────────────────
function TabletPreview({ message, darkMode, app, settings, zoom, pinnedPost }) {
  const bg = darkMode ? "#0D1117" : "#F2F2F7";
  const msgBg = darkMode ? "#2B5278" : "#EFFDDE";
  const textColor = darkMode ? "#C5D0DC" : "#1A1A2E";
  const headerBg = darkMode ? "#1C2B3A" : "#54A4F3";
  const scale = Math.min(zoom / 100, 0.7);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "480px",
          height: "360px",
          borderRadius: "20px",
          background: "linear-gradient(145deg, #1A1A1A, #0A0A0A)",
          padding: "8px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 0 0 1px #2A2A2A",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease",
          position: "relative",
        }}
      >
        {/* Home button */}
        <div
          style={{
            position: "absolute",
            right: "-16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#1A1A1A",
            border: "2px solid #2A2A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "3px",
              border: "1px solid #444",
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "14px",
            overflow: "hidden",
            background: bg,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Status */}
          <div
            style={{
              height: "24px",
              background: headerBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              fontSize: "10px",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            <span>Wed May 28</span>
            <span style={{ fontSize: "12px" }}>Mod Apk Store</span>
            <span>9:41 AM 🔋</span>
          </div>
          {/* Header */}
          <div
            style={{
              height: "42px",
              background: headerBg,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
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
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                Mod Apk Store
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>
                1,234 subscribers
              </div>
            </div>
          </div>
          {pinnedPost && (
            <div
              style={{
                padding: "4px 14px",
                background: darkMode ? "#1C2B3A" : "#E8F5FE",
                borderLeft: "3px solid #3DDC84",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}
            >
              <Pin size={10} color="#3DDC84" />
              <div
                style={{ fontSize: "9px", color: darkMode ? "#888" : "#555" }}
              >
                <span style={{ color: "#3DDC84", fontWeight: 700 }}>
                  Pinned:{" "}
                </span>
                {app.name} MOD APK
              </div>
            </div>
          )}
          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              background: darkMode ? "#0D1117" : "#E5DDD5",
              display: "flex",
              gap: "10px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  background: msgBg,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {app.icon_url && (
                  <img
                    src={app.icon_url}
                    alt=""
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      marginBottom: "6px",
                      objectFit: "contain",
                      float: "left",
                      marginRight: "8px",
                      background: "#fff",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.6,
                    color: textColor,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderHTML(message) }}
                />
                {settings.telegram_include_download_button !== "false" && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      gap: "5px",
                      clear: "both",
                    }}
                  >
                    <div
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "#3DDC84",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#1A1A2E",
                      }}
                    >
                      ⬇️ Download
                    </div>
                    <div
                      style={{
                        padding: "5px 8px",
                        borderRadius: "6px",
                        background: "rgba(61,220,132,0.1)",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#3DDC84",
                        border: "1px solid rgba(61,220,132,0.3)",
                      }}
                    >
                      🌐 Web
                    </div>
                  </div>
                )}
                <div
                  style={{
                    fontSize: "8px",
                    color: "#888",
                    textAlign: "right",
                    marginTop: "4px",
                  }}
                >
                  9:41 AM ✓✓ · 12K views
                </div>
              </div>
              <div style={{ marginTop: "4px", display: "flex", gap: "3px" }}>
                {["👍 12", "❤️ 8", "🔥 24"].map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: "9px",
                      padding: "1px 6px",
                      borderRadius: "8px",
                      background: darkMode ? "#1C2B3A" : "#fff",
                      border: `1px solid ${darkMode ? "#2B5278" : "#E0E0E0"}`,
                      color: textColor,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            {/* Side panel (iPad unique) */}
            <div
              style={{
                width: "130px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {["🔥 Spotify MOD", "🎮 PUBG Mobile", "💎 Netflix PRO"].map(
                (item) => (
                  <div
                    key={item}
                    style={{
                      padding: "8px",
                      background: darkMode ? "#1C2B3A" : "#fff",
                      borderRadius: "8px",
                      fontSize: "10px",
                      color: textColor,
                      border: `1px solid ${darkMode ? "#2B5278" : "#E0E0E0"}`,
                    }}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: "8px",
          fontSize: "11px",
          color: "#555",
        }}
      >
        iPad Layout
      </div>
    </div>
  );
}

// ─── Main Preview Component ────────────────────────────────────────────────
const DEVICES = [
  { id: "android", label: "Android", icon: Smartphone },
  { id: "iphone", label: "iPhone", icon: Smartphone },
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "iPad", icon: Tablet },
];

export default function TelegramPreview({ settings = {}, app = SAMPLE_APP }) {
  const [device, setDevice] = useState("android");
  const [darkMode, setDarkMode] = useState(true);
  const [zoom, setZoom] = useState(75);
  const [pinnedPost, setPinnedPost] = useState(false);
  const [forwardedFrom, setForwardedFrom] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [rawCopied, setRawCopied] = useState(false);

  const message = buildPreviewMessage(app, settings);

  const previewProps = {
    message,
    darkMode,
    app,
    settings,
    zoom,
    pinnedPost,
    forwardedFrom,
    showTyping,
  };

  const copyRaw = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(message);
      setRawCopied(true);
      setTimeout(() => setRawCopied(false), 1500);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Device selector */}
      <div
        style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "10px",
          padding: "3px",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {DEVICES.map((d) => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              style={{
                flex: 1,
                padding: "6px 4px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
                background:
                  device === d.id ? "rgba(61,220,132,0.2)" : "transparent",
                color: device === d.id ? "#3DDC84" : "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Icon size={12} /> {d.label}
            </button>
          );
        })}
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 10px",
            borderRadius: "7px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {darkMode ? <Sun size={12} /> : <Moon size={12} />}{" "}
          {darkMode ? "Light" : "Dark"}
        </button>
        <button
          onClick={() => setPinnedPost(!pinnedPost)}
          style={{
            padding: "6px 10px",
            borderRadius: "7px",
            border: `1px solid ${pinnedPost ? "rgba(61,220,132,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: pinnedPost
              ? "rgba(61,220,132,0.1)"
              : "rgba(255,255,255,0.04)",
            color: pinnedPost ? "#3DDC84" : "#666",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Pin size={11} /> Pin
        </button>
        <button
          onClick={() => setForwardedFrom(!forwardedFrom)}
          style={{
            padding: "6px 10px",
            borderRadius: "7px",
            border: `1px solid ${forwardedFrom ? "rgba(79,194,247,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: forwardedFrom
              ? "rgba(79,194,247,0.08)"
              : "rgba(255,255,255,0.04)",
            color: forwardedFrom ? "#4FC3F7" : "#666",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Forward size={11} /> Fwd
        </button>
        {(device === "android" || device === "iphone") && (
          <button
            onClick={() => setShowTyping(!showTyping)}
            style={{
              padding: "6px 10px",
              borderRadius: "7px",
              border: `1px solid ${showTyping ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: showTyping
                ? "rgba(255,215,0,0.08)"
                : "rgba(255,255,255,0.04)",
              color: showTyping ? "#FFD700" : "#666",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <MessageSquare size={11} /> Typing
          </button>
        )}
        {/* Zoom */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={() => setZoom((z) => Math.max(40, z - 10))}
            style={zoomBtn}
          >
            <ZoomOut size={12} />
          </button>
          <span
            style={{
              fontSize: "11px",
              color: "#555",
              minWidth: "32px",
              textAlign: "center",
            }}
          >
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(100, z + 10))}
            style={zoomBtn}
          >
            <ZoomIn size={12} />
          </button>
        </div>
      </div>

      {/* Preview container */}
      <div
        style={{
          background: darkMode
            ? "radial-gradient(ellipse at center, #0D1520 0%, #080C10 100%)"
            : "radial-gradient(ellipse at center, #E8EDF2 0%, #D5DCE4 100%)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "auto",
          minHeight: "360px",
        }}
      >
        {device === "android" && <AndroidPreview {...previewProps} />}
        {device === "iphone" && <IPhonePreview {...previewProps} />}
        {device === "desktop" && <DesktopPreview {...previewProps} />}
        {device === "tablet" && <TabletPreview {...previewProps} />}
      </div>

      {/* Raw message */}
      <details style={{ cursor: "pointer" }}>
        <summary
          style={{
            fontSize: "11px",
            color: "#555",
            padding: "7px 12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            userSelect: "none",
          }}
        >
          <span style={{ fontSize: "9px" }}>▶</span> View raw message
          <button
            onClick={(e) => {
              e.preventDefault();
              copyRaw();
            }}
            style={{
              marginLeft: "auto",
              padding: "3px 8px",
              borderRadius: "5px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: rawCopied ? "#3DDC84" : "#555",
              cursor: "pointer",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {rawCopied ? <Check size={10} /> : <Copy size={10} />}
            {rawCopied ? "Copied!" : "Copy"}
          </button>
        </summary>
        <pre
          style={{
            margin: "6px 0 0",
            padding: "10px",
            background: "rgba(0,0,0,0.4)",
            borderRadius: "8px",
            fontSize: "10px",
            color: "#888",
            overflowX: "auto",
            lineHeight: 1.7,
            border: "1px solid rgba(255,255,255,0.05)",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </pre>
      </details>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 1; }
          30% { transform: translateY(-4px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

const zoomBtn = {
  padding: "5px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#666",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
};
