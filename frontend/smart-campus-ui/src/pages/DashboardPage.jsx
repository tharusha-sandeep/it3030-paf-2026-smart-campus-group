import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Ticket,
  Bell,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  ShieldCheck,
  Plus,
  ArrowRight,
  ChevronRight,
  Loader2,
  Clock,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";

const NAVY = "#1a3a6b";
const NAVY_DARK = "#0f2447";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    upcomingCount: 0,
    availableResources: 0,
    systemAlerts: 0
  });
  const [priorityBookings, setPriorityBookings] = useState([]);
  const [systemFeed, setSystemFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resourcesRes, bookingsRes] = await Promise.all([
          axiosInstance.get("/api/resources"),
          axiosInstance.get("/api/bookings/my")
        ]);

        const today = new Date().toISOString().split('T')[0];
        
        // Stats: Available Resources
        const activeResources = resourcesRes.data.filter(r => r.status === 'ACTIVE');
        
        // Stats: Upcoming Bookings (Approved & >= Today)
        const allMyBookings = bookingsRes.data || [];
        const upcoming = allMyBookings.filter(b => 
          b.status === 'APPROVED' && b.bookingDate >= today
        );

        setStats({
          upcomingCount: upcoming.length,
          availableResources: activeResources.length,
          systemAlerts: 0 // No alerts API yet
        });

        // Priority Bookings: Approved, sorted by date ASC, limit 3
        const sortedUpcoming = [...upcoming].sort((a, b) => 
          a.bookingDate.localeCompare(b.bookingDate)
        ).slice(0, 3);
        setPriorityBookings(sortedUpcoming);

        // System Feed: Last 3 booking changes (using createdAt or just last from list)
        // Sort by createdAt DESC if available, otherwise just use latest additions
        const sortedFeed = [...allMyBookings].sort((a, b) => 
          new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
        ).slice(0, 3);
        setSystemFeed(sortedFeed);

      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatCards = () => [
    {
      color: "#3b82f6",
      bg: "#eff6ff",
      emoji: "📅",
      label: "UPCOMING BOOKINGS",
      value: stats.upcomingCount,
      sub: "confirmed reservations",
      badge: null,
    },
    {
      color: "#f97316",
      bg: "#fff7ed",
      emoji: "📦",
      label: "AVAILABLE RESOURCES",
      value: stats.availableResources,
      sub: "items active",
      badge: { text: "LIVE", color: "#f97316", bg: "#fff7ed" },
    },
    {
      color: "#ef4444",
      bg: "#fff1f2",
      emoji: "🔔",
      label: "SYSTEM ALERTS",
      value: stats.systemAlerts,
      sub: "no current issues",
      badge: { text: "STABLE", color: "#64748b", bg: "#f1f5f9" },
    },
  ];

  const layout = {
    root: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", backgroundColor: "#f5f6fa" },
    main: { marginLeft: "220px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" },
    topNav: { backgroundColor: "white", padding: "0 1.5rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50 },
    searchWrapper: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "9px", padding: "8px 14px", width: "280px" },
    searchInput: { border: "none", outline: "none", backgroundColor: "transparent", fontSize: "0.875rem", color: "#475569", width: "100%" },
    topNavRight: { display: "flex", alignItems: "center", gap: "16px" },
    bellBtn: { position: "relative", background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" },
    content: { padding: "1.75rem", flex: 1 },
    welcome: { marginBottom: "1.75rem" },
    welcomeTitle: { fontSize: "1.625rem", fontWeight: "700", color: "#0f172a", margin: 0 },
    welcomeSub: { fontSize: "0.875rem", color: "#64748b", marginTop: "4px" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.75rem" },
    statCard: { backgroundColor: "white", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "10px" },
    statIconBox: (bg) => ({ width: "44px", height: "44px", borderRadius: "11px", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }),
    statLabel: (color) => ({ fontSize: "0.6875rem", fontWeight: "700", color, letterSpacing: "0.06em" }),
    statValue: { fontSize: "2rem", fontWeight: "800", color: "#0f172a", lineHeight: 1 },
    statSub: { fontSize: "0.8125rem", color: "#64748b" },
    statBadge: (color, bg) => ({ display: "inline-block", backgroundColor: bg, color, fontSize: "0.625rem", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", alignSelf: "flex-start" }),
    twoCol: { display: "grid", gridTemplateColumns: "65fr 35fr", gap: "1rem" },
    panel: { backgroundColor: "white", borderRadius: "14px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    panelTitle: { fontSize: "1rem", fontWeight: "700", color: "#0f172a", margin: 0 },
    viewAllLink: { fontSize: "0.8125rem", color: "#3b82f6", textDecoration: "none", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", border: "none", background: "none", padding: 0 },
    bookingCard: { display: "flex", gap: "14px", padding: "14px", borderRadius: "11px", border: "1px solid #f1f5f9", borderLeft: "4px solid #3b82f6", marginBottom: "10px", alignItems: "flex-start" },
    bookingDateBox: { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#f8fafc", padding: "8px", borderRadius: "8px", minWidth: "50px" },
    bookingDay: { fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" },
    bookingMonth: { fontSize: "0.625rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" },
    bookingTitle: { fontSize: "0.9375rem", fontWeight: "600", color: "#0f172a", margin: 0 },
    bookingLoc: { fontSize: "0.8125rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" },
    bookingTime: { fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" },
    emptyState: { padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" },
    rightCol: { display: "flex", flexDirection: "column", gap: "1rem" },
    launchpad: { background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, borderRadius: "14px", padding: "1.25rem", color: "white" },
    launchpadTitle: { fontSize: "0.9375rem", fontWeight: "700", marginBottom: "0.25rem" },
    launchpadSub: { fontSize: "0.8125rem", color: "rgba(255,255,255,0.65)", marginBottom: "1rem" },
    outlineBtn: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 12px", backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "9px", color: "white", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer", marginBottom: "8px", transition: "all 0.2s" },
    feedCard: { display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f1f5f9", alignItems: "flex-start" },
    feedDot: (status) => {
      const colors = { PENDING: '#eab308', APPROVED: '#22c55e', REJECTED: '#ef4444', CANCELLED: '#64748b' };
      return { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colors[status] || '#cbd5e1', marginTop: "6px", flexShrink: 0 };
    },
    fab: { position: "fixed", bottom: "2rem", right: "2rem", width: "52px", height: "52px", borderRadius: "50%", background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(26,58,107,0.45)", zIndex: 200 },
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' })
    };
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div style={layout.root}>
      <Sidebar activeId="dashboard" />

      <main style={layout.main}>
        <header style={layout.topNav}>
          <div style={layout.searchWrapper}>
            <Search size={15} color="#94a3b8" />
            <input style={layout.searchInput} placeholder="Search operations..." />
          </div>
          <div style={layout.topNavRight}>
            <button style={layout.bellBtn} aria-label="Notifications">
              <Bell size={20} />
              {stats.systemAlerts > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", border: "2px solid white" }} />}
            </button>
            <ProfileDropdown />
          </div>
        </header>

        <div style={layout.content}>
          <div style={layout.welcome}>
            <h1 style={layout.welcomeTitle}>Welcome back, {user?.name || "User"}!</h1>
            <p style={layout.welcomeSub}>University Operations Platform</p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
              <Loader2 size={40} className="animate-spin" color={NAVY} />
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div style={layout.statsRow}>
                {getStatCards().map((st) => (
                  <div key={st.label} style={layout.statCard}>
                    <div style={layout.statIconBox(st.bg)}>{st.emoji}</div>
                    <span style={layout.statLabel(st.color)}>{st.label}</span>
                    <span style={layout.statValue}>{st.value}</span>
                    <span style={layout.statSub}>{st.sub}</span>
                  </div>
                ))}
              </div>

              {/* Two Columns */}
              <div style={layout.twoCol}>
                {/* LEFT – Bookings */}
                <div style={layout.panel}>
                  <div style={layout.panelHeader}>
                    <p style={layout.panelTitle}>Your Priority Bookings</p>
                    <button style={layout.viewAllLink} onClick={() => navigate("/bookings")}>
                      View All Schedule <ChevronRight size={14} />
                    </button>
                  </div>
                  
                  {priorityBookings.length > 0 ? (
                    priorityBookings.map((b, i) => {
                      const { day, month } = formatDate(b.bookingDate);
                      return (
                        <div key={b.id || i} style={layout.bookingCard}>
                          <div style={layout.bookingDateBox}>
                            <span style={layout.bookingDay}>{day}</span>
                            <span style={layout.bookingMonth}>{month}</span>
                          </div>
                          <div>
                            <p style={layout.bookingTitle}>{b.resourceName}</p>
                            <span style={layout.bookingLoc}>{b.resourceLocation || "Main Campus"}</span>
                            <div style={layout.bookingTime}>
                              <Clock size={12} /> {b.startTime} – {b.endTime}
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", fontStyle: "italic" }}>
                              "{b.purpose?.length > 60 ? b.purpose.substring(0, 57) + "..." : b.purpose}"
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={layout.emptyState}>No upcoming bookings found.</div>
                  )}
                </div>

                {/* RIGHT */}
                <div style={layout.rightCol}>
                  <div style={layout.launchpad}>
                    <p style={layout.launchpadTitle}>Operations Launchpad</p>
                    <p style={layout.launchpadSub}>Quick access to core functions</p>
                    <button style={layout.outlineBtn} onClick={() => navigate("/bookings")}>
                      Book a Room <ArrowRight size={15} />
                    </button>
                    <button style={{ ...layout.outlineBtn, marginBottom: 0 }} onClick={() => navigate("/resources")}>
                      Browse Catalog <ArrowRight size={15} />
                    </button>
                  </div>

                  <div style={layout.panel}>
                    <div style={layout.panelHeader}>
                       <p style={layout.panelTitle}>System Feed</p>
                    </div>
                    {systemFeed.length > 0 ? (
                      systemFeed.map((f, i) => (
                        <div key={f.id || i} style={layout.feedCard}>
                          <div style={layout.feedDot(f.status)} />
                          <div>
                            <p style={layout.feedTitle}>{f.resourceName} — {f.status}</p>
                            <p style={layout.feedDesc}>Booking for {f.bookingDate}</p>
                            <p style={layout.feedTime}>{getTimeAgo(f.updatedAt || f.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={layout.emptyState}>No recent activity.</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <button style={layout.fab} onClick={() => navigate("/bookings")} title="New Booking">
        <Plus size={22} />
      </button>
    </div>
  );
};

export default DashboardPage;
