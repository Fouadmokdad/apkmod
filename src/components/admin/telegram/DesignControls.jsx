"use client";
import { useState } from "react";
import { Palette, Type, Layout, Sliders, RotateCcw } from "lucide-react";

const TITLE_STYLES = [
  { id: "fire", label: "🔥 Fire", preview: "🔥 **App Name MOD APK**" },
  { id: "gem", label: "💎 Gem", preview: "💎 **App Name MOD APK**" },
  { id: "rocket", label: "🚀 Rocket", preview: "🚀 **App Name MOD APK**" },
  { id: "crown", label: "👑 Crown", preview: "👑 **App Name MOD APK**" },
  { id: "clean", label: "✦ Clean", preview: "**APP NAME MOD APK**" },
  { id: "arrow", label: "➤ Arrow", preview: "➤ App Name MOD APK" },
];

const EMOJI_STYLES = [
  { id: "rich", label: "Rich", desc: "Full emoji set" },
  { id: "minimal", label: "Minimal", desc: "Key emojis only" },
  { id: "none", label: "None", desc: "Text only, no emojis" },
  { id: "gaming", label: "Gaming", desc: "⚡💎🎮 style" },
  { id: "luxury", label: "Luxury", desc: "👑✨ style" },
];

const DIVIDER_STYLES = [
  { id: "none", label: "None", preview: "" },
  { id: "line", label: "─────", preview: "─────────────────" },
  { id: "dots", label: "· · ·", preview: "· · · · · · · · ·" },
  { id: "star", label: "✦ ✦ ✦", preview: "✦ ✦ ✦ ✦ ✦" },
  { id: "wave", label: "〰〰〰", preview: "〰〰〰〰〰" },
];

const HASHTAG_STYLES = [
  { id: "inline", label: "Inline", preview: "#MOD #APK #Premium" },
  { id: "spaced", label: "Spaced", preview: "#MOD   #APK   #Premium" },
  { id: "newline", label: "Each Line", preview: "#MOD\n#APK\n#Premium" },
  { id: "compact", label: "Compact", preview: "#MOD#APK#Premium" },
];

const FOOTER_STYLES = [
  { id: "site", label: "Site Link", preview: "🌐 modapkstore.pro" },
  {
    id: "full",
    label: "Full Brand",
    preview: "🌐 Mod Apk Store — modapkstore.pro",
  },
  { id: "minimal", label: "Minimal", preview: "modapkstore.pro" },
  { id: "none", label: "None", preview: "" },
];

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "#3A4A5C",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "12px",
        marginTop: "24px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }}
      />
      <span>{children}</span>
      <div
        style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

function OptionPill({ label, active, onClick, preview, color = "#2AABEE" }) {
  return (
    <button
      onClick={onClick}
      title={preview}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        border: `1px solid ${active ? color + "60" : "rgba(255,255,255,0.07)"}`,
        background: active ? color + "18" : "rgba(255,255,255,0.03)",
        color: active ? color : "#556",
        fontSize: "12px",
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "'Inter', sans-serif",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = color + "40";
          e.currentTarget.style.color = color + "CC";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.color = "#556";
        }
      }}
    >
      {label}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  color = "#2AABEE",
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#778", fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: "12px",
            color: color,
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "100%",
          accentColor: color,
          cursor: "pointer",
          background: `linear-gradient(90deg, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0%)`,
          height: "4px",
          borderRadius: "2px",
          outline: "none",
          border: "none",
          appearance: "none",
          WebkitAppearance: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "4px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#334" }}>
          {min}
          {unit}
        </span>
        <span style={{ fontSize: "10px", color: "#334" }}>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

function PremiumToggle({ label, desc, checked, onChange, color = "#2AABEE" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ flex: 1, paddingRight: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: checked ? "#E8EDF2" : "#667",
            marginBottom: "2px",
          }}
        >
          {label}
        </div>
        {desc && <div style={{ fontSize: "11px", color: "#445" }}>{desc}</div>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          background: checked ? color : "rgba(255,255,255,0.08)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.3s",
          flexShrink: 0,
          boxShadow: checked ? `0 0 12px ${color}40` : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </div>
    </div>
  );
}

function ColorButton({ color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        background: color,
        border: active ? "2px solid #fff" : "2px solid transparent",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.2s",
        boxShadow: active ? `0 0 10px ${color}80` : "none",
        outline: active ? `2px solid ${color}60` : "none",
        outlineOffset: "2px",
      }}
    />
  );
}

