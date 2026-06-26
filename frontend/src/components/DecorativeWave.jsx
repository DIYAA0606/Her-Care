function DecorativeWave({ position = "top-right", opacity = 0.5 }) {
  const isTopRight = position === "top-right";
  const isBottomLeft = position === "bottom-left";

  const style = {
    position: "absolute",
    zIndex: 0,
    pointerEvents: "none",
    ...(isTopRight && { top: -20, right: -30 }),
    ...(isBottomLeft && { bottom: -20, left: -30 }),
  };

  const transform = isBottomLeft ? "rotate(180deg)" : "none";

  return (
    <div style={style}>
      <svg
        width="220" height="220"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform, opacity }}
      >
        <path
          d="M180 10 C160 10 140 30 130 55 C120 80 125 110 110 130 C95 150 65 155 50 175 C35 195 40 220 20 220"
          stroke="#E8748A"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M220 40 C195 40 175 62 163 90 C151 118 157 150 140 172 C123 194 88 198 70 220"
          stroke="#F9D1D9"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default DecorativeWave;