"use client";

import React, { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      setLoading(false);

      // Show success state briefly before redirecting
      setTimeout(() => {
        window.dispatchEvent(new Event("auth-change"));
        window.dispatchEvent(new Event("login-success"));
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <motion.div
        className="glass-card gradient-border"
        style={{ width: "100%", maxWidth: "420px", position: "relative", overflow: "hidden" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Loading/Success Overlay */}
        <AnimatePresence>
          {(loading || success) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--overlay-bg)",
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                zIndex: 10,
                borderRadius: "var(--radius-card)",
              }}
            >
              {success ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 size={48} style={{ color: "var(--success)" }} />
                  </motion.div>
                  <p style={{ color: "var(--success)", fontWeight: 600, fontSize: "1.1rem" }}>
                    Login Successful!
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Redirecting to dashboard...
                  </p>
                </>
              ) : (
                <>
                  <Loader2 size={40} className="spin-icon" style={{ color: "var(--accent)" }} />
                  <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                    Logging in...
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header icon */}
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          color: "var(--btn-primary-text)",
        }}>
          <LogIn size={26} />
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.75rem" }} className="text-gradient">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <Mail size={15} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="input"
              placeholder="you@example.com"
              required
              disabled={loading || success}
              id="login-email"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              <Lock size={15} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="input"
              placeholder="••••••••"
              required
              disabled={loading || success}
              id="login-password"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  color: "var(--danger)",
                  fontSize: "0.875rem",
                  background: "rgba(231, 76, 60, 0.08)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-input)",
                  border: "1px solid rgba(231, 76, 60, 0.2)",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="btn btn-primary glow-pulse"
            disabled={loading || success}
            style={{ marginTop: "0.75rem", padding: "0.875rem", fontSize: "1rem" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            id="login-submit"
          >
            {loading ? (
              <><Loader2 size={18} className="spin-icon" /> Logging in...</>
            ) : success ? (
              <><CheckCircle2 size={18} /> Success!</>
            ) : (
              <><LogIn size={18} /> Login</>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
