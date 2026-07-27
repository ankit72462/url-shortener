"use client";

import React, { useState, useEffect, useRef } from "react";
import ShortenForm from "@/components/ShortenForm";
import ResultCard from "@/components/ResultCard";
import RecentLinks from "@/components/RecentLinks";
import GoogleAd from "@/components/GoogleAd";
import { ShortenResponse } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, BarChart3, Globe, QrCode, Lock } from "lucide-react";

/* ===== Animated Counter Hook ===== */
function useAnimatedCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let raf: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

/* ===== Scroll Reveal Hook ===== */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ===== Feature Data ===== */
const features = [
  {
    icon: <Zap size={28} />,
    title: "Lightning Fast",
    desc: "Generate short links in milliseconds with our optimized Snowflake ID engine and Redis caching.",
    gradient: "linear-gradient(135deg, hsl(40, 100%, 55%), hsl(20, 100%, 55%))",
  },
  {
    icon: <Shield size={28} />,
    title: "Secure by Design",
    desc: "Password-protected links, rate limiting, JWT auth, and encrypted storage keep your data safe.",
    gradient: "linear-gradient(135deg, hsl(260, 100%, 70%), hsl(280, 100%, 60%))",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Rich Analytics",
    desc: "Track clicks, browsers, devices, OS, referrers, and geographic data in real time.",
    gradient: "linear-gradient(135deg, hsl(180, 100%, 50%), hsl(160, 100%, 45%))",
  },
];

const highlights = [
  { icon: <Globe size={20} />, text: "Custom Aliases" },
  { icon: <QrCode size={20} />, text: "QR Codes" },
  { icon: <Lock size={20} />, text: "Password Protection" },
];

export default function Home() {
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [recentLinks, setRecentLinks] = useState<ShortenResponse[]>([]);

  const statsReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();

  const linksCount = useAnimatedCounter(10000, 2000, statsReveal.visible);
  const uptimeCount = useAnimatedCounter(999, 2000, statsReveal.visible);
  const countriesCount = useAnimatedCounter(150, 2000, statsReveal.visible);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentLinks");
      if (stored) {
        setRecentLinks(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse recent links from localStorage", e);
    }
  }, []);

  const handleSuccess = (newResult: ShortenResponse) => {
    setResult(newResult);

    setRecentLinks((prev) => {
      const filtered = prev.filter(link => link.short_code !== newResult.short_code);
      const updated = [newResult, ...filtered].slice(0, 5);

      try {
        localStorage.setItem("recentLinks", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }

      return updated;
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <>
      {/* ===== Hero Section ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "3rem", padding: "0 1rem" }}
      >
        <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.25rem", fontWeight: 800 }}>
          Shorten Your Links,<br />
          <span className="text-gradient">Amplify Your Reach</span>
        </h2>
        <p style={{ fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto 2rem", color: "var(--text-secondary)" }}>
          The premium URL shortener for modern creators. Fast, secure, and beautifully designed.
        </p>

        {/* Highlight Pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "99px",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ color: "var(--accent)", display: "flex" }}>{h.icon}</span>
              {h.text}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== URL Shortener Form / Result ===== */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ShortenForm onSuccess={handleSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard result={result} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Stats Section ===== */}
      <div
        ref={statsReveal.ref}
        className={`scroll-reveal ${statsReveal.visible ? "visible" : ""}`}
        style={{ marginTop: "5rem", marginBottom: "5rem" }}
      >
        <h3 style={{ textAlign: "center", fontSize: "1rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          Trusted by creators worldwide
        </h3>
        <hr className="section-divider" />
        <div className="stats-grid" style={{ marginTop: "2rem" }}>
          <div className="stat-card">
            <div className="stat-number text-gradient">{linksCount.toLocaleString()}+</div>
            <div className="stat-label">Links Shortened</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-gradient">{(uptimeCount / 10).toFixed(1)}%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-gradient">{countriesCount}+</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
      </div>

      {/* ===== Ad (between sections) ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ marginBottom: "4rem", maxWidth: "728px", margin: "0 auto 4rem auto" }}
      >
        <GoogleAd adSlot="HOMEPAGE_BANNER_SLOT" format="horizontal" />
      </motion.div>

      {/* ===== Features Section ===== */}
      <div
        ref={featuresReveal.ref}
        className={`scroll-reveal ${featuresReveal.visible ? "visible" : ""}`}
        style={{ marginBottom: "5rem" }}
      >
        <h3 style={{ textAlign: "center", fontSize: "1rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          Why LinkSnap?
        </h3>
        <hr className="section-divider" />
        <h2 style={{ textAlign: "center", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "3rem" }}>
          Built for <span className="text-gradient">Performance</span>
        </h2>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresReveal.visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              className="feature-card"
            >
              <div
                className="feature-icon"
                style={{ background: f.gradient, color: "#fff" }}
              >
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Recent Links ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <RecentLinks links={recentLinks} />
      </motion.div>

      {/* ===== Bottom Ad ===== */}
      <div style={{ marginTop: "3rem", maxWidth: "728px", margin: "3rem auto 0 auto" }}>
        <GoogleAd adSlot="HOMEPAGE_BOTTOM_SLOT" format="horizontal" />
      </div>
    </>
  );
}
