"use client";
import { useState } from "react";
import {
  Sparkles,
  Check,
  X,
  RefreshCw,
  Wand2,
  Hash,
  Type,
  AlignLeft,
  Zap,
  Crown,
  Gamepad2,
  Bot,
} from "lucide-react";

const TONES = [
  {
    id: "professional",
    label: "Professional",
    icon: "💼",
    desc: "Clean & authoritative",
  },
  { id: "gaming", label: "Gaming", icon: "🎮", desc: "Bold & energetic" },
  { id: "hacker", label: "Hacker", icon: "💻", desc: "Tech & matrix style" },
  { id: "anime", label: "Anime", icon: "✨", desc: "Kawaii & expressive" },
  { id: "minimal", label: "Minimal", icon: "◼", desc: "Clean & wordless" },
  { id: "viral", label: "Viral", icon: "🔥", desc: "FOMO & engagement" },
  { id: "luxury", label: "Luxury", icon: "👑", desc: "Premium & gold" },
];

const ACTIONS = [
  {
    id: "caption",
    label: "Generate Caption",
    icon: Type,
    color: "#3DDC84",
    prompt: "Generate a Telegram channel caption",
  },
  {
    id: "clicks",
    label: "Optimize Clicks",
    icon: Zap,
    color: "#FFD700",
    prompt: "Rewrite to maximize click-through rate",
  },
  {
    id: "format",
    label: "Clean Formatting",
    icon: AlignLeft,
    color: "#4ECDC4",
    prompt: "Clean up and improve formatting",
  },
  {
    id: "hashtags",
    label: "SEO Hashtags",
    icon: Hash,
    color: "#FF6B6B",
    prompt: "Generate optimized SEO hashtags",
  },
  {
    id: "emojis",
    label: "Add Emojis",
    icon: Sparkles,
    color: "#DDA0DD",
    prompt: "Add relevant emojis to enhance engagement",
  },
  {
    id: "cta",
    label: "Generate CTA",
    icon: Crown,
    color: "#FF9500",
    prompt: "Write a compelling call-to-action",
  },
  {
    id: "rewrite",
    label: "Rewrite Premium",
    icon: Wand2,
    color: "#FF4081",
    prompt: "Completely rewrite in premium style",
  },
];

function buildPrompt(action, tone, context) {
  const toneInstructions = {
    professional: "Use a clean, professional tone with proper formatting.",
    gaming:
      "Use an energetic gaming style with bold text and gaming emojis like 🎮⚡💎.",
    hacker:
      "Use a hacker/tech style with monospace formatting and matrix-style language.",
    anime: "Use an anime/kawaii style with cute expressions and soft emojis.",
    minimal: "Use a minimal style — clean, no clutter, max 5 lines.",
    viral: "Write for maximum viral engagement, create FOMO, use urgency.",
    luxury:
      "Use a luxury/premium style with gold and diamond emojis, elite language.",
  };

  return `You are a Telegram marketing expert for a MOD APK store called "Mod Apk Store" (modapkstore.pro).

Task: ${action.prompt} for this app post.

Tone: ${tone} — ${toneInstructions[tone] || ""}

App Context:
${context || "App Name: Spotify Premium MOD APK\nFeatures: Premium Unlocked, No Ads, Offline Downloads\nVersion: 8.9.12 MOD\nSize: 34 MB\nAndroid: 6.0+"}

Rules:
- Use HTML formatting: <b>bold</b>, <i>italic</i>, <code>code</code>
- Use relevant emojis
- Max 1500 characters
- Include relevant hashtags at the end
- Make it Telegram-channel ready
- Do NOT include markdown (##, **, etc.) — use HTML only

Output ONLY the Telegram message text, nothing else.`;
}

