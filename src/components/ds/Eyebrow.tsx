import React from "react";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Eyebrow({ children, className = "", style }: EyebrowProps) {
  return (
    <div
      className={`ds-eyebrow ${className}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--muted)",
        marginBottom: "6px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Eyebrow;
