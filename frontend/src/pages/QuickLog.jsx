import { useNavigate } from "react-router-dom";

function QuickLog() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Log cycle",
      description: "Track your period and cycle dates",
      icon: "ti-circle-plus",
      route: "/log-cycle",
      bg: "#FFF0F3",
      color: "#E8748A",
    },
    {
      label: "Log symptom",
      description: "Record how you're feeling today",
      icon: "ti-mood-heart",
      route: "/log-symptom",
      bg: "#EFF5E4",
      color: "#838F58",
    },
    {
      label: "Upload report",
      description: "Add a new lab report or test result",
      icon: "ti-file-upload",
      route: "/upload-reports",
      bg: "#F4EEF8",
      color: "#8B5CA8",
    },
  ];

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", padding: "52px 20px 40px" }}>

      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 4px" }}>Quick log</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
          What would you like to track?
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {actions.map((action) => (
          <button
            key={action.route}
            onClick={() => navigate(action.route)}
            style={{
              background: "white",
              border: "1px solid #F2E8EA",
              borderRadius: 20,
              padding: "20px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(232,116,138,0.10)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{
              background: action.bg,
              borderRadius: 14,
              width: 52,
              height: 52,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <i className={`ti ${action.icon}`} style={{ fontSize: 22, color: action.color }} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1F2A", margin: "0 0 3px" }}>
                {action.label}
              </p>
              <p style={{ fontSize: 13, color: "#A07890", margin: 0, lineHeight: 1.5 }}>
                {action.description}
              </p>
            </div>

            <i className="ti ti-chevron-right" style={{ fontSize: 18, color: "#D4B8C7", flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickLog;