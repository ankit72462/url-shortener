"use client";

import React, { useEffect } from "react";

interface GoogleAdProps {
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
}

export default function GoogleAd({ 
  adSlot, 
  style = { display: "block", minHeight: "90px" }, 
  className = "", 
  format = "auto",
  responsive = true 
}: GoogleAdProps) {
  // Display a placeholder in development mode or if the ad ID is missing
  const isDev = process.env.NODE_ENV === "development";
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

  useEffect(() => {
    if (!isDev) {
      try {
        // Push the ad to the adsbygoogle array
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error", err);
      }
    }
  }, [isDev]);

  if (isDev) {
    return (
      <div 
        className={`glass-card ${className}`} 
        style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", color: "var(--text-secondary)", borderStyle: "dashed" }}
      >
        <div style={{ textAlign: "center" }}>
          <strong>Google Ad Placement</strong>
          <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Slot: {adSlot}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
