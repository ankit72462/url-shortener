"use client";

import React, { useState } from "react";
import { ShortenResponse } from "@/lib/api";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";

interface RecentLinksProps {
  links: ShortenResponse[];
}

export default function RecentLinks({ links }: RecentLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!links || links.length === 0) {
    return (
      <div className="glass-card fade-in-up" style={{ width: "100%", maxWidth: "800px", margin: "3rem auto", animationDelay: "0.2s" }}>
        <h3 style={{ marginBottom: "1rem" }}>Recent Links</h3>
        <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.7, padding: "2rem 0" }}>
          No recent links yet. Shorten a URL to see it here!
        </p>
      </div>
    );
  }

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="glass-card fade-in-up" style={{ width: "100%", maxWidth: "800px", margin: "3rem auto", animationDelay: "0.2s" }}>
      <h3 style={{ marginBottom: "1.5rem" }}>Recent Links</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {links.map((link, index) => (
          <motion.div
            key={link.short_code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              background: "var(--card-inner-bg)",
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
              gap: "1rem",
              flexWrap: "wrap",
              transition: "all 0.3s ease",
            }}
            whileHover={{
              borderColor: "rgba(255, 255, 255, 0.12)",
              scale: 1.01,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <a
                href={link.short_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  marginBottom: "0.25rem",
                  color: "var(--accent)",
                }}
              >
                {link.short_url}
                <ExternalLink size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              </a>
              <p style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {link.long_url}
              </p>
            </div>

            <button
              onClick={() => handleCopy(link.short_url, link.short_code)}
              className="btn btn-secondary"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                minWidth: "100px",
                borderColor: copiedId === link.short_code ? "var(--accent)" : "var(--border-light)",
                color: copiedId === link.short_code ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {copiedId === link.short_code ? <Check size={16} /> : <Copy size={16} />}
              {copiedId === link.short_code ? "Copied!" : "Copy"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
