import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, markAllAsRead } from "../api/notificationApi";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications().then(setNotifications).finally(() => setLoading(false));
  }, []);

  const handleClick = async (n) => {
    if (!n.read) {
      await markAsRead(n.id);
      setNotifications(notifications.map((x) => x.id === n.id ? { ...x, read: true } : x));
    }
    if (n.type === "TICKET_STATUS" || n.type === "NEW_COMMENT") {
      navigate(`/tickets/${n.referenceId}`);
    }
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button onClick={handleMarkAll} style={s.markAllBtn}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={s.empty}>No notifications yet.</div>
      ) : (
        <div style={s.list}>
          {notifications.map((n) => (
            <div key={n.id} onClick={() => handleClick(n)}
              style={{ ...s.item, background: n.read ? "#fff" : "#eff6ff" }}>
              <div style={s.dot(n.read)} />
              <div style={{ flex: 1 }}>
                <p style={s.message}>{n.message}</p>
                <span style={s.time}>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  container: { maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  title: { fontSize: "1.75rem", fontWeight: 700, margin: 0 },
  markAllBtn: { background: "none", border: "1px solid #2563eb", color: "#2563eb", borderRadius: 8, padding: "0.4rem 1rem", cursor: "pointer", fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  item: { display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1rem", borderRadius: 12, border: "1px solid #e5e7eb", cursor: "pointer" },
  dot: (read) => ({ width: 10, height: 10, borderRadius: "50%", background: read ? "#d1d5db" : "#2563eb", marginTop: 5, flexShrink: 0 }),
  message: { margin: 0, fontSize: "0.95rem", color: "#111", lineHeight: 1.5 },
  time: { fontSize: "0.8rem", color: "#9ca3af" },
  empty: { textAlign: "center", padding: "3rem", color: "#9ca3af", background: "#f9fafb", borderRadius: 12 },
  center: { textAlign: "center", padding: "3rem" },
};