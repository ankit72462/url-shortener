import React from "react";
import Link from "next/link";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div 
        className="glass-card gradient-border fade-in-up" 
        style={{ width: "100%", maxWidth: "500px", textAlign: "center", padding: "3rem 2rem" }}
      >
        <div style={{
          width: "10vh",
          height: "10vh",
          minWidth: "70px",
          minHeight: "70px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--danger), var(--warning))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 2rem",
          color: "#fff",
        }}>
          <SearchX size={36} />
        </div>
        
        <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }} className="text-gradient">
          Link Not Found
        </h2>
        
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Oops! The link you are looking for does not exist, has expired, or has been removed.
        </p>
        
        <Link 
          href="/" 
          className="btn btn-primary glow-pulse"
          style={{ padding: "1rem 2rem", fontSize: "1.1rem", display: "inline-flex" }}
        >
          <Home size={20} />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
