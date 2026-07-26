"use client";

import React, { useState } from "react";
import { signup, login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in username, email, and password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup(username, email, password, firstName, lastName, mobileNumber);
      await login(email, password); // auto login
      
      setTimeout(() => {
        window.dispatchEvent(new Event("auth-change"));
        router.push("/dashboard");
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem 0" }}>
      <div className="glass-card fade-in-up" style={{ width: "100%", maxWidth: "450px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem" }} className="text-gradient">
          Create Account
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="input"
              placeholder="johndoe"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input"
                placeholder="John"
                disabled={loading}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input"
                placeholder="Doe"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="input"
              placeholder="+1234567890"
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Email *</label>
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
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="input"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={8}
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--primary-color)", textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
