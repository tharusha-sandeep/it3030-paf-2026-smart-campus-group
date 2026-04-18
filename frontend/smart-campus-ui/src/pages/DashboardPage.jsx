import { useAuth } from "../auth/AuthContext";
import { LogOut, User, Mail, Shield } from "lucide-react";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "white",
      borderRadius: "1rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      backgroundColor: "white",
      color: "#374151",
      cursor: "pointer",
      fontWeight: "500",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#f9fafb",
      marginBottom: "12px",
    },
    label: {
      fontSize: "0.875rem",
      color: "#6b7280",
      flex: 1,
    },
    value: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#111827",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <button style={styles.logoutBtn} onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ color: "#4b5563", marginBottom: "1rem" }}>Welcome back! Here is your account information:</p>
          
          <div style={styles.infoRow}>
            <User size={20} color="#15803d" />
            <span style={styles.label}>Full Name</span>
            <span style={styles.value}>{user?.name}</span>
          </div>

          <div style={styles.infoRow}>
            <Mail size={20} color="#15803d" />
            <span style={styles.label}>Email Address</span>
            <span style={styles.value}>{user?.email}</span>
          </div>

          <div style={styles.infoRow}>
            <Shield size={20} color="#15803d" />
            <span style={styles.label}>System Role</span>
            <span style={styles.value}>{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
