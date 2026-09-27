import React from "react";
import { Eyebrow } from "./Eyebrow";

interface StatBlockProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function StatBlock({
  label,
  value,
  highlight = false,
  className = "",
  style,
}: StatBlockProps) {
  return (
    <div
      className={`ds-stat-block ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ...style,
      }}
    >
      <Eyebrow style={{ marginBottom: "2px" }}>{label}</Eyebrow>
      <div
        className="ds-stat-numeral font-serif"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.25rem",
          fontWeight: 600,
          lineHeight: 1.05,
          color: highlight ? "var(--accent)" : "var(--ink)",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default StatBlock;
