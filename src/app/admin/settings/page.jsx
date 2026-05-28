"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState({});
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      const map = {};
      data.settings?.forEach((s) => {
        map[s.key] = s.value;
      });
      setLocalSettings(map);
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (settings) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries(["admin-settings"]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading)
    return <div style={{ color: "#555" }}>Loading settings...</div>;

  const settingsGroups = [
    {
      title: "General",
      fields: [
        { key: "site_name", label: "Site Name", type: "text" },
        { key: "site_description", label: "Site Description", type: "text" },
        { key: "site_url", label: "Site URL", type: "text" },
        { key: "contact_email", label: "Contact Email", type: "email" },
      ],
    },
    {
      title: "Analytics & Ads",
      fields: [
        {
          key: "google_analytics",
          label: "Google Analytics ID",
          type: "text",
          placeholder: "G-XXXXXXXXXX",
        },
        {
          key: "google_adsense",
          label: "Google AdSense ID",
          type: "text",
          placeholder: "ca-pub-XXXXXXXXXX",
        },
      ],
    },
    {
      title: "App Settings",
      fields: [
        { key: "apps_per_page", label: "Apps Per Page", type: "number" },
        { key: "allow_reviews", label: "Allow Reviews", type: "toggle" },
        {
          key: "review_auto_approve",
          label: "Auto-Approve Reviews",
          type: "toggle",
        },
        { key: "maintenance_mode", label: "Maintenance Mode", type: "toggle" },
      ],
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
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
          Site Settings
        </h1>
        <button
          onClick={() => updateSettings.mutate(localSettings)}
          disabled={updateSettings.isPending}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: saved ? "rgba(61,220,132,0.15)" : "#3DDC84",
            border: saved ? "1px solid rgba(61,220,132,0.4)" : "none",
            borderRadius: "10px",
            color: saved ? "#3DDC84" : "#1A1A2E",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.3s",
          }}
        >
          <Save size={16} />{" "}
          {saved
            ? "✓ Saved!"
            : updateSettings.isPending
              ? "Saving..."
              : "Save Settings"}
        </button>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {settingsGroups.map((group) => (
          <div
            key={group.title}
            style={{
              background: "#16213E",
              borderRadius: "16px",
              padding: "28px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#3DDC84",
                marginBottom: "20px",
              }}
            >
              {group.title}
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {group.fields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#C0C0C0",
                      minWidth: "200px",
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === "toggle" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "44px",
                        height: "24px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          [field.key]:
                            prev[field.key] === "true" ? "false" : "true",
                        }))
                      }
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "12px",
                          background:
                            localSettings[field.key] === "true"
                              ? "#3DDC84"
                              : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left:
                            localSettings[field.key] === "true"
                              ? "22px"
                              : "3px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.3s",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={localSettings[field.key] || ""}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder || ""}
                      style={{
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                        width: "300px",
                        maxWidth: "100%",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
