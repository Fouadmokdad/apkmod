import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Zap, Star, Users, Download, Globe } from "lucide-react";

export const metadata = {
  title: "About Us - Mod Apk Store",
  description:
    "Learn about Mod Apk Store - your trusted source for premium MOD APKs.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px,5vw,52px)",
              fontWeight: 800,
              marginBottom: "20px",
            }}
          >
            About <span style={{ color: "#3DDC84" }}>Mod Apk Store</span>
          </h1>
          <p
            style={{
              color: "#888",
              fontSize: "18px",
              lineHeight: 1.7,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Your trusted destination for premium Android MOD APKs. We provide
            safe, tested, and up-to-date modified apps — all completely free.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "60px",
          }}
        >
          {[
            {
              icon: Shield,
              title: "Safety First",
              desc: "Every APK we publish goes through rigorous virus scanning and manual review. Your device security is our top priority.",
              color: "#3DDC84",
            },
            {
              icon: Zap,
              title: "Always Updated",
              desc: "We track app updates and provide the latest MOD versions as soon as they're available. Stay current without the cost.",
              color: "#FFD700",
            },
            {
              icon: Star,
              title: "Quality Guaranteed",
              desc: "Community reviews, ratings, and our expert team ensure only the best, working mods make it to our platform.",
              color: "#FF6B6B",
            },
            {
              icon: Globe,
              title: "Global Community",
              desc: "Millions of users from 100+ countries trust Mod Apk Store for their Android modifications.",
              color: "#4ECDC4",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={{
                  background: "#16213E",
                  borderRadius: "18px",
                  padding: "28px",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${item.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <Icon size={26} color={item.color} />
                </div>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "12px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "#16213E",
            borderRadius: "24px",
            padding: "48px",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Our Mission
          </h2>
          <p
            style={{
              color: "#888",
              fontSize: "16px",
              lineHeight: 1.9,
              textAlign: "center",
              maxWidth: "700px",
              margin: "0 auto 32px",
            }}
          >
            We believe premium software should be accessible to everyone. Our
            mission is to provide a safe, curated platform where Android users
            can discover and download modified apps that unlock premium features
            — without breaking the bank.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              { value: "10+", label: "MOD APKs", icon: Download },
              { value: "5M+", label: "Downloads", icon: Users },
              { value: "4.8★", label: "Avg Rating", icon: Star },
              { value: "100%", label: "Free", icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "rgba(61,220,132,0.05)",
                    borderRadius: "14px",
                  }}
                >
                  <Icon
                    size={24}
                    color="#3DDC84"
                    style={{ marginBottom: "8px" }}
                  />
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#3DDC84",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,165,0,0.07)",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "16px",
            padding: "28px",
          }}
        >
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#FFA500",
              marginBottom: "12px",
            }}
          >
            ⚠️ Disclaimer
          </h3>
          <p
            style={{
              color: "#888",
              fontSize: "14px",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            Mod Apk Store is provided for educational and research purposes
            only. We do not host any APK files on our servers — we only provide
            information and links to third-party sources. Using modified apps
            may violate the Terms of Service of the original developers. Use at
            your own risk. We do not take responsibility for any issues that may
            arise from using MOD APKs.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
