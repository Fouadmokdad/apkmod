"use client";
import { useState, useCallback } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

const DEFAULT_BLOCKS = [
  {
    id: "title",
    type: "title",
    label: "🔥 Title / App Name",
    enabled: true,
    spacing: 1,
    collapsed: false,
  },
  {
    id: "version",
    type: "version",
    label: "📌 Version Info",
    enabled: true,
    spacing: 1,
    collapsed: false,
  },
  {
    id: "features",
    type: "features",
    label: "✨ MOD Features List",
    enabled: true,
    spacing: 1,
    collapsed: false,
  },
  {
    id: "size",
    type: "size",
    label: "📦 APK Size & Android",
    enabled: true,
    spacing: 1,
    collapsed: false,
  },
  {
    id: "changelog",
    type: "changelog",
    label: "🆕 Changelog",
    enabled: false,
    spacing: 1,
    collapsed: true,
  },
  {
    id: "cta",
    type: "cta",
    label: "🌐 Download Link CTA",
    enabled: true,
    spacing: 1,
    collapsed: false,
  },
  {
    id: "divider1",
    type: "divider",
    label: "─── Divider Line",
    enabled: false,
    spacing: 0,
    collapsed: true,
  },
  {
    id: "hashtags",
    type: "hashtags",
    label: "#️⃣ Hashtags",
    enabled: true,
    spacing: 0,
    collapsed: false,
  },
  {
    id: "buttons",
    type: "buttons",
    label: "⬇️ Inline Buttons",
    enabled: true,
    spacing: 0,
    collapsed: false,
  },
  {
    id: "developer",
    type: "developer",
    label: "👨‍💻 Developer Info",
    enabled: false,
    spacing: 0,
    collapsed: true,
  },
  {
    id: "date",
    type: "date",
    label: "📅 Post Date",
    enabled: false,
    spacing: 0,
    collapsed: true,
  },
  {
    id: "warning",
    type: "warning",
    label: "⚠️ Warning Banner",
    enabled: false,
    spacing: 1,
    collapsed: true,
  },
];

const BLOCK_PREVIEWS = {
  title: "🔥 **App Name MOD APK**",
  version: "📌 **Version:** 1.0 MOD",
  features: "✨ Premium Unlocked\n🚫 No Ads\n📥 Offline Mode",
  size: "📦 **Size:** 50 MB  📱 **Android:** 7.0+",
  changelog: "🆕 **Changelog:**\n- Updated UI\n- Bug fixes",
  cta: "🌐 [Download on modapkstore.pro]",
  divider: "─────────────────",
  hashtags: "#MODAPK #Premium #AndroidApps",
  buttons: "[ ⬇️ Download APK ]  [ 🌐 Website ]",
  developer: "👨‍💻 Developer: Spotify AB",
  date: "📅 Posted: May 28, 2025",
  warning: "⚠️ Uninstall original app first!",
};

const ADD_BLOCK_TYPES = [
  { type: "title", label: "🔥 Title / App Name" },
  { type: "version", label: "📌 Version Info" },
  { type: "features", label: "✨ MOD Features List" },
  { type: "size", label: "📦 APK Size & Android" },
  { type: "changelog", label: "🆕 Changelog" },
  { type: "cta", label: "🌐 Download Link CTA" },
  { type: "divider", label: "─── Divider Line" },
  { type: "hashtags", label: "#️⃣ Hashtags" },
  { type: "buttons", label: "⬇️ Inline Buttons" },
  { type: "developer", label: "👨‍💻 Developer Info" },
  { type: "date", label: "📅 Post Date" },
  { type: "warning", label: "⚠️ Warning Banner" },
];

function DropZone({ visible, onDrop, dragOverId, myId }) {
  const isOver = dragOverId === `drop_${myId}`;
  if (!visible) return null;
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={onDrop}
      style={{
        height: isOver ? "32px" : "6px",
        margin: "2px 0",
        borderRadius: "6px",
        background: isOver ? "rgba(61,220,132,0.12)" : "transparent",
        border: isOver
          ? "1px dashed rgba(61,220,132,0.5)"
          : "1px dashed transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        cursor: isOver ? "copy" : "default",
      }}
    >
      {isOver && (
        <span style={{ fontSize: "11px", color: "#3DDC84", fontWeight: 600 }}>
          + Drop here
        </span>
      )}
    </div>
  );
}

