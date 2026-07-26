"use client";

import React, { useState } from "react";
import { unlockLink } from "@/lib/api";
import { Lock } from "lucide-react";

export default function UnlockPage({ params }: { params: { shortCode: string } }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError("");
    setLoading(true);

    try {
      const result = await unlockLink(params.shortCode, password);
      // Redirect to the actual long URL
      window.location.href = result.long_url;
    } catch (err: any) {
      setError(err.message || "Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-card fade-in-up" style={{ maxWidth: "400px", width: "100%", padding: "2rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--primary)" }}>
          <Lock size={48} />
        </div>
        <h2 style={{ marginBottom: "0.5rem" }}>Protected Link</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          This link is password protected. Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter password"
            className="input"
            style={{ fontSize: "1.1rem", padding: "1rem", borderRadius: "12px", textAlign: "center" }}
            required
            disabled={loading}
          />
          
          {error && (
            <div style={{ color: "hsl(0, 80%, 65%)", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!password || loading}
            style={{ padding: "1rem", fontSize: "1.1rem", borderRadius: "12px" }}
          >
            {loading ? "Unlocking..." : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
