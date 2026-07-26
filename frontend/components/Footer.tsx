import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: "2rem 0", borderTop: "1px solid var(--border-light)", background: "rgba(10, 10, 15, 0.4)", textAlign: "center", marginTop: "auto" }}>
      <div className="container">
        <p style={{ fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} LinkSnap. Crafted with precision.
        </p>
      </div>
    </footer>
  );
}
