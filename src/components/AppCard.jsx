import { Star, Download, Shield } from "lucide-react";

function formatDownloads(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function StarRating({ rating, size = 12 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        fill={i <= Math.round(rating) ? "#FFD700" : "transparent"}
        color={i <= Math.round(rating) ? "#FFD700" : "#444"}
      />,
    );
  }
  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {stars}
    </div>
  );
}

export default function AppCard({ app, variant = "default" }) {
  if (variant === "compact") {
    return (
      <a href={`/app/${app.slug}`} style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(61,220,132,0.05)";
            e.currentTarget.style.borderColor = "rgba(61,220,132,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
          }}
        >
          <img
            src={app.icon_url || "/placeholder-app.png"}
            alt={app.name}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              objectFit: "contain",
              background: "#1A1A2E",
              flexShrink: 0,
            }}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=48`;
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {app.name}
            </div>
            <div
              style={{ fontSize: "12px", color: "#3DDC84", marginTop: "2px" }}
            >
              {app.mod_version || "MOD"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <StarRating rating={app.rating} />
              <span style={{ fontSize: "11px", color: "#666" }}>
                {formatDownloads(app.download_count)}
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={`/app/${app.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#16213E",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)";
          e.currentTarget.style.borderColor = "rgba(61,220,132,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={app.icon_url || "/placeholder.png"}
              alt={app.name}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                objectFit: "contain",
                background: "#1A1A2E",
              }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=3DDC84&color=1A1A2E&size=64`;
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#fff",
                  lineHeight: 1.3,
                }}
              >
                {app.name}
              </h3>
              <span
                style={{
                  background: "rgba(61,220,132,0.15)",
                  border: "1px solid rgba(61,220,132,0.3)",
                  color: "#3DDC84",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "5px",
                  flexShrink: 0,
                  letterSpacing: "0.05em",
                }}
              >
                MOD
              </span>
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
              {app.developer || "Unknown Dev"}
            </div>
            {app.category_name && (
              <div style={{ marginTop: "6px" }}>
                <a
                  href={`/category/${app.category_slug}`}
                  style={{
                    fontSize: "11px",
                    color: "#3DDC84",
                    background: "rgba(61,220,132,0.1)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  {app.category_name}
                </a>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "0 20px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <StarRating rating={app.rating} />
            <span
              style={{ color: "#FFD700", fontSize: "13px", fontWeight: 600 }}
            >
              {app.rating > 0 ? parseFloat(app.rating).toFixed(1) : "N/A"}
            </span>
            <span style={{ color: "#555", fontSize: "12px" }}>
              ({(app.total_ratings || 0).toLocaleString()})
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "14px",
            }}
          >
            {app.size && <Chip label={app.size} />}
            {app.android_version && (
              <Chip label={`Android ${app.android_version}`} />
            )}
            {app.mod_version && (
              <Chip label={app.mod_version} color="#3DDC84" />
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Download size={13} color="#666" />
            <span style={{ fontSize: "12px", color: "#666" }}>
              {formatDownloads(app.download_count)} Downloads
            </span>
            {app.is_virus_scanned && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "auto",
                  fontSize: "11px",
                  color: "#3DDC84",
                }}
              >
                <Shield size={12} /> Safe
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "12px 20px",
            background: "rgba(61,220,132,0.05)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "10px",
              background: "#3DDC84",
              borderRadius: "10px",
              textAlign: "center",
              color: "#1A1A2E",
              fontWeight: 700,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Download size={16} />
            Download MOD
          </div>
        </div>
      </div>
    </a>
  );
}

function Chip({ label, color }) {
  return (
    <span
      style={{
        fontSize: "11px",
        padding: "3px 8px",
        borderRadius: "5px",
        background: color ? `${color}15` : "rgba(255,255,255,0.06)",
        color: color || "#888",
        border: `1px solid ${color ? `${color}30` : "rgba(255,255,255,0.08)"}`,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}
