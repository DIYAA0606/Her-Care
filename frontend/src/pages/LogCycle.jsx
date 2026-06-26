import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function LogCycle() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/cycles/", {
        start_date: startDate,
        end_date: endDate || null,
        notes: notes || null,
      });
      setSuccess("Cycle logged successfully.");
      setStartDate("");
      setEndDate("");
      setNotes("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    border: "1px solid #F2E8EA", borderRadius: 12,
    padding: "11px 14px", fontSize: 14, color: "#2D1F2A",
    background: "#FFFAFB", outline: "none",
    transition: "border-color 0.2s", fontFamily: "inherit"
  };

  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: "#6B4F6B",
    display: "block", marginBottom: 6
  };

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px" }}>

        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: "#A07890", fontSize: 13, fontWeight: 600,
            padding: 0, marginBottom: 24
          }}
        >
          <i className="ti ti-chevron-left" style={{ fontSize: 16 }} />
          Back
        </button>

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 4px" }}>Track your cycle</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>Log a cycle</h1>
        </div>

        {/* Feedback */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 12, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{
            background: "#EFF5E4", border: "1px solid #C2D9A0",
            borderRadius: 12, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#4A6741", margin: 0 }}>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          background: "white", borderRadius: 20,
          border: "1px solid #F2E8EA", padding: "24px 20px"
        }}>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Start date <span style={{ color: "#E8748A" }}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>End date <span style={{ color: "#A07890", fontWeight: 400 }}>(optional)</span></label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Notes <span style={{ color: "#A07890", fontWeight: 400 }}>(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about this cycle..."
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical", lineHeight: 1.6
              }}
              onFocus={e => e.target.style.borderColor = "#E8748A"}
              onBlur={e => e.target.style.borderColor = "#F2E8EA"}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: submitting ? "#F0B8C4" : "#E8748A",
              color: "white", border: "none", borderRadius: 14,
              padding: "13px", fontSize: 15, fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#D95F75"; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#E8748A"; }}
          >
            {submitting ? "Saving..." : "Save cycle"}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}

export default LogCycle;