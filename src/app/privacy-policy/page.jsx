import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy - Mod Apk Store" };

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "#3DDC84",
          marginBottom: "14px",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "#888", fontSize: "15px", lineHeight: 1.9 }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
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
          Privacy Policy
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
          <Section title="1. Information We Collect">
            <p>
              We collect information you provide directly to us, such as when
              you submit a review, contact us, or subscribe to our newsletter.
              This may include your name, email address, and any other
              information you choose to provide.
            </p>
            <p>
              We also automatically collect certain information when you visit
              our website, including your IP address, browser type, operating
              system, referring URLs, and pages viewed.
            </p>
          </Section>
          <Section title="2. How We Use Your Information">
            <ul style={{ paddingLeft: "20px" }}>
              <li>To provide, maintain, and improve our services</li>
              <li>To send you newsletters and updates (with your consent)</li>
              <li>To respond to your comments and questions</li>
              <li>To analyze usage patterns and optimize our website</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </Section>
          <Section title="3. Cookies">
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and hold certain information. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is
              being sent.
            </p>
          </Section>
          <Section title="4. Third-Party Services">
            <p>
              We may use third-party services such as Google Analytics, Google
              AdSense, and Cloudflare that collect, monitor, and analyze usage
              data. These third parties have their own privacy policies
              addressing how they use such information.
            </p>
          </Section>
          <Section title="5. Data Retention">
            <p>
              We retain personal information for as long as necessary to fulfill
              the purposes for which it was collected, including satisfying
              legal, accounting, or reporting requirements.
            </p>
          </Section>
          <Section title="6. Your Rights">
            <p>
              You have the right to access, correct, or delete your personal
              information. To exercise these rights, please contact us at
              privacy@modapkstore.pro.
            </p>
          </Section>
          <Section title="7. Contact Us">
            <p>
              If you have questions about this Privacy Policy, please contact us
              at:{" "}
              <span style={{ color: "#3DDC84" }}>privacy@modapkstore.pro</span>
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
