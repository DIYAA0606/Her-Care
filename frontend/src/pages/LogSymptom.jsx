import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const SYMPTOM_OPTIONS = [
  { label: "Cramps", icon: "ti-bolt" },
  { label: "Headache", icon: "ti-brain" },
  { label: "Fatigue", icon: "ti-zzz" },
  { label: "Bloating", icon: "ti-circle" },
  { label: "Mood swings", icon: "ti-mood-sad" },
  { label: "Back pain", icon: "ti-spine" },
  { label: "Acne", icon: "ti-droplet" },
  { label: "Nausea", icon: "ti-wave-sine" },
  { label: "Breast tenderness", icon: "ti-heart" },
  { label: "Spotting", icon: "ti-droplet-half-2" },
];

const SEVERITY_LABELS = ["", "Mild", "Low", "Moderate", "High", "Severe"];

function LogSymptom() {
  const [symptomType, setSymptomType] = useState("");
  const [date, setDate] = useState("");
  const [severity, setSeverity] = useState(null);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!date || !symptomType) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/symptoms/", {
        date,
        symptom_type: symptomType,
        severity: severity || null,
        notes: notes || null,
      });
      setSuccess("Symptom logged successfully.");
      setDate("");
      setSymptomType("");
      setSeverity(null);
      setNotes("");
      setShowNotes(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSave = date && symptomType;

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 120 }}>
      <div style={{ padding: "52px 24px 24px" }}>

        {/* Header */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          color: "#A07890", fontSize: 13, fontWeight: 600,
          padding: 0, marginBottom: 24
        }}>
          <i className="ti ti-chevron-left" style={{ fontSize: 16 }} />
          Back
        </button>

        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 4px", letterSpacing: "0.04em" }}>
            How are you feeling?
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            Log a symptom
          </h1>
        </div>

        {/* Feedback */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{
            background: "#EFF5E4", border: "1px solid #C2D9A0",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#4A6741", margin: 0 }}>{success}</p>
          </div>
        )}

        {/* Date */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid #F2E8EA", padding: "20px",
          marginBottom: 16
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#A07890",
            textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px"
          }}>
            Date <span style={{ color: "#E8748A" }}>*</span>
          </p>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1px solid #F2E8EA", borderRadius: 12,
              padding: "11px 14px", fontSize: 14, color: "#2D1F2A",
              background: "#FFFAFB", outline: "none", fontFamily: "inherit",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#E8748A"}
            onBlur={e => e.target.style.borderColor = "#F2E8EA"}
          />
        </div>

        {/* Symptom picker */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid #F2E8EA", padding: "20px",
          marginBottom: 16
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#A07890",
            textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px"
          }}>
            Symptom <span style={{ color: "#E8748A" }}>*</span>
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 10
          }}>
            {SYMPTOM_OPTIONS.map((s) => {
              const selected = symptomType === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => setSymptomType(selected ? "" : s.label)}
                  style={{
                    background: selected ? "#FFF0F3" : "#FFFAFB",
                    border: selected ? "1.5px solid #E8748A" : "1px solid #F2E8EA",
                    borderRadius: 14, padding: "12px 14px",
                    cursor: "pointer", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: selected ? "white" : "#F9F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <i className={`ti ${s.icon}`} style={{
                      fontSize: 15,
                      color: selected ? "#E8748A" : "#C0B0BC"
                    }} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: selected ? 600 : 400,
                    color: selected ? "#2D1F2A" : "#6B4F6B",
                    lineHeight: 1.3
                  }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid #F2E8EA", padding: "20px",
          marginBottom: 16
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 14
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: "#A07890",
              textTransform: "uppercase", letterSpacing: "0.08em", margin: 0
            }}>
              Severity
            </p>
            {severity && (
              <span style={{
                fontSize: 12, fontWeight: 600, color: "#E8748A",
                background: "#FFF0F3", borderRadius: 8, padding: "2px 10px"
              }}>
                {SEVERITY_LABELS[severity]}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((level) => {
              const selected = severity === level;
              const filled = severity && level <= severity;
              return (
                <button
                  key={level}
                  onClick={() => setSeverity(selected ? null : level)}
                  style={{
                    flex: 1, height: 44, borderRadius: 12,
                    border: selected ? "1.5px solid #E8748A" : "1px solid #F2E8EA",
                    background: filled ? "#E8748A" : "#FFFAFB",
                    color: filled ? "white" : "#C0B0BC",
                    fontSize: 14, fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: selected ? "0 2px 8px rgba(232,116,138,0.25)" : "none"
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 6
          }}>
            <span style={{ fontSize: 10, color: "#C0B0BC" }}>Mild</span>
            <span style={{ fontSize: 10, color: "#C0B0BC" }}>Severe</span>
          </div>
        </div>

        {/* Notes */}
        <div style={{
          background: "white", borderRadius: 20,
          border: "1px solid #F2E8EA", padding: "16px 20px",
          marginBottom: 16
        }}>
          {!showNotes ? (
            <button
              onClick={() => setShowNotes(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, padding: 0
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "#FFF0F3",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className="ti ti-pencil" style={{ fontSize: 15, color: "#E8748A" }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: 0 }}>
                  Add a note
                </p>
                <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
                  Any additional observations
                </p>
              </div>
            </button>
          ) : (
            <>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 12
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#6B4F6B", margin: 0 }}>Note</p>
                <button
                  onClick={() => { setShowNotes(false); setNotes(""); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <i className="ti ti-x" style={{ fontSize: 15, color: "#C0B0BC" }} />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe how you're feeling..."
                rows={3}
                autoFocus
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: "1px solid #F2E8EA", borderRadius: 12,
                  padding: "10px 14px", fontSize: 14, color: "#2D1F2A",
                  background: "#FFFAFB", outline: "none", resize: "none",
                  lineHeight: 1.6, fontFamily: "inherit",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#E8748A"}
                onBlur={e => e.target.style.borderColor = "#F2E8EA"}
              />
            </>
          )}
        </div>

      </div>

      {/* Sticky save */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "16px 24px 40px",
        background: "linear-gradient(to top, #FFF8F9 65%, transparent)",
        pointerEvents: "none"
      }}>
        <button
          onClick={handleSubmit}
          disabled={!canSave || submitting}
          style={{
            width: "100%", pointerEvents: "all",
            background: !canSave ? "#F2E8EA" : submitting ? "#F0B8C4" : "#E8748A",
            color: !canSave ? "#C0B0BC" : "white",
            border: "none", borderRadius: 16,
            padding: "15px", fontSize: 15, fontWeight: 600,
            cursor: !canSave || submitting ? "not-allowed" : "pointer",
            boxShadow: canSave ? "0 4px 20px rgba(232,116,138,0.30)" : "none",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { if (canSave && !submitting) e.currentTarget.style.background = "#D95F75"; }}
          onMouseLeave={e => { if (canSave && !submitting) e.currentTarget.style.background = "#E8748A"; }}
        >
          {submitting ? "Saving..." : "Save symptom"}
        </button>
      </div>
    </div>
  );
}

export default LogSymptom;