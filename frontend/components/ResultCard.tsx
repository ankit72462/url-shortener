"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShortenResponse } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Copy, Check, QrCode, Download, ArrowLeft, PartyPopper } from "lucide-react";

interface ResultCardProps {
  result: ShortenResponse;
  onReset: () => void;
}

/* ===== Confetti Particle Component ===== */
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#aa66ff", "#00ffff", "#ff6b6b", "#feca57", "#54a0ff", "#5f27cd"];
  const color = colors[index % colors.length];
  const angle = (index / 12) * 360;
  const distance = 60 + Math.random() * 80;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x, y: y - 30, scale: 0 }}
      transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
      style={{
        position: "absolute",
        width: `${0.8 + Math.random() * 0.6}vh`,
        height: `${0.8 + Math.random() * 0.6}vh`,
        minWidth: "5px",
        minHeight: "5px",
        background: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        top: "50%",
        left: "50%",
        pointerEvents: "none",
      }}
    />
  );
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
    <div
      className="glass-card gradient-border fade-in-up"
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "2rem auto 0",
        textAlign: "center",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Confetti burst */}
      {showConfetti && (
        <div style={{ position: "absolute", top: "30%", left: "50%", zIndex: 10 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        style={{
          width: "7vh",
          height: "7vh",
          minWidth: "48px",
          minHeight: "48px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
          color: "var(--btn-primary-text)",
        }}
      >
        <PartyPopper size={24} />
      </motion.div>

      <h3 style={{ color: "var(--text-secondary)", fontSize: "1rem", fontWeight: 500, marginBottom: "1.5rem" }}>
        Your shortened link is ready!
      </h3>

      <div style={{
        background: "var(--card-deep-bg)",
        padding: "1.5rem",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        border: "1px solid var(--border-light)",
      }}>
        <a href={result.short_url} target="_blank" rel="noreferrer" style={{ fontSize: "1.5rem", fontFamily: "monospace", color: "var(--accent)", wordBreak: "break-all", textAlign: "left" }}>
          {result.short_url}
        </a>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setShowQR(!showQR)}
            className="btn btn-secondary"
            id="qr-toggle-btn"
          >
            <QrCode size={18} />
            {showQR ? "Hide QR" : "QR Code"}
          </button>
          <button
            onClick={handleCopy}
            className="btn btn-primary"
            style={{ minWidth: "100px" }}
            id="copy-btn"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {showQR && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
        >
          <div style={{ background: "white", padding: "1rem", borderRadius: "12px", display: "inline-block" }}>
            <QRCodeSVG
              ref={qrRef}
              value={result.short_url}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <button onClick={handleDownloadQR} className="btn btn-secondary" style={{ fontSize: "0.9rem" }} id="download-qr-btn">
            <Download size={16} />
            Download PNG
          </button>
        </motion.div>
      )}

      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Original URL:</p>
        <p style={{ fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-secondary)" }}>
          {result.long_url}
        </p>
      </div>

      <button onClick={onReset} className="btn btn-secondary" id="shorten-another-btn">
        <ArrowLeft size={18} />
        Shorten Another Link
      </button>
    </div>
  );
}
