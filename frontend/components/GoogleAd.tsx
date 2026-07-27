"use client";

import React, { useEffect, useRef, useState } from "react";

interface GoogleAdProps {
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
}

export default function GoogleAd({
  adSlot,
  style = { display: "block", minHeight: "12vh" },
  className = "",
  format = "auto",
  responsive = true,
}: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [adPushed, setAdPushed] = useState(false);

  const isDev = process.env.NODE_ENV === "development";
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  // Check cookie consent
  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("linksnap-cookie-consent");
      setHasConsent(consent === "accepted");
    };

    checkConsent();
    window.addEventListener("cookie-consent-changed", checkConsent);
    return () => window.removeEventListener("cookie-consent-changed", checkConsent);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (isDev || !adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [isDev]);

  // Push ad when visible, has consent, and client ID exists
  useEffect(() => {
    if (isDev || !isVisible || !hasConsent || !clientId || adPushed) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdPushed(true);
    } catch (err) {
      console.error("AdSense error:", err);
      setAdBlocked(true);
    }
  }, [isDev, isVisible, hasConsent, clientId, adPushed]);

  // Ad blocker detection
  useEffect(() => {
    if (isDev || !isVisible || !hasConsent) return;

    const timer = setTimeout(() => {
      if (adRef.current) {
        const adElement = adRef.current.querySelector("ins.adsbygoogle");
        if (adElement) {
          const computedStyle = window.getComputedStyle(adElement);
          if (computedStyle.display === "none" || computedStyle.height === "0px") {
            setAdBlocked(true);
          }
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDev, isVisible, hasConsent]);

  // Dev mode placeholder
  if (isDev) {
    return (
      <div
        className={`ad-container ${className}`}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "var(--surface)",
          border: "1px dashed var(--border-light)",
          borderRadius: "var(--radius-card)",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <strong style={{ fontSize: "0.9rem" }}>📢 Ad Placement</strong>
          <div style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "0.25rem" }}>Slot: {adSlot}</div>
        </div>
      </div>
    );
  }

  // No client ID configured
  if (!clientId) return null;

  // Waiting for consent
  if (!hasConsent) {
    return (
      <div ref={adRef} className={`ad-container ${className}`} style={style}>
        <div className="ad-fallback">
          <p style={{ fontSize: "0.85rem" }}>Accept cookies to see personalized content</p>
        </div>
      </div>
    );
  }

  // Ad blocked
  if (adBlocked) {
    return (
      <div className={`ad-container ${className}`} style={style}>
        <div className="ad-fallback">
          <p>💡 Enjoying LinkSnap? Consider disabling your ad blocker to support us!</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`} style={{ overflow: "hidden", ...style }}>
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "12vh", ...style }}
          data-ad-client={clientId}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      )}
    </div>
  );
}
