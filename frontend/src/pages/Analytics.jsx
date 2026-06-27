import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";
import DecorativeWave from "../components/DecorativeWave";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const navigate = useNavigate();

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get("/export/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hercare_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    api.get("/analytics/")
      .then(res => setData(res.data))
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  const sectionTitle = (text) => (
    <p style={{
      fontSize: 11, fontWeight: 700, color: "#A07890",
      textTransform: "uppercase", letterSpacing: "0.08em",
      margin: "0 0 14px"
    }}>
      {text}
    </p>
  );

  const cardStyle = {
    background: "white", borderRadius: 20,
    border: "1px solid #F2E8EA", padding: "20px",
    marginBottom: 16
  };

  const flagColors = {
    low: { bg: "#FFF0F3", border: "#F7C5CE", color: "#C0445A", icon: "ti-arrow-down" },
    trending_down: { bg: "#FFF0F3", border: "#F7C5CE", color: "#C0445A", icon: "ti-trending-down" },
    high: { bg: "#FFF8EE", border: "#FFE5B0", color: "#C8860A", icon: "ti-arrow-up" },
    trending_up: { bg: "#FFF8EE", border: "#FFE5B0", color: "#C8860A", icon: "ti-trending-up" },
    default: { bg: "#F4EEF8", border: "#DDD0EC", color: "#8B5CA8", icon: "ti-info-circle" },
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F9",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <p style={{ color: "#A07890", fontSize: 14 }}>Loading your analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFF8F9",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px"
      }}>
        <div style={{
          background: "#FFF0F3", border: "1px solid #F7C5CE",
          borderRadius: 16, padding: "20px 24px", textAlign: "center"
        }}>
          <p style={{ fontSize: 14, color: "#C0445A", margin: 0 }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isEmpty = data.flags.length === 0 &&
    data.cycle_count === 0 &&
    data.symptom_count === 0;

  return (
    <div style={{
      background: "#FFF8F9", minHeight: "100vh",
      paddingBottom: 90, position: "relative", overflow: "hidden"
    }}>
      <DecorativeWave position="top-right" opacity={0.25} />

      <div style={{ padding: "52px 24px 20px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: 28
        }}>
          <div>
            <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 4px", letterSpacing: "0.04em" }}>
              Your patterns
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
              Analytics
            </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={{
              background: downloading ? "#F2E8EA" : "white",
              border: "1px solid #F2E8EA", borderRadius: 12,
              padding: "9px 14px", cursor: downloading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { if (!downloading) e.currentTarget.style.borderColor = "#E8748A"; }}
            onMouseLeave={e => { if (!downloading) e.currentTarget.style.borderColor = "#F2E8EA"; }}
          >
            <i className="ti ti-download" style={{
              fontSize: 15,
              color: downloading ? "#C0B0BC" : "#E8748A"
            }} />
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: downloading ? "#C0B0BC" : "#2D1F2A"
            }}>
              {downloading ? "Generating..." : "Export PDF"}
            </span>
          </button>
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
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div style={{
            ...cardStyle, textAlign: "center", padding: "48px 24px"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#FFF0F3",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <i className="ti ti-chart-bar" style={{ fontSize: 24, color: "#E8748A" }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1F2A", margin: "0 0 6px" }}>
              No data yet
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: 0, lineHeight: 1.6 }}>
              Log cycles, symptoms, and reports to see your health patterns here.
            </p>
          </div>
        )}

        {/* Health flags */}
        {data.flags.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {sectionTitle("Health flags")}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.flags.map((flag, i) => {
                const style = flagColors[flag.type] || flagColors.default;
                return (
                  <div key={i} style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "flex-start", gap: 12
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "white",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <i className={`ti ${style.icon}`} style={{ fontSize: 16, color: style.color }} />
                    </div>
                    <p style={{ fontSize: 13, color: style.color, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                      {flag.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cycle summary */}
        {sectionTitle("Cycle summary")}
        <div style={{ ...cardStyle, borderLeft: "4px solid #E8748A" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Cycles logged", value: data.cycle_count ?? "—" },
              {
                label: "Avg cycle",
                value: data.avg_cycle_length || data.avg_period_length 
  ? `${data.avg_cycle_length || data.avg_period_length} days` 
  : "—"
              },
              {
                label: "Avg period",
                value: data.avg_period_length ? `${data.avg_period_length}d` : "—"
              },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: 24, fontWeight: 700, color: "#E8748A",
                  margin: "0 0 4px", letterSpacing: "-0.02em"
                }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, color: "#A07890", margin: 0, lineHeight: 1.4 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top symptoms */}
        {data.most_frequent_symptoms?.length > 0 && (
          <>
            {sectionTitle("Most frequent symptoms")}
            <div style={{ ...cardStyle, borderLeft: "4px solid #838F58" }}>
              {data.most_frequent_symptoms.map((s, i) => {
                const max = data.most_frequent_symptoms[0].count;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <div key={i} style={{
                    marginBottom: i < data.most_frequent_symptoms.length - 1 ? 14 : 0
                  }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 5
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#2D1F2A", margin: 0 }}>
                        {s.symptom}
                      </p>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#838F58",
                        background: "#EFF5E4", borderRadius: 8, padding: "2px 8px"
                      }}>
                        {s.count}x
                      </span>
                    </div>
                    <div style={{
                      height: 6, borderRadius: 10,
                      background: "#F2E8EA", overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 10,
                        background: "#838F58",
                        width: `${pct}%`,
                        transition: "width 0.6s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Lab trends */}
        {data.lab_trends && Object.keys(data.lab_trends).length > 0 && (
          <>
            {sectionTitle("Lab value history")}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(data.lab_trends).map(([testType, readings]) => (
                <div key={testType} style={{ ...cardStyle, borderLeft: "4px solid #8B5CA8", marginBottom: 0 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 700, color: "#2D1F2A",
                    margin: "0 0 12px"
                  }}>
                    {testType}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {readings.map((r, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "7px 10px",
                        background: "#FFFAFB", borderRadius: 10
                      }}>
                        <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>{r.date}</p>
                        <p style={{
                          fontSize: 13, fontWeight: 700,
                          color: "#8B5CA8", margin: 0
                        }}>
                          {r.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <SideDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)}/>
    </div>
  );
}

export default Analytics;