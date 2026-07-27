"use client";

import React, { useState, useMemo } from "react";
import { signup, login } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, User, Mail, Lock, Phone, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

/* ===== Password Strength Calculator ===== */
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "var(--danger)" };
  if (score === 2) return { score: 40, label: "Fair", color: "var(--warning)" };
  if (score === 3) return { score: 60, label: "Good", color: "hsl(40, 80%, 55%)" };
  if (score === 4) return { score: 80, label: "Strong", color: "var(--success)" };
  return { score: 100, label: "Excellent", color: "hsl(160, 70%, 45%)" };
}

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

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
      await login(email, password);
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        window.dispatchEvent(new Event("auth-change"));
        window.dispatchEvent(new Event("login-success"));
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      setLoading(false);
    }
  };

  const formFields = [
    { delay: 0.05, content: (
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
          <User size={16} /> Username <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }}
          className="input" placeholder="johndoe" required disabled={loading} minLength={3} id="signup-username" />
      </div>
    )},
    { delay: 0.1, content: (
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="input" placeholder="John" disabled={loading} id="signup-firstname" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="input" placeholder="Doe" disabled={loading} id="signup-lastname" />
        </div>
      </div>
    )},
    { delay: 0.15, content: (
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
          <Phone size={16} /> Mobile Number
        </label>
        <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}
          className="input" placeholder="+1234567890" disabled={loading} id="signup-mobile" />
      </div>
    )},
    { delay: 0.2, content: (
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
          <Mail size={16} /> Email <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="input" placeholder="you@example.com" required disabled={loading} id="signup-email" />
      </div>
    )},
    { delay: 0.25, content: (
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
          <Lock size={16} /> Password <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
          className="input" placeholder="••••••••" required disabled={loading} minLength={8} id="signup-password" />
        {/* Password Strength Indicator */}
        {password && (
          <div style={{ marginTop: "0.75rem" }}>
            <div className="password-strength-bar">
              <div
                className="password-strength-fill"
                style={{ width: `${strength.score}%`, background: strength.color }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.8rem", color: strength.color, fontWeight: 600 }}>
                {strength.label}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Min 8 characters
              </span>
            </div>
          </div>
        )}
      </div>
    )},
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem 0" }}>
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
                    Account Created!
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Redirecting to dashboard...
                  </p>
                </>
              ) : (
                <>
                  <Loader2 size={40} className="spin-icon" style={{ color: "var(--accent)" }} />
                  <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                    Creating your account...
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
          <ShieldCheck size={28} />
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.75rem" }} className="text-gradient">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {formFields.map((field, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: field.delay, duration: 0.4 }}
            >
              {field.content}
            </motion.div>
          ))}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: "var(--danger)", fontSize: "0.9rem" }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary glow-pulse"
            disabled={loading || success}
            style={{ marginTop: "0.75rem", padding: "0.875rem", fontSize: "1rem" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            id="signup-submit"
          >
            {loading ? (
              <><Loader2 size={18} className="spin-icon" /> Creating Account...</>
            ) : success ? (
              <><CheckCircle2 size={18} /> Success!</>
            ) : (
              <><UserPlus size={18} /> Sign Up</>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
