"use client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  TestTube,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield,
  Users,
  Clock,
  Edit3,
} from "lucide-react";

const DEFAULT_CHANNELS = [
  {
    id: "main",
    name: "Main Channel",
    description: "Primary MOD APK channel",
    bot_token: "",
    chat_id: "",
    enabled: true,
    status: "unconfigured",
    schedule: "00:00",
    auto_post: true,
    members: null,
  },
];

// ─── Permissions Badge ─────────────────────────────────────────────────────
function PermBadge({ label, granted }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
        background: granted ? "rgba(61,220,132,0.1)" : "rgba(255,107,107,0.08)",
        border: `1px solid ${granted ? "rgba(61,220,132,0.25)" : "rgba(255,107,107,0.2)"}`,
        color: granted ? "#3DDC84" : "#FF6B6B",
      }}
    >
      <span style={{ fontSize: "10px" }}>{granted ? "✓" : "✗"}</span> {label}
    </div>
  );
}

function ChannelCard({ channel, onUpdate, onDelete, onTest }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(channel);
  const [testing, setTesting] = useState(false);
  const [showPerms, setShowPerms] = useState(false);

  const handleSave = () => {
    onUpdate(local);
    setEditing(false);
  };

  const handleTest = async () => {
    setTesting(true);
    await onTest(local);
    setTesting(false);
  };

  const statusColors = {
    connected: "#3DDC84",
    failed: "#FF6B6B",
    unconfigured: "#555",
    configured: "#FFD700",
    testing: "#4FC3F7",
  };
  const statusColor = statusColors[channel.status] || "#555";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "16px",
        border: `1px solid ${channel.enabled ? "rgba(61,220,132,0.12)" : "rgba(255,255,255,0.07)"}`,
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      {/* Color bar */}
      <div
        style={{
          height: "3px",
          background: channel.enabled
            ? "linear-gradient(90deg, #3DDC84, #4ECDC4)"
            : "rgba(255,255,255,0.05)",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Avatar with gradient */}
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            background: channel.enabled
              ? "linear-gradient(135deg, #2B5278, #3DDC84)"
              : "linear-gradient(135deg, #2B5278, #1C3A5E)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "20px",
            boxShadow: channel.enabled
              ? "0 4px 14px rgba(61,220,132,0.2)"
              : "none",
          }}
        >
          📢
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: "#fff",
              marginBottom: "2px",
            }}
          >
            {channel.name}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#555",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {channel.description}
          </div>
        </div>
        {/* Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 12px",
            borderRadius: "20px",
            background: `${statusColor}12`,
            border: `1px solid ${statusColor}35`,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: statusColor,
              animation:
                channel.status === "connected"
                  ? "channel-pulse 2s ease-in-out infinite"
                  : "none",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: statusColor,
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {channel.status}
          </span>
        </div>
        {/* Toggle */}
        <div
          onClick={() => onUpdate({ ...channel, enabled: !channel.enabled })}
          style={{
            width: "40px",
            height: "22px",
            borderRadius: "11px",
            background: channel.enabled ? "#3DDC84" : "rgba(255,255,255,0.1)",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s",
            flexShrink: 0,
            boxShadow: channel.enabled
              ? "0 0 10px rgba(61,220,132,0.3)"
              : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: channel.enabled ? "21px" : "3px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.3s",
            }}
          />
        </div>
      </div>

      {/* Stats row (if connected) */}
      {channel.status === "connected" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {[
            {
              label: "Members",
              value: channel.members
                ? `${(channel.members / 1000).toFixed(1)}K`
                : "—",
              icon: Users,
            },
            {
              label: "Auto Post",
              value: channel.auto_post ? "ON" : "OFF",
              icon: CheckCircle,
            },
            {
              label: "Schedule",
              value: channel.schedule || "Instant",
              icon: Clock,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  padding: "10px 14px",
                  textAlign: "center",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Icon
                  size={13}
                  color="#3DDC84"
                  style={{ marginBottom: "4px" }}
                />
                <div
                  style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: "10px", color: "#444" }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bot Permissions (if connected) */}
      {channel.status === "connected" && (
        <div
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={() => setShowPerms(!showPerms)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#555",
              fontFamily: "'Inter', sans-serif",
              padding: 0,
            }}
          >
            <Shield size={13} color="#3DDC84" />
            <span style={{ fontWeight: 600 }}>Bot Permissions</span>
            <span style={{ fontSize: "10px" }}>{showPerms ? "▲" : "▼"}</span>
          </button>
          {showPerms && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              <PermBadge label="Post Messages" granted={true} />
              <PermBadge label="Send Media" granted={true} />
              <PermBadge label="Pin Messages" granted={false} />
              <PermBadge label="Edit Messages" granted={true} />
              <PermBadge label="Delete Messages" granted={false} />
            </div>
          )}
        </div>
      )}

      {/* Config fields */}
      {editing ? (
        <div style={{ padding: "18px" }}>
          <div style={{ display: "grid", gap: "13px", marginBottom: "14px" }}>
            <div>
              <div style={fieldLabel}>Channel Name</div>
              <input
                value={local.name}
                onChange={(e) => setLocal({ ...local, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={fieldLabel}>
                Bot Token{" "}
                <span style={{ color: "#FF6B6B", fontSize: "10px" }}>
                  ● Encrypted
                </span>
              </div>
              <input
                value={local.bot_token}
                onChange={(e) =>
                  setLocal({ ...local, bot_token: e.target.value })
                }
                style={inputStyle}
                type="password"
                placeholder="1234567890:ABCDefGhIJK..."
              />
            </div>
            <div>
              <div style={fieldLabel}>Chat ID / Username</div>
              <input
                value={local.chat_id}
                onChange={(e) =>
                  setLocal({ ...local, chat_id: e.target.value })
                }
                style={inputStyle}
                placeholder="@mychannel or -1001234567890"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <div style={fieldLabel}>Schedule (UTC)</div>
                <input
                  value={local.schedule}
                  onChange={(e) =>
                    setLocal({ ...local, schedule: e.target.value })
                  }
                  style={inputStyle}
                  type="time"
                />
              </div>
              <div>
                <div style={fieldLabel}>Post Mode</div>
                <select
                  value={local.auto_post ? "auto" : "manual"}
                  onChange={(e) =>
                    setLocal({ ...local, auto_post: e.target.value === "auto" })
                  }
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="auto">Auto (on publish)</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: "10px",
                background: "#3DDC84",
                border: "none",
                borderRadius: "10px",
                color: "#1A1A2E",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "10px 20px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#888",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "12px 18px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => setEditing(true)} style={actionBtn("#555")}>
            <Edit3 size={13} /> Configure
          </button>
          <button
            onClick={handleTest}
            disabled={!channel.bot_token || !channel.chat_id || testing}
            style={actionBtn(
              "#4ECDC4",
              !channel.bot_token || !channel.chat_id || testing,
            )}
          >
            {testing ? (
              <>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    border: "2px solid #4ECDC4",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />{" "}
                Testing...
              </>
            ) : (
              <>
                <TestTube size={13} /> Test Connection
              </>
            )}
          </button>
          {channel.id !== "main" && (
            <button
              onClick={() => onDelete(channel.id)}
              style={{ ...actionBtn("#FF6B6B"), marginLeft: "auto" }}
            >
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TelegramChannelManager({
  mainSettings,
  onMainSettingsUpdate,
}) {
  const [channels, setChannels] = useState([
    {
      ...DEFAULT_CHANNELS[0],
      bot_token: mainSettings?.telegram_bot_token ? "••••••••••" : "",
      chat_id: mainSettings?.telegram_chat_id || "",
      status: mainSettings?.telegram_bot_token ? "configured" : "unconfigured",
      enabled: mainSettings?.telegram_enabled === "true",
    },
  ]);
  const [testResults, setTestResults] = useState({});

  const updateChannel = (updated) => {
    setChannels((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    // Sync main channel config back to settings
    if (updated.id === "main") {
      onMainSettingsUpdate?.({
        telegram_enabled: updated.enabled ? "true" : "false",
        telegram_bot_token:
          updated.bot_token !== "••••••••••" ? updated.bot_token : undefined,
        telegram_chat_id: updated.chat_id,
      });
    }
  };

  const deleteChannel = (id) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  const testChannel = async (channel) => {
    const result = { success: false, message: "Testing...", id: channel.id };
    try {
      const res = await fetch("/api/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_token:
            channel.bot_token !== "••••••••••"
              ? channel.bot_token
              : mainSettings?.telegram_bot_token,
          chat_id: channel.chat_id,
        }),
      });
      const data = await res.json();
      result.success = data.success;
      result.message = data.success
        ? `✅ Connected via @${data.bot_name}`
        : `❌ ${data.error}`;
      result.hint = data.hint;
    } catch (err) {
      result.message = `❌ Network error: ${err.message}`;
    }
    setTestResults((prev) => ({ ...prev, [channel.id]: result }));
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id
          ? { ...c, status: result.success ? "connected" : "failed" }
          : c,
      ),
    );
  };

  const addChannel = () => {
    setChannels((prev) => [
      ...prev,
      {
        id: `ch_${Date.now()}`,
        name: `Channel ${prev.length + 1}`,
        description: "Secondary channel",
        bot_token: "",
        chat_id: "",
        enabled: false,
        status: "unconfigured",
        schedule: "12:00",
        auto_post: false,
        members: null,
      },
    ]);
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>
            Channel Management
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
            Manage multiple Telegram channels from one dashboard
          </p>
        </div>
        <button
          onClick={addChannel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            background: "rgba(61,220,132,0.1)",
            border: "1px solid rgba(61,220,132,0.3)",
            borderRadius: "10px",
            color: "#3DDC84",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Plus size={16} /> Add Channel
        </button>
      </div>

      {/* Test result banners */}
      {Object.values(testResults).map((r) => (
        <div
          key={r.id}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "12px",
            background: r.success
              ? "rgba(61,220,132,0.08)"
              : "rgba(255,107,107,0.08)",
            border: `1px solid ${r.success ? "rgba(61,220,132,0.25)" : "rgba(255,107,107,0.25)"}`,
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {r.success ? (
            <CheckCircle size={16} color="#3DDC84" />
          ) : (
            <XCircle size={16} color="#FF6B6B" />
          )}
          <div>
            <span
              style={{
                fontSize: "13px",
                color: r.success ? "#3DDC84" : "#FF6B6B",
                fontWeight: 600,
              }}
            >
              {r.message}
            </span>
            {r.hint && (
              <div
                style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}
              >
                💡 {r.hint}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Channel list */}
      <div style={{ display: "grid", gap: "14px" }}>
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            onUpdate={updateChannel}
            onDelete={deleteChannel}
            onTest={testChannel}
          />
        ))}
      </div>

      {/* Info box */}
      <div
        style={{
          marginTop: "20px",
          padding: "16px 20px",
          background: "rgba(84,164,243,0.07)",
          border: "1px solid rgba(84,164,243,0.2)",
          borderRadius: "12px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <Shield
          size={18}
          color="#54A4F3"
          style={{ flexShrink: 0, marginTop: "1px" }}
        />
        <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.6 }}>
          <strong style={{ color: "#C0C0C0" }}>Security:</strong> Bot tokens are
          encrypted in the database and never exposed to the frontend. Each
          channel operates independently with its own credentials.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes channel-pulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61,220,132,0.4); } 50% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(61,220,132,0); } }
      `}</style>
    </div>
  );
}

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
const actionBtn = (color, disabled) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "7px 14px",
  borderRadius: "8px",
  border: `1px solid ${color}30`,
  background: `${color}10`,
  color,
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "12px",
  fontWeight: 600,
  opacity: disabled ? 0.5 : 1,
  fontFamily: "'Inter', sans-serif",
});
