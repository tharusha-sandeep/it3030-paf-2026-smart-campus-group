import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Send, 
  MessageSquare, 
  Info,
  ExternalLink,
  BookOpen,
  CalendarCheck,
  UserCheck
} from "lucide-react";

// FAQ Component for Accordion effect
const FAQItem = ({ question, answer, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ 
      border: "1px solid #E2E8F0", 
      borderRadius: "12px", 
      marginBottom: "12px", 
      overflow: "hidden", 
      backgroundColor: "white",
      transition: "all 0.2s ease"
    }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            backgroundColor: isOpen ? "#0EA5E9" : "#F1F5F9", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: isOpen ? "white" : "#64748B",
            transition: "all 0.2s"
          }}>
            <Icon size={18} />
          </div>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "#0F172A" }}>{question}</span>
        </div>
        {isOpen ? <ChevronUp size={20} color="#94A3B8" /> : <ChevronDown size={20} color="#94A3B8" />}
      </button>
      
      {isOpen && (
        <div style={{ 
          padding: "0 24px 20px 76px", 
          fontSize: "14px", 
          color: "#475569", 
          lineHeight: "1.6" 
        }}>
          {answer}
        </div>
      )}
    </div>
  );
};

const SupportPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return toast.error("Please fill in all fields.");
    
    setSubmitting(true);
    try {
      await axiosInstance.post("/api/support/messages", { subject, message });
      toast.success("Message sent! We'll get back to you soon.");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    root: { display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" },
    main: { marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column" },
    topNav: { height: "64px", backgroundColor: "white", borderBottom: "1px solid #E2E8F0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "flex-end", position: "sticky", top: 0, zIndex: 50 },
    content: { padding: "40px", maxWidth: "900px", margin: "0 auto", width: "100%" },
    
    header: { marginBottom: "40px", textAlign: "center" },
    title: { fontSize: "32px", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.02em" },
    subtitle: { fontSize: "16px", color: "#64748B", marginTop: "8px" },

    grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px", alignItems: "start" },
    
    sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#0F172A", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" },

    card: { backgroundColor: "white", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
    
    label: { display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" },
    input: { width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outlineColor: "#0EA5E9", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outlineColor: "#0EA5E9", minHeight: "150px", resize: "none", boxSizing: "border-box" },

    infoFooter: { marginTop: "60px", paddingTop: "32px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#94A3B8", fontSize: "13px" }
  };

  const faqs = [
    {
      icon: BookOpen,
      question: "How do I book a resource?",
      answer: "Navigate to the 'Resources' page from the sidebar. Browse the available catalog, click on 'Book Now' for your desired resource, fill in the time slots and purpose, then submit your request."
    },
    {
      icon: CalendarCheck,
      question: "How do I cancel a booking?",
      answer: "Go to your 'My Bookings' page. Locate the reservation you wish to cancel and click the 'Cancel' button. Please note that approved bookings might have restriction periods for cancellation."
    },
    {
      icon: Mail,
      question: "How do I contact admin?",
      answer: "You can use the 'Contact Support' form on this page to send a direct message to the campus administrative team. Alternatively, you can email us at support@smartcampus.edu."
    },
    {
      icon: UserCheck,
      question: "What is the booking approval process?",
      answer: "Once you submit a request, it enters a 'PENDING' state. An administrator will review your request based on availability and priority. You will receive an email notification once it is 'APPROVED' or 'REJECTED'."
    }
  ];

  return (
    <div style={styles.root}>
      <Sidebar activeId="support" />
      <main style={styles.main}>
        <header style={styles.topNav}>
          <ProfileDropdown />
        </header>

        <div style={styles.content}>
          <div style={styles.header}>
            <div style={{ display: "inline-flex", padding: "12px", backgroundColor: "#E0F2FE", borderRadius: "16px", color: "#0EA5E9", marginBottom: "16px" }}>
              <HelpCircle size={32} />
            </div>
            <h1 style={styles.title}>How can we help?</h1>
            <p style={styles.subtitle}>Find answers to common questions or reach out to our team.</p>
          </div>

          <div style={styles.grid}>
            {/* FAQ Section */}
            <div>
              <h2 style={styles.sectionTitle}><MessageSquare size={20} color="#0EA5E9" /> Frequently Asked Questions</h2>
              <div>
                {faqs.map((faq, index) => (
                  <FAQItem key={index} {...faq} />
                ))}
              </div>
            </div>

            {/* Contact Form Section */}
            <div>
              <h2 style={styles.sectionTitle}><Send size={20} color="#0EA5E9" /> Contact Support</h2>
              <div style={styles.card}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={styles.label}>Subject</label>
                    <input 
                      style={styles.input} 
                      placeholder="What is this regarding?" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={styles.label}>Message</label>
                    <textarea 
                      style={styles.textarea} 
                      placeholder="Describe your issue in detail..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : <>Send Message <Send size={16} /></>}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#F1F5F9", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0F172A", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                  <Info size={16} color="#0EA5E9" /> Need immediate help?
                </div>
                <p style={{ fontSize: "13px", color: "#64748B", margin: 0, lineHeight: "1.5" }}>
                  For urgent campus emergencies, please call the security hotline at <strong>(555) 0123-4567</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <footer style={styles.infoFooter}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Version v1.0.0</span>
              <span style={{ color: "#E2E8F0" }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} /> support@smartcampus.edu
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748B", cursor: "pointer" }}>
              Terms & Privacy <ExternalLink size={12} />
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
