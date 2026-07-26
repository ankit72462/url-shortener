"use client";

import React, { useState } from "react";
import { ShortenResponse } from "@/lib/api";

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
        {links.map((link) => (
          <div 
            key={link.short_code} 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "1rem",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "12px",
              border: "1px solid var(--border-light)",
              gap: "1rem",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <a href={link.short_url} target="_blank" rel="noreferrer" style={{ display: "block", fontFamily: "monospace", fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--accent)" }}>
                {link.short_url}
              </a>
              <p style={{ fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {link.long_url}
              </p>
            </div>
            
            <button 
              onClick={() => handleCopy(link.short_url, link.short_code)} 
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", minWidth: "90px", borderColor: copiedId === link.short_code ? "var(--accent)" : "var(--border-light)", color: copiedId === link.short_code ? "var(--accent)" : "var(--text-primary)" }}
            >
              {copiedId === link.short_code ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
