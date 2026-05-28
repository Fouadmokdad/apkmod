"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

export default function EditAppPage({ params }) {
  const { id } = params;
  const [form, setForm] = useState(null);
  const [modFeatures, setModFeatures] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [screenshots, setScreenshots] = useState([""]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const { data: appsData, isLoading: appLoading } = useQuery({
    queryKey: ["admin-app-edit", id],
    queryFn: async () => {
      const res = await fetch(`/api/apps?limit=100`);
      const data = await res.json();
      return data.apps?.find((a) => a.id === parseInt(id));
    },
  });

  useEffect(() => {
    if (appsData) {
      setForm({
        name: appsData.name || "",
        slug: appsData.slug || "",
        developer: appsData.developer || "",
        category_id: appsData.category_id || "",
        version: appsData.version || "",
        mod_version: appsData.mod_version || "",
        package_name: appsData.package_name || "",
        size: appsData.size || "",
        android_version: appsData.android_version || "",
        icon_url: appsData.icon_url || "",
        description: appsData.description || "",
        installation_guide: appsData.installation_guide || "",
        changelog: appsData.changelog || "",
        download_url: appsData.download_url || "",
        md5_checksum: appsData.md5_checksum || "",
        is_featured: appsData.is_featured || false,
        is_trending: appsData.is_trending || false,
        is_published: appsData.is_published !== false,
      });
      setModFeatures(
        appsData.mod_features?.length ? appsData.mod_features : [""],
      );
      setTags(appsData.tags?.length ? appsData.tags : [""]);
      setScreenshots(
        appsData.screenshots?.length ? appsData.screenshots : [""],
      );
    }
  }, [appsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        mod_features: modFeatures.filter((f) => f.trim()),
        tags: tags.filter((t) => t.trim()),
        screenshots: screenshots.filter((s) => s.trim()),
      };
      const res = await fetch(`/api/apps/${appsData?.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus({ type: "success", message: "App updated successfully!" });
      } else {
        const d = await res.json();
        setStatus({ type: "error", message: d.error || "Failed" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    }
    setLoading(false);
  };

  const updateList = (list, setList, idx, value) => {
    const u = [...list];
    u[idx] = value;
    setList(u);
  };
  const addToList = (setList) => setList((prev) => [...prev, ""]);
  const removeFromList = (list, setList, idx) =>
    setList(list.filter((_, i) => i !== idx));

  if (appLoading || !form)
    return (
      <div style={{ color: "#555", padding: "40px", textAlign: "center" }}>
        Loading app...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <a
          href="/admin/apps"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#555",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={16} /> Back
        </a>
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            margin: 0,
          }}
        >
          Edit: {form.name}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: "20px" }}>
            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                Basic Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {[
                  ["name", "App Name *", "text"],
                  ["slug", "Slug *", "text"],
                  ["developer", "Developer", "text"],
                  ["version", "Version", "text"],
                  ["mod_version", "MOD Version", "text"],
                  ["size", "Size", "text"],
                  ["android_version", "Android Version", "text"],
                  ["download_url", "Download URL", "text"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={inp}
                    />
                  </div>
                ))}
                <div>
                  <label style={lbl}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    style={inp}
                  >
                    <option value="">Select category</option>
                    {catData?.categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label style={lbl}>Icon URL</label>
                <input
                  value={form.icon_url}
                  onChange={(e) =>
                    setForm({ ...form, icon_url: e.target.value })
                  }
                  style={inp}
                />
                {form.icon_url && (
                  <img
                    src={form.icon_url}
                    alt="icon"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "14px",
                      marginTop: "8px",
                      objectFit: "contain",
                      background: "#1A1A2E",
                    }}
                  />
                )}
              </div>
            </div>

            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                Description
              </h3>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={6}
                style={{ ...inp, resize: "vertical", width: "100%" }}
              />
            </div>

            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                MOD Features
              </h3>
              {modFeatures.map((f, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    value={f}
                    onChange={(e) =>
                      updateList(modFeatures, setModFeatures, i, e.target.value)
                    }
                    style={{ ...inp, flex: 1 }}
                  />
                  {modFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(modFeatures, setModFeatures, i)
                      }
                      style={rmBtn}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToList(setModFeatures)}
                style={addBtn}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                Installation Guide
              </h3>
              <textarea
                value={form.installation_guide}
                onChange={(e) =>
                  setForm({ ...form, installation_guide: e.target.value })
                }
                rows={5}
                style={{ ...inp, resize: "vertical", width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                Publishing
              </h3>
              {[
                ["is_published", "Published"],
                ["is_featured", "Featured"],
                ["is_trending", "Trending"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "40px",
                      height: "22px",
                    }}
                    onClick={() => setForm({ ...form, [key]: !form[key] })}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "11px",
                        background: form[key]
                          ? "#3DDC84"
                          : "rgba(255,255,255,0.1)",
                        transition: "background 0.3s",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: form[key] ? "20px" : "2px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.3s",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "14px", color: "#C0C0C0" }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            <div
              style={{
                background: "#16213E",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "20px",
                  color: "#3DDC84",
                }}
              >
                Tags
              </h3>
              {tags.map((t, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    value={t}
                    onChange={(e) =>
                      updateList(tags, setTags, i, e.target.value)
                    }
                    style={{ ...inp, flex: 1 }}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromList(tags, setTags, i)}
                      style={rmBtn}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToList(setTags)}
                style={addBtn}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg,#3DDC84,#2BA861)",
                border: "none",
                borderRadius: "12px",
                color: "#1A1A2E",
                fontWeight: 800,
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "'Poppins', sans-serif",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
            {status && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "10px",
                  background:
                    status.type === "success"
                      ? "rgba(61,220,132,0.1)"
                      : "rgba(255,107,107,0.1)",
                  color: status.type === "success" ? "#3DDC84" : "#ff6b6b",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {status.message}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

const lbl = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#666",
  marginBottom: "8px",
};
const inp = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};
const rmBtn = {
  padding: "11px",
  background: "rgba(255,107,107,0.1)",
  border: "1px solid rgba(255,107,107,0.2)",
  borderRadius: "10px",
  color: "#ff6b6b",
  cursor: "pointer",
  display: "flex",
};
const addBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "9px 16px",
  background: "rgba(61,220,132,0.1)",
  border: "1px solid rgba(61,220,132,0.2)",
  borderRadius: "10px",
  color: "#3DDC84",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  marginTop: "8px",
  fontFamily: "'Inter', sans-serif",
};
