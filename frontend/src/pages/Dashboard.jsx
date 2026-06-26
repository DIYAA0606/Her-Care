import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.email?.split("@")[0] || "there";

  const actions = [
    { label: "Log cycle", icon: "ti-circle-plus", route: "/log-cycle", bg: "#FFF0F3", color: "#E8748A" },
    { label: "Log symptom", icon: "ti-mood-heart", route: "/log-symptom", bg: "#EFF5E4", color: "#838F58" },
    { label: "Upload report", icon: "ti-file-upload", route: "/upload-report", bg: "#F4EEF8", color: "#8B5CA8" },
    { label: "Timeline", icon: "ti-timeline", route: "/timeline", bg: "#FFF8EE", color: "#C8860A" },
    { label: "My cycles", icon: "ti-calendar", route: "/my-cycles", bg: "#FFF0F3", color: "#E8748A" },
    { label: "My symptoms", icon: "ti-heart-rate-monitor", route: "/my-symptoms", bg: "#EFF5E4", color: "#838F58" },
    { label: "My reports", icon: "ti-file-text", route: "/my-reports", bg: "#F4EEF8", color: "#8B5CA8" },
    { label: "Analytics", icon: "ti-chart-bar", route: "/analytics", bg: "#FFF8EE", color: "#C8860A" },
  ];

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 90 }}>

      <div style={{ padding: "52px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: "#A07890", margin: 0 }}>
  {(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })()}
</p>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>{firstName}</h1>
          </div>
          <button onClick={logout} style={{
            background: "#FFF0F3", border: "none", borderRadius: "50%",
            width: 40, height: 40, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="ti ti-logout" style={{ fontSize: 18, color: "#E8748A" }} />
          </button>
        </div>

        <div style={{
  background: "white", borderRadius: 20, padding: 20,
  border: "1px solid #F2E8EA", marginBottom: 28,
  borderLeft: "4px solid #E8748A"
}}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#A07890", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your health space</p>
          <p style={{ fontSize: 14, color: "#6B4F6B", margin: 0, lineHeight: 1.6 }}>
            Track your cycles, symptoms and lab reports — all in one place.
          </p>
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, color: "#A07890", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Quick actions</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {actions.map((action) => (
            <button key={action.route} onClick={() => navigate(action.route)}
              style={{
                background: action.bg, border: `1px solid ${action.color}22`,
                borderRadius: 18, padding: "18px 16px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                gap: 10, textAlign: "left"
              }}>
              <div style={{
                background: "white", borderRadius: 10, width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className={`ti ${action.icon}`} style={{ fontSize: 18, color: action.color }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A" }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default Dashboard;