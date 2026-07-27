"use client";

import React, { useEffect, useState } from "react";
import { Cookie, Shield } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("linksnap-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("linksnap-cookie-consent", "accepted");
    setVisible(false);
    // Dispatch event so GoogleAd component knows to load ads
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem("linksnap-cookie-consent", "declined");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" id="cookie-consent-banner">
      <div className="cookie-banner-inner">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1, minWidth: 250 }}>
          <div style={{
            background: "var(--surface-hover)",
            borderRadius: "12px",
            padding: "0.6rem",
            display: "flex",
            flexShrink: 0,
          }}>
            <Cookie size={22} color="var(--accent)" />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem", fontSize: "0.95rem" }}>
              We value your privacy
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
              We use cookies to improve your experience and display personalized ads.
              By clicking &quot;Accept&quot;, you consent to the use of cookies including those from Google AdSense.
              Read our{" "}
              <a href="/privacy" style={{ color: "var(--accent)", textDecoration: "underline" }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
        <div className="cookie-banner-actions">
          <button
            onClick={handleDecline}
            className="btn btn-secondary"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}
            id="cookie-decline-btn"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-primary"
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}
            id="cookie-accept-btn"
          >
            <Shield size={16} />
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
