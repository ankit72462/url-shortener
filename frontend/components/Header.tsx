"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getToken, removeToken } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Link2, LogOut, LayoutDashboard, UserPlus, LogIn } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = () => {
    setIsLoggedIn(!!getToken());
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    checkAuth();
    router.push("/");
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ 
        padding: "1rem 0", 
        borderBottom: "1px solid var(--border-light)", 
        background: "rgba(6, 6, 12, 0.75)", 
        backdropFilter: "blur(24px)", 
        WebkitBackdropFilter: "blur(24px)",
        position: "sticky", 
        top: 0, 
        zIndex: 50 
      }}
    >
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ 
            background: "linear-gradient(135deg, var(--primary), var(--accent))", 
            borderRadius: "12px", 
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000"
          }}>
            <Link2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "-0.05em", lineHeight: 1 }} className="text-gradient">
              LinkSnap
            </h1>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                style={{ 
                  color: pathname.includes("/dashboard") ? "var(--accent)" : "var(--text-secondary)", 
                  textDecoration: "none", 
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "color 0.2s"
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                style={{ 
                  color: "var(--text-secondary)", 
                  textDecoration: "none", 
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn btn-primary" 
                style={{ padding: "0.5rem 1.5rem", textDecoration: "none" }}
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
