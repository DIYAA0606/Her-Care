import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DecorativeWave from "../components/DecorativeWave";
import SideDrawer from "../components/SideDrawer";
import FlowerHero from "../components/FlowerHero";

const PRIMARY_ACTIONS = [
  { label: "Log cycle", icon: "ti-circle-plus", route: "/log-cycle", color: "#E8748A", bg: "#FFF0F3" },
  { label: "Log symptom", icon: "ti-mood-heart", route: "/log-symptom", color: "#838F58", bg: "#EFF5E4" },
  { label: "Upload report", icon: "ti-file-upload", route: "/upload-reports", color: "#8B5CA8", bg: "#F4EEF8" },
];

const SECONDARY_ACTIONS = [
  { label: "Timeline", icon: "ti-timeline", route: "/timeline", bg: "#FFF8EE", color: "#C8860A" },
  { label: "My cycles", icon: "ti-calendar", route: "/my-cycles", bg: "#FFF0F3", color: "#E8748A" },
  { label: "My symptoms", icon: "ti-heart-rate-monitor", route: "/my-symptoms", bg: "#EFF5E4", color: "#838F58" },
  { label: "My reports", icon: "ti-file-text", route: "/my-reports", bg: "#F4EEF8", color: "#8B5CA8" },
  { label: "Analytics", icon: "ti-chart-bar", route: "/analytics", bg: "#FFF8EE", color: "#C8860A" },
];

// Positions for 3 action cards bursting out horizontally from flower center
const BURST_POSITIONS = [
  { x: -130, y: 20, rotate: -8 },  // left
  { x: 0,    y: 70, rotate: 0  },  // center-down
  { x: 130,  y: 20, rotate: 8  },  // right
];

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [burstOpen, setBurstOpen] = useState(false);
  const scrollRef = useRef(null);

  const firstName = user?.display_name || user?.email?.split("@")[0] || "there";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Close burst on outside tap
  useEffect(() => {
    if (!burstOpen) return;
    const handler = (e) => {
      if (!e.target.closest("[data-burst-zone]")) {
        setBurstOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [burstOpen]);

  return (
    <div style={{
      background: "#FFF8F9", minHeight: "100vh",
      paddingBottom: 40, position: "relative", overflow: "hidden"
    }}>
      <DecorativeWave position="top-right" opacity={0.3} />

      {/* Header */}
      <div style={{
        padding: "52px 24px 0",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "relative", zIndex: 1
      }}>
        <div>
          <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 2px" }}>
            {greeting()}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            {firstName}
          </h1>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 4, display: "flex", flexDirection: "column",
            gap: 5, alignItems: "flex-start"
          }}
        >
          <span style={{ display: "block", width: 22, height: 2, background: "#2D1F2A", borderRadius: 2 }} />
          <span style={{ display: "block", width: 16, height: 2, background: "#2D1F2A", borderRadius: 2 }} />
          <span style={{ display: "block", width: 19, height: 2, background: "#2D1F2A", borderRadius: 2 }} />
        </button>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} style={{
        overflowY: "auto", position: "relative", zIndex: 1
      }}>

        {/* Flower hero section */}
        <div style={{
          padding: "32px 24px 24px",
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>

          {/* Burst zone wrapper */}
          <div
            data-burst-zone="true"
            style={{ position: "relative", width: "100%" }}
          >
            <FlowerHero onActionBurst={(open) => setBurstOpen(open)} />

            {/* Burst action cards */}
            {PRIMARY_ACTIONS.map((action, i) => {
              const pos = BURST_POSITIONS[i];
              return (
                <div
                  key={action.route}
                  onClick={() => { setBurstOpen(false); navigate(action.route); }}
                  style={{
                    position: "absolute",
                    top: "42%",
                    left: "50%",
                    transform: burstOpen
                      ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.rotate}deg)`
                      : `translate(-50%, -50%) scale(0.4)`,
                    opacity: burstOpen ? 1 : 0,
                    pointerEvents: burstOpen ? "all" : "none",
                    transition: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 60}ms, opacity 0.3s ease ${i * 60}ms`,
                    zIndex: 10,
                    cursor: "pointer"
                  }}
                >
                  <div style={{
                    background: "white",
                    border: `1.5px solid ${action.color}30`,
                    borderRadius: 18,
                    padding: "14px 16px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8,
                    width: 90, textAlign: "center",
                    boxShadow: `0 8px 24px ${action.color}20`
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: action.bg,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <i className={`ti ${action.icon}`} style={{ fontSize: 20, color: action.color }} />
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: "#2D1F2A", lineHeight: 1.3
                    }}>
                      {action.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{
          margin: "0 24px 24px",
          height: 1, background: "#F2E8EA"
        }} />

        {/* Secondary actions */}
        <div style={{ padding: "0 24px 40px" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#A07890",
            textTransform: "uppercase", letterSpacing: "0.08em",
            margin: "0 0 14px"
          }}>
            Your health data
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 12
          }}>
            {SECONDARY_ACTIONS.map((action) => (
              <button
                key={action.route}
                onClick={() => navigate(action.route)}
                style={{
                  background: action.bg,
                  border: `1px solid ${action.color}22`,
                  borderRadius: 18, padding: "16px",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "flex-start", gap: 10,
                  textAlign: "left",
                  transition: "box-shadow 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${action.color}18`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{
                  background: "white", borderRadius: 10,
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <i className={`ti ${action.icon}`} style={{ fontSize: 18, color: action.color }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2D1F2A" }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default Dashboard;