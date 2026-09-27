import React from "react";

export type StatusVariant = "good" | "warn" | "bad" | "neutral";

interface StatusPillProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function StatusPill({
  children,
  variant = "neutral",
  className = "",
  style,
}: StatusPillProps) {
  const getStyles = () => {
    switch (variant) {
      case "good":
        return {
          backgroundColor: "var(--good-bg)",
          color: "var(--good-text)",
          border: "1px solid rgba(30, 90, 65, 0.2)",
        };
      case "warn":
        return {
          backgroundColor: "var(--warn-bg)",
          color: "var(--warn-text)",
          border: "1px solid rgba(138, 106, 31, 0.2)",
        };
      case "bad":
        return {
          backgroundColor: "var(--bad-bg)",
          color: "var(--bad-text)",
          border: "1px solid rgba(160, 58, 46, 0.2)",
        };
      default:
        return {
          backgroundColor: "var(--paper)",
          color: "var(--muted)",
          border: "1px solid var(--line)",
        };
    }
  };

  return (
    <span
      className={`ds-status-pill ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "9999px",
        padding: "3px 10px",
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.4,
        ...getStyles(),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default StatusPill;
