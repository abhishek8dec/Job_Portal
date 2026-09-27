import React from "react";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function SecondaryButton({
  children,
  fullWidth = false,
  className = "",
  style,
  disabled,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={`ds-btn-secondary ds-focus ${className}`}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: "var(--surface)",
        color: "var(--ink)",
        border: "1px solid var(--line)",
        borderRadius: "8px",
        padding: "8px 16px",
        fontSize: "0.875rem",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? "100%" : "auto",
        textDecoration: "none",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
