"use client";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CHAR_LIMIT = 4096;

function validate(settings, message) {
  const warnings = [];
  const errors = [];
  const infos = [];

  const botToken = settings.telegram_bot_token || "";
  const chatId = settings.telegram_chat_id || "";
  const downloadUrl =
    settings.telegram_download_url || settings.download_url || "";
  const hashtags = settings.telegram_default_hashtags || "";
  const msgLen = (message || "").length;

  // Errors (blocking)
  if (!botToken)
    errors.push({
      id: "no_token",
      label: "Bot Token missing",
      detail: "Required to post to Telegram. Get from @BotFather.",
    });
  if (!chatId)
    errors.push({
      id: "no_chat",
      label: "Chat ID missing",
      detail: "Add your channel username (@channel) or numeric ID.",
    });

  // Warnings (non-blocking)
  if (msgLen > CHAR_LIMIT) {
    warnings.push({
      id: "too_long",
      label: `Message too long (${msgLen}/${CHAR_LIMIT} chars)`,
      detail: "Telegram will reject messages over 4096 chars.",
    });
  } else if (msgLen > 3500) {
    warnings.push({
      id: "near_limit",
      label: `Message approaching limit (${msgLen}/${CHAR_LIMIT})`,
      detail: "Consider trimming features list or changelog.",
    });
  }
  if (!downloadUrl && settings.telegram_include_download_button !== "false") {
    warnings.push({
      id: "no_dl_url",
      label: "No download URL configured",
      detail: "Download button will use default site URL.",
    });
  }
  if (settings.telegram_include_image !== "false" && !settings.icon_url) {
    warnings.push({
      id: "no_image",
      label: "No app icon will be sent",
      detail: "App has no icon — post will be text-only.",
    });
  }

  // Button validation
  const btns = settings.telegram_buttons || [];
  if (Array.isArray(btns)) {
    btns.forEach((btn, i) => {
      if (btn.url && !btn.url.startsWith("http")) {
        warnings.push({
          id: `btn_url_${i}`,
          label: `Button "${btn.label || i + 1}": invalid URL`,
          detail: "Button URLs must start with http:// or https://",
        });
      }
      if (!btn.label) {
        warnings.push({
          id: `btn_no_label_${i}`,
          label: `Button ${i + 1} has no label`,
          detail: "Empty button labels will break the inline keyboard.",
        });
      }
    });
  }

  // Variable checks
  const tpl = settings.telegram_template || "";
  const vars = tpl.match(/\{([^}]+)\}/g) || [];
  const KNOWN_VARS = [
    "{title}",
    "{version}",
    "{size}",
    "{android}",
    "{developer}",
    "{category}",
    "{updatedAt}",
    "{modFeatures}",
    "{hashtags}",
    "{downloadUrl}",
    "{websiteUrl}",
    "{image}",
    "{changelog}",
  ];
  vars.forEach((v) => {
    if (!KNOWN_VARS.includes(v)) {
      warnings.push({
        id: `unknown_var_${v}`,
        label: `Unknown variable: ${v}`,
        detail: "This variable won't be replaced. Check spelling.",
      });
    }
  });

  // Infos
  if (settings.telegram_silent_posts === "true")
    infos.push({
      id: "silent",
      label: "Silent posting is ON",
      detail: "Posts will not trigger notifications.",
    });
  if (settings.telegram_pin_posts === "true")
    infos.push({
      id: "pin",
      label: "Auto-pin is ON",
      detail: "Each new post will be pinned in the channel.",
    });
  if (msgLen > 0)
    infos.push({
      id: "msg_len",
      label: `Estimated ${msgLen} chars (${Math.round((msgLen / CHAR_LIMIT) * 100)}% of limit)`,
      detail: "",
    });

  return {
    errors,
    warnings,
    infos,
    score: Math.max(0, 100 - errors.length * 30 - warnings.length * 10),
  };
}

function ScoreRing({ score }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#3DDC84" : score >= 50 ? "#FFD700" : "#FF6B6B";

  return (
    <svg width="44" height="44" style={{ flexShrink: 0 }}>
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="4"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.3s" }}
      />
      <text
        x="22"
        y="26"
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontWeight="800"
      >
        {score}
      </text>
    </svg>
  );
}

