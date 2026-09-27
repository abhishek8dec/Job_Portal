import React from "react";

interface CardProps {
  children: React.ReactNode;
  id?: string;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({
  children,
  id,
  interactive = false,
  className = "",
  style,
  onClick,
}: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`ds-card ${interactive ? "cursor-pointer" : ""} ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        padding: "24px",
        color: "var(--ink)",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
