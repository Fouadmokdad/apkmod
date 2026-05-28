"use client";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users, Download } from "lucide-react";

export default function AdminNewsletterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: async () => {
      const res = await fetch("/api/newsletter");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const handleExport = () => {
    if (!data?.subscribers) return;
    const csv =
      "Email,Status,Date\n" +
      data.subscribers
        .map(
          (s) =>
            `${s.email},${s.is_active ? "Active" : "Inactive"},${new Date(s.created_at).toLocaleDateString()}`,
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: 800,
              margin: "0 0 4px",
            }}
          >
            Newsletter Subscribers
          </h1>
          <p style={{ color: "#555", margin: 0, fontSize: "14px" }}>
            {data?.total || 0} active subscribers
          </p>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            background: "rgba(61,220,132,0.1)",
            border: "1px solid rgba(61,220,132,0.3)",
            borderRadius: "10px",
            color: "#3DDC84",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Subscribers",
            value: data?.total || 0,
            icon: Users,
            color: "#3DDC84",
          },
          {
            label: "Active",
            value: data?.subscribers?.filter((s) => s.is_active).length || 0,
            icon: Mail,
            color: "#4ECDC4",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: "#16213E",
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `${stat.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "#16213E",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            All Subscribers
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#", "Email", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#555",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                data?.subscribers?.map((sub, i) => (
                  <tr
                    key={sub.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#C0C0C0",
                      }}
                    >
                      {sub.email}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          background: sub.is_active
                            ? "rgba(61,220,132,0.15)"
                            : "rgba(255,107,107,0.15)",
                          color: sub.is_active ? "#3DDC84" : "#ff6b6b",
                        }}
                      >
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