function Item({ item, type }) {
  const [open, setOpen] = useState(false);
  const colors = {
    error: {
      bg: "rgba(255,107,107,0.07)",
      border: "rgba(255,107,107,0.2)",
      text: "#FF6B6B",
      icon: XCircle,
    },
    warning: {
      bg: "rgba(255,215,0,0.06)",
      border: "rgba(255,215,0,0.18)",
      text: "#FFD700",
      icon: AlertTriangle,
    },
    info: {
      bg: "rgba(42,171,238,0.06)",
      border: "rgba(42,171,238,0.15)",
      text: "#2AABEE",
      icon: Info,
    },
  };
  const c = colors[type];
  const Icon = c.icon;

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "10px",
        marginBottom: "6px",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
    >
      <button
        onClick={() => (item.detail ? setOpen(!open) : null)}
        style={{
          width: "100%",
          padding: "9px 12px",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: item.detail ? "pointer" : "default",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Icon size={14} color={c.text} style={{ flexShrink: 0 }} />
        <span
          style={{
            flex: 1,
            fontSize: "12px",
            fontWeight: 600,
            color: c.text,
            textAlign: "left",
          }}
        >
          {item.label}
        </span>
        {item.detail &&
          (open ? (
            <ChevronUp size={12} color={c.text} />
          ) : (
            <ChevronDown size={12} color={c.text} />
          ))}
      </button>
      {open && item.detail && (
        <div
          style={{
            padding: "0 12px 10px 34px",
            fontSize: "11px",
            color: c.text,
            opacity: 0.7,
            lineHeight: 1.5,
          }}
        >
          {item.detail}
        </div>
      )}
    </div>
  );
}

export default function ValidationPanel({ settings = {}, message = "" }) {
  const [expanded, setExpanded] = useState(true);
  const { errors, warnings, infos, score } = validate(settings, message);
  const total = errors.length + warnings.length;
  const scoreColor =
    score >= 80 ? "#3DDC84" : score >= 50 ? "#FFD700" : "#FF6B6B";

  return (
    <div
      style={{
        background: "rgba(5,10,20,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: `1px solid ${errors.length > 0 ? "rgba(255,107,107,0.2)" : warnings.length > 0 ? "rgba(255,215,0,0.15)" : "rgba(61,220,132,0.15)"}`,
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <ScoreRing score={score} />
        <div style={{ flex: 1, textAlign: "left" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: scoreColor,
              marginBottom: "2px",
            }}
          >
            {errors.length > 0
              ? "⛔ Fix issues before posting"
              : warnings.length > 0
                ? "⚠️ Minor warnings"
                : "✅ Ready to post!"}
          </div>
          <div style={{ fontSize: "11px", color: "#445" }}>
            {errors.length > 0 &&
              `${errors.length} error${errors.length > 1 ? "s" : ""} · `}
            {warnings.length > 0 &&
              `${warnings.length} warning${warnings.length > 1 ? "s" : ""} · `}
            {infos.length} info · Score: {score}/100
          </div>
        </div>
        {total === 0 && <CheckCircle size={18} color="#3DDC84" />}
        {expanded ? (
          <ChevronUp size={16} color="#445" />
        ) : (
          <ChevronDown size={16} color="#445" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div style={{ padding: "0 12px 12px" }}>
          {/* Char progress bar */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                fontSize: "10px",
                color: "#445",
              }}
            >
              <span>Message length</span>
              <span
                style={{ color: message.length > 3500 ? "#FFD700" : "#445" }}
              >
                {message.length} / {CHAR_LIMIT}
              </span>
            </div>
            <div
              style={{
                height: "4px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (message.length / CHAR_LIMIT) * 100)}%`,
                  background:
                    message.length > 3500
                      ? "linear-gradient(90deg, #FFD700, #FF6B6B)"
                      : "linear-gradient(90deg, #3DDC84, #2AABEE)",
                  borderRadius: "2px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {errors.map((e) => (
            <Item key={e.id} item={e} type="error" />
          ))}
          {warnings.map((w) => (
            <Item key={w.id} item={w} type="warning" />
          ))}
          {total === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                fontSize: "12px",
                color: "#3DDC84",
                background: "rgba(61,220,132,0.05)",
                borderRadius: "10px",
              }}
            >
              🎉 All checks passed. Ready to send!
            </div>
          )}
          {infos.map((i) => (
            <Item key={i.id} item={i} type="info" />
          ))}
        </div>
      )}
    </div>
  );
}
