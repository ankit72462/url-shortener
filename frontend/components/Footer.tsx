"use client";

import React from "react";
import Link from "next/link";
import { Link2, Heart, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div style={{
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                borderRadius: "10px",
                padding: "0.35rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
              }}>
                <Link2 size={18} strokeWidth={2.5} />
              </div>
              <span className="text-gradient" style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-outfit)", letterSpacing: "-0.03em" }}>
                LinkSnap
              </span>
            </Link>
            <p className="footer-tagline">
              The premium URL shortener for modern creators. Fast, secure, and beautifully designed.
            </p>
          </div>

          {/* Product */}
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link href="/">URL Shortener</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/signup">Create Account</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Sign Up</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} LinkSnap. Crafted with{" "}
            <Heart size={13} style={{ display: "inline", verticalAlign: "-2px", color: "var(--danger)" }} fill="var(--danger)" />{" "}
            by Ankit Kumar
          </p>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Globe size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
