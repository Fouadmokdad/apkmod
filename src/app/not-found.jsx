import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "160px 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "120px",
            fontWeight: 900,
            background: "linear-gradient(135deg,#3DDC84,#2BA861)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "32px",
            fontWeight: 800,
            marginBottom: "16px",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "17px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              padding: "14px 32px",
              background: "#3DDC84",
              borderRadius: "12px",
              color: "#1A1A2E",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            Go Home
          </a>
          <a
            href="/search"
            style={{
              padding: "14px 32px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#C0C0C0",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            Search Apps
          </a>
        </div>
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            ["Top Downloads", "/top-downloads"],
            ["Latest Apps", "/latest"],
            ["Games", "/category/games"],
            ["Music", "/category/music"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                color: "#3DDC84",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              → {label}
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
