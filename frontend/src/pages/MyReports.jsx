import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [drawerOpen,setDrawerOpen]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/reports/")
      .then(res => setReports(res.data))
      .catch(() => setError("Could not load reports. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ padding: "52px 24px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 4px", letterSpacing: "0.04em" }}>
            Your health data
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            My reports
          </h1>
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

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#A07890", fontSize: 14 }}>Loading your reports...</p>
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
        {!loading && !error && reports.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "white", borderRadius: 20, border: "1px solid #F2E8EA"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#F4EEF8",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <i className="ti ti-file-text" style={{ fontSize: 24, color: "#8B5CA8" }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#2D1F2A", margin: "0 0 6px" }}>
              No reports uploaded yet
            </p>
            <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 20px", lineHeight: 1.6 }}>
              Upload your lab reports to keep all your health data in one place.
            </p>
            <button
              onClick={() => navigate("/upload-report")}
              style={{
                background: "#8B5CA8", color: "white", border: "none",
                borderRadius: 12, padding: "10px 24px",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Upload your first report
            </button>
          </div>
        )}

        {/* Reports list */}
        {!loading && reports.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {reports.map((report) => {
                const isExpanded = expanded[report.id];
                return (
                  <div key={report.id} style={{
                    background: "white", borderRadius: 18,
                    border: "1px solid #F2E8EA",
                    borderLeft: "4px solid #8B5CA8",
                    overflow: "hidden"
                  }}>
                    {/* Report header row */}
                    <button
                      onClick={() => toggleExpand(report.id)}
                      style={{
                        width: "100%", background: "none", border: "none",
                        padding: "16px 20px", cursor: "pointer",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: "#F4EEF8", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <i className="ti ti-file-text" style={{ fontSize: 16, color: "#8B5CA8" }} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: 14, fontWeight: 700,
                            color: "#2D1F2A", margin: "0 0 2px",
                            maxWidth: 180,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>
                            {report.filename}
                          </p>
                          <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
                            {formatDate(report.upload_date?.slice(0, 10))}
                            {report.results?.length > 0 && (
                              <span style={{ color: "#8B5CA8", marginLeft: 6 }}>
                                · {report.results.length} result{report.results.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <i className={`ti ${isExpanded ? "ti-chevron-up" : "ti-chevron-down"}`}
                        style={{ fontSize: 16, color: "#C0B0BC", flexShrink: 0 }} />
                    </button>

                    {/* Expanded results */}
                    {isExpanded && (
                      <div style={{ padding: "0 20px 16px" }}>
                        <div style={{ borderTop: "1px solid #F9F0F3", paddingTop: 12 }}>
                          {report.results?.length === 0 ? (
                            <p style={{ fontSize: 13, color: "#A07890", margin: "8px 0" }}>
                              No results added yet.
                            </p>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {report.results.map((result) => (
                                <div key={result.id} style={{
                                  display: "flex", alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 12px", borderRadius: 10,
                                  background: "#FFFAFB"
                                }}>
                                  <p style={{
                                    fontSize: 13, fontWeight: 600,
                                    color: "#2D1F2A", margin: 0
                                  }}>
                                    {result.test_type}
                                  </p>
                                  <p style={{
                                    fontSize: 13, color: "#8B5CA8",
                                    fontWeight: 700, margin: 0
                                  }}>
                                    {result.value}
                                    {result.unit && (
                                      <span style={{ fontSize: 11, fontWeight: 400, color: "#A07890", marginLeft: 4 }}>
                                        {result.unit}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => navigate(`/add-results/${report.id}`)}
                            style={{
                              background: "none", border: "none",
                              cursor: "pointer", padding: "10px 0 0",
                              display: "flex", alignItems: "center", gap: 6
                            }}
                          >
                            <i className="ti ti-plus" style={{ fontSize: 14, color: "#8B5CA8" }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#8B5CA8" }}>
                              Add results
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/upload-reports")}
              style={{
                width: "100%", background: "#8B5CA8",
                color: "white", border: "none", borderRadius: 14,
                padding: "13px", fontSize: 15, fontWeight: 600,
                cursor: "pointer", transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#7A4D96"}
              onMouseLeave={e => e.currentTarget.style.background = "#8B5CA8"}
            >
              Upload another report
            </button>
          </>
        )}
      </div>
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default MyReports;