"use client";

import React, { useEffect, useState } from "react";
import { getAnalytics, AnalyticsData } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MousePointerClick, Globe, Monitor, Share2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#6366f1', '#14b8a6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export default function AnalyticsPage({ params }: { params: { shortCode: string } }) {
  // `use` not actually needed if params is direct but in Next 15 it's a promise, we are in Next 14 so it's fine
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [params.shortCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics(params.shortCode);
      setData(res);
    } catch (err: any) {
      if (err.message.includes("Not authenticated")) {
        router.push("/login");
      } else {
        setError(err.message || "Failed to load analytics");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "4rem" }}>Loading analytics...</div>;
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ color: "hsl(0, 80%, 65%)", margin: "2rem 0" }}>
        {error || "No data available"}
      </div>
    );
  }

  const formatChartData = (record: Record<string, number> | undefined) => {
    if (!record) return [];
    return Object.entries(record).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  const browserData = formatChartData(data.browsers);
  const osData = formatChartData(data.os);
  const referrerData = formatChartData(data.referrers);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/dashboard" className="btn" style={{ background: "transparent", border: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h2 style={{ fontSize: "2rem", margin: 0 }} className="text-gradient">
          Analytics for /{params.shortCode}
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-card fade-in-up" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "rgba(99, 102, 241, 0.2)", padding: "1rem", borderRadius: "12px", color: "var(--primary-color)" }}>
            <MousePointerClick size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Total Clicks</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{data.total_clicks}</div>
          </div>
        </div>
      </div>

      {data.total_clicks > 0 ? (
        <>
          <div className="glass-card fade-in-up" style={{ marginBottom: "2rem", animationDelay: "0.1s" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MousePointerClick size={18} className="text-gradient" /> Clicks Over Time
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.clicks_by_date} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ background: "rgba(10, 10, 15, 0.9)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)" }}
                    itemStyle={{ color: "var(--primary-color)" }}
                  />
                  <Line type="monotone" dataKey="count" name="Clicks" stroke="var(--primary-color)" strokeWidth={3} dot={{ fill: "var(--bg-color)", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: "var(--accent-color)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div className="glass-card fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 style={{ marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Globe size={18} className="text-gradient" /> Browsers
              </h3>
              <div style={{ width: "100%", height: 250 }}>
                {browserData.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={browserData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ background: "rgba(10, 10, 15, 0.9)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)" }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>No data available</div>
                )}
              </div>
            </div>

            <div className="glass-card fade-in-up" style={{ animationDelay: "0.3s" }}>
              <h3 style={{ marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Monitor size={18} className="text-gradient" /> Operating Systems
              </h3>
              <div style={{ width: "100%", height: 250 }}>
                {osData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={osData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                      <XAxis type="number" stroke="var(--text-secondary)" axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" axisLine={false} tickLine={false} width={80} />
                      <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(10, 10, 15, 0.9)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)" }} />
                      <Bar dataKey="value" name="Clicks" fill="var(--accent-color)" radius={[0, 4, 4, 0]}>
                        {osData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>No data available</div>
                )}
              </div>
            </div>
            
            <div className="glass-card fade-in-up" style={{ animationDelay: "0.4s" }}>
              <h3 style={{ marginTop: 0, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Share2 size={18} className="text-gradient" /> Referrers
              </h3>
              <div style={{ width: "100%", height: 250 }}>
                {referrerData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={referrerData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                      <XAxis type="number" stroke="var(--text-secondary)" axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" axisLine={false} tickLine={false} width={100} />
                      <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ background: "rgba(10, 10, 15, 0.9)", border: "1px solid var(--border-light)", borderRadius: "8px", color: "var(--text-primary)" }} />
                      <Bar dataKey="value" name="Clicks" fill="var(--primary-color)" radius={[0, 4, 4, 0]}>
                        {referrerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>No data available</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card fade-in-up" style={{ textAlign: "center", padding: "4rem 2rem", marginTop: "2rem" }}>
          <MousePointerClick size={48} style={{ color: "var(--text-secondary)", opacity: 0.5, marginBottom: "1rem" }} />
          <h3 style={{ margin: "0 0 0.5rem 0" }}>No Clicks Yet</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>Share your shortened link to start collecting analytics data.</p>
        </div>
      )}
    </div>
  );
}
