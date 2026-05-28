"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

export default function NewAppPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    developer: "",
    category_id: "",
    version: "",
    mod_version: "",
    package_name: "",
    size: "",
    android_version: "",
    icon_url: "",
    description: "",
    installation_guide: "",
    changelog: "",
    download_url: "",
    md5_checksum: "",
    is_featured: false,
    is_trending: false,
    is_published: true,
  });
  const [modFeatures, setModFeatures] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [screenshots, setScreenshots] = useState([""]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        mod_features: modFeatures.filter((f) => f.trim()),
        tags: tags.filter((t) => t.trim()),
        screenshots: screenshots.filter((s) => s.trim()),
      };
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "App created successfully!" });
        setTimeout(() => {
          if (typeof window !== "undefined")
            window.location.href = "/admin/apps";
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to create app",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    }
    setLoading(false);
  };

  const updateList = (list, setList, idx, value) => {
    const updated = [...list];
    updated[idx] = value;
    setList(updated);
  };

  const addToList = (setList) => setList((prev) => [...prev, ""]);
  const removeFromList = (list, setList, idx) =>
    setList(list.filter((_, i) => i !== idx));

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
          Add New App
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
          {/* Main fields */}
          <div style={{ display: "grid", gap: "20px" }}>
            <Card title="Basic Information">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Field label="App Name *">
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }
                    required
                    style={inp}
                    placeholder="e.g. Spotify Premium"
                  />
                </Field>
                <Field label="Slug *">
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                    style={inp}
                    placeholder="spotify-premium"
                  />
                </Field>
                <Field label="Developer">
                  <input
                    value={form.developer}
                    onChange={(e) =>
                      setForm({ ...form, developer: e.target.value })
                    }
                    style={inp}
                    placeholder="Spotify AB"
                  />
                </Field>
                <Field label="Category">
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
                </Field>
                <Field label="Version">
                  <input
                    value={form.version}
                    onChange={(e) =>
                      setForm({ ...form, version: e.target.value })
                    }
                    style={inp}
                    placeholder="8.9.12"
                  />
                </Field>
                <Field label="MOD Version">
                  <input
                    value={form.mod_version}
                    onChange={(e) =>
                      setForm({ ...form, mod_version: e.target.value })
                    }
                    style={inp}
                    placeholder="8.9.12 MOD"
                  />
                </Field>
                <Field label="Package Name">
                  <input
                    value={form.package_name}
                    onChange={(e) =>
                      setForm({ ...form, package_name: e.target.value })
                    }
                    style={inp}
                    placeholder="com.spotify.music"
                  />
                </Field>
                <Field label="Size">
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    style={inp}
                    placeholder="34 MB"
                  />
                </Field>
                <Field label="Android Version">
                  <input
                    value={form.android_version}
                    onChange={(e) =>
                      setForm({ ...form, android_version: e.target.value })
                    }
                    style={inp}
                    placeholder="6.0"
                  />
                </Field>
                <Field label="Download URL">
                  <input
                    value={form.download_url}
                    onChange={(e) =>
                      setForm({ ...form, download_url: e.target.value })
                    }
                    style={inp}
                    placeholder="https://..."
                  />
                </Field>
              </div>
              <Field label="Icon URL">
                <input
                  value={form.icon_url}
                  onChange={(e) =>
                    setForm({ ...form, icon_url: e.target.value })
                  }
                  style={inp}
                  placeholder="https://..."
                />
                {form.icon_url && (
                  <img
                    src={form.icon_url}
                    alt="Icon preview"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      marginTop: "8px",
                      objectFit: "contain",
                      background: "#1A1A2E",
                    }}
                  />
                )}
              </Field>
            </Card>

            <Card title="Description">
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={6}
                style={{ ...inp, resize: "vertical", width: "100%" }}
                placeholder="Full description of the app..."
              />
            </Card>

            <Card title="MOD Features">
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
                    placeholder="e.g. Premium Unlocked"
                  />
                  {modFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(modFeatures, setModFeatures, i)
                      }
                      style={removeBtn}
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
                <Plus size={14} /> Add Feature
              </button>
            </Card>

            <Card title="Screenshots (URLs)">
              {screenshots.map((s, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    value={s}
                    onChange={(e) =>
                      updateList(screenshots, setScreenshots, i, e.target.value)
                    }
                    style={{ ...inp, flex: 1 }}
                    placeholder="https://screenshot-url..."
                  />
                  {screenshots.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(screenshots, setScreenshots, i)
                      }
                      style={removeBtn}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToList(setScreenshots)}
                style={addBtn}
              >
                <Plus size={14} /> Add Screenshot
              </button>
            </Card>

            <Card title="Installation Guide">
              <textarea
                value={form.installation_guide}
                onChange={(e) =>
                  setForm({ ...form, installation_guide: e.target.value })
                }
                rows={5}
                style={{ ...inp, resize: "vertical", width: "100%" }}
                placeholder="Step by step installation instructions..."
              />
            </Card>

            <Card title="Changelog">
              <textarea
                value={form.changelog}
                onChange={(e) =>
                  setForm({ ...form, changelog: e.target.value })
                }
                rows={4}
                style={{ ...inp, resize: "vertical", width: "100%" }}
                placeholder="What's new in this version..."
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ display: "grid", gap: "20px" }}>
            <Card title="Publishing">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  ["is_published", "Published (visible)"],
                  ["is_featured", "Featured on homepage"],
                  ["is_trending", "Trending"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "40px",
                        height: "22px",
                        flexShrink: 0,
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
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "14px", color: "#C0C0C0" }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </Card>

            <Card title="Tags">
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
                    placeholder="e.g. music"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromList(tags, setTags, i)}
                      style={removeBtn}
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
                <Plus size={14} /> Add Tag
              </button>
            </Card>

            <Card title="MD5 Checksum">
              <input
                value={form.md5_checksum}
                onChange={(e) =>
                  setForm({ ...form, md5_checksum: e.target.value })
                }
                style={inp}
                placeholder="MD5 hash..."
              />
            </Card>

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
              <Save size={18} /> {loading ? "Creating..." : "Create App"}
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

function Card({ title, children }) {
  return (
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
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: "#666",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

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
const removeBtn = {
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
