"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getToken, removeToken } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, LogOut, LayoutDashboard, UserPlus, LogIn, Menu, X, Sun, Moon, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const checkAuth = useCallback(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [checkAuth]);

  // Show toast on login
  useEffect(() => {
    const handleLoginSuccess = () => {
      setToastMessage("Logged in successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    };
    window.addEventListener("login-success", handleLoginSuccess);
    return () => window.removeEventListener("login-success", handleLoginSuccess);
  }, []);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setToastMessage("Logging out...");

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Clear all session data
    removeToken();
    localStorage.removeItem("recentLinks");
    sessionStorage.clear();

    checkAuth();
    setMobileOpen(false);
    setLoggingOut(false);
    setToastMessage("Logged out successfully!");
    setTimeout(() => setToastMessage(null), 2500);

    // Replace current history entry so back button won't return to authenticated page
    router.replace("/");

    // Push a clean state to prevent back navigation to protected pages
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
      const preventBack = () => {
        window.history.pushState(null, "", "/");
      };
      window.addEventListener("popstate", preventBack);
      // Remove listener after 2 seconds (enough time for user to move on)
      setTimeout(() => {
        window.removeEventListener("popstate", preventBack);
      }, 2000);
    }
  };

  const navLinkStyle = (active: boolean) => ({
    color: active ? "var(--accent)" : "var(--text-secondary)",
    textDecoration: "none" as const,
    fontSize: "0.9rem",
    fontWeight: 500 as const,
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "0.4rem",
    transition: "color 0.2s",
    letterSpacing: "-0.01em" as const,
  });

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={scrolled ? "header-scrolled" : ""}
        style={{
          padding: "0.75rem 0",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--header-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "box-shadow 0.3s, border-color 0.3s, background 0.4s",
        }}
      >
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <div style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              borderRadius: "10px",
              padding: "0.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
            }}>
              <Link2 size={20} strokeWidth={2.5} />
            </div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "var(--font-outfit)" }} className="text-gradient">
              LinkSnap
            </h1>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Desktop Navigation */}
            <nav className="nav-links">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex" }}
                  >
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex" }}
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" style={navLinkStyle(pathname.includes("/dashboard"))}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-logout"
                  disabled={loggingOut}
                  style={{
                    padding: "0.4rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    opacity: loggingOut ? 0.6 : 1,
                    cursor: loggingOut ? "not-allowed" : "pointer",
                  }}
                >
                  {loggingOut ? <Loader2 size={14} className="spin-icon" /> : <LogOut size={14} />}
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={navLinkStyle(pathname === "/login")}>
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-primary btn-sm"
                  style={{ padding: "0.4rem 1.1rem", textDecoration: "none", fontSize: "0.85rem" }}
                >
                  <UserPlus size={15} />
                  Sign Up
                </Link>
              </>
            )}
            </nav>

            {/* Mobile Menu Button */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={toggleTheme}
                className="theme-toggle mobile-menu-btn"
                aria-label="Toggle theme"
                style={{ display: "none" }}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -30, x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="header-toast"
          >
            {toastMessage.includes("...") ? (
              <Loader2 size={16} className="spin-icon" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={22} />
        </button>

        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            borderRadius: "12px",
            padding: "0.6rem",
            display: "flex",
            color: "#000",
          }}>
            <Link2 size={28} strokeWidth={2.5} />
          </div>
          <span className="text-gradient" style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-outfit)" }}>LinkSnap</span>
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard" style={navLinkStyle(pathname.includes("/dashboard"))}>
              <LayoutDashboard size={22} />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              disabled={loggingOut}
              style={{ padding: "0.75rem 2rem", fontSize: "1.1rem" }}
            >
              {loggingOut ? <Loader2 size={20} className="spin-icon" /> : <LogOut size={20} />}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={navLinkStyle(pathname === "/login")}>
              <LogIn size={22} />
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: "0.75rem 2rem", textDecoration: "none", fontSize: "1.1rem" }}>
              <UserPlus size={20} />
              Sign Up
            </Link>
          </>
        )}
      </div>
    </>
  );
}
