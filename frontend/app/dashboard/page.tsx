"use client";

import React, { useEffect, useState } from "react";
import { listUserLinks, updateLink, deleteLink, getMe, Link as LinkType, User } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart2, Trash2, Power, PowerOff, ShieldCheck, Link2Off, ExternalLink, Lock, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAd from "@/components/GoogleAd";

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRFor, setShowQRFor] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const [data, me] = await Promise.all([listUserLinks(), getMe()]);
      setLinks(data);
      setUser(me);
    } catch (err: any) {
      if (err.message.includes("Not authenticated") || err.message.includes("Could not validate credentials")) {
        router.push("/login");
      } else {
        setError(err.message || "Failed to load links");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (link: LinkType) => {
    try {
      await updateLink(link.short_code, !link.is_active);
      setLinks(links.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l));
    } catch (err: any) {
      alert(err.message || "Failed to update link");
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await deleteLink(shortCode);
      setLinks(links.filter(l => l.short_code !== shortCode));
    } catch (err: any) {
      alert(err.message || "Failed to delete link");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: "40px", height: "40px", border: "4px solid var(--border-light)", borderTopColor: "var(--accent)", borderRadius: "50%" }}
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", margin: 0 }} className="text-gradient">Dashboard</h2>
          <p style={{ margin: "0.5rem 0 0 0" }}>Manage and track your shortened URLs.</p>
        </div>
        
        {user?.is_admin && (
          <Link href="/admin/logs" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={18} color="var(--accent)" />
            Admin Panel
          </Link>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "2rem" }}
      >
        <GoogleAd adSlot="DASHBOARD_TOP_SLOT" format="horizontal" />
      </motion.div>

      {error && (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card" style={{ color: "hsl(0, 80%, 65%)", marginBottom: "2rem", borderColor: "rgba(231, 76, 60, 0.3)" }}>
          {error}
        </motion.div>
      )}

      {links.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card" 
          style={{ textAlign: "center", padding: "6rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          <div style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "50%", color: "var(--text-secondary)" }}>
            <Link2Off size={48} strokeWidth={1.5} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No Links Found</h3>
            <p style={{ maxWidth: "400px", margin: "0 auto" }}>You haven't created any shortened links yet. Go to the homepage to create your first link.</p>
          </div>
          <Link href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Shorten a Link Now
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          <AnimatePresence>
            {links.map((link, i) => (
              <motion.div 
                key={link.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass-card" 
                style={{ display: "flex", flexDirection: "column", padding: "1.5rem", gap: "1.5rem" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <a 
                      href={link.short_url || `${window.location.origin}/${link.short_code}`} 
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", wordBreak: "break-all" }}
                    >
                      /{link.short_code}
                      {link.has_password && <Lock size={16} color="var(--accent)" title="Password Protected" />}
                      <ExternalLink size={16} />
                    </a>
                    <span className={link.is_active ? "badge badge-success" : "badge badge-danger"}>
                      {link.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: "0.95rem", 
                    color: "var(--text-secondary)", 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis",
                    background: "rgba(0,0,0,0.3)",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-light)"
                  }}>
                    {link.long_url}
                  </div>
                </div>

                {showQRFor === link.id && (
                  <div style={{ background: "white", padding: "1rem", borderRadius: "8px", display: "flex", justifyContent: "center", margin: "0.5rem 0" }}>
                    <QRCodeSVG 
                      value={link.short_url || `${window.location.origin}/${link.short_code}`} 
                      size={150}
                      level="H"
                    />
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Clicks</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--text-primary)" }}>{link.clicks?.toLocaleString() || 0}</span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => setShowQRFor(showQRFor === link.id ? null : link.id)}
                      className="btn btn-secondary"
                      style={{ padding: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Show QR Code"
                    >
                      <QrCode size={18} />
                    </button>
                    <Link 
                      href={`/dashboard/analytics/${link.short_code}`}
                      className="btn btn-secondary"
                      style={{ padding: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="View Analytics"
                    >
                      <BarChart2 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleToggleActive(link)}
                      className="btn btn-secondary"
                      style={{ padding: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title={link.is_active ? "Deactivate Link" : "Activate Link"}
                    >
                      {link.is_active ? <PowerOff size={18} color="#e74c3c" /> : <Power size={18} color="#2ecc71" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(link.short_code)}
                      className="btn btn-secondary"
                      style={{ padding: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", borderColor: "rgba(231, 76, 60, 0.3)" }}
                      title="Delete Link"
                    >
                      <Trash2 size={18} color="#e74c3c" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
