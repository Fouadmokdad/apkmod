import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Mail, FileText } from "lucide-react";

export const metadata = { title: "DMCA Policy - Mod Apk Store" };

export default function DMCAPage() {
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
              background: "rgba(61,220,132,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={26} color="#3DDC84" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "40px",
                fontWeight: 800,
                margin: 0,
              }}
            >
              DMCA Policy
            </h1>
            <p style={{ color: "#555", margin: 0, fontSize: "14px" }}>
              Digital Millennium Copyright Act
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#16213E",
            borderRadius: "20px",
            padding: "48px",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "24px",
          }}
        >
          {[
            {
              title: "Overview",
              content:
                "Mod Apk Store respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, we will respond expeditiously to claims of copyright infringement.",
            },
            {
              title: "Notice Requirements",
              content:
                "To file a DMCA notice, you must provide:\n• Your physical or electronic signature\n• Identification of the copyrighted work claimed to have been infringed\n• Identification of the material claimed to be infringing\n• Your contact information (address, telephone, email)\n• A statement that you have a good faith belief that use of the material is not authorized\n• A statement that the information is accurate and you are authorized to act",
            },
            {
              title: "Submit a DMCA Notice",
              content:
                "Send your DMCA notice to: dmca@modapkstore.pro\n\nWe process all valid DMCA requests within 24-48 hours of receipt.",
            },
            {
              title: "Counter-Notice",
              content:
                "If you believe your content was removed in error, you may file a counter-notice with our DMCA agent. Counter-notices must include: your signature, identification of removed content, statement under penalty of perjury that removal was a mistake, and your contact information.",
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#3DDC84",
                  marginBottom: "12px",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  color: "#888",
                  lineHeight: 1.9,
                  fontSize: "15px",
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a
            href="mailto:dmca@modapkstore.pro"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              background: "#3DDC84",
              borderRadius: "12px",
              color: "#1A1A2E",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            <Mail size={18} /> Submit DMCA Notice
          </a>
          <a
            href="/contact"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 24px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#C0C0C0",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            <FileText size={18} /> Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
