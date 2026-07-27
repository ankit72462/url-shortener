"use client";

import React, { useState, useEffect } from "react";
import { shortenUrl, ShortenResponse, getToken } from "@/lib/api";
import { Link2, Sparkles } from "lucide-react";

interface ShortenFormProps {
  onSuccess: (result: ShortenResponse) => void;
}

export default function ShortenForm({ onSuccess }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = !!getToken();
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        checkRateLimit();
      } else {
        setIsLimitReached(false);
        setError("");
      }
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const checkRateLimit = () => {
    try {
      const stored = localStorage.getItem("anon_shorten_timestamps");
      if (stored) {
        const timestamps: string[] = JSON.parse(stored);
        const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;
        const validTimestamps = timestamps.filter(t => new Date(t).getTime() > twelveHoursAgo);

        localStorage.setItem("anon_shorten_timestamps", JSON.stringify(validTimestamps));

        if (validTimestamps.length >= 10) {
          setIsLimitReached(true);
          setError("You've reached the limit of 10 URLs per 12 hours. Please sign up or log in to create unlimited links!");
          return;
        }
      }
      setIsLimitReached(false);
    } catch (e) {
      console.error("Failed to check rate limit", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || isLimitReached) return;

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await shortenUrl(url, isLoggedIn && customAlias ? customAlias : undefined, isLoggedIn && password ? password : undefined);
      onSuccess(result);
      setUrl("");
      setCustomAlias("");
      setPassword("");

      if (!isLoggedIn) {
        const stored = localStorage.getItem("anon_shorten_timestamps");
        const timestamps: string[] = stored ? JSON.parse(stored) : [];
        timestamps.push(new Date().toISOString());
        localStorage.setItem("anon_shorten_timestamps", JSON.stringify(timestamps));
        checkRateLimit();
      }
    } catch (err: any) {
      if (err.message.includes("limit reached")) {
        setIsLimitReached(true);
      }
      setError(err.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card gradient-border fade-in-up" style={{ width: "100%", maxWidth: "800px", margin: "0 auto", animationDelay: "0.1s" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* URL Input with icon */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            display: "flex",
            pointerEvents: "none",
          }}>
            <Link2 size={22} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            placeholder={isLimitReached ? "Rate limit reached. Please sign up." : "Paste your long URL here..."}
            className="input"
            style={{ fontSize: "1.2rem", padding: "1.25rem 1.5rem 1.25rem 3.5rem", borderRadius: "16px" }}
            required
            disabled={loading || isLimitReached}
            id="url-input"
          />
        </div>

        {isLoggedIn && (
          <>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => { setCustomAlias(e.target.value); setError(""); }}
                placeholder="Custom Alias (optional)"
                className="input"
                style={{ fontSize: "1rem", padding: "1rem 1.5rem", borderRadius: "16px" }}
                disabled={loading}
                maxLength={20}
                id="alias-input"
              />
              {customAlias && (
                <span style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "0.8rem",
                  color: customAlias.length >= 18 ? "var(--danger)" : "var(--text-muted)",
                }}>
                  {customAlias.length}/20
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password protect link (optional)"
                className="input"
                style={{ fontSize: "1rem", padding: "1rem 1.5rem", borderRadius: "16px" }}
                disabled={loading}
                id="password-input"
              />
            </div>
          </>
        )}

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.9rem", marginTop: "-0.5rem", marginLeft: "0.5rem" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary glow-pulse"
          disabled={!url || loading || isLimitReached}
          style={{ padding: "1.25rem", fontSize: "1.2rem", borderRadius: "16px" }}
          id="shorten-btn"
        >
          <Sparkles size={22} />
          {loading ? "Shortening..." : isLimitReached ? "Limit Reached" : "Shorten URL"}
        </button>
      </form>
    </div>
  );
}