const BUTTON_COLOR_PRESETS = [
  "#2AABEE",
  "#3DDC84",
  "#FF6B6B",
  "#FFD700",
  "#FF4081",
  "#4ECDC4",
  "#FF9500",
  "#A855F7",
];

const DEFAULT_DESIGN = {
  titleStyle: "fire",
  emojiStyle: "rich",
  dividerStyle: "line",
  hashtagStyle: "inline",
  footerStyle: "site",
  cardRadius: 12,
  fontWeight: 500,
  spacing: 1,
  buttonRadius: 8,
  primaryButtonColor: "#2AABEE",
  secondaryButtonColor: "#3DDC84",
  alignment: "left",
  compactMode: false,
  minimalMode: false,
  premiumMode: false,
  boldTitles: true,
  emojiInTitle: true,
  showDivider: false,
  pinPost: false,
  silentPost: false,
};

export default function DesignControls({ design = DEFAULT_DESIGN, onChange }) {
  const [activeSection, setActiveSection] = useState("typography");
  const d = { ...DEFAULT_DESIGN, ...design };

  const update = (key, val) => onChange?.({ ...d, [key]: val });

  const SECTIONS = [
    { id: "typography", label: "Typography", icon: Type },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "buttons", label: "Buttons", icon: Palette },
    { id: "automation", label: "Auto", icon: Sliders },
  ];

  return (
    <div>
      {/* Section tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                flex: 1,
                padding: "8px 6px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                background: active ? "rgba(42,171,238,0.15)" : "transparent",
                color: active ? "#2AABEE" : "#445",
                fontSize: "11px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
            >
              <Icon size={13} /> {s.label}
            </button>
          );
        })}
      </div>

      {/* Typography */}
      {activeSection === "typography" && (
        <div>
          <SectionLabel>Title Style</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            {TITLE_STYLES.map((ts) => (
              <OptionPill
                key={ts.id}
                label={ts.label}
                active={d.titleStyle === ts.id}
                preview={ts.preview}
                onClick={() => update("titleStyle", ts.id)}
              />
            ))}
          </div>

          <SectionLabel>Emoji Density</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            {EMOJI_STYLES.map((es) => (
              <OptionPill
                key={es.id}
                label={es.label}
                active={d.emojiStyle === es.id}
                preview={es.desc}
                onClick={() => update("emojiStyle", es.id)}
              />
            ))}
          </div>

          <SectionLabel>Hashtag Style</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            {HASHTAG_STYLES.map((hs) => (
              <OptionPill
                key={hs.id}
                label={hs.label}
                active={d.hashtagStyle === hs.id}
                preview={hs.preview}
                onClick={() => update("hashtagStyle", hs.id)}
              />
            ))}
          </div>

          <SectionLabel>Footer Style</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "8px",
            }}
          >
            {FOOTER_STYLES.map((fs) => (
              <OptionPill
                key={fs.id}
                label={fs.label}
                active={d.footerStyle === fs.id}
                preview={fs.preview}
                onClick={() => update("footerStyle", fs.id)}
              />
            ))}
          </div>

          <SectionLabel>Text Options</SectionLabel>
          <PremiumToggle
            label="Bold Titles"
            desc="Make the app name title bold"
            checked={d.boldTitles}
            onChange={(v) => update("boldTitles", v)}
          />
          <PremiumToggle
            label="Emoji in Title"
            desc="Show emoji before the app name"
            checked={d.emojiInTitle}
            onChange={(v) => update("emojiInTitle", v)}
          />
        </div>
      )}

      {/* Layout */}
      {activeSection === "layout" && (
        <div>
          <SectionLabel>Divider Style</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            {DIVIDER_STYLES.map((ds) => (
              <OptionPill
                key={ds.id}
                label={ds.label || "None"}
                active={d.dividerStyle === ds.id}
                preview={ds.preview}
                onClick={() => update("dividerStyle", ds.id)}
              />
            ))}
          </div>

          <Slider
            label="Card Border Radius"
            value={d.cardRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => update("cardRadius", v)}
          />
          <Slider
            label="Block Spacing"
            value={d.spacing}
            min={0}
            max={4}
            onChange={(v) => update("spacing", v)}
          />

          <SectionLabel>Alignment</SectionLabel>
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
            {["left", "center"].map((a) => (
              <OptionPill
                key={a}
                label={a === "left" ? "← Left" : "⊕ Center"}
                active={d.alignment === a}
                onClick={() => update("alignment", a)}
              />
            ))}
          </div>

          <SectionLabel>Mode Presets</SectionLabel>
          <PremiumToggle
            label="Compact Mode"
            desc="Shorter posts with key info only"
            checked={d.compactMode}
            onChange={(v) => update("compactMode", v)}
          />
          <PremiumToggle
            label="Minimal Mode"
            desc="Clean text only, minimal emojis"
            checked={d.minimalMode}
            onChange={(v) => update("minimalMode", v)}
          />
          <PremiumToggle
            label="Premium Mode"
            desc="Rich formatting, maximum detail"
            checked={d.premiumMode}
            onChange={(v) => update("premiumMode", v)}
          />
        </div>
      )}

      {/* Buttons */}
      {activeSection === "buttons" && (
        <div>
          <SectionLabel>Primary Button Color</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {BUTTON_COLOR_PRESETS.map((c) => (
              <ColorButton
                key={c}
                color={c}
                active={d.primaryButtonColor === c}
                onClick={() => update("primaryButtonColor", c)}
              />
            ))}
            <input
              type="color"
              value={d.primaryButtonColor}
              onChange={(e) => update("primaryButtonColor", e.target.value)}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                background: "transparent",
              }}
              title="Custom color"
            />
          </div>

          <SectionLabel>Secondary Button Color</SectionLabel>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {BUTTON_COLOR_PRESETS.map((c) => (
              <ColorButton
                key={c}
                color={c}
                active={d.secondaryButtonColor === c}
                onClick={() => update("secondaryButtonColor", c)}
              />
            ))}
          </div>

          <Slider
            label="Button Border Radius"
            value={d.buttonRadius}
            min={0}
            max={24}
            unit="px"
            onChange={(v) => update("buttonRadius", v)}
          />

          <SectionLabel>Button Style</SectionLabel>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { id: "solid", label: "Solid" },
              { id: "ghost", label: "Ghost" },
              { id: "gradient", label: "Gradient" },
              { id: "glow", label: "Glow" },
            ].map((s) => (
              <OptionPill
                key={s.id}
                label={s.label}
                active={d.buttonStyle === s.id}
                onClick={() => update("buttonStyle", s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Automation */}
      {activeSection === "automation" && (
        <div>
          <SectionLabel>Auto Content</SectionLabel>
          <PremiumToggle
            label="Auto Hashtags"
            desc="Automatically generate hashtags from category and tags"
            checked={d.autoHashtags !== false}
            onChange={(v) => update("autoHashtags", v)}
            color="#3DDC84"
          />
          <PremiumToggle
            label="Auto Emojis"
            desc="Smart emoji insertion based on content"
            checked={d.autoEmojis !== false}
            onChange={(v) => update("autoEmojis", v)}
            color="#3DDC84"
          />
          <PremiumToggle
            label="Auto Short Links"
            desc="Shorten download URLs automatically"
            checked={d.autoShortLinks}
            onChange={(v) => update("autoShortLinks", v)}
            color="#3DDC84"
          />
          <PremiumToggle
            label="Auto CTA"
            desc="Add dynamic call-to-action to every post"
            checked={d.autoCTA}
            onChange={(v) => update("autoCTA", v)}
            color="#3DDC84"
          />

          <SectionLabel>Posting Options</SectionLabel>
          <PremiumToggle
            label="Silent Posting"
            desc="Send without notification sound"
            checked={d.silentPost}
            onChange={(v) => update("silentPost", v)}
            color="#FFD700"
          />
          <PremiumToggle
            label="Pin Posts"
            desc="Auto-pin every new post in channel"
            checked={d.pinPost}
            onChange={(v) => update("pinPost", v)}
            color="#FFD700"
          />
          <PremiumToggle
            label="First Comment"
            desc="Auto-post download link as first comment"
            checked={d.autoFirstComment}
            onChange={(v) => update("autoFirstComment", v)}
            color="#FFD700"
          />
          <PremiumToggle
            label="Scheduled Posting"
            desc="Post at optimal engagement times"
            checked={d.scheduledPosting}
            onChange={(v) => update("scheduledPosting", v)}
            color="#FFD700"
          />
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => onChange?.(DEFAULT_DESIGN)}
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "10px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "10px",
          color: "#445",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontFamily: "'Inter', sans-serif",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#FF6B6B";
          e.currentTarget.style.borderColor = "rgba(255,107,107,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#445";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        }}
      >
        <RotateCcw size={13} /> Reset to defaults
      </button>
    </div>
  );
}
