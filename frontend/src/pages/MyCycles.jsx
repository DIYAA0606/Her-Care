import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function MyCycles() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cycles/")
      .then(res => setCycles(res.data))
      .catch(() => setError("Could not load cycles. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ padding: "52px 20px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 4px" }}>Your history</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>My cycles</h1>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#A07890", fontSize: 14 }}>Loading your cycles...</p>
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
        {!loading && !error && cycles.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "white", borderRadius: 20, border: "1px solid #F2E8EA"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#FFF0F3", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <i className="ti ti-calendar" style={{ fontSize: 24, color: "#E8748A" }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1F2A", margin: "0 0 6px" }}>
              No cycles logged yet
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 20px", lineHeight: 1.6 }}>
              Start tracking your cycle to see patterns over time.
            </p>
            <button
              onClick={() => navigate("/log-cycle")}
              style={{
                background: "#E8748A", color: "white", border: "none",
                borderRadius: 12, padding: "10px 24px",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Log your first cycle
            </button>
          </div>
        )}

        {/* Cycle list */}
        {!loading && cycles.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {cycles.map((cycle) => (
                <div key={cycle.id} style={{
                  background: "white", borderRadius: 18,
                  border: "1px solid #F2E8EA", padding: "18px 20px",
                  borderLeft: "4px solid #E8748A"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: cycle.notes ? 8 : 0 }}>
                    <div style={{
                      background: "#FFF0F3", borderRadius: 8,
                      width: 32, height: 32, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <i className="ti ti-calendar" style={{ fontSize: 15, color: "#E8748A" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
                        {formatDate(cycle.start_date)}
                        {cycle.end_date && (
                          <span style={{ fontWeight: 400, color: "#A07890" }}>
                            {" "}→ {formatDate(cycle.end_date)}
                          </span>
                        )}
                      </p>
                      {!cycle.end_date && (
                        <p style={{ fontSize: 12, color: "#E8748A", margin: 0, fontWeight: 600 }}>Ongoing</p>
                      )}
                    </div>
                  </div>
                  {cycle.notes && (
                    <p style={{
                      fontSize: 13, color: "#6B4F6B", margin: "8px 0 0",
                      paddingLeft: 42, lineHeight: 1.5
                    }}>
                      {cycle.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/log-cycle")}
              style={{
                width: "100%", background: "#E8748A", color: "white",
                border: "none", borderRadius: 14, padding: "13px",
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#D95F75"}
              onMouseLeave={e => e.currentTarget.style.background = "#E8748A"}
            >
              Log another cycle
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default MyCycles;