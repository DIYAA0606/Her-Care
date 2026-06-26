import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const MONTHS_BACK = 3;
const MONTHS_FORWARD = 3;

function generateMonths(today) {
  const months = [];
  for (let i = -MONTHS_BACK; i <= MONTHS_FORWARD; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
}

function LogCycle() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months = generateMonths(today);
  const todayMonthRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (todayMonthRef.current) {
      setTimeout(() => {
        todayMonthRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const toDateKey = (d) => d.toISOString().split("T")[0];

  const handleDayTap = (date) => {
    const next = tapCount + 1;
    if (next === 1) {
      setStartDate(date);
      setEndDate(null);
      setTapCount(1);
    } else if (next === 2) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
        setTapCount(1);
      } else {
        setEndDate(date);
        setTapCount(2);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
      setTapCount(1);
      setShowNotes(false);
      setNotes("");
    }
  };

  const isStart = (date) => startDate && toDateKey(date) === toDateKey(startDate);
  const isEnd = (date) => endDate && toDateKey(date) === toDateKey(endDate);
  const isInRange = (date) => startDate && endDate && date > startDate && date < endDate;
  const isToday = (date) => toDateKey(date) === toDateKey(today);

  const formatDisplay = (d) => d.toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric"
  });

  const handleSubmit = async () => {
    if (!startDate) return;
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/cycles/", {
        start_date: toDateKey(startDate),
        end_date: endDate ? toDateKey(endDate) : null,
        notes: notes || null,
      });
      setSuccess("Cycle logged successfully.");
      setStartDate(null);
      setEndDate(null);
      setTapCount(0);
      setNotes("");
      setShowNotes(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ background: "#FFF8F9", minHeight: "100vh", paddingBottom: 120 }}>

      {/* Fixed header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "#FFF8F9",
        padding: "52px 24px 16px",
        borderBottom: "1px solid #F2E8EA",
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          color: "#A07890", fontSize: 13, fontWeight: 600,
          padding: 0, marginBottom: 16
        }}>
          <i className="ti ti-chevron-left" style={{ fontSize: 16 }} />
          Back
        </button>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <p style={{ fontSize: 12, color: "#A07890", margin: "0 0 2px", letterSpacing: "0.04em" }}>
              Track your cycle
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2D1F2A", margin: 0 }}>
              Log a cycle
            </h1>
          </div>

          {/* Live selection pill */}
          {startDate ? (
            <div style={{
              background: "white", borderRadius: 12,
              border: "1px solid #F2E8EA",
              padding: "8px 12px", maxWidth: 160, textAlign: "right"
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#E8748A", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {endDate ? "Range" : "Start"}
              </p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#2D1F2A", margin: 0, lineHeight: 1.4 }}>
                {endDate
                  ? `${startDate.getDate()} – ${endDate.getDate()} ${endDate.toLocaleString("default", { month: "short" })}`
                  : formatDisplay(startDate)
                }
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#C0B0BC", fontStyle: "italic" }}>
              Tap to begin
            </p>
          )}
        </div>

        {/* Feedback inline */}
        {error && (
          <div style={{
            background: "#FFF0F3", border: "1px solid #F7C5CE",
            borderRadius: 10, padding: "8px 12px", marginTop: 10
          }}>
            <p style={{ fontSize: 12, color: "#C0445A", margin: 0 }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{
            background: "#EFF5E4", border: "1px solid #C2D9A0",
            borderRadius: 10, padding: "8px 12px", marginTop: 10
          }}>
            <p style={{ fontSize: 12, color: "#4A6741", margin: 0 }}>{success}</p>
          </div>
        )}

        {/* Day labels — sticky, always visible */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
          marginTop: 16
        }}>
          {DAY_LABELS.map((d) => (
            <div key={d} style={{
              textAlign: "center", fontSize: 10, fontWeight: 600,
              color: "#C0B0BC", letterSpacing: "0.04em",
              paddingBottom: 4
            }}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling months */}
      <div style={{ padding: "0 24px" }}>
        {months.map(({ year, month }) => {
          const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const firstDay = new Date(year, month, 1).getDay();
          const monthLabel = new Date(year, month).toLocaleString("default", { month: "long" });

          return (
            <div
              key={`${year}-${month}`}
              ref={isCurrentMonth ? todayMonthRef : null}
              style={{ paddingTop: 28, paddingBottom: 8 }}
            >
              {/* Month label */}
              <div style={{
                display: "flex", alignItems: "baseline", gap: 8,
                marginBottom: 16
              }}>
                <p style={{
                  fontSize: 22, fontWeight: 300, color: "#2D1F2A",
                  margin: 0, letterSpacing: "-0.02em"
                }}>
                  {monthLabel}
                </p>
                <p style={{ fontSize: 13, color: "#C0B0BC", margin: 0, fontWeight: 400 }}>
                  {year}
                </p>
              </div>

              {/* Days grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
                rowGap: 4
              }}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  date.setHours(0, 0, 0, 0);

                  const start = isStart(date);
                  const end = isEnd(date);
                  const inRange = isInRange(date);
                  const todayMark = isToday(date);
                  const selected = start || end;

                  // Determine range band sides
                  const showRightBand = (start && endDate) || inRange;
                  const showLeftBand = (end && startDate) || inRange;

                  return (
                    <div key={day} style={{
                      position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      height: 44
                    }}>
                      {/* Range band — left half */}
                      {showLeftBand && (
                        <div style={{
                          position: "absolute", top: 4, bottom: 4,
                          left: 0, right: "50%",
                          background: "#FDE8ED",
                          zIndex: 0
                        }} />
                      )}
                      {/* Range band — right half */}
                      {showRightBand && (
                        <div style={{
                          position: "absolute", top: 4, bottom: 4,
                          left: "50%", right: 0,
                          background: "#FDE8ED",
                          zIndex: 0
                        }} />
                      )}

                      <button
                        onClick={() => handleDayTap(date)}
                        style={{
                          position: "relative", zIndex: 1,
                          width: 38, height: 38,
                          borderRadius: "50%",
                          border: todayMark && !selected
                            ? "1.5px solid #E8748A"
                            : "none",
                          cursor: "pointer",
                          background: selected
                            ? "#E8748A"
                            : "transparent",
                          color: selected ? "white"
                            : inRange ? "#C0445A"
                            : todayMark ? "#E8748A"
                            : "#2D1F2A",
                          fontSize: 14,
                          fontWeight: selected ? 700
                            : todayMark ? 700
                            : 400,
                          display: "flex", alignItems: "center",
                          justifyContent: "center",
                          boxShadow: selected
                            ? "0 2px 12px rgba(232,116,138,0.35)"
                            : "none",
                          transition: "background 0.15s, box-shadow 0.15s"
                        }}
                      >
                        {day}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Notes section */}
        {startDate && (
          <div style={{
            background: "white", borderRadius: 20,
            border: "1px solid #F2E8EA",
            padding: "16px 20px", marginTop: 24
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
                    How are you feeling?
                  </p>
                </div>
              </button>
            ) : (
              <>
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 12
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6B4F6B", margin: 0 }}>
                    Note
                  </p>
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
                  placeholder="How are you feeling? Any observations..."
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
        )}
      </div>

      {/* Sticky save */}
      {startDate && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "16px 24px 40px",
          background: "linear-gradient(to top, #FFF8F9 65%, transparent)",
          pointerEvents: "none"
        }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", pointerEvents: "all",
              background: submitting ? "#F0B8C4" : "#E8748A",
              color: "white", border: "none", borderRadius: 16,
              padding: "15px", fontSize: 15, fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 20px rgba(232,116,138,0.30)",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#D95F75"; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#E8748A"; }}
          >
            {submitting ? "Saving..." : endDate ? "Save cycle" : "Save as ongoing"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LogCycle;