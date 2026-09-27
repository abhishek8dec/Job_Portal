import React from "react";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Chip({ children, active = false, className = "", style }: ChipProps) {
  return (
    <span
      className={`ds-chip ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        borderRadius: "9999px",
        border: active ? "1px solid var(--accent)" : "1px solid var(--line)",
        backgroundColor: active ? "var(--accent-soft)" : "var(--paper)",
        color: active ? "var(--accent)" : "var(--muted)",
        fontSize: "12px",
        padding: "3px 10px",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Chip;
