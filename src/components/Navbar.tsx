"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { NAV_ITEMS, NavItemConfig, DropdownOption } from "./navConfig";
import { BrandIcon } from "./BrandLogo";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
  company?: string | null;
  title?: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Active dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const handleMouseEnter = (itemId: string, hasDropdown: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hasDropdown) {
      setActiveDropdown(itemId);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleDropdown = (itemId: string) => {
    setActiveDropdown((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--paper)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        ref={navContainerRef}
        style={{
          maxWidth: "1520px",
          margin: "0 auto",
          padding: "0 28px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Left: Brand Logo & Wordmark */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          {/* Official Job.Com Brand Icon */}
          <BrandIcon size={28} />

          {/* Job.Com Brand Wordmark */}
          <span
            style={{
              fontSize: "1.32rem",
              fontFamily: "var(--font-heading), var(--font-body), sans-serif",
              color: "var(--ink)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ fontWeight: 700 }}>Job</span>
            <span style={{ fontWeight: 400, color: "var(--accent)" }}>.Com</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Bar with Dropdowns */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: "28px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);
            const isOpen = activeDropdown === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => handleMouseEnter(item.id, hasDropdown)}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.id)}
                    aria-expanded={isOpen}
                    style={{
                      background: "transparent",
                      border: "none",
                      height: "100%",
                      padding: "0 4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: isOpen ? "var(--ink)" : "var(--ink)",
                      textTransform: "uppercase",
                      position: "relative",
                      transition: "color 0.15s ease",
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={13}
                      strokeWidth={2.5}
                      style={{
                        transition: "transform 0.2s ease",
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                    />

                    {/* Active Underline Indicator (matches reference image) */}
                    {isOpen && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          backgroundColor: "var(--ink)",
                        }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || "/"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      padding: "0 4px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: "var(--ink)",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      position: "relative",
                      transition: "color 0.15s ease",
                    }}
                  >
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Dropdown Menu Panel (matches reference image) */}
                {hasDropdown && isOpen && item.dropdown && (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.id, true)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 1px)",
                      left: 0,
                      width: "420px",
                      backgroundColor: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "0 0 6px 6px",
                      boxShadow: "0 12px 30px rgba(28, 27, 24, 0.08)",
                      padding: "24px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                      zIndex: 100,
                      animation: "fadeIn 0.15s ease-out",
                    }}
                  >
                    {item.dropdown.map((opt, idx) => (
                      <Link
                        key={idx}
                        href={opt.href}
                        onClick={() => setActiveDropdown(null)}
                        style={{
                          textDecoration: "none",
                          display: "block",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          margin: "-6px -8px",
                          transition: "background-color 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(30, 90, 65, 0.04)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {/* Eyebrow Label */}
                        <div
                          style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            color: "var(--muted)",
                            textTransform: "uppercase",
                            marginBottom: "3px",
                          }}
                        >
                          {opt.eyebrow}
                        </div>

                        {/* Title / Value Proposition */}
                        <div
                          style={{
                            fontFamily: "var(--font-body), sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.01em",
                            color: "var(--ink)",
                            lineHeight: 1.35,
                          }}
                        >
                          {opt.title}
                        </div>

                        {opt.description && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--muted)",
                              marginTop: "3px",
                              lineHeight: 1.4,
                            }}
                          >
                            {opt.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Actions (START HIRING FREE & LOGIN) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Amber Boxed Button: START HIRING FREE > */}
          <Link
            href="/recruiter"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              border: "1px solid #D9A038",
              borderRadius: "2px",
              backgroundColor: "#FAF6EE",
              color: "var(--ink)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F4EBD9";
              e.currentTarget.style.borderColor = "#C89332";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FAF6EE";
              e.currentTarget.style.borderColor = "#D9A038";
            }}
          >
            <span>START HIRING FREE</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </Link>

          {/* User Auth or LOGIN Link */}
          {loading ? null : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link
                href={user.role === "CANDIDATE" ? "/candidate/dashboard" : "/recruiter"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--surface)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                  }}
                >
                  {user.name.split(" ")[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: "4px",
                }}
                title="Sign Out"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: "var(--ink)",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "6px 8px",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink)";
              }}
            >
              LOGIN
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "var(--ink)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            backgroundColor: "var(--paper)",
            padding: "16px 24px 24px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.id} style={{ marginBottom: "16px" }}>
              {item.dropdown ? (
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "8px" }}>
                    {item.dropdown.map((opt, idx) => (
                      <Link
                        key={idx}
                        href={opt.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: "9.5px",
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            color: "var(--muted)",
                          }}
                        >
                          {opt.eyebrow}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body), sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {opt.title}
                        </div>
                        {opt.description && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "var(--muted)",
                              marginTop: "2px",
                              lineHeight: 1.35,
                            }}
                          >
                            {opt.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href || "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
            <Link
              href="/recruiter"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px",
                border: "1px solid #D9A038",
                backgroundColor: "#FAF6EE",
                color: "var(--ink)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                marginBottom: "10px",
              }}
            >
              START HIRING FREE &gt;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
