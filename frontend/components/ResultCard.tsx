"use client";

import React, { useState, useRef } from "react";
import { ShortenResponse } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";

interface ResultCardProps {
  result: ShortenResponse;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Scale up for better quality
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `qr-${result.short_code}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="glass-card fade-in-up" style={{ width: "100%", maxWidth: "800px", margin: "2rem auto 0", textAlign: "center", border: "1px solid var(--accent)", boxShadow: "0 0 20px rgba(170,255,255,0.1)" }}>
      <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", fontWeight: 500, marginBottom: "1rem" }}>Your shortened link is ready!</h3>
      
      <div style={{ background: "rgba(0,0,0,0.3)", padding: "1.5rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <a href={result.short_url} target="_blank" rel="noreferrer" style={{ fontSize: "1.5rem", fontFamily: "monospace", color: "var(--accent)", wordBreak: "break-all", textAlign: "left" }}>
          {result.short_url}
        </a>
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={() => setShowQR(!showQR)} 
            className="btn btn-secondary"
          >
            {showQR ? "Hide QR" : "QR Code"}
          </button>
          <button 
            onClick={handleCopy} 
            className="btn btn-primary"
            style={{ minWidth: "100px", background: copied ? "hsl(140, 60%, 45%)" : undefined }}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {showQR && (
        <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "white", padding: "1rem", borderRadius: "12px", display: "inline-block" }}>
            <QRCodeSVG 
              ref={qrRef}
              value={result.short_url} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <button onClick={handleDownloadQR} className="btn btn-secondary" style={{ fontSize: "0.9rem" }}>
            Download PNG
          </button>
        </div>
      )}

      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Original URL:</p>
        <p style={{ fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {result.long_url}
        </p>
      </div>

      <button onClick={onReset} className="btn btn-secondary">
        Shorten Another Link
      </button>
    </div>
  );
}
