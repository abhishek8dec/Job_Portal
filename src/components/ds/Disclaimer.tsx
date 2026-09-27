import React from "react";

interface DisclaimerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Disclaimer({ children, className = "", style }: DisclaimerProps) {
  return (
    <div
      className={`ds-disclaimer ${className}`}
      style={{
        fontSize: "12px",
        color: "rgba(111, 106, 97, 0.85)",
        lineHeight: 1.5,
        marginTop: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Disclaimer;
