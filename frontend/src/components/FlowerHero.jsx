import { useEffect, useState } from "react";
import api from "../api/axios";

const MILESTONES = [
  { key: "first_cycle", label: "First cycle logged", petal: 0 },
  { key: "three_symptoms", label: "3 symptoms tracked", petal: 1 },
  { key: "first_report", label: "First report uploaded", petal: 2 },
  { key: "profile_complete", label: "Profile completed", petal: 3 },
  { key: "five_cycles", label: "5 cycles logged", petal: 4 },
];

function computeMilestones(data, hasDisplayName) {
  const unlocked = new Set();
  if (data.cycle_count >= 1) unlocked.add("first_cycle");
  if (data.symptom_count >= 3) unlocked.add("three_symptoms");
  if (data.report_count >= 1) unlocked.add("first_report");
  if (hasDisplayName) unlocked.add("profile_complete");
  if (data.cycle_count >= 5) unlocked.add("five_cycles");
  return unlocked;
}

// Petal paths arranged around center
const PETAL_CONFIGS = [
  { rotate: 0 },
  { rotate: 72 },
  { rotate: 144 },
  { rotate: 216 },
  { rotate: 288 },
];

function Petal({ unlocked, rotate, delay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <g transform={`rotate(${rotate}, 100, 100)`}>
      <ellipse
        cx="100"
        cy="68"
        rx="14"
        ry="26"
        fill={unlocked ? "#F9D1D9" : "#F2E8EA"}
        opacity={visible ? 1 : 0}
        style={{
          transition: `opacity 0.6s ease ${delay}ms, fill 0.8s ease`,
          transformOrigin: "100px 100px",
          transform: visible
            ? "scaleY(1)"
            : "scaleY(0)",
        }}
      />
      {unlocked && (
        <ellipse
          cx="100"
          cy="72"
          rx="8"
          ry="16"
          fill="#F7B8C4"
          opacity={visible ? 0.6 : 0}
          style={{
            transition: `opacity 0.6s ease ${delay + 200}ms`,
          }}
        />
      )}
    </g>
  );
}

function FlowerHero({ onActionBurst }) {
  const [analytics, setAnalytics] = useState(null);
  const [tip, setTip] = useState("");
  const [tipLoading, setTipLoading] = useState(true);
  const [burst, setBurst] = useState(false);
  const [floatUp, setFloatUp] = useState(false);

  useEffect(() => {
    api.get("/analytics/")
      .then(res => setAnalytics(res.data))
      .catch(() => setAnalytics(null));

    api.get("/reports/tip")
      .then(res => setTip(res.data.tip))
      .catch(() => setTip("Keep tracking your health — every entry helps build a clearer picture."))
      .finally(() => setTipLoading(false));
  }, []);

  // Idle float animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatUp(f => !f);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const unlocked = analytics
    ? computeMilestones(analytics, false)
    : new Set();

  const unlockedCount = unlocked.size;
  const totalPetals = MILESTONES.length;

  const handleFlowerTap = () => {
    setBurst(b => !b);
    if (onActionBurst) onActionBurst(!burst);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", width: "100%"
    }}>

      {/* Flower */}
      <div
        onClick={handleFlowerTap}
        style={{
          cursor: "pointer",
          transform: floatUp ? "translateY(-6px)" : "translateY(0px)",
          transition: "transform 2s ease-in-out",
          marginBottom: 8,
          position: "relative"
        }}
      >
        <svg
          width="200" height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Petals */}
          {PETAL_CONFIGS.map((config, i) => (
            <Petal
              key={i}
              unlocked={unlocked.has(MILESTONES[i].key)}
              rotate={config.rotate}
              delay={i * 150}
            />
          ))}

          {/* Stem */}
          <path
            d="M100 140 Q95 160 98 180"
            stroke="#C2D9A0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf */}
          <path
            d="M98 165 Q85 155 82 145"
            stroke="#838F58"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Center circle */}
          <circle
            cx="100" cy="100" r="22"
            fill="#E8748A"
          />
          {/* Center shine */}
          <circle cx="93" cy="94" r="5" fill="#F7B8C4" opacity="0.5" />

          {/* Plus icon in center */}
          <line
            x1="100" y1="91"
            x2="100" y2="109"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="91" y1="100"
            x2="109" y2="100"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Tap hint ring */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          boxShadow: burst
            ? "0 0 0 12px rgba(232,116,138,0.08)"
            : "0 0 0 0px rgba(232,116,138,0)",
          transition: "box-shadow 0.4s ease",
          pointerEvents: "none"
        }} />
      </div>

      {/* Milestone progress */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 16
      }}>
        {MILESTONES.map((m, i) => (
          <div
            key={m.key}
            title={m.label}
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: unlocked.has(m.key) ? "#E8748A" : "#F2E8EA",
              transition: "background 0.4s ease"
            }}
          />
        ))}
      </div>

      {/* Progress label */}
      <p style={{
        fontSize: 12, color: "#A07890", margin: "0 0 20px",
        fontWeight: 500
      }}>
        {unlockedCount === 0 && "Start tracking to grow your flower"}
        {unlockedCount > 0 && unlockedCount < totalPetals && `${unlockedCount} of ${totalPetals} petals bloomed`}
        {unlockedCount === totalPetals && "Your flower is in full bloom"}
      </p>

      {/* Gemini tip */}
      <div style={{
        background: "white", borderRadius: 18,
        border: "1px solid #F2E8EA",
        padding: "14px 18px",
        width: "100%", boxSizing: "border-box",
        display: "flex", alignItems: "flex-start", gap: 12,
        marginBottom: 8
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "#FFF0F3", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <i className="ti ti-sparkles" style={{ fontSize: 15, color: "#E8748A" }} />
        </div>
        <p style={{
          fontSize: 13, color: "#6B4F6B",
          margin: 0, lineHeight: 1.6,
          fontStyle: tipLoading ? "italic" : "normal",
          opacity: tipLoading ? 0.5 : 1,
          transition: "opacity 0.4s"
        }}>
          {tipLoading ? "Reading your health data..." : tip}
        </p>
      </div>
    </div>
  );
}

export default FlowerHero;