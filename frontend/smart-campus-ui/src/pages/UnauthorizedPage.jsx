import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ 
        textAlign: "center", 
        padding: "2rem", 
        backgroundColor: "white", 
        borderRadius: "1rem", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        maxWidth: "400px"
      }}>
        <ShieldAlert size={64} color="#dc2626" style={{ marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
          Access Denied
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          You do not have the required permissions to access this page.
        </p>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