export default function TelegramAIPanel({
  currentMessage = "",
  appContext = "",
  onAccept,
}) {
  const [selectedTone, setSelectedTone] = useState("professional");
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [context, setContext] = useState(
    appContext ||
      "App: Spotify Premium MOD APK\nFeatures: Premium Unlocked, No Ads, Offline Downloads\nVersion: 8.9.12 MOD\nSize: 34 MB\nAndroid: 6.0+",
  );
  const [showContext, setShowContext] = useState(false);
  const [copied, setCopied] = useState(false);

  const runAI = async (action) => {
    setActiveAction(action.id);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = buildPrompt(
        action,
        selectedTone,
        context || currentMessage,
      );
      const res = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || data.result || "";

      if (!text) throw new Error("No response from AI");
      setResult({ text, action: action.label, tone: selectedTone });
      setHistory((prev) => [
        { text, action: action.label, tone: selectedTone, id: Date.now() },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      console.error("AI error:", err);
      setError(err.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      onAccept?.(result.text);
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (result && typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          background:
            "linear-gradient(135deg, rgba(61,220,132,0.08), rgba(255,64,129,0.08))",
          borderRadius: "14px",
          border: "1px solid rgba(61,220,132,0.15)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3DDC84, #FF4081)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bot size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>
            AI Smart Content Engine
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Powered by GPT-4 · Generate premium Telegram posts instantly
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            background: "rgba(61,220,132,0.1)",
            border: "1px solid rgba(61,220,132,0.2)",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#3DDC84",
              animation: "ai-pulse 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: "11px", color: "#3DDC84", fontWeight: 600 }}>
            Online
          </span>
        </div>
      </div>

      {/* App Context Editor */}
      <div
        style={{
          marginBottom: "20px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setShowContext(!showContext)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Inter', sans-serif",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#888" }}>
            📋 App Context
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#444",
              flex: 1,
            }}
          >
            — the AI uses this to generate content
          </span>
          <span style={{ fontSize: "11px", color: "#555" }}>
            {showContext ? "▲" : "▼"}
          </span>
        </button>
        {showContext && (
          <div style={{ padding: "0 16px 16px" }}>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={5}
              placeholder="App: App Name MOD APK\nFeatures: Premium Unlocked, No Ads\nVersion: 1.0 MOD\nSize: 50 MB\nAndroid: 6.0+"
              style={{
                width: "100%",
                padding: "12px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#C0C0C0",
                fontSize: "12px",
                fontFamily: "monospace",
                lineHeight: 1.7,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(61,220,132,0.4)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
            <div style={{ fontSize: "11px", color: "#444", marginTop: "5px" }}>
              Provide app details — name, features, version, size, Android
              version — for best AI results
            </div>
          </div>
        )}
      </div>

      {/* Tone Selector */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Writing Tone
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              style={{
                padding: "7px 12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                background:
                  selectedTone === tone.id
                    ? "rgba(61,220,132,0.15)"
                    : "rgba(255,255,255,0.04)",
                color: selectedTone === tone.id ? "#3DDC84" : "#666",
                outline:
                  selectedTone === tone.id
                    ? "1px solid rgba(61,220,132,0.4)"
                    : "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "14px" }}>{tone.icon}</span>
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: "8px",
          }}
        >
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            const isActive = activeAction === action.id && loading;
            return (
              <button
                key={action.id}
                onClick={() => runAI(action)}
                disabled={loading}
                style={{
                  padding: "11px 14px",
                  borderRadius: "11px",
                  border: `1px solid ${action.color}30`,
                  background: isActive
                    ? `${action.color}15`
                    : "rgba(255,255,255,0.03)",
                  color: isActive ? action.color : "#666",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s",
                  textAlign: "left",
                  opacity: loading && activeAction !== action.id ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = `${action.color}12`;
                    e.currentTarget.style.color = action.color;
                    e.currentTarget.style.borderColor = `${action.color}50`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && activeAction !== action.id) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "#666";
                    e.currentTarget.style.borderColor = `${action.color}30`;
                  }
                }}
              >
                {isActive ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: `2px solid ${action.color}`,
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Icon
                    size={16}
                    style={{ flexShrink: 0, color: action.color }}
                  />
                )}
                {isActive ? "Generating..." : action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(255,107,107,0.08)",
            border: "1px solid rgba(255,107,107,0.25)",
            borderRadius: "12px",
            marginBottom: "14px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <X
            size={16}
            color="#FF6B6B"
            style={{ flexShrink: 0, marginTop: "1px" }}
          />
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#FF6B6B",
                fontWeight: 600,
                marginBottom: "3px",
              }}
            >
              Generation Failed
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>{error}</div>
          </div>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div
          style={{
            padding: "18px",
            background: "rgba(61,220,132,0.04)",
            borderRadius: "12px",
            border: "1px solid rgba(61,220,132,0.1)",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                border: "2px solid #3DDC84",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span
              style={{ fontSize: "13px", color: "#3DDC84", fontWeight: 600 }}
            >
              AI is crafting your message...
            </span>
          </div>
          {[100, 80, 90, 60].map((w, i) => (
            <div
              key={i}
              style={{
                height: "11px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "4px",
                marginBottom: "7px",
                width: `${w}%`,
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div
          style={{
            padding: "18px",
            background: "rgba(61,220,132,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(61,220,132,0.2)",
            marginBottom: "14px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={15} color="#3DDC84" />
              <span
                style={{ fontSize: "12px", color: "#3DDC84", fontWeight: 700 }}
              >
                {result.action} · {result.tone} tone
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: "6px 14px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: copied ? "#3DDC84" : "#888",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {copied ? <Check size={12} /> : <span>📋</span>}{" "}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleAccept}
                style={{
                  padding: "6px 14px",
                  background: "#3DDC84",
                  border: "none",
                  borderRadius: "8px",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Check size={13} /> Use This
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  runAI(
                    ACTIONS.find((a) => a.id === activeAction) || ACTIONS[0],
                  );
                }}
                style={{
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#888",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <RefreshCw size={12} /> Retry
              </button>
              <button
                onClick={() => setResult(null)}
                style={{
                  padding: "6px 8px",
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,107,107,0.2)",
                  borderRadius: "8px",
                  color: "#FF6B6B",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#C0C0C0",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              padding: "12px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
              maxHeight: "280px",
              overflow: "auto",
            }}
          >
            {result.text}
          </pre>
          <div
            style={{
              marginTop: "6px",
              fontSize: "11px",
              color: "#444",
              display: "flex",
              gap: "12px",
            }}
          >
            <span>{result.text.length} chars</span>
            <span>{result.text.split(/\s+/).length} words</span>
            <span
              style={{
                color: result.text.length > 1500 ? "#FF6B6B" : "#555",
              }}
            >
              {result.text.length > 1500
                ? "⚠️ Too long for Telegram"
                : "✓ Length OK"}
            </span>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#444",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Recent Generations
          </div>
          <div style={{ display: "grid", gap: "6px" }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onClick={() => onAccept?.(item.text)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(61,220,132,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{ fontSize: "11px", color: "#555", fontWeight: 600 }}
                  >
                    {item.action} · {item.tone}
                  </span>
                  <span style={{ fontSize: "10px", color: "#3DDC84" }}>
                    Click to use →
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                  }}
                >
                  {item.text.slice(0, 90)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ai-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
