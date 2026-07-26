"use client";

import React, { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Wait a tick for localstorage
      setTimeout(() => {
        // Trigger a global custom event so Header can update
        window.dispatchEvent(new Event("auth-change"));
        router.push("/dashboard");
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="glass-card fade-in-up" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }} className="text-gradient">
          Welcome Back
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="input"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div style={{ color: "hsl(0, 80%, 65%)", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ marginTop: "1rem", padding: "1rem", fontSize: "1.1rem" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "var(--primary-color)", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
