"use client";

import React, { useEffect, useState } from "react";
import { getActivityLogs, getFailureLogs, LogEntry } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogsPage() {
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);
  const [failureLogs, setFailureLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const [activity, failures] = await Promise.all([getActivityLogs(), getFailureLogs()]);
      setActivityLogs(activity);
      setFailureLogs(failures);
    } catch (err: any) {
      if (err.message.includes("Not authorized") || err.message.includes("Not authenticated")) {
        router.push("/dashboard");
      } else {
        setError(err.message || "Failed to fetch logs");
      }
    } finally {
      setLoading(false);
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
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "2rem", fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.5rem", margin: 0 }} className="text-gradient">System Logs</h2>
        <p style={{ margin: "0.5rem 0 0 0", color: "var(--text-secondary)" }}>Monitor administrative activity and system failures.</p>
      </div>

      {error && (
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card" style={{ color: "hsl(0, 80%, 65%)", marginBottom: "2rem", borderColor: "rgba(231, 76, 60, 0.3)" }}>
          {error}
        </motion.div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
        
        {/* Failure Logs Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <ShieldAlert size={24} color="#e74c3c" />
            <h3 style={{ margin: 0, color: "#f0f0f5", fontSize: "1.5rem" }}>Failure Logs</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Error Type</th>
                  <th>User ID</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {failureLogs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No failures logged.</td></tr>
                ) : (
                  failureLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>{new Date(log.created_at).toLocaleString()}</td>
                      <td><span className="badge badge-danger">{log.error_type}</span></td>
                      <td>{log.user_id || "-"}</td>
                      <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{log.ip_address || "-"}</td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activity Logs Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Activity size={24} color="var(--primary)" />
            <h3 style={{ margin: 0, color: "#f0f0f5", fontSize: "1.5rem" }}>Activity Logs</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>User ID</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No activities logged.</td></tr>
                ) : (
                  activityLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>{new Date(log.created_at).toLocaleString()}</td>
                      <td><span className="badge badge-success" style={{ background: "rgba(102, 126, 234, 0.15)", color: "var(--primary)", borderColor: "rgba(102, 126, 234, 0.3)" }}>{log.action}</span></td>
                      <td>{log.user_id || "-"}</td>
                      <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{log.ip_address || "-"}</td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
