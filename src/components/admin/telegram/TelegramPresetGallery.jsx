"use client";
import { useState } from "react";
import { Zap, Check } from "lucide-react";

const PRESETS = [
  {
    id: 1,
    name: "Premium MOD APK",
    style: "Professional",
    tags: ["Dark", "Emojis", "Viral"],
    colors: ["#3DDC84", "#1A1A2E", "#16213E"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_include_changelog: "false",
      telegram_default_hashtags: "#MODAPK #Premium #AndroidApps #FreeDownload",
    },
    preview:
      "🔥 <b>App Name MOD APK</b>\n✨ Premium Unlocked\n🚫 No Ads\n📥 Offline Mode\n\n📌 v1.0 MOD | 📦 50 MB | 📱 7.0+\n\n#MODAPK #Premium",
  },
  {
    id: 2,
    name: "Gaming Style",
    style: "Gaming",
    tags: ["Bold", "Energetic", "Gaming"],
    colors: ["#FF6B6B", "#FFD700", "#FF4500"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags:
        "#GameMod #AndroidGaming #ModAPK #GamingCommunity #FreeGames",
    },
    preview:
      "🎮 <b>Game Name MOD APK</b>\n💎 Unlimited Gems\n⚡ God Mode ON\n🏆 All Levels Unlocked\n\n🔥 v1.0 | 📦 200MB | 💥 Android 8+\n\n#Gaming #GameMod",
  },
  {
    id: 3,
    name: "Anime Style",
    style: "Kawaii",
    tags: ["Soft", "Anime", "Fun"],
    colors: ["#FF9FF3", "#FFEAA7", "#DDA0DD"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "false",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#AnimeApps #ModAPK #Kawaii #AnimeFan",
    },
    preview:
      "✨ <b>App Name MOD</b> (◕‿◕)\n🌸 Premium Features\n🎀 Ad-Free Experience\n🌟 All Content Unlocked\n\n💫 Version: Latest\n\n#Anime #ModAPK",
  },
  {
    id: 4,
    name: "Minimal Clean",
    style: "Minimal",
    tags: ["Clean", "No Emojis", "Pro"],
    colors: ["#FFFFFF", "#E5E5E5", "#999999"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#MOD #Android #Premium #App",
    },
    preview:
      "<b>App Name — Premium MOD</b>\n\nFeatures Unlocked:\n• Premium Access\n• No Advertisements\n• Offline Available\n\nVersion 1.0 | 50 MB | Android 6+\n\n#MOD #Android",
  },
  {
    id: 5,
    name: "Hacker Style",
    style: "Hacker",
    tags: ["Tech", "Matrix", "Monospace"],
    colors: ["#00FF41", "#003300", "#001100"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#HackerMod #AndroidHack #RootAPK #TechMod",
    },
    preview:
      "⌨️ <code>APP_NAME.apk [MOD]</code>\n> PATCH_STATUS: ACTIVE\n> ADS_BLOCKER: ENABLED\n> PREMIUM: BYPASSED\n> BUILD: v1.0-MODDED\n\n[DOWNLOAD] → Click below\n\n#Hacker #ModAPK",
  },
  {
    id: 6,
    name: "Luxury Black Gold",
    style: "Luxury",
    tags: ["Gold", "Premium", "Elite"],
    colors: ["#FFD700", "#1A1A1A", "#C0C0C0"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#LuxuryApps #GoldMOD #PremiumAPK #Elite",
    },
    preview:
      "👑 <b>App Name — Gold Edition</b>\n\n◈ VIP Access Unlocked\n◈ Zero Advertisements\n◈ Exclusive Features\n\n▸ Version 1.0 Premium\n▸ Size: 50 MB\n\n#Luxury #GoldMOD",
  },
  {
    id: 7,
    name: "Neon Cyberpunk",
    style: "Cyberpunk",
    tags: ["Neon", "Cyber", "Bold"],
    colors: ["#00FFFF", "#FF00FF", "#FFFF00"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags:
        "#Cyberpunk #NeonMOD #Futuristic #AndroidCyber",
    },
    preview:
      "⚡ <b>APP_NAME CYBER MOD</b> ⚡\n\n🔵 Neural Premium: ACTIVE\n🔴 Ad Matrix: DESTROYED\n🟢 Download Protocol: READY\n\n◉ v1.0 | 50MB | ANDROID+\n\n#Cyberpunk #NeonMOD",
  },
  {
    id: 8,
    name: "Viral Telegram",
    style: "Viral",
    tags: ["Engagement", "FOMO", "CTA"],
    colors: ["#FF4444", "#FF8C00", "#FFD700"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#Viral #MODAPKDaily #GetItNow #AndroidFree",
    },
    preview:
      "🚨 JUST DROPPED: <b>App Name MOD!</b>\n\n🔥 Everyone is downloading this!\n✅ TESTED & WORKING 2025\n⚠️ Won't last long — grab it NOW!\n\n⬇️ 50,000+ downloads already!\n\n#Viral #MODAPKDaily",
  },
  {
    id: 9,
    name: "App Store Style",
    style: "Professional",
    tags: ["Clean", "Store", "Official"],
    colors: ["#007AFF", "#34C759", "#FF9500"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#AppStore #Android #Download #MOD",
    },
    preview:
      "📱 <b>App Name</b>\n⭐⭐⭐⭐⭐ 4.9/5\n\n<b>What's New in MOD:</b>\n› Premium subscription bypassed\n› Ads completely removed\n› All features unlocked\n\n🔖 Version 1.0 MOD\n\n#AppStore #Android",
  },
  {
    id: 10,
    name: "Compact Mobile",
    style: "Compact",
    tags: ["Short", "Mobile", "Quick"],
    colors: ["#3DDC84", "#4ECDC4", "#45B7D1"],
    config: {
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_default_hashtags: "#MOD #APK #Free",
    },
    preview:
      "📦 <b>App v1.0 MOD</b>\n✅ Premium | ✅ No Ads | 50MB\n\n⬇️ Tap to Download\n#MOD #APK #Free",
  },
];

