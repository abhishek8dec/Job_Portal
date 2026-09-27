import React from "react";

interface QuoteProps {
  text: string;
  attribution?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Quote({ text, attribution, className = "", style }: QuoteProps) {
  return (
    <div
      className={`ds-quote ${className}`}
      style={{
        borderLeft: "2px solid var(--line)",
        paddingLeft: "16px",
        margin: "12px 0",
        fontStyle: "italic",
        color: "var(--ink)",
        ...style,
      }}
    >
      <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>"{text}"</div>
      {attribution && (
        <div
          className="ds-quote-attribution"
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            fontStyle: "normal",
            marginTop: "6px",
          }}
        >
          {attribution}
        </div>
      )}
    </div>
  );
}

export default Quote;
