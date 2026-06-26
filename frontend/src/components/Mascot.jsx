function Mascot({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="60" cy="68" rx="38" ry="36" fill="#F9D1D9" />
      {/* Head */}
      <ellipse cx="60" cy="44" rx="32" ry="30" fill="#F9D1D9" />
      {/* Ear left */}
      <ellipse cx="32" cy="28" rx="10" ry="13" fill="#F9D1D9" />
      <ellipse cx="32" cy="28" rx="6" ry="8" fill="#F7B8C4" />
      {/* Ear right */}
      <ellipse cx="88" cy="28" rx="10" ry="13" fill="#F9D1D9" />
      <ellipse cx="88" cy="28" rx="6" ry="8" fill="#F7B8C4" />
      {/* Face blush */}
      <ellipse cx="44" cy="50" rx="7" ry="4" fill="#F7B8C4" opacity="0.6" />
      <ellipse cx="76" cy="50" rx="7" ry="4" fill="#F7B8C4" opacity="0.6" />
      {/* Eyes */}
      <ellipse cx="50" cy="42" rx="5" ry="6" fill="#2D1F2A" />
      <ellipse cx="70" cy="42" rx="5" ry="6" fill="#2D1F2A" />
      {/* Eye shine */}
      <ellipse cx="52" cy="40" rx="2" ry="2" fill="white" />
      <ellipse cx="72" cy="40" rx="2" ry="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="50" rx="3" ry="2" fill="#E8748A" />
      {/* Smile */}
      <path d="M52 56 Q60 63 68 56" stroke="#E8748A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Little paws */}
      <ellipse cx="30" cy="90" rx="12" ry="9" fill="#F9D1D9" />
      <ellipse cx="90" cy="90" rx="12" ry="9" fill="#F9D1D9" />
      {/* Paw toes left */}
      <ellipse cx="23" cy="87" rx="3" ry="2.5" fill="#F7B8C4" />
      <ellipse cx="30" cy="85" rx="3" ry="2.5" fill="#F7B8C4" />
      <ellipse cx="37" cy="87" rx="3" ry="2.5" fill="#F7B8C4" />
      {/* Paw toes right */}
      <ellipse cx="83" cy="87" rx="3" ry="2.5" fill="#F7B8C4" />
      <ellipse cx="90" cy="85" rx="3" ry="2.5" fill="#F7B8C4" />
      <ellipse cx="97" cy="87" rx="3" ry="2.5" fill="#F7B8C4" />
      {/* Tail */}
      <path d="M96 72 Q118 60 110 82" stroke="#F9D1D9" strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default Mascot;