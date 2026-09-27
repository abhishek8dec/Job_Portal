import React from "react";

interface ScoreBarProps {
  label: string;
  score: number; // 0 to 100
  max?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScoreBar({
  label,
  score,
  max = 100,
  className = "",
  style,
}: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)));

  return (
    <div
      className={`ds-score-bar ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        margin: "8px 0",
        ...style,
      }}
    >
      <div style={{ flex: "0 0 160px", fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500 }}>
        {label}
      </div>

      <div
        style={{
          flex: 1,
          height: "8px",
          backgroundColor: "var(--line)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "var(--accent)",
            borderRadius: "9999px",
            transition: "width 0.4s ease-out",
          }}
        />
      </div>

      <div
        className="font-mono"
        style={{
          flex: "0 0 44px",
          textAlign: "right",
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {score}
      </div>
    </div>
  );
}

export default ScoreBar;
