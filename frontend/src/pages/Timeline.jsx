import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import DecorativeWave from "../components/DecorativeWave";

const SEVERITY_LABELS = ["", "Mild", "Low", "Moderate", "High", "Severe"];

function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/timeline/")
      .then(res => setEvents(res.data))
      .catch(() => setError("Could not load timeline."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  // Group events by date
  const grouped = events.reduce((acc, event) => {
    const key = event.date?.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  const eventConfig = {
    cycle: {
      color: "#E8748A",
      bg: "#FFF0F3",
      icon: "ti-circle-plus",
      label: "Cycle started",
    },
    symptom: {
      color: "#838F58",
      bg: "#EFF5E4",
      icon: "ti-mood-heart",
      label: "Symptom logged",
    },
    lab_report: {
      color: "#8B5CA8",
      bg: "#F4EEF8",
      icon: "ti-file-text",
      label: "Lab report",
    },
  };

  const renderEvent = (event, index, isLast) => {
    const config = eventConfig[event.type] || eventConfig.lab_report;

    return (
      <div key={index} style={{
        display: "flex", gap: 14,
        paddingBottom: isLast ? 0 : 16
      }}>
        {/* Timeline line + dot */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", flexShrink: 0
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: config.bg, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1.5px solid ${config.color}22`
          }}>
            <i className={`ti ${config.icon}`} style={{
              fontSize: 16, color: config.color
            }} />
          </div>
          {!isLast && (
            <div style={{
              width: 1.5, flex: 1, marginTop: 4,
              background: "#F2E8EA", minHeight: 16
            }} />
          )}
        </div>

        {/* Event card */}
        <div style={{
          flex: 1, background: "white", borderRadius: 16,
          border: "1px solid #F2E8EA", padding: "14px 16px",
          marginBottom: isLast ? 0 : 4
        }}>
          <p style={{
            fontSize: 12, fontWeight: 700,
            color: config.color, margin: "0 0 4px",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}>
            {config.label}
          </p>

          {event.type === "cycle" && (
            <>
              {event.data.end_date ? (
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 2px" }}>
                  {formatDate(event.date)} → {formatDate(event.data.end_date)}
                </p>
              ) : (
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 2px" }}>
                  Started {formatDate(event.date)}
                  <span style={{ fontSize: 12, color: "#E8748A", fontWeight: 400, marginLeft: 6 }}>
                    Ongoing
                  </span>
                </p>
              )}
              {event.data.notes && (
                <p style={{ fontSize: 13, color: "#A07890", margin: "6px 0 0", lineHeight: 1.5 }}>
                  {event.data.notes}
                </p>
              )}
            </>
          )}

          {event.type === "symptom" && (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 2px" }}>
                {event.data.symptom_type}
                {event.data.severity && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    background: "#EFF5E4", color: "#4A6741",
                    borderRadius: 8, padding: "2px 8px", marginLeft: 8
                  }}>
                    {SEVERITY_LABELS[event.data.severity]}
                  </span>
                )}
              </p>
              {event.data.notes && (
                <p style={{ fontSize: 13, color: "#A07890", margin: "6px 0 0", lineHeight: 1.5 }}>
                  {event.data.notes}
                </p>
              )}
            </>
          )}

          {event.type === "lab_report" && (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 8px" }}>
                {event.data.filename}
              </p>
              {event.data.results?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {event.data.results.map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "5px 10px", background: "#FFFAFB",
                      borderRadius: 8
                    }}>
                      <p style={{ fontSize: 12, color: "#6B4F6B", margin: 0 }}>{r.test_type}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#8B5CA8", margin: 0 }}>
                        {r.value}
                        {r.unit && <span style={{ fontWeight: 400, color: "#A07890", marginLeft: 3 }}>{r.unit}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: "#FFF8F9", minHeight: "100vh",
      paddingBottom: 90, position: "relative", overflow: "hidden"
    }}>
      <DecorativeWave position="top-right" opacity={0.25} />

      <div style={{ padding: "52px 24px 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 4px", letterSpacing: "0.04em" }}>
            Your journey
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            Timeline
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#A07890", fontSize: 14 }}>Loading your timeline...</p>
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
        {!loading && !error && events.length === 0 && (
          <div style={{
            background: "white", borderRadius: 20,
            border: "1px solid #F2E8EA", padding: "60px 24px",
            textAlign: "center"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#FFF0F3",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <i className="ti ti-timeline" style={{ fontSize: 24, color: "#E8748A" }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1F2A", margin: "0 0 6px" }}>
              Nothing here yet
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 20px", lineHeight: 1.6 }}>
              Your health events will appear here as you log cycles, symptoms, and reports.
            </p>
            <button
              onClick={() => navigate("/quick-log")}
              style={{
                background: "#E8748A", color: "white", border: "none",
                borderRadius: 12, padding: "10px 24px",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Log your first entry
            </button>
          </div>
        )}

        {/* Grouped timeline */}
        {!loading && sortedDates.map((dateKey) => (
          <div key={dateKey} style={{ marginBottom: 28 }}>
            {/* Date group header */}
            <p style={{
              fontSize: 12, fontWeight: 700, color: "#A07890",
              textTransform: "uppercase", letterSpacing: "0.08em",
              margin: "0 0 14px"
            }}>
              {formatDate(dateKey)}
            </p>

            {grouped[dateKey].map((event, index) =>
              renderEvent(event, index, index === grouped[dateKey].length - 1)
            )}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

export default Timeline;