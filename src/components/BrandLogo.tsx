import React from "react";

interface BrandIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official Brand Icon for Job.Com
 * Features an authoritative monogram 'J', the signature emerald '.Com' dot,
 * and a deep forest green gradient badge matching the editorial aesthetic.
 */
export function BrandIcon({ size = 28, className = "", style }: BrandIconProps) {
  const scale = size / 28;

  return (
    <div
      className={`brand-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(7 * scale)}px`,
        background: "linear-gradient(135deg, #1E5A41 0%, #133D2B 100%)",
        boxShadow: "0 2px 6px rgba(30, 90, 65, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        ...style,
      }}
      aria-label="Job.Com Icon"
    >
      <svg
        width={Math.round(20 * scale)}
        height={Math.round(20 * scale)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Serifs / Top Crossbar of 'J' */}
        <path
          d="M7 6.5H16.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Stem and Sweeping Hook of 'J' */}
        <path
          d="M13.5 6.5V14.5C13.5 17 11.5 19 8.8 19C7.2 19 5.8 18.1 5 16.8"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The Signature '.Com' Accent Dot (Camera Aperture / Live Video Indicator) */}
        <circle cx="18" cy="18" r="2.8" fill="#34D399" />
        <circle cx="18" cy="18" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

interface BrandLogoProps {
  iconSize?: number;
  textSize?: string;
  showWordmark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Full Brand Lockup: BrandIcon + "Job.Com" Editorial Wordmark
 */
export function BrandLogo({
  iconSize = 28,
  textSize = "1.32rem",
  showWordmark = true,
  className = "",
  style,
}: BrandLogoProps) {
  return (
    <div
      className={`brand-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        color: "var(--ink)",
        ...style,
      }}
    >
      <BrandIcon size={iconSize} />

      {showWordmark && (
        <span
          style={{
            fontSize: textSize,
            fontFamily: "var(--font-heading), var(--font-body), sans-serif",
            color: "var(--ink)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            userSelect: "none",
          }}
        >
          <span style={{ fontWeight: 700 }}>Job</span>
          <span style={{ fontWeight: 400, color: "var(--accent)" }}>.Com</span>
        </span>
      )}
    </div>
  );
}

export default BrandLogo;
