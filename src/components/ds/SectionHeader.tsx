import React from "react";
import { Eyebrow } from "./Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  number?: string;
  title: string;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionHeader({
  eyebrow,
  number,
  title,
  subtitle,
  className = "",
  style,
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`} style={{ marginBottom: "28px", ...style }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className="font-serif tracking-tight"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {number && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              fontWeight: 400,
              marginRight: "10px",
            }}
          >
            {number.endsWith("/") ? number : `${number} /`}{" "}
          </span>
        )}
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--muted)",
            marginTop: "8px",
            lineHeight: 1.5,
            maxWidth: "680px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
