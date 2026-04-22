import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import {
  Search,
  Bell,
  TrendingUp,
  Box,
  AlertTriangle,
  Plus,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Users,
  Clock3,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAuth } from "../auth/AuthContext";

const NAVY = "#1a3a6b";
const NAVY_DARK = "#0f2447";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Group bookings by week label sorted chronologically (oldest → newest).
 * Uses a sort key of YYYY-MM-WW so ordering is always correct.
 */
function groupByWeek(bookings) {
  // Map: sortKey -> { label, count }
  const weekMap = {};
  bookings.forEach((b) => {
    if (!b.bookingDate) return;
    const d = new Date(b.bookingDate);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    const weekOfMonth = Math.ceil(d.getDate() / 7);
    // zero-pad month so "Jan" (0) sorts before "Feb" (1) etc.
    const sortKey = `${year}-${String(month).padStart(2, "0")}-${weekOfMonth}`;
    const label   = `${d.toLocaleString("default", { month: "short" })} W${weekOfMonth}`;
    if (!weekMap[sortKey]) weekMap[sortKey] = { week: label, bookings: 0 };
    weekMap[sortKey].bookings += 1;
  });

  // Sort by the numeric sort key (chronological) and take the last 8 weeks
  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([, v]) => v);
}

/** Format a booking for the Recent Activity panel. */
function bookingToActivity(b) {
  const statusMap = {
    PENDING:   { icon: Clock3,       iconColor: "#854d0e", iconBg: "#fef9c3", verb: "Pending review" },
    APPROVED:  { icon: CheckCircle2, iconColor: "#16a34a", iconBg: "#dcfce7", verb: "Approved" },
    REJECTED:  { icon: XCircle,      iconColor: "#991b1b", iconBg: "#fef2f2", verb: "Rejected" },
    CANCELLED: { icon: AlertCircle,  iconColor: "#64748b", iconBg: "#f1f5f9", verb: "Cancelled" },
  };
  const cfg = statusMap[b.status] || statusMap.PENDING;
  // Truncate long purpose text to 40 chars
  const rawPurpose = b.purpose || "";
  const purpose = rawPurpose.length > 40 ? rawPurpose.substring(0, 40) + "…" : rawPurpose;
  return {
    icon: cfg.icon,
    iconColor: cfg.iconColor,
    iconBg: cfg.iconBg,
    title: `${b.resourceName || "Resource"} — ${cfg.verb}`,
    desc: `By ${b.userName || "a user"} · ${purpose}`,
    time: b.bookingDate || "",
  };
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 14px", fontSize: "0.8125rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ fontWeight: "700", color: NAVY, margin: 0 }}>{label}</p>
      <p style={{ color: "#475569", margin: "2px 0 0" }}>{payload[0].value} bookings</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartView, setChartView] = useState("month");

  // Stats state
  const [stats, setStats] = useState({
    totalResources: null,
    totalBookings: null,
    pendingApprovals: null,
    activeUsers: null,
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingStats(true);
      try {
        const [resourcesRes, bookingsRes, usersRes] = await Promise.allSettled([
          axiosInstance.get("/api/resources"),
          axiosInstance.get("/api/bookings"),
          axiosInstance.get("/api/users"),
        ]);

        const resources = resourcesRes.status === "fulfilled" ? resourcesRes.value.data : [];
        const bookings  = bookingsRes.status  === "fulfilled" ? bookingsRes.value.data  : [];
        const usersData = usersRes.status     === "fulfilled" ? usersRes.value.data     : [];

        // Handle plain array, { content: [...] }, or { totalElements: N } from paginated APIs
        let activeUsersCount = 0;
        if (Array.isArray(usersData)) {
          activeUsersCount = usersData.length;
        } else if (usersData?.totalElements != null) {
          activeUsersCount = usersData.totalElements;
        } else if (Array.isArray(usersData?.content)) {
          activeUsersCount = usersData.content.length;
        }

        const pending = bookings.filter(b => b.status === "PENDING");

        setStats({
          totalResources:   Array.isArray(resources) ? resources.length : 0,
          totalBookings:    Array.isArray(bookings)  ? bookings.length  : 0,
          pendingApprovals: pending.length,
          activeUsers:      activeUsersCount,
        });

        // Chart: group ALL bookings by week
        setChartData(groupByWeek(bookings));

        // Recent activity: latest 4 bookings
        const sorted = [...bookings].sort((a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setRecentActivity(sorted.slice(0, 4).map(bookingToActivity));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setStats({ totalResources: 0, totalBookings: 0, pendingApprovals: 0, activeUsers: 0 });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAll();
  }, []);

  // ── Stat cards config (values wired to real state) ────────────────────────
  const STATS = [
    {
      icon: Box,
      iconColor: "#3b82f6",
      iconBg: "#eff6ff",
      label: "TOTAL RESOURCES",
      value: stats.totalResources,
      badge: null,
    },
    {
      icon: CalendarDays,
      iconColor: "#6366f1",
      iconBg: "#eef2ff",
      label: "TOTAL BOOKINGS",
      value: stats.totalBookings,
      badge: null,
    },
    {
      icon: AlertTriangle,
      iconColor: "#f97316",
      iconBg: "#fff7ed",
      label: "PENDING APPROVALS",
      value: stats.pendingApprovals,
      badge: stats.pendingApprovals > 0
        ? { text: "Needs attention", color: "#ea580c", bg: "#ffedd5" }
        : { text: "All clear", color: "#16a34a", bg: "#dcfce7" },
    },
    {
      icon: Users,
      iconColor: NAVY,
      iconBg: "#e8edf7",
      label: "ACTIVE USERS",
      value: stats.activeUsers,
      badge: null,
    },
  ];

  // peak week index for chart highlight
  const peakIndex = chartData.reduce(
    (maxIdx, d, i, arr) => (d.bookings > (arr[maxIdx]?.bookings || 0) ? i : maxIdx),
    0
  );

  // ── Styles ────────────────────────────────────────────────────────────────
  const s = {
    root: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: "#f5f6fa" },
    main: { marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
    topNav: { backgroundColor: "white", padding: "0 1.5rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50, gap: "1rem" },
    searchWrapper: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "9px", padding: "8px 14px", width: "240px" },
    searchInput: { border: "none", outline: "none", backgroundColor: "transparent", fontSize: "0.875rem", color: "#475569", width: "100%" },
    topNavRight: { display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" },
    newResourceBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "9px", border: "none", backgroundColor: NAVY, color: "white", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer" },
    bellBtn: { position: "relative", background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" },
    bellDot: { position: "absolute", top: 0, right: 0, width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", border: "2px solid white" },
    content: { padding: "1.75rem", flex: 1 },
    pageTitle: { fontSize: "1.625rem", fontWeight: "700", color: "#0f172a", margin: 0, letterSpacing: "-0.02em" },
    pageSub: { fontSize: "0.875rem", color: "#64748b", marginTop: "4px", marginBottom: "1.75rem" },

    statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" },
    statCard: { backgroundColor: "white", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    statIconBox: (bg) => ({ width: "42px", height: "42px", borderRadius: "11px", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }),
    statLabel: { fontSize: "0.6875rem", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.06em", marginBottom: "4px" },
    statValue: { fontSize: "1.875rem", fontWeight: "800", color: "#0f172a", lineHeight: 1, marginBottom: "10px" },
    statBadge: (color, bg) => ({ display: "inline-block", backgroundColor: bg, color, fontSize: "0.6875rem", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.04em" }),
    statSkeleton: { width: "60px", height: "36px", backgroundColor: "#f1f5f9", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" },

    twoCol: { display: "grid", gridTemplateColumns: "65fr 35fr", gap: "1rem", alignItems: "flex-start" },
    panel: { backgroundColor: "white", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" },
    panelTitle: { fontSize: "1rem", fontWeight: "700", color: "#0f172a", margin: 0 },
    panelSub: { fontSize: "0.8125rem", color: "#94a3b8", marginBottom: "1.25rem" },

    toggleGroup: { display: "flex", gap: "4px" },
    toggleBtn: (active) => ({ padding: "5px 12px", borderRadius: "7px", border: active ? "none" : "1px solid #e2e8f0", backgroundColor: active ? NAVY : "white", color: active ? "white" : "#64748b", fontSize: "0.75rem", fontWeight: "500", cursor: "pointer" }),

    activityItem: { display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f1f5f9", alignItems: "flex-start" },
    activityIconBox: (bg) => ({ width: "34px", height: "34px", borderRadius: "9px", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
    activityTitle: { fontSize: "0.875rem", fontWeight: "600", color: "#0f172a", margin: 0 },
    activityDesc: { fontSize: "0.8125rem", color: "#64748b", marginTop: "1px" },
    activityTime: { fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" },
    viewLogBtn: { width: "100%", marginTop: "1rem", padding: "10px", borderRadius: "9px", border: "1.5px solid #e2e8f0", backgroundColor: "white", color: "#374151", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer", boxSizing: "border-box" },

    emptyActivity: { textAlign: "center", padding: "2rem 1rem", color: "#94a3b8", fontSize: "0.875rem" },
    emptyChart: { display: "flex", alignItems: "center", justifyContent: "center", height: "240px", color: "#94a3b8", fontSize: "0.875rem" },
  };

  return (
    <div style={s.root}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar activeId="dashboard" />

      <main style={s.main}>
        {/* Top Navbar */}
        <header style={s.topNav}>
          <div style={s.searchWrapper}>
            <Search size={15} color="#94a3b8" />
            <input style={s.searchInput} placeholder="Search operations..." aria-label="Search operations" />
          </div>
          <div style={s.topNavRight}>
            <button style={s.newResourceBtn} onClick={() => navigate("/resources")}>
              <Plus size={15} /> New Resource
            </button>
            <button style={s.bellBtn} aria-label="Notifications">
              <Bell size={20} color="#64748b" />
              {stats.pendingApprovals > 0 && <span style={s.bellDot} />}
            </button>
            <ProfileDropdown />
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>
          <h1 style={s.pageTitle}>Campus Overview</h1>
          <p style={s.pageSub}>Real-time operational intelligence for the main campus sector.</p>

          {/* Stat Cards */}
          <div style={s.statsRow}>
            {STATS.map((st) => {
              const StatIcon = st.icon;
              return (
                <div key={st.label} style={s.statCard}>
                  <div style={s.statIconBox(st.iconBg)}>
                    <StatIcon size={20} color={st.iconColor} strokeWidth={2} />
                  </div>
                  <p style={s.statLabel}>{st.label}</p>
                  {loadingStats ? (
                    <div style={s.statSkeleton} />
                  ) : (
                    <p style={s.statValue}>{st.value ?? 0}</p>
                  )}
                  {!loadingStats && st.badge && (
                    <span style={s.statBadge(st.badge.color, st.badge.bg)}>
                      {st.badge.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Two Column */}
          <div style={s.twoCol}>
            {/* LEFT – Chart */}
            <div style={s.panel}>
              <div style={s.panelHeader}>
                <div>
                  <p style={s.panelTitle}>Booking Trends</p>
                </div>
                <div style={s.toggleGroup}>
                  <button style={s.toggleBtn(chartView === "month")} onClick={() => setChartView("month")}>Month</button>
                  <button style={s.toggleBtn(chartView === "week")} onClick={() => setChartView("week")}>Week</button>
                </div>
              </div>
              <p style={s.panelSub}>Bookings grouped by week from real data.</p>

              {loadingStats ? (
                <div style={s.emptyChart}>
                  <Loader2 size={28} color={NAVY} style={{ animation: "spin 1s linear infinite" }} />
                </div>
              ) : chartData.length === 0 ? (
                <div style={s.emptyChart}>No booking data available yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                    <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === peakIndex ? NAVY : "#e2e8f0"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* RIGHT – Recent Activity */}
            <div style={s.panel}>
              <p style={s.panelTitle}>Recent Bookings</p>
              <p style={{ ...s.panelSub, marginBottom: "0.25rem" }}> </p>

              {loadingStats ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                  <Loader2 size={24} color={NAVY} style={{ animation: "spin 1s linear infinite" }} />
                </div>
              ) : recentActivity.length === 0 ? (
                <div style={s.emptyActivity}>No recent bookings yet.</div>
              ) : (
                recentActivity.map((item, i) => {
                  const AIcon = item.icon;
                  return (
                    <div key={i} style={s.activityItem}>
                      <div style={s.activityIconBox(item.iconBg)}>
                        <AIcon size={16} color={item.iconColor} strokeWidth={2} />
                      </div>
                      <div>
                        <p style={s.activityTitle}>{item.title}</p>
                        <p style={s.activityDesc}>{item.desc}</p>
                        <p style={s.activityTime}>{item.time}</p>
                      </div>
                    </div>
                  );
                })
              )}

              <button style={s.viewLogBtn} onClick={() => navigate("/admin/bookings")}>
                View All Bookings →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
