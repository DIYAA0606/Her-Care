import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard", icon: "ti-home", route: "/dashboard" },
  { label: "My cycles", icon: "ti-calendar", route: "/my-cycles" },
  { label: "My symptoms", icon: "ti-mood-heart", route: "/my-symptoms" },
  { label: "My reports", icon: "ti-file-text", route: "/my-reports" },
  { label: "Timeline", icon: "ti-timeline", route: "/timeline" },
  { label: "Analytics", icon: "ti-chart-bar", route: "/analytics" },
  { label: "Profile", icon: "ti-user", route: "/profile" },
];

const accentColors = {
  "/dashboard": "#E8748A",
  "/my-cycles": "#E8748A",
  "/my-symptoms": "#838F58",
  "/my-reports": "#8B5CA8",
  "/timeline": "#C8860A",
  "/analytics": "#E8748A",
  "/profile": "#E8748A",
};

function SideDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const path = location.pathname;

  // Close on back gesture / escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (route) => {
    navigate(route);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.display_name || user?.email?.split("@")[0] || "there";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(45, 31, 42, 0.35)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.3s ease"
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: 280, zIndex: 201,
        background: "white",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
        boxShadow: open ? "4px 0 40px rgba(45,31,42,0.12)" : "none",
        borderRadius: "0 24px 24px 0"
      }}>

        {/* Top — user info */}
        <div style={{
          padding: "56px 24px 24px",
          borderBottom: "1px solid #F2E8EA",
          position: "relative"
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "#FFF0F3", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}
          >
            <i className="ti ti-x" style={{ fontSize: 15, color: "#E8748A" }} />
          </button>

          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#FFF0F3", border: "2px solid #F7C5CE",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12
          }}>
            <i className="ti ti-user" style={{ fontSize: 20, color: "#E8748A" }} />
          </div>

          <p style={{
            fontSize: 16, fontWeight: 700, color: "#2D1F2A",
            margin: "0 0 2px"
          }}>
            {displayName}
          </p>
          <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
            {user?.email}
          </p>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = path === item.route;
            const accent = accentColors[item.route] || "#E8748A";
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                style={{
                  width: "100%", background: isActive ? `${accent}12` : "none",
                  border: "none", borderRadius: 14,
                  padding: "12px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  textAlign: "left", marginBottom: 4,
                  transition: "background 0.15s"
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = "#FFF8F9";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = "none";
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: isActive ? `${accent}20` : "#F9F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s"
                }}>
                  <i className={`ti ${item.icon}`} style={{
                    fontSize: 17,
                    color: isActive ? accent : "#C0B0BC"
                  }} />
                </div>
                <span style={{
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#2D1F2A" : "#6B4F6B"
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <div style={{
                    marginLeft: "auto", width: 6, height: 6,
                    borderRadius: "50%", background: accent
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom — logout */}
        <div style={{
          padding: "16px 12px 36px",
          borderTop: "1px solid #F2E8EA"
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", background: "none", border: "none",
              borderRadius: 14, padding: "12px 16px",
              cursor: "pointer", display: "flex",
              alignItems: "center", gap: 14, textAlign: "left",
              transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FFF0F3"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#FFF0F3",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <i className="ti ti-logout" style={{ fontSize: 17, color: "#E8748A" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#E8748A" }}>
              Log out
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SideDrawer;