function BlockItem({
  block,
  index,
  total,
  onMove,
  onToggle,
  onRemove,
  onDuplicate,
  draggedId,
  dragOverId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onDropZone,
}) {
  const isDragged = draggedId === block.id;

  return (
    <div>
      <DropZone
        visible={!!draggedId}
        myId={block.id + "_before"}
        dragOverId={dragOverId}
        onDrop={(e) => onDropZone(e, index)}
      />
      <div
        draggable
        onDragStart={(e) => onDragStart(e, block.id)}
        onDragOver={(e) => onDragOver(e, block.id)}
        onDragEnd={onDragEnd}
        onDrop={(e) => onDrop(e, block.id)}
        style={{
          background: isDragged
            ? "rgba(61,220,132,0.06)"
            : "rgba(255,255,255,0.03)",
          border: isDragged
            ? "1px solid rgba(61,220,132,0.5)"
            : "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px",
          opacity: isDragged ? 0.5 : block.enabled ? 1 : 0.55,
          transition: "all 0.2s ease",
          cursor: "default",
          boxShadow: isDragged ? "0 0 14px rgba(61,220,132,0.15)" : "none",
        }}
      >
        {/* Block header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              color: "#333",
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              padding: "2px",
            }}
            title="Drag to reorder"
          >
            <GripVertical size={15} />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: "13px",
              fontWeight: 600,
              color: block.enabled ? "#C0C0C0" : "#555",
              fontFamily: "monospace",
            }}
          >
            {block.label}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => onMove(block.id, -1)}
              disabled={index === 0}
              style={iconBtn}
              title="Move up"
            >
              <ChevronUp size={13} />
            </button>
            <button
              onClick={() => onMove(block.id, 1)}
              disabled={index === total - 1}
              style={iconBtn}
              title="Move down"
            >
              <ChevronDown size={13} />
            </button>
            <button
              onClick={() => onToggle(block.id, "enabled")}
              style={{ ...iconBtn, color: block.enabled ? "#3DDC84" : "#444" }}
              title={block.enabled ? "Hide" : "Show"}
            >
              {block.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button
              onClick={() => onDuplicate(block.id)}
              style={iconBtn}
              title="Duplicate"
            >
              <Copy size={13} />
            </button>
            {block.id.includes("_copy") && (
              <button
                onClick={() => onRemove(block.id)}
                style={{ ...iconBtn, color: "#FF6B6B" }}
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <div
            onClick={() => onToggle(block.id, "enabled")}
            style={{
              width: "32px",
              height: "18px",
              borderRadius: "9px",
              cursor: "pointer",
              flexShrink: 0,
              background: block.enabled ? "#3DDC84" : "rgba(255,255,255,0.1)",
              transition: "all 0.2s",
              position: "relative",
              boxShadow: block.enabled
                ? "0 0 8px rgba(61,220,132,0.3)"
                : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: block.enabled ? "16px" : "2px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </div>
        </div>

        {/* Block preview (if enabled) */}
        {block.enabled && (
          <div style={{ padding: "0 14px 12px 38px" }}>
            <div
              style={{
                padding: "7px 10px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                borderLeft: "3px solid rgba(61,220,132,0.3)",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: "#666",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {BLOCK_PREVIEWS[block.type] || ""}
              </pre>
            </div>
            {/* Spacing slider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "7px",
              }}
            >
              <span
                style={{ fontSize: "10px", color: "#444", fontWeight: 600 }}
              >
                Spacing:
              </span>
              <input
                type="range"
                min="0"
                max="3"
                value={block.spacing}
                onChange={(e) =>
                  onToggle(block.id, "spacing", parseInt(e.target.value))
                }
                style={{
                  flex: 1,
                  accentColor: "#3DDC84",
                  height: "3px",
                  cursor: "pointer",
                }}
              />
              <span
                style={{ fontSize: "10px", color: "#555", minWidth: "12px" }}
              >
                {block.spacing}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TelegramBlockEditor({ onChange }) {
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const updateBlocks = useCallback(
    (newBlocks) => {
      setBlocks(newBlocks);
      const template = newBlocks
        .filter((b) => b.enabled)
        .map((b) => {
          const nl = "\n".repeat(b.spacing + 1);
          return (BLOCK_PREVIEWS[b.type] || "") + nl;
        })
        .join("");
      onChange?.(template, newBlocks);
    },
    [onChange],
  );

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  };

  const onDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const onDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      onDragEnd();
      return;
    }
    const newBlocks = [...blocks];
    const fromIdx = newBlocks.findIndex((b) => b.id === draggedId);
    const toIdx = newBlocks.findIndex((b) => b.id === targetId);
    const [removed] = newBlocks.splice(fromIdx, 1);
    newBlocks.splice(toIdx, 0, removed);
    onDragEnd();
    updateBlocks(newBlocks);
  };

  const onDropZone = (e, toIndex) => {
    e.preventDefault();
    if (!draggedId) {
      onDragEnd();
      return;
    }
    const newBlocks = [...blocks];
    const fromIdx = newBlocks.findIndex((b) => b.id === draggedId);
    if (fromIdx === -1) {
      onDragEnd();
      return;
    }
    const [removed] = newBlocks.splice(fromIdx, 1);
    const insertIdx = fromIdx < toIndex ? toIndex - 1 : toIndex;
    newBlocks.splice(Math.max(0, insertIdx), 0, removed);
    onDragEnd();
    updateBlocks(newBlocks);
  };

  const onMove = (id, direction) => {
    const newBlocks = [...blocks];
    const idx = newBlocks.findIndex((b) => b.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[newIdx]] = [newBlocks[newIdx], newBlocks[idx]];
    updateBlocks(newBlocks);
  };

  const onToggle = (id, field, value) => {
    const newBlocks = blocks.map((b) =>
      b.id === id
        ? { ...b, [field]: value !== undefined ? value : !b[field] }
        : b,
    );
    updateBlocks(newBlocks);
  };

  const onDuplicate = (id) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const orig = blocks[idx];
    const copy = {
      ...orig,
      id: `${orig.id}_copy_${Date.now()}`,
      label: `${orig.label} (copy)`,
    };
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, copy);
    updateBlocks(newBlocks);
  };

  const onRemove = (id) => {
    updateBlocks(blocks.filter((b) => b.id !== id));
  };

  const resetToDefault = () => updateBlocks(DEFAULT_BLOCKS);

  const addBlock = (type) => {
    const def = ADD_BLOCK_TYPES.find((t) => t.type === type);
    const newBlock = {
      id: `${type}_${Date.now()}`,
      type,
      label: def.label,
      enabled: true,
      spacing: 1,
      collapsed: false,
    };
    updateBlocks([...blocks, newBlock]);
    setShowAddMenu(false);
  };

  const enabledCount = blocks.filter((b) => b.enabled).length;

  return (
    <div>
      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          background: "rgba(61,220,132,0.05)",
          borderRadius: "10px",
          border: "1px solid rgba(61,220,132,0.1)",
          marginBottom: "14px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#3DDC84",
            }}
          />
          <span style={{ fontSize: "12px", color: "#3DDC84", fontWeight: 600 }}>
            {enabledCount} blocks active
          </span>
        </div>
        <span style={{ fontSize: "12px", color: "#444" }}>
          Drag to reorder · Toggle to show/hide
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
          {/* Add block */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                background: "rgba(61,220,132,0.1)",
                border: "1px solid rgba(61,220,132,0.3)",
                borderRadius: "7px",
                color: "#3DDC84",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Plus size={12} /> Add Block
            </button>
            {showAddMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: "#16213E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "6px",
                  width: "220px",
                  zIndex: 100,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {ADD_BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      borderRadius: "8px",
                      color: "#888",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      textAlign: "left",
                      fontFamily: "monospace",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(61,220,132,0.1)";
                      e.currentTarget.style.color = "#3DDC84";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#888";
                    }}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={resetToDefault}
            style={{
              padding: "5px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "7px",
              color: "#666",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Block list */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedId) onDrop(e, blocks[blocks.length - 1]?.id);
        }}
        onClick={() => setShowAddMenu(false)}
      >
        {blocks.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
            onMove={onMove}
            onToggle={onToggle}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            draggedId={draggedId}
            dragOverId={dragOverId}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
            onDropZone={onDropZone}
          />
        ))}
        {/* Final drop zone */}
        {draggedId && (
          <DropZone
            visible={!!draggedId}
            myId="end"
            dragOverId={dragOverId}
            onDrop={(e) => onDropZone(e, blocks.length)}
          />
        )}
      </div>

      {/* Generated template preview */}
      <div
        style={{
          marginTop: "14px",
          padding: "14px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Live Template Preview</span>
          <span
            style={{ color: "#444", fontWeight: 400, textTransform: "none" }}
          >
            {enabledCount} of {blocks.length} blocks active
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#888",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
        >
          {blocks
            .filter((b) => b.enabled)
            .map((b) => BLOCK_PREVIEWS[b.type] || "")
            .join("\n")}
        </pre>
      </div>
    </div>
  );
}

const iconBtn = {
  background: "none",
  border: "none",
  color: "#444",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.15s",
};
