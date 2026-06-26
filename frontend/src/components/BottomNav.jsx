import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { icon: "ti-home", label: "Home", route: "/dashboard" },
    { icon: "ti-calendar", label: "Cycle", route: "/my-cycles" },
    { icon: "ti-plus", label: "Log", route: null, primary: true },
    { icon: "ti-chart-bar", label: "Insights", route: "/analytics" },
    { icon: "ti-user", label: "Profile", route: "/profile" },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "white", borderTop: "1px solid #F2E8EA",
      display: "flex", justifyContent: "space-around",
      padding: "8px 0 20px", zIndex: 100
    }}>
      {items.map((item) => {
        const isActive = path === item.route;
        if (item.primary) {
          return (
            <button key="log" onClick={() => navigate("/log-cycle")}
              style={{
                background: "#E8748A", border: "none", borderRadius: "50%",
                width: 48, height: 48, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", marginTop: -8
              }}>
              <i className="ti ti-plus" style={{ fontSize: 22, color: "white" }} />
            </button>
          );
        }
        return (
          <button key={item.route} onClick={() => navigate(item.route)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "4px 12px"
            }}>
            <i className={`ti ${item.icon}`} style={{
              fontSize: 22,
              color: isActive ? "#E8748A" : "#B09AB0"
            }} />
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: isActive ? "#E8748A" : "#B09AB0"
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;