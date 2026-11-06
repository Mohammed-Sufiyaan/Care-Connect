// Original animated robot mascot for the CareConnect Advisor (pure SVG + CSS, no external assets).
// Idle: floats, blinks and waves. Thinking: antenna pulses, eyes scan, a dot loader appears.

export function Robot({ size = 160, thinking = false, wave = true, className = "" }: { size?: number; thinking?: boolean; wave?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`robot ${thinking ? "robot--thinking" : ""} ${className}`}
      role="img"
      aria-label={thinking ? "Advisor robot thinking" : "Advisor robot"}
    >
      <ellipse className="robot-shadow" cx="100" cy="186" rx="44" ry="7" />
      <g className="robot-body">
        {/* antenna */}
        <line x1="100" y1="34" x2="100" y2="52" className="robot-line" />
        <circle cx="100" cy="28" r="8" className="robot-antenna" />
        {/* ears */}
        <rect x="38" y="78" width="12" height="28" rx="6" className="robot-accent" />
        <rect x="150" y="78" width="12" height="28" rx="6" className="robot-accent" />
        {/* head */}
        <rect x="48" y="50" width="104" height="84" rx="26" className="robot-shell" />
        <rect x="60" y="64" width="80" height="54" rx="18" className="robot-face" />
        {/* eyes */}
        <g className="robot-eyes">
          <ellipse cx="84" cy="88" rx="8" ry="9" className="robot-eye" />
          <ellipse cx="116" cy="88" rx="8" ry="9" className="robot-eye" />
          <circle cx="86.5" cy="85" r="2.4" className="robot-glint" />
          <circle cx="118.5" cy="85" r="2.4" className="robot-glint" />
        </g>
        {/* mouth */}
        <path d="M88 106 Q100 114 112 106" className="robot-mouth" />
        {/* cheeks */}
        <circle cx="70" cy="104" r="4" className="robot-cheek" />
        <circle cx="130" cy="104" r="4" className="robot-cheek" />
        {/* torso */}
        <rect x="70" y="138" width="60" height="38" rx="14" className="robot-shell" />
        <path d="M100 148 l3.2 6.4 7 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7-1z" className="robot-badge" />
        {/* arms */}
        <rect x="52" y="142" width="14" height="30" rx="7" className="robot-accent" />
        <g className={wave ? "robot-wave" : ""}>
          <rect x="134" y="142" width="14" height="30" rx="7" className="robot-accent" />
        </g>
      </g>
      {/* thinking dots */}
      <g className="robot-dots">
        <circle cx="158" cy="40" r="5" />
        <circle cx="174" cy="30" r="6" />
        <circle cx="188" cy="18" r="7" />
      </g>
    </svg>
  );
}
