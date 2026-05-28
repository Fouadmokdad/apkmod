import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms of Service - Mod Apk Store" };

export default function TermsPage() {
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
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "40px",
            fontWeight: 800,
            marginBottom: "8px",
          }}
        >
          Terms of Service
        </h1>
        <p style={{ color: "#555", marginBottom: "48px", fontSize: "14px" }}>
          Last updated: January 1, 2024
        </p>
        <div
          style={{
            background: "#16213E",
            borderRadius: "20px",
            padding: "48px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            {
              title: "1. Acceptance of Terms",
              content:
                "By accessing and using Mod Apk Store, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.",
            },
            {
              title: "2. Educational Purpose",
              content:
                "Mod Apk Store provides information about modified Android applications for educational and research purposes only. We do not host any APK files on our servers. All download links point to third-party hosting services.",
            },
            {
              title: "3. User Responsibilities",
              content:
                "You are solely responsible for your use of any MOD APK downloaded through information on this site. You acknowledge that using MOD APKs may violate the terms of service of the original application developers.",
            },
            {
              title: "4. No Warranties",
              content:
                'This service is provided "as is" without any warranties. We do not guarantee the accuracy, completeness, or usefulness of any information provided. We are not responsible for any damages resulting from your use of information from this site.',
            },
            {
              title: "5. Intellectual Property",
              content:
                "All trademarks, logos, and brand names mentioned on this site are the property of their respective owners. Their appearance does not imply endorsement or affiliation.",
            },
            {
              title: "6. Privacy",
              content:
                "Your use of this service is also governed by our Privacy Policy, which is incorporated into these Terms of Service.",
            },
            {
              title: "7. Changes to Terms",
              content:
                "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
            },
            {
              title: "8. Contact",
              content:
                "For any questions about these Terms, contact us at: legal@modapkstore.pro",
            },
          ].map((s) => (
            <div key={s.title} style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#3DDC84",
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
