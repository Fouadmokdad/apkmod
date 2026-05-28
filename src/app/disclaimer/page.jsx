import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export const metadata = { title: "Disclaimer - Mod Apk Store" };

export default function DisclaimerPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(255,165,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={26} color="#FFA500" />
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "40px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Disclaimer
          </h1>
        </div>
        <div
          style={{
            background: "#16213E",
            borderRadius: "20px",
            padding: "48px",
            border: "1px solid rgba(255,255,255,0.07)",
            marginTop: "32px",
          }}
        >
          {[
            {
              title: "Information Only",
              content:
                "The information on Mod Apk Store is provided for general information purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the information provided.",
            },
            {
              title: "No APK Hosting",
              content:
                "We do not host, store, or distribute any APK files. All download links on this website lead to third-party file hosting services. We are not responsible for the content, safety, or legality of files hosted by third parties.",
            },
            {
              title: "Legal Responsibility",
              content:
                "Using MOD APKs may be illegal in your jurisdiction and/or violate the Terms of Service of the original application. You use any modified application at your own risk. We are not responsible for any legal consequences of downloading or using MOD APKs.",
            },
            {
              title: "Account Safety",
              content:
                "Using MOD APKs for apps that require an account (especially online games or social media apps) may result in your account being permanently banned by the original developer. We are not responsible for any account bans.",
            },
            {
              title: "Device Safety",
              content:
                "Installing APKs from unknown sources carries inherent risks. While we do our best to ensure safety, we cannot guarantee that all listed APKs are completely safe. Always use a reputable antivirus program and exercise caution.",
            },
            {
              title: "Trademarks",
              content:
                "All mentioned trademarks, product names, or company names belong to their respective owners. Mod Apk Store is not affiliated with, endorsed by, or connected to any of these companies.",
            },
          ].map((s) => (
            <div key={s.title} style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#FFA500",
                  marginBottom: "10px",
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  color: "#888",
                  lineHeight: 1.9,
                  fontSize: "15px",
                  margin: 0,
                }}
              >
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
