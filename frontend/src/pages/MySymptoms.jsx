import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const SEVERITY_LABELS = ["", "Mild", "Low", "Moderate", "High", "Severe"];

const SEVERITY_COLORS = {
  1: { bg: "#EFF5E4", color: "#4A6741" },
  2: { bg: "#EFF5E4", color: "#4A6741" },
  3: { bg: "#FFF8EE", color: "#C8860A" },
  4: { bg: "#FFF0F3", color: "#C0445A" },
  5: { bg: "#FFF0F3", color: "#C0445A" },
};

function MySymptoms() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/symptoms/")
      .then(res => setSymptoms(res.data))
      .catch(() => setError("Could not load symptoms. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "52px 24px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 4px", letterSpacing: "0.04em" }}>
            Your history
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            My symptoms
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#A07890", fontSize: 14 }}>Loading your symptoms...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 12, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && symptoms.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "white", borderRadius: 20, border: "1px solid #F2E8EA"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#EFF5E4",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <i className="ti ti-mood-heart" style={{ fontSize: 24, color: "#838F58" }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1F2A", margin: "0 0 6px" }}>
              No symptoms logged yet
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 20px", lineHeight: 1.6 }}>
              Start tracking how you feel to spot patterns over time.
            </p>
            <button
              onClick={() => navigate("/log-symptom")}
              style={{
                background: "#838F58", color: "white", border: "none",
                borderRadius: 12, padding: "10px 24px",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Log your first symptom
            </button>
          </div>
        )}

        {/* Symptom list */}
        {!loading && symptoms.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {symptoms.map((symptom) => {
                const severityStyle = symptom.severity ? SEVERITY_COLORS[symptom.severity] : null;
                return (
                  <div key={symptom.id} style={{
                    background: "white", borderRadius: 18,
                    border: "1px solid #F2E8EA", padding: "16px 20px",
                    borderLeft: "4px solid #838F58"
                  }}>
                    <div style={{
                      display: "flex", alignItems: "flex-start",
                      justifyContent: "space-between", marginBottom: symptom.notes ? 8 : 0
                    }}>
                      <div>
                        <p style={{
                          fontSize: 15, fontWeight: 700,
                          color: "#2D1F2A", margin: "0 0 3px"
                        }}>
                          {symptom.symptom_type}
                        </p>
                        <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
                          {formatDate(symptom.date)}
                        </p>
                      </div>

                      {symptom.severity && (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          background: severityStyle.bg,
                          color: severityStyle.color,
                          borderRadius: 8, padding: "3px 10px",
                          flexShrink: 0, marginLeft: 8
                        }}>
                          {SEVERITY_LABELS[symptom.severity]}
                        </span>
                      )}
                    </div>

                    {symptom.notes && (
                      <p style={{
                        fontSize: 13, color: "#6B4F6B",
                        margin: "8px 0 0", lineHeight: 1.5,
                        paddingTop: 8,
                        borderTop: "1px solid #F9F0F3"
                      }}>
                        {symptom.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/log-symptom")}
              style={{
                width: "100%", background: "#838F58",
                color: "white", border: "none", borderRadius: 14,
                padding: "13px", fontSize: 15, fontWeight: 600,
                cursor: "pointer", transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#6B7848"}
              onMouseLeave={e => e.currentTarget.style.background = "#838F58"}
            >
              Log another symptom
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default MySymptoms;