"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Zap,
  Layout,
  Palette,
  Bot,
  BarChart3,
  Radio,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  Eye,
  Send,
  Power,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";
import TelegramPresetGallery from "@/components/admin/telegram/TelegramPresetGallery";
import TelegramPreview from "@/components/admin/telegram/TelegramPreview";
import TelegramAIPanel from "@/components/admin/telegram/TelegramAIPanel";
import TelegramBlockEditor from "@/components/admin/telegram/TelegramBlockEditor";
import TelegramButtonDesigner from "@/components/admin/telegram/TelegramButtonDesigner";
import TelegramAnalytics from "@/components/admin/telegram/TelegramAnalytics";
import TelegramChannelManager from "@/components/admin/telegram/TelegramChannelManager";
import DesignControls from "@/components/admin/telegram/DesignControls";
import ValidationPanel from "@/components/admin/telegram/ValidationPanel";

// ─── Design tokens ────────────────────────────────────────────────────────
const T = {
  bg: "#070D1A",
  surface: "rgba(255,255,255,0.025)",
  surfaceHover: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.07)",
  borderAccent: "rgba(42,171,238,0.22)",
  text: "#E8EDF5",
  muted: "#4A5568",
  dim: "#2A3A4A",
  blue: "#2AABEE",
  green: "#3DDC84",
  red: "#FF6B6B",
  gold: "#FFD700",
  radius: "16px",
  font: "'Inter', system-ui, -apple-system, sans-serif",
};

// ─── Tabs config ─────────────────────────────────────────────────────────
const TABS = [
  {
    id: "core",
    label: "Connection",
    icon: Shield,
    desc: "Bot token & triggers",
  },
  { id: "blocks", label: "Template", icon: Layout, desc: "Block editor" },
  { id: "design", label: "Design", icon: Palette, desc: "Styles & colors" },
  { id: "buttons", label: "Buttons", icon: Zap, desc: "Inline keyboard" },
  { id: "presets", label: "Presets", icon: Sparkles, desc: "Template library" },
  { id: "ai", label: "AI Engine", icon: Bot, desc: "Smart content" },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    desc: "Stats & charts",
  },
  { id: "channels", label: "Channels", icon: Radio, desc: "Multi-channel" },
];

// ─── Variable chips shown in the template tab ─────────────────────────────
const VARS = [
  ["{title}", "#2AABEE"],
  ["{version}", "#3DDC84"],
  ["{size}", "#FFD700"],
  ["{android}", "#FF9500"],
  ["{developer}", "#A855F7"],
  ["{category}", "#4ECDC4"],
  ["{modFeatures}", "#FF4081"],
  ["{hashtags}", "#3DDC84"],
  ["{downloadUrl}", "#FF6B6B"],
  ["{websiteUrl}", "#2AABEE"],
  ["{changelog}", "#FFD700"],
];

// ─── Shared primitives ────────────────────────────────────────────────────
function Toggle({ checked, onChange, color = T.green }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "46px",
        height: "26px",
        borderRadius: "13px",
        background: checked ? color : "rgba(255,255,255,0.09)",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.3s",
        boxShadow: checked ? `0 0 14px ${color}55` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "23px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </div>
  );
}

