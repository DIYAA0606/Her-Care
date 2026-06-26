import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SideDrawer from "../components/SideDrawer";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [drawerOpen,setDrawerOpen]=useState(false);

  useEffect(() => {
    api.get("/auth/profile")
      .then(res => {
        setDisplayName(res.data.display_name || "");
        setCycleLength(res.data.cycle_length || 28);
        setPeriodLength(res.data.period_length || 5);
        updateUser({ display_name: res.data.display_name });
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      await api.patch("/auth/profile", {
        display_name: displayName,
        cycle_length: cycleLength,
        period_length: periodLength,
      });
      updateUser({ display_name: displayName });    
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "1px solid #F2E8EA", borderRadius: 12,
    padding: "11px 14px", fontSize: 14, color: "#2D1F2A",
    background: "#FFFAFB", outline: "none",
    transition: "border-color 0.2s"
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: "#6B4F6B",
    display: "block", marginBottom: 6
  };

  const sectionTitleStyle = {
    fontSize: 11, fontWeight: 700, color: "#A07890",
    textTransform: "uppercase", letterSpacing: "0.08em",
    margin: "0 0 12px"
  };

  const cardStyle = {
    background: "white", borderRadius: 20,
    border: "1px solid #F2E8EA", padding: "20px",
    marginBottom: 16
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F9",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#A07890", fontSize: 14 }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex",
    alignItems: "center",
    justifyContent: "space-between"}}>
          <div>
          <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 4px" }}>Your account</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>Profile</h1>
          </div>
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

        {/* Avatar + email */}
        <div style={{
          ...cardStyle,
          display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#FFF0F3", border: "2px solid #F7C5CE",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <i className="ti ti-user" style={{ fontSize: 22, color: "#E8748A" }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#2D1F2A", margin: "0 0 2px" }}>
              {displayName || user?.email?.split("@")[0] || "Your name"}
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: 0 }}>{user?.email}</p>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 12, padding: "10px 14px", marginBottom: 16
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}
        {saveSuccess && (
          <div style={{
            background: "#EFF5E4", border: "1px solid #C2D9A0",
            borderRadius: 12, padding: "10px 14px", marginBottom: 16
          }}>
            <p style={{ fontSize: 13, color: "#4A6741", margin: 0 }}>Changes saved successfully.</p>
          </div>
        )}

        {/* Account settings */}
        <p style={sectionTitleStyle}>Account</p>
        <div style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              style={{ ...inputStyle, background: "#F9F4F6", color: "#A07890", cursor: "not-allowed" }}
            />
          </div>
        </div>

        {/* Health settings */}
        <p style={sectionTitleStyle}>Health settings</p>
        <div style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Average cycle length (days)</label>
            <input
              type="number"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              min={15} max={60}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>
          <div>
            <label style={labelStyle}>Average period length (days)</label>
            <input
              type="number"
              value={periodLength}
              onChange={e => setPeriodLength(Number(e.target.value))}
              min={1} max={14}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>
        </div>

        {/* Preferences */}
        <p style={sectionTitleStyle}>Preferences</p>
        <div style={cardStyle}>
          {[
            { label: "Push notifications", sub: "Coming soon" },
            { label: "Dark mode", sub: "Coming soon" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #F9F0F3"
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>{item.sub}</p>
              </div>
              <div style={{
                width: 40, height: 24, borderRadius: 12,
                background: "#F2E8EA", opacity: 0.5,
                cursor: "not-allowed"
              }} />
            </div>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", background: saving ? "#F0B8C4" : "#E8748A",
            color: "white", border: "none", borderRadius: 14,
            padding: "13px", fontSize: 15, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            marginBottom: 16, transition: "background 0.2s"
          }}
          onMouseEnter={e => { if (!saving) e.target.style.background = "#D95F75"; }}
          onMouseLeave={e => { if (!saving) e.target.style.background = "#E8748A"; }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        {/* Danger zone */}
        <p style={sectionTitleStyle}>Account</p>
        <div style={cardStyle}>
          <button
            onClick={logout}
            style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: 12,
              padding: "4px 0", cursor: "pointer", marginBottom: 16
            }}
          >
            <i className="ti ti-logout" style={{ fontSize: 18, color: "#E8748A" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#E8748A" }}>Log out</span>
          </button>

          <div style={{ height: 1, background: "#F9F0F3", margin: "4px 0 16px" }} />

          <button
            onClick={() => navigate("/delete-account")}
            style={{
              width: "100%", background: "none", border: "none",
              display: "flex", alignItems: "center", gap: 12,
              padding: "4px 0", cursor: "pointer"
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: 18, color: "#C0445A" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#C0445A" }}>Delete account</span>
          </button>
        </div>

      </div>
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default Profile;