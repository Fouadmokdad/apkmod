"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "What is a MOD APK?",
    a: "A MOD APK is a modified version of an original Android application. These modified apps often include premium features unlocked, ads removed, unlimited in-app currencies, or other modifications not available in the official version.",
  },
  {
    q: "Are MOD APKs safe to install?",
    a: "All MOD APKs on our site go through virus scanning before being listed. However, like any third-party software, there is always a degree of risk. We recommend using a reputable antivirus app and only downloading from trusted sources like ours.",
  },
  {
    q: "How do I install a MOD APK?",
    a: 'Go to Settings → Security → Enable "Unknown Sources" (or "Install Unknown Apps" depending on your Android version). Download the MOD APK from our site, open the file, and tap "Install". If you have the original app installed, uninstall it first.',
  },
  {
    q: "Will my account get banned using MOD APKs?",
    a: "For online/multiplayer apps, using MOD APKs can result in account bans, as the original developer can detect modifications. For offline apps, this risk is minimal. Use MOD APKs for online apps at your own risk.",
  },
  {
    q: "Can I update MOD APKs through the Play Store?",
    a: "No. Do not update MOD APKs through the Play Store, as this will replace the MOD version with the original. Check our site for updated MOD versions.",
  },
  {
    q: "Are all MOD APKs on this site free?",
    a: "Yes! All MOD APKs listed on Mod Apk Store are completely free to download. We believe in making premium software accessible to everyone.",
  },
  {
    q: "How often are MOD APKs updated?",
    a: "We try to update our MOD APKs as soon as new versions are available. The update frequency depends on the app, but popular apps are typically updated within a few days of the official release.",
  },
  {
    q: "How do I request a specific MOD APK?",
    a: "Visit our Submit App page and fill out the request form. Our team reviews all requests and tries to fulfill them within 48 hours, prioritizing most-requested apps.",
  },
  {
    q: "Why does my antivirus flag the APK?",
    a: "Some antivirus software may flag MOD APKs as potentially harmful due to the modifications, even if the file is safe. This is often a false positive. All our APKs are manually reviewed, but always use your own judgment.",
  },
  {
    q: "Do you host APK files on your servers?",
    a: "No. We do not host APK files directly. We provide download links to third-party file hosting services. This is for educational and informational purposes only.",
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: "#16213E",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        transition: "border-color 0.2s",
        marginBottom: "10px",
        ...(open && { borderColor: "rgba(61,220,132,0.3)" }),
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "16px",
            color: open ? "#3DDC84" : "#fff",
            transition: "color 0.2s",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {faq.q}
        </span>
        <ChevronDown
          size={20}
          color={open ? "#3DDC84" : "#555"}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
            flexShrink: 0,
          }}
        />
      </button>
      {open && (
        <div
          style={{
            padding: "0 24px 20px",
            color: "#888",
            fontSize: "15px",
            lineHeight: 1.8,
          }}
        >
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#1A1A2E" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px,5vw,48px)",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Frequently Asked <span style={{ color: "#3DDC84" }}>Questions</span>
          </h1>
          <p style={{ color: "#666", fontSize: "17px" }}>
            Everything you need to know about MOD APKs
          </p>
        </div>
        {FAQS.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
            padding: "40px",
            background: "rgba(61,220,132,0.05)",
            border: "1px solid rgba(61,220,132,0.15)",
            borderRadius: "20px",
          }}
        >
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            Still have questions?
          </h3>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            Our support team is here to help
          </p>
          <a
            href="/contact"
            style={{
              padding: "14px 32px",
              background: "#3DDC84",
              borderRadius: "12px",
              color: "#1A1A2E",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