function PInput({ value, onChange, type = "text", placeholder, mono, rows }) {
  const [focused, setFocused] = useState(false);
  const s = {
    width: "100%",
    padding: "11px 14px",
    background: focused ? "rgba(42,171,238,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focused ? "rgba(42,171,238,0.4)" : T.border}`,
    borderRadius: "12px",
    color: T.text,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: mono ? "monospace" : T.font,
    transition: "all 0.2s",
    resize: rows ? "vertical" : undefined,
  };
  if (rows)
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={s}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
      style={s}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Field({ label, hint, children, required }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "8px",
        }}
      >
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#6A7A8A",
            letterSpacing: "0.03em",
          }}
        >
          {label}
        </label>
        {required && (
          <span style={{ fontSize: "10px", color: T.red, fontWeight: 800 }}>
            *
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: "11px",
            color: T.dim,
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function SCard({ children, accent, style = {} }) {
  return (
    <div
      style={{
        background: T.surface,
        borderRadius: T.radius,
        padding: "22px",
        border: `1px solid ${accent ? T.borderAccent : T.border}`,
        boxShadow: accent ? "0 0 40px rgba(42,171,238,0.05)" : "none",
        marginBottom: "14px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SCardTitle({ icon, children }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: T.dim,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "18px",
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <span style={{ fontSize: "14px" }}>{icon}</span>
      {children}
    </div>
  );
}

function TRow({ label, desc, value, onChange, color }) {
  const on = value === "true" || value === true;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div style={{ flex: 1, paddingRight: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: on ? T.text : T.muted,
            marginBottom: "1px",
          }}
        >
          {label}
        </div>
        {desc && <div style={{ fontSize: "11px", color: T.dim }}>{desc}</div>}
      </div>
      <Toggle
        checked={on}
        onChange={(v) => onChange(v ? "true" : "false")}
        color={color || T.green}
      />
    </div>
  );
}

// ─── Core Settings ────────────────────────────────────────────────────────
function CoreSettings({ settings, onUpdate, onTest, testResult, testing }) {
  const on = settings.telegram_enabled === "true";
  return (
    <div>
      {/* Master switch */}
      <div
        style={{
          padding: "20px 22px",
          borderRadius: T.radius,
          marginBottom: "16px",
          background: on ? "rgba(61,220,132,0.05)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${on ? "rgba(61,220,132,0.2)" : T.border}`,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          transition: "all 0.3s",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: on ? "rgba(61,220,132,0.12)" : "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Power size={21} color={on ? T.green : T.muted} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: on ? T.green : T.muted,
              marginBottom: "2px",
            }}
          >
            Auto Posting — {on ? "🟢 Live" : "⚪ Paused"}
          </div>
          <div style={{ fontSize: "12px", color: T.dim }}>
            {on
              ? "Posts fire automatically when apps are published."
              : "Enable to start auto-posting."}
          </div>
        </div>
        <Toggle
          checked={on}
          onChange={(v) => onUpdate("telegram_enabled", v ? "true" : "false")}
        />
      </div>

      {/* Credentials */}
      <SCard>
        <SCardTitle icon="🔐">Bot Credentials</SCardTitle>
        <Field
          label="Bot Token"
          required
          hint="From @BotFather → /newbot command"
        >
          <PInput
            value={settings.telegram_bot_token}
            onChange={(v) => onUpdate("telegram_bot_token", v)}
            type="password"
            placeholder="1234567890:ABCDefGhIJKlmnoPQRstuVWXyz"
            mono
          />
        </Field>
        <Field
          label="Chat ID / Channel"
          required
          hint="@yourchannel  ·  or numeric ID: -1001234567890"
        >
          <PInput
            value={settings.telegram_chat_id}
            onChange={(v) => onUpdate("telegram_chat_id", v)}
            placeholder="@modapkstore or -1001234567890"
            mono
          />
        </Field>
        <button
          onClick={onTest}
          disabled={
            testing ||
            !settings.telegram_bot_token ||
            !settings.telegram_chat_id
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: testing
              ? "rgba(255,255,255,0.04)"
              : "rgba(42,171,238,0.1)",
            border: `1px solid ${testing ? T.border : "rgba(42,171,238,0.3)"}`,
            borderRadius: "11px",
            color: testing ? T.muted : T.blue,
            cursor: testing ? "wait" : "pointer",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: T.font,
            transition: "all 0.2s",
            opacity:
              !settings.telegram_bot_token || !settings.telegram_chat_id
                ? 0.5
                : 1,
          }}
          onMouseEnter={(e) => {
            if (!testing)
              e.currentTarget.style.background = "rgba(42,171,238,0.18)";
          }}
          onMouseLeave={(e) => {
            if (!testing)
              e.currentTarget.style.background = "rgba(42,171,238,0.1)";
          }}
        >
          {testing ? (
            <Loader
              size={15}
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          ) : (
            <TestTube size={15} />
          )}
          {testing ? "Testing..." : "Test Connection"}
        </button>
        {testResult && (
          <div
            style={{
              marginTop: "13px",
              padding: "13px 16px",
              borderRadius: "12px",
              background: testResult.success
                ? "rgba(61,220,132,0.07)"
                : "rgba(255,107,107,0.07)",
              border: `1px solid ${testResult.success ? "rgba(61,220,132,0.22)" : "rgba(255,107,107,0.22)"}`,
              display: "flex",
              gap: "11px",
              alignItems: "flex-start",
              animation: "fadeUp 0.3s ease",
            }}
          >
            {testResult.success ? (
              <CheckCircle
                size={17}
                color={T.green}
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
            ) : (
              <XCircle
                size={17}
                color={T.red}
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
            )}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: testResult.success ? T.green : T.red,
                  marginBottom: "3px",
                }}
              >
                {testResult.success
                  ? "Connection successful!"
                  : "Connection failed"}
              </div>
              {testResult.bot_name && (
                <div style={{ fontSize: "12px", color: "#556" }}>
                  Bot: @{testResult.bot_name}
                </div>
              )}
              {testResult.error && (
                <div
                  style={{ fontSize: "12px", color: "#778", marginTop: "2px" }}
                >
                  {testResult.error}
                </div>
              )}
              {testResult.hint && (
                <div
                  style={{ fontSize: "12px", color: T.gold, marginTop: "4px" }}
                >
                  💡 {testResult.hint}
                </div>
              )}
            </div>
          </div>
        )}
      </SCard>

      {/* Post mode */}
      <SCard>
        <SCardTitle icon="⚡">Post Mode</SCardTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {[
            ["instant", "⚡ Instant", "Post the moment app is published"],
            ["scheduled", "🕐 Scheduled", "Queue for optimal time"],
          ].map(([val, label, desc]) => (
            <div
              key={val}
              onClick={() => onUpdate("telegram_post_mode", val)}
              style={{
                padding: "15px",
                borderRadius: "12px",
                cursor: "pointer",
                background:
                  settings.telegram_post_mode === val
                    ? "rgba(42,171,238,0.08)"
                    : "rgba(255,255,255,0.02)",
                outline: `1px solid ${settings.telegram_post_mode === val ? "rgba(42,171,238,0.35)" : T.border}`,
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: settings.telegram_post_mode === val ? T.blue : T.muted,
                  marginBottom: "4px",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "11px", color: T.dim }}>{desc}</div>
            </div>
          ))}
        </div>
      </SCard>

      {/* Content options */}
      <SCard>
        <SCardTitle icon="📝">Message Content</SCardTitle>
        {[
          [
            "telegram_include_image",
            "🖼️ Include App Icon",
            "Send icon as photo with caption",
          ],
          [
            "telegram_include_mod_features",
            "✨ MOD Features",
            "List all unlocked features",
          ],
          [
            "telegram_include_version_info",
            "📌 Version Info",
            "Show version number in post",
          ],
          [
            "telegram_include_apk_size",
            "📦 APK Size & Android",
            "Show file size and min Android version",
          ],
          [
            "telegram_include_download_button",
            "⬇️ Download Buttons",
            "Inline keyboard with download links",
          ],
          [
            "telegram_include_changelog",
            "🆕 Changelog",
            "Show latest changes section",
          ],
          ["telegram_silent_posts", "🔕 Silent Posts", "No notification ping"],
          ["telegram_pin_posts", "📌 Pin Posts", "Auto-pin each new post"],
        ].map(([key, label, desc]) => (
          <TRow
            key={key}
            label={label}
            desc={desc}
            value={settings[key]}
            onChange={(v) => onUpdate(key, v)}
          />
        ))}
      </SCard>

      {/* Hashtags */}
      <SCard>
        <SCardTitle icon="#️⃣">Default Hashtags</SCardTitle>
        <PInput
          value={settings.telegram_default_hashtags}
          onChange={(v) => onUpdate("telegram_default_hashtags", v)}
          placeholder="#MODAPK #AndroidApps #FreeDownload #Premium"
          mono
          rows={3}
        />
        <p style={{ margin: "8px 0 0", fontSize: "11px", color: T.dim }}>
          Appended to every post. Extra tags auto-generated from app category
          and name.
        </p>
      </SCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function TelegramSettingsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("core");
  const [localSettings, setLocalSettings] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [manualSendSlug, setManualSendSlug] = useState("");
  const [sendResult, setSendResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [design, setDesign] = useState({});
  const sentinelRef = useRef(null);
  const [copiedVar, setCopiedVar] = useState(null);

  // Sticky bar via IntersectionObserver (smooth, no scroll jank)
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setStickyVisible(!e.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.settings) {
      const map = {};
      for (const row of data.settings) map[row.key] = row.value;
      setLocalSettings(map);
    }
  }, [data]);

  const updateField = useCallback((key, val) => {
    setLocalSettings((p) => ({ ...p, [key]: val }));
    setIsDirty(true);
  }, []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: localSettings }),
      });
      if (!res.ok) throw new Error("Save failed");
      return res.json();
    },
    onMutate: () => setSaveState("saving"),
    onSuccess: () => {
      setSaveState("saved");
      setIsDirty(false);
      qc.invalidateQueries(["admin-settings"]);
      setTimeout(() => setSaveState("idle"), 2500);
    },
    onError: () => {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    },
  });

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_token: localSettings.telegram_bot_token,
          chat_id: localSettings.telegram_chat_id,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setTestResult(d);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    }
    setTesting(false);
  };

  const handleManualSend = async (e) => {
    e.preventDefault();
    if (!manualSendSlug.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_slug: manualSendSlug.trim(), force: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setSendResult(d);
    } catch (err) {
      setSendResult({ success: false, error: err.message });
    }
    setSending(false);
  };

  const applyPreset = (config) => {
    setLocalSettings((p) => ({ ...p, ...config }));
    setIsDirty(true);
  };

  const copyVar = (v) => {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(v);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 1200);
  };

  const isEnabled = localSettings.telegram_enabled === "true";
  const activeTabData = TABS.find((t) => t.id === activeTab);

  const previewMsg = [
    localSettings.telegram_include_mod_features !== "false"
      ? "✨ Premium Unlocked\n🚫 No Ads\n📥 Offline Mode"
      : "",
    localSettings.telegram_include_version_info !== "false"
      ? "📌 v8.9.12 MOD | 📦 34 MB | 📱 6.0+"
      : "",
    localSettings.telegram_default_hashtags || "#MODAPK #Premium",
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div style={{ fontFamily: T.font, color: T.text }}>
      {/* ── Intersection sentinel (for sticky bar) ── */}
      <div ref={sentinelRef} style={{ height: "1px", marginBottom: "-1px" }} />

      {/* ── Sticky Save Bar ──────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "28px",
          left: "50%",
          transform: `translateX(-50%) translateY(${stickyVisible && isDirty ? "0px" : "110px"})`,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px 10px 14px",
          background: "rgba(7,13,26,0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(42,171,238,0.28)",
          borderRadius: "22px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(42,171,238,0.08)",
          transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          whiteSpace: "nowrap",
        }}
      >
        <AlertTriangle size={15} color={T.gold} />
        <span style={{ fontSize: "13px", color: "#7A8A9A" }}>
          Unsaved changes
        </span>
        <button
          onClick={() => saveMutation.mutate()}
          style={{
            padding: "8px 18px",
            background: "linear-gradient(135deg, #2AABEE 0%, #1a8fc7 100%)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: T.font,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(42,171,238,0.38)",
            transition: "all 0.2s",
          }}
        >
          {saveState === "saving" ? (
            <Loader
              size={13}
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          ) : (
            <Save size={13} />
          )}
          {saveState === "saving" ? "Saving…" : "Save Now"}
        </button>
        <button
          onClick={() => setStickyVisible(false)}
          style={{
            background: "none",
            border: "none",
            color: T.muted,
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          borderRadius: "22px",
          padding: "30px 34px 24px",
          marginBottom: "22px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0B1626 0%, #0F2245 50%, #0B1A35 100%)",
          border: "1px solid rgba(42,171,238,0.14)",
          boxShadow: "0 1px 0 rgba(42,171,238,0.07) inset",
        }}
      >
        {/* Glow orbs */}
        {[
          {
            t: "-70px",
            r: "50px",
            w: "280px",
            h: "280px",
            bg: "rgba(42,171,238,0.07)",
            b: "60px",
            anim: "orb1 8s ease-in-out infinite",
          },
          {
            t: "auto",
            b: "-50px",
            l: "38%",
            w: "200px",
            h: "200px",
            bg: "rgba(61,220,132,0.04)",
            bl: "40px",
            anim: "orb2 11s ease-in-out infinite reverse",
          },
          {
            t: "20px",
            l: "58%",
            w: "100px",
            h: "100px",
            bg: "rgba(255,64,129,0.04)",
            bl: "28px",
            anim: "orb3 7s ease-in-out infinite",
          },
        ].map((o, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: o.t,
              right: o.r,
              bottom: o.b,
              left: o.l,
              width: o.w,
              height: o.h,
              borderRadius: "50%",
              background: o.bg,
              filter: `blur(${o.b || o.bl || "50px"})`,
              pointerEvents: "none",
              animation: o.anim,
            }}
          />
        ))}

        <div style={{ position: "relative" }}>
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "22px",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "18px",
                flexShrink: 0,
                background:
                  "linear-gradient(135deg, rgba(42,171,238,0.18) 0%, rgba(42,171,238,0.06) 100%)",
                border: "1px solid rgba(42,171,238,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 28px rgba(42,171,238,0.1)",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "28px" }}>📨</span>
              {isEnabled && (
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: T.green,
                    border: "2px solid #0F2245",
                    animation: "pulseGreen 2s ease-in-out infinite",
                    boxShadow: `0 0 10px ${T.green}80`,
                  }}
                />
              )}
            </div>
            {/* Title */}
            <div style={{ flex: 1, minWidth: "180px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "6px",
                }}
              >
                <h1
                  style={{
                    fontFamily: T.font,
                    fontSize: "clamp(20px,3vw,27px)",
                    fontWeight: 800,
                    margin: 0,
                    letterSpacing: "-0.025em",
                    background:
                      "linear-gradient(120deg, #fff 40%, rgba(42,171,238,0.85))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Telegram Automation
                </h1>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: isEnabled
                      ? "rgba(61,220,132,0.12)"
                      : "rgba(255,255,255,0.06)",
                    color: isEnabled ? T.green : T.muted,
                    border: `1px solid ${isEnabled ? "rgba(61,220,132,0.25)" : T.border}`,
                  }}
                >
                  {isEnabled ? "● LIVE" : "○ OFFLINE"}
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    background: "rgba(42,171,238,0.1)",
                    color: T.blue,
                    border: "1px solid rgba(42,171,238,0.2)",
                  }}
                >
                  Enterprise
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#4A6070",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                AI-powered marketing · Multi-device preview · Drag &amp; drop
                blocks · Real-time validation
              </p>
            </div>
            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                flexShrink: 0,
              }}
            >
              <a
                href="/admin/telegram"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${T.border}`,
                  color: T.muted,
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                <BarChart3 size={13} /> Logs
              </a>
              <button
                onClick={() => saveMutation.mutate()}
                disabled={!isDirty || saveState === "saving"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "10px 22px",
                  borderRadius: "12px",
                  background: isDirty
                    ? "linear-gradient(135deg, #2AABEE 0%, #1a8fc7 100%)"
                    : "rgba(255,255,255,0.05)",
                  border: "none",
                  color: isDirty ? "#fff" : T.muted,
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: isDirty ? "pointer" : "default",
                  fontFamily: T.font,
                  transition: "all 0.3s",
                  boxShadow: isDirty
                    ? "0 4px 20px rgba(42,171,238,0.38)"
                    : "none",
                }}
              >
                {saveState === "saving" ? (
                  <Loader
                    size={14}
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                ) : saveState === "saved" ? (
                  <CheckCircle size={14} />
                ) : (
                  <Save size={14} />
                )}
                {saveState === "saving"
                  ? "Saving…"
                  : saveState === "saved"
                    ? "Saved!"
                    : "Save"}
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div
            style={{
              paddingTop: "18px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Status",
                value: isEnabled ? "Active" : "Paused",
                color: isEnabled ? T.green : T.muted,
              },
              {
                label: "Mode",
                value:
                  localSettings.telegram_post_mode === "scheduled"
                    ? "Scheduled"
                    : "Instant",
                color: T.blue,
              },
              {
                label: "Silent",
                value:
                  localSettings.telegram_silent_posts === "true" ? "Yes" : "No",
                color: "#667",
              },
              {
                label: "Buttons",
                value:
                  localSettings.telegram_include_download_button !== "false"
                    ? "On"
                    : "Off",
                color: T.gold,
              },
              {
                label: "Pin Posts",
                value:
                  localSettings.telegram_pin_posts === "true" ? "Yes" : "No",
                color: "#667",
              },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: T.dim,
                    letterSpacing: "0.07em",
                    marginBottom: "3px",
                  }}
                >
                  {s.label.toUpperCase()}
                </div>
                <div
                  style={{ fontSize: "14px", fontWeight: 700, color: s.color }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3-Column Grid ────────────────────────────────────────── */}
      <div
        className="tg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "216px 1fr 354px",
          gap: "18px",
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Navigation ── */}
        <div
          style={{
            background: T.surface,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
            position: "sticky",
            top: "16px",
          }}
        >
          <div
            style={{
              padding: "14px 14px 4px",
              fontSize: "10px",
              fontWeight: 700,
              color: T.dim,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Settings
          </div>
          <div style={{ padding: "6px 8px 8px" }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 11px",
                    borderRadius: "10px",
                    background: active ? "rgba(42,171,238,0.1)" : "transparent",
                    border: `1px solid ${active ? "rgba(42,171,238,0.2)" : "transparent"}`,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: T.font,
                    transition: "all 0.18s",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = T.surfaceHover;
                      e.currentTarget.style.borderColor = T.border;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      flexShrink: 0,
                      background: active
                        ? "rgba(42,171,238,0.16)"
                        : "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.18s",
                    }}
                  >
                    <Icon size={14} color={active ? T.blue : T.muted} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: active ? T.blue : "#5A6A7A",
                        marginBottom: "1px",
                      }}
                    >
                      {tab.label}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: T.dim,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tab.desc}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight
                      size={12}
                      color={T.blue}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick send */}
          <div
            style={{
              margin: "6px 8px 8px",
              padding: "13px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "10px",
              border: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: T.dim,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "9px",
              }}
            >
              Quick Send
            </div>
            <form
              onSubmit={handleManualSend}
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <input
                value={manualSendSlug}
                onChange={(e) => setManualSendSlug(e.target.value)}
                placeholder="app-slug"
                style={{
                  padding: "8px 10px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "8px",
                  color: T.text,
                  fontSize: "12px",
                  outline: "none",
                  fontFamily: "monospace",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={!manualSendSlug || sending}
                style={{
                  padding: "8px",
                  background: "rgba(42,171,238,0.1)",
                  border: "1px solid rgba(42,171,238,0.24)",
                  borderRadius: "8px",
                  color: T.blue,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  fontFamily: T.font,
                  width: "100%",
                }}
              >
                {sending ? (
                  <Loader
                    size={12}
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                ) : (
                  <Send size={12} />
                )}
                {sending ? "Sending…" : "Send Now"}
              </button>
            </form>
            {sendResult && (
              <div
                style={{
                  marginTop: "7px",
                  fontSize: "11px",
                  color: sendResult.success ? T.green : T.red,
                  lineHeight: 1.5,
                }}
              >
                {sendResult.success
                  ? "✅ Sent!"
                  : `❌ ${sendResult.error || sendResult.reason || "Failed"}`}
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER: Content ── */}
        <div
          style={{
            background: T.surface,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            minHeight: "600px",
            overflow: "hidden",
          }}
        >
          {/* Tab header */}
          {(() => {
            const TabIcon = activeTabData ? activeTabData.icon : null;
            return (
              <div
                style={{
                  padding: "20px 26px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  background: "rgba(255,255,255,0.012)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                {TabIcon && activeTabData && (
                  <>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        flexShrink: 0,
                        background: "rgba(42,171,238,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TabIcon size={17} color={T.blue} />
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: T.font,
                          fontSize: "17px",
                          fontWeight: 800,
                          margin: "0 0 2px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {activeTabData.label}
                      </h2>
                      <p
                        style={{ margin: 0, color: T.muted, fontSize: "12px" }}
                      >
                        {activeTabData.desc}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })()}

          {/* Variable chips — shown only on template tab */}
          {activeTab === "blocks" && (
            <div
              style={{
                padding: "10px 26px",
                borderBottom: `1px solid ${T.border}`,
                background: "rgba(0,0,0,0.18)",
                display: "flex",
                gap: "5px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: T.dim,
                  fontWeight: 700,
                  flexShrink: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Variables
              </span>
              {VARS.map(([v, color]) => (
                <button
                  key={v}
                  onClick={() => copyVar(v)}
                  title={`Click to copy ${v}`}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    border: "none",
                    background: copiedVar === v ? color + "35" : color + "16",
                    color: copiedVar === v ? "#fff" : color,
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    transition: "all 0.15s",
                    outline: copiedVar === v ? `1px solid ${color}` : "none",
                  }}
                >
                  {copiedVar === v ? "✓" : v}
                </button>
              ))}
              <span
                style={{ fontSize: "10px", color: T.dim, marginLeft: "2px" }}
              >
                · click to copy
              </span>
            </div>
          )}

          {/* Tab content */}
          <div style={{ padding: "22px 26px" }}>
            {isLoading ? (
              <div style={{ display: "grid", gap: "10px" }}>
                {[1, 0.82, 0.93, 0.68, 0.88].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "52px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.04)",
                      width: `${w * 100}%`,
                      animation: `shimmer 1.5s ease-in-out ${i * 0.12}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div key={activeTab} style={{ animation: "fadeUp 0.22s ease" }}>
                {activeTab === "core" && (
                  <CoreSettings
                    settings={localSettings}
                    onUpdate={updateField}
                    onTest={handleTest}
                    testResult={testResult}
                    testing={testing}
                  />
                )}
                {activeTab === "blocks" && (
                  <TelegramBlockEditor onChange={() => {}} />
                )}
                {activeTab === "design" && (
                  <DesignControls
                    design={design}
                    onChange={(d) => {
                      setDesign(d);
                      setIsDirty(true);
                    }}
                  />
                )}
                {activeTab === "buttons" && (
                  <TelegramButtonDesigner
                    settings={localSettings}
                    onUpdate={(updates) => {
                      Object.entries(updates).forEach(([k, v]) =>
                        updateField(k, v),
                      );
                    }}
                  />
                )}
                {activeTab === "presets" && (
                  <TelegramPresetGallery onApply={applyPreset} />
                )}
                {activeTab === "ai" && (
                  <TelegramAIPanel
                    appContext="App: Spotify Premium MOD APK\nFeatures: Premium Unlocked, No Ads, Offline Downloads\nVersion: 8.9.12 MOD\nSize: 34 MB\nAndroid: 6.0+"
                    onAccept={(text) => {
                      if (typeof navigator !== "undefined")
                        navigator.clipboard?.writeText(text);
                    }}
                  />
                )}
                {activeTab === "analytics" && <TelegramAnalytics />}
                {activeTab === "channels" && (
                  <TelegramChannelManager
                    mainSettings={localSettings}
                    onMainSettingsUpdate={(updates) => {
                      Object.entries(updates).forEach(([k, v]) => {
                        if (v !== undefined) updateField(k, v);
                      });
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Preview + Validation ── */}
        <div
          className="tg-right"
          style={{
            position: "sticky",
            top: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Preview card */}
          <div
            style={{
              background: T.surface,
              borderRadius: T.radius,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "13px 17px",
                borderBottom: `1px solid ${T.border}`,
                background: "rgba(255,255,255,0.01)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Eye size={14} color={T.blue} />
              <span
                style={{ fontSize: "12px", fontWeight: 700, color: "#B0C0D0" }}
              >
                Live Preview
              </span>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 9px",
                  background: "rgba(42,171,238,0.08)",
                  borderRadius: "8px",
                  border: "1px solid rgba(42,171,238,0.15)",
                }}
              >
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: T.blue,
                    animation: "pulseBlue 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{ fontSize: "10px", color: T.blue, fontWeight: 600 }}
                >
                  Real-time
                </span>
              </div>
            </div>
            <div style={{ padding: "13px" }}>
              <TelegramPreview settings={localSettings} />
            </div>
          </div>

          {/* Validation panel */}
          <ValidationPanel settings={localSettings} message={previewMsg} />

          {/* Dirty / save feedback */}
          {isDirty && saveState === "idle" && (
            <div
              style={{
                padding: "11px 15px",
                background: "rgba(255,165,0,0.06)",
                border: "1px solid rgba(255,165,0,0.18)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "9px",
                animation: "fadeUp 0.3s ease",
              }}
            >
              <AlertTriangle size={15} color={T.gold} />
              <span style={{ fontSize: "12px", color: "#7A8A9A", flex: 1 }}>
                Unsaved changes
              </span>
              <button
                onClick={() => saveMutation.mutate()}
                style={{
                  padding: "5px 14px",
                  background: T.blue,
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: T.font,
                }}
              >
                Save
              </button>
            </div>
          )}
          {saveState === "saved" && (
            <div
              style={{
                padding: "11px 15px",
                background: "rgba(61,220,132,0.07)",
                border: "1px solid rgba(61,220,132,0.2)",
                borderRadius: "12px",
                fontSize: "13px",
                color: T.green,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeUp 0.3s ease",
              }}
            >
              <CheckCircle size={15} /> Settings saved!
            </div>
          )}
          {saveState === "error" && (
            <div
              style={{
                padding: "11px 15px",
                background: "rgba(255,107,107,0.07)",
                border: "1px solid rgba(255,107,107,0.2)",
                borderRadius: "12px",
                fontSize: "13px",
                color: T.red,
              }}
            >
              ❌ Save failed — please try again.
            </div>
          )}
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:0.2; } 50% { opacity:0.55; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGreen { 0%,100% { box-shadow:0 0 0 0 rgba(61,220,132,0.5); } 50% { box-shadow:0 0 0 7px rgba(61,220,132,0); } }
        @keyframes pulseBlue { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes orb1 { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-14px) scale(1.08); } }
        @keyframes orb2 { 0%,100% { transform:translateY(0); } 50% { transform:translateY(10px); } }
        @keyframes orb3 { 0%,100% { transform:translateY(0) translateX(0); } 50% { transform:translateY(-8px) translateX(8px); } }

        @media (max-width:1280px) {
          .tg-grid { grid-template-columns: 200px 1fr !important; }
          .tg-right { display: none !important; }
        }
        @media (max-width:960px) {
          .tg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
