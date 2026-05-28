"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  });

  const createCategory = useMutation({
    mutationFn: async (cat) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries(["categories"]);
      setForm({ name: "", slug: "", icon: "", description: "" });
      setShowForm(false);
    },
  });

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            margin: 0,
          }}
        >
          Categories
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
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
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "#16213E",
            borderRadius: "16px",
            padding: "28px",
            border: "1px solid rgba(61,220,132,0.2)",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            New Category
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={lbl}>Name *</label>
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
                placeholder="e.g. Games"
              />
            </div>
            <div>
              <label style={lbl}>Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                style={inp}
                placeholder="e.g. games"
              />
            </div>
            <div>
              <label style={lbl}>Icon (Lucide name)</label>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                style={inp}
                placeholder="e.g. Gamepad2"
              />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={inp}
                placeholder="Short description"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => createCategory.mutate(form)}
              disabled={createCategory.isPending}
              style={{
                padding: "12px 24px",
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
              {createCategory.isPending ? "Creating..." : "Create Category"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.07)",
                border: "none",
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
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {isLoading
          ? Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "120px",
                    background: "#16213E",
                    borderRadius: "14px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))
          : data?.categories?.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#16213E",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(61,220,132,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  <Tag size={20} color="#3DDC84" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#fff",
                      marginBottom: "4px",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#3DDC84",
                      marginBottom: "6px",
                    }}
                  >
                    /{cat.slug}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#555",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cat.description || "No description"}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        background: "rgba(61,220,132,0.1)",
                        color: "#3DDC84",
                      }}
                    >
                      {cat.actual_count || cat.app_count || 0} apps
                    </span>
                    <a
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        textDecoration: "none",
                      }}
                    >
                      View →
                    </a>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
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
