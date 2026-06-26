import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function UploadReport() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [extractedValues, setExtractedValues] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedFile) { setError("Please select a file first."); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReportId(response.data.report_id);
      setExtractedValues(response.data.extracted_values || []);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleValueChange = (index, field, newValue) => {
    const updated = [...extractedValues];
    updated[index] = { ...updated[index], [field]: newValue };
    setExtractedValues(updated);
  };

  const handleRemove = (index) => {
    setExtractedValues(extractedValues.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.post(`/reports/${reportId}/results`, extractedValues);
      setSaved(true);
    } catch (err) {
      setError("Could not save results. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    border: "1px solid #F2E8EA", borderRadius: 10,
    padding: "9px 12px", fontSize: 13, color: "#2D1F2A",
    background: "#FFFAFB", outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s", boxSizing: "border-box"
  };

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 40 }}>
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
            Your health data
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
            Upload a report
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 10, padding: "10px 14px", marginBottom: 20
          }}>
            <p style={{ fontSize: 13, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Stage 1 — file select */}
        {!reportId && (
          <form onSubmit={handleUpload}>
            <div style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F2E8EA", padding: "24px",
              marginBottom: 16
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: "#A07890",
                textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px"
              }}>
                Select file
              </p>

              {/* Drop zone */}
              <label style={{
                display: "block", cursor: "pointer",
                border: `2px dashed ${selectedFile ? "#8B5CA8" : "#F2E8EA"}`,
                borderRadius: 16, padding: "32px 20px",
                textAlign: "center", background: selectedFile ? "#F9F4FC" : "#FFFAFB",
                transition: "all 0.2s"
              }}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: selectedFile ? "#F4EEF8" : "#F9F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px"
                }}>
                  <i className={`ti ${selectedFile ? "ti-file-check" : "ti-file-upload"}`}
                    style={{ fontSize: 22, color: selectedFile ? "#8B5CA8" : "#C0B0BC" }} />
                </div>

                {selectedFile ? (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#8B5CA8", margin: "0 0 4px" }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB — tap to change
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#2D1F2A", margin: "0 0 4px" }}>
                      Tap to select a file
                    </p>
                    <p style={{ fontSize: 12, color: "#A07890", margin: 0 }}>
                      PDF, JPG, or PNG accepted
                    </p>
                  </>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              style={{
                width: "100%",
                background: !selectedFile ? "#F2E8EA" : uploading ? "#C9A0D8" : "#8B5CA8",
                color: !selectedFile ? "#C0B0BC" : "white",
                border: "none", borderRadius: 16, padding: "15px",
                fontSize: 15, fontWeight: 600,
                cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
                boxShadow: selectedFile ? "0 4px 20px rgba(139,92,168,0.25)" : "none",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { if (selectedFile && !uploading) e.currentTarget.style.background = "#7A4D96"; }}
              onMouseLeave={e => { if (selectedFile && !uploading) e.currentTarget.style.background = "#8B5CA8"; }}
            >
              {uploading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <i className="ti ti-loader-2" style={{ fontSize: 16 }} />
                  Uploading and extracting...
                </span>
              ) : "Upload report"}
            </button>
          </form>
        )}

        {/* Stage 2 — review extracted values */}
        {reportId && !saved && (
          <div>
            <div style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F2E8EA", padding: "24px",
              marginBottom: 16
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: "#A07890",
                textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px"
              }}>
                Review extracted values
              </p>
              <p style={{ fontSize: 13, color: "#6B4F6B", margin: "0 0 20px", lineHeight: 1.5 }}>
                We found these values in your report. Edit or remove anything that looks wrong.
              </p>

              {extractedValues.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "24px 0",
                  borderTop: "1px solid #F9F0F3"
                }}>
                  <p style={{ fontSize: 13, color: "#A07890", margin: "0 0 4px" }}>
                    No values were automatically extracted.
                  </p>
                  <p style={{ fontSize: 12, color: "#C0B0BC", margin: 0 }}>
                    You can add them manually below.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {extractedValues.map((item, index) => (
                    <div key={index} style={{
                      background: "#FFFAFB", borderRadius: 14,
                      border: "1px solid #F2E8EA", padding: "14px 16px",
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", marginBottom: 10
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#8B5CA8",
                          textTransform: "uppercase", letterSpacing: "0.06em"
                        }}>
                          Result {index + 1}
                        </span>
                        <button
                          onClick={() => handleRemove(index)}
                          style={{
                            background: "none", border: "none",
                            cursor: "pointer", padding: 0
                          }}
                        >
                          <i className="ti ti-trash" style={{ fontSize: 15, color: "#C0B0BC" }} />
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 8 }}>
                        <input
                          type="text"
                          value={item.test_type}
                          onChange={e => handleValueChange(index, "test_type", e.target.value)}
                          placeholder="Test name"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#8B5CA8"}
                          onBlur={e => e.target.style.borderColor = "#F2E8EA"}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={item.value}
                          onChange={e => handleValueChange(index, "value", e.target.value)}
                          placeholder="Value"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#8B5CA8"}
                          onBlur={e => e.target.style.borderColor = "#F2E8EA"}
                        />
                        <input
                          type="text"
                          value={item.unit}
                          onChange={e => handleValueChange(index, "unit", e.target.value)}
                          placeholder="Unit"
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = "#8B5CA8"}
                          onBlur={e => e.target.style.borderColor = "#F2E8EA"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saving || extractedValues.length === 0}
                style={{
                  width: "100%",
                  background: extractedValues.length === 0 ? "#F2E8EA" : saving ? "#C9A0D8" : "#8B5CA8",
                  color: extractedValues.length === 0 ? "#C0B0BC" : "white",
                  border: "none", borderRadius: 16, padding: "15px",
                  fontSize: 15, fontWeight: 600,
                  cursor: saving || extractedValues.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: extractedValues.length > 0 ? "0 4px 20px rgba(139,92,168,0.25)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {saving ? "Saving..." : "Confirm and save"}
              </button>

              <button
                onClick={() => navigate(`/add-results/${reportId}`)}
                style={{
                  width: "100%", background: "white",
                  border: "1px solid #F2E8EA", borderRadius: 16,
                  padding: "14px", fontSize: 15, fontWeight: 600,
                  color: "#6B4F6B", cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFF8F9"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                Add manually instead
              </button>
            </div>
          </div>
        )}

        {/* Stage 3 — success */}
        {saved && (
          <div style={{
            background: "white", borderRadius: 20,
            border: "1px solid #F2E8EA", padding: "40px 24px",
            textAlign: "center"
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#EFF5E4", border: "2px solid #C2D9A0",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <i className="ti ti-check" style={{ fontSize: 26, color: "#4A6741" }} />
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2D1F2A", margin: "0 0 8px" }}>
              Results saved
            </h2>
            <p style={{ fontSize: 14, color: "#A07890", margin: "0 0 28px", lineHeight: 1.6 }}>
              Your lab report has been uploaded and results have been saved successfully.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => navigate("/my-reports")}
                style={{
                  width: "100%", background: "#8B5CA8",
                  color: "white", border: "none", borderRadius: 14,
                  padding: "13px", fontSize: 15, fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(139,92,168,0.25)",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#7A4D96"}
                onMouseLeave={e => e.currentTarget.style.background = "#8B5CA8"}
              >
                View my reports
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  width: "100%", background: "none",
                  border: "1px solid #F2E8EA", borderRadius: 14,
                  padding: "13px", fontSize: 15, fontWeight: 600,
                  color: "#A07890", cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FFF8F9"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadReport;