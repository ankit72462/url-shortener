"use client";

import React, { useState, useEffect } from "react";
import ShortenForm from "@/components/ShortenForm";
import ResultCard from "@/components/ResultCard";
import RecentLinks from "@/components/RecentLinks";
import GoogleAd from "@/components/GoogleAd";
import { ShortenResponse } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [recentLinks, setRecentLinks] = useState<ShortenResponse[]>([]);

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
    
    // Add to recent links and save
    setRecentLinks((prev) => {
      // Avoid duplicates
      const filtered = prev.filter(link => link.short_code !== newResult.short_code);
      const updated = [newResult, ...filtered].slice(0, 5); // Keep max 5
      
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: "4rem", padding: "0 1rem" }}
      >
        <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1.25rem", fontWeight: 800 }}>
          Shorten Your Links,<br />
          <span className="text-gradient">Amplify Your Reach</span>
        </h2>
        <p style={{ fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto", color: "var(--text-secondary)" }}>
          The premium URL shortener for modern creators. Fast, secure, and beautifully designed.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ marginBottom: "2rem", maxWidth: "728px", margin: "0 auto 3rem auto" }}
      >
        <GoogleAd adSlot="HOMEPAGE_HERO_SLOT" format="horizontal" />
      </motion.div>

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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <RecentLinks links={recentLinks} />
      </motion.div>
    </>
  );
}
