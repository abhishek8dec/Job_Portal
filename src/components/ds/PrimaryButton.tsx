import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  fullWidth = false,
  className = "",
  style,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`ds-btn-primary ds-focus ${className}`}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: "var(--ink)",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "0.875rem",
        fontWeight: 500,
        border: "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? "100%" : "auto",
        textDecoration: "none",
        transition: "opacity 0.15s ease",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