export default function TelegramPresetGallery({ onApply }) {
  const [appliedId, setAppliedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [filterStyle, setFilterStyle] = useState("All");

  const styles = ["All", ...new Set(PRESETS.map((p) => p.style))];
  const filtered =
    filterStyle === "All"
      ? PRESETS
      : PRESETS.filter((p) => p.style === filterStyle);

  const handleApply = (preset) => {
    setAppliedId(preset.id);
    onApply?.(preset.config, preset.name);
    setTimeout(() => setAppliedId(null), 2000);
  };

  return (
    <div>
      {/* Filter row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#555",
            marginRight: "4px",
            fontWeight: 500,
          }}
        >
          Filter:
        </span>
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStyle(s)}
            style={{
              padding: "5px 14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              background:
                filterStyle === s
                  ? "rgba(61,220,132,0.2)"
                  : "rgba(255,255,255,0.05)",
              color: filterStyle === s ? "#3DDC84" : "#666",
              border:
                filterStyle === s
                  ? "1px solid rgba(61,220,132,0.4)"
                  : "1px solid transparent",
              transition: "all 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((preset) => {
          const isHovered = hoveredId === preset.id;
          const isApplied = appliedId === preset.id;
          return (
            <div
              key={preset.id}
              onMouseEnter={() => setHoveredId(preset.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.03)",
                borderRadius: "16px",
                overflow: "hidden",
                border: isHovered
                  ? `1px solid ${preset.colors[0]}50`
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isHovered
                  ? `0 0 20px ${preset.colors[0]}20`
                  : "none",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
            >
              {/* Color bar */}
              <div
                style={{
                  height: "4px",
                  background: `linear-gradient(90deg, ${preset.colors.join(", ")})`,
                }}
              />

              {/* Header */}
              <div
                style={{
                  padding: "16px 16px 12px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#fff",
                      marginBottom: "4px",
                    }}
                  >
                    {preset.name}
                  </div>
                  <div
                    style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                  >
                    {preset.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: `${preset.colors[0]}15`,
                          color: preset.colors[0],
                          border: `1px solid ${preset.colors[0]}30`,
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Color dots */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {preset.colors.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: c,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mini message preview */}
              <div
                style={{
                  margin: "0 16px 14px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                }}
              >
                {/* Telegram bubble */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #2B5278, #1C3A5E)",
                    borderRadius: "12px 12px 12px 0",
                    padding: "10px 12px",
                    fontSize: "11px",
                    lineHeight: 1.6,
                    color: "#C0C0C0",
                    fontFamily: "monospace",
                    maxHeight: "80px",
                    overflow: "hidden",
                    position: "relative",
                    whiteSpace: "pre-line",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: preset.preview
                      .replace(
                        /<b>(.*?)<\/b>/g,
                        '<strong style="color:#fff">$1</strong>',
                      )
                      .replace(
                        /<code>(.*?)<\/code>/g,
                        '<code style="font-family:monospace;color:#4FC3F7">$1</code>',
                      )
                      .replace(/\n/g, "<br/>"),
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    fontSize: "10px",
                    color: "#4FC3F7",
                  }}
                >
                  ✓✓
                </div>
              </div>

              {/* Apply button */}
              <div style={{ padding: "0 16px 16px" }}>
                <button
                  onClick={() => handleApply(preset)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    background: isApplied
                      ? "rgba(61,220,132,0.2)"
                      : `${preset.colors[0]}18`,
                    color: isApplied ? "#3DDC84" : preset.colors[0],
                    border: `1px solid ${isApplied ? "rgba(61,220,132,0.5)" : `${preset.colors[0]}40`}`,
                    fontWeight: 700,
                    fontSize: "13px",
                    fontFamily: "'Inter', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  {isApplied ? (
                    <>
                      <Check size={14} /> Applied!
                    </>
                  ) : (
                    <>
                      <Zap size={14} /> Apply Preset
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
