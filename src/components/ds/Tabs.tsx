import React from "react";

interface TabsProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Tabs({
  tabs,
  activeIndex,
  onChange,
  className = "",
  style,
}: TabsProps) {
  return (
    <div
      className={`ds-tabs flex border-b border-line ${className}`}
      style={{
        display: "flex",
        borderBottom: "1px solid var(--line)",
        gap: "4px",
        marginBottom: "20px",
        ...style,
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(idx)}
            style={{
              padding: "10px 18px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              borderBottom: isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--muted)",
              borderRadius: "6px 6px 0 0",
              transition: "all 0.15s ease",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
