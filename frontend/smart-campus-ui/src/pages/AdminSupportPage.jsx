import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { 
  Ticket, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle, 
  Mail, 
  User, 
  Calendar,
  MessageSquare,
  Clock
} from "lucide-react";

/**
 * Admin Support Messages Directory
 * Displays all user inquiries in a clean, professional table.
 */
const AdminSupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/api/support/messages");
      setMessages(response.data);
    } catch (err) {
      setError("Failed to load support messages.");
      toast.error("Connectivity issue with support API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => 
    msg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    root: { display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" },
    main: { marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column" },
    header: { 
      height: "64px", 
      backgroundColor: "white", 
      borderBottom: "1px solid #E2E8F0", 
      padding: "0 32px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "flex-end", 
      position: "sticky", 
      top: 0, 
      zIndex: 50 
    },
    content: { padding: "32px", maxWidth: "1400px", margin: "0 auto", width: "100%" },
    pageHeader: { marginBottom: "32px" },
    title: { fontSize: "24px", fontWeight: "700", color: "#0F172A" },
    sub: { fontSize: "14px", color: "#64748B", marginTop: "4px" },

    card: { 
      backgroundColor: "white", 
      borderRadius: "12px", 
      border: "1px solid #E2E8F0", 
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      overflow: "hidden"
    },

    toolbar: {
      padding: "16px 24px",
      borderBottom: "1px solid #F1F5F9",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FDFDFD"
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#F1F5F9",
      padding: "8px 16px",
      borderRadius: "8px",
      width: "320px"
    },
    searchInput: {
      border: "none",
      background: "none",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      color: "#0F172A"
    },

    table: { width: "100%", borderCollapse: "collapse" },
    th: { 
      textAlign: "left", 
      padding: "12px 24px", 
      fontSize: "12px", 
      fontWeight: "600", 
      color: "#64748B", 
      textTransform: "uppercase", 
      letterSpacing: "0.05em",
      backgroundColor: "#F8FAFC",
      borderBottom: "1px solid #E2E8F0"
    },
    td: { 
      padding: "16px 24px", 
      fontSize: "14px", 
      color: "#374151", 
      borderBottom: "1px solid #F1F5F9",
      verticalAlign: "top"
    },
    userName: { fontWeight: "600", color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" },
    userEmail: { fontSize: "12px", color: "#94A3B8", marginTop: "2px" },
    subject: { fontWeight: "600", color: "#0F172A", marginBottom: "4px" },
    message: { fontSize: "13px", color: "#64748B", lineHeight: "1.5", maxWidth: "400px" },
    date: { fontSize: "12px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "6px" },

    empty: { padding: "80px", textAlign: "center", borderTop: "1px solid #F1F5F9" }
  };

  return (
    <div style={styles.root}>
      <Sidebar activeId="admin-support" />
      <main style={styles.main}>
        <header style={styles.header}>
          <ProfileDropdown />
        </header>

        <div style={styles.content}>
          <div style={styles.pageHeader}>
            <h1 style={styles.title}>Support Tickets</h1>
            <p style={styles.sub}>Review and respond to inquiries from the campus community.</p>
          </div>

          <div style={styles.card}>
            <div style={styles.toolbar}>
              <div style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <input 
                  style={styles.searchInput} 
                  placeholder="Search by name, email or subject..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn-secondary" 
                onClick={fetchMessages}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Clock size={14} /> Refresh
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>User Information</th>
                    <th style={styles.th}>Message Details</th>
                    <th style={styles.th}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" style={{ padding: "100px", textAlign: "center" }}>
                        <Loader2 className="animate-spin" size={32} color="#0EA5E9" />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" style={{ padding: "80px", textAlign: "center" }}>
                        <AlertCircle size={32} color="#EF4444" style={{ marginBottom: "12px" }} />
                        <div style={{ fontWeight: "600", color: "#0F172A" }}>{error}</div>
                      </td>
                    </tr>
                  ) : filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={styles.empty}>
                        <div style={{ fontSize: "32px", marginBottom: "16px" }}>📩</div>
                        <div style={{ fontWeight: "600", color: "#0F172A" }}>No messages found</div>
                        <div style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Users haven't submitted any support tickets yet.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map(msg => (
                      <tr key={msg.id}>
                        <td style={styles.td}>
                          <div style={styles.userName}><User size={14} color="#0EA5E9" /> {msg.userName}</div>
                          <div style={styles.userEmail}>{msg.userEmail}</div>
                          <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>UUID: {msg.userId.substring(0, 8)}...</div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.subject}>{msg.subject}</div>
                          <div style={styles.message}>{msg.message}</div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.date}>
                            <Calendar size={14} /> {new Date(msg.createdAt).toLocaleDateString()}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={12} /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSupportPage;
