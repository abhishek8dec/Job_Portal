"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Lock,
  Mail,
  ArrowRight,
  Briefcase,
  AlertCircle,
  Users,
} from "lucide-react";
import { Eyebrow, Card, PrimaryButton, SecondaryButton } from "@/components/ds";
import { BrandLogo } from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "RECRUITER") {
        router.push("/recruiter");
      } else {
        router.push("/candidate/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: "CANDIDATE" | "RECRUITER", demoEmail?: string) => {
    setError(null);
    if (demoRole === "RECRUITER") {
      setRole("RECRUITER");
      setEmail(demoEmail || "sarah.jenkins@nexus.ai");
      setPassword("Password123!");
    } else {
      setRole("CANDIDATE");
      setEmail(demoEmail || "alex.mercer@example.com");
      setPassword("Password123!");
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        backgroundColor: "var(--paper)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Card style={{ padding: "32px", border: "1px solid var(--line)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <BrandLogo iconSize={32} textSize="1.45rem" />
            </div>
            <Eyebrow style={{ marginBottom: "6px" }}>WELCOME BACK</Eyebrow>
            <h1
              className="font-serif tracking-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.2,
                marginBottom: "8px",
              }}
            >
              Sign in to Job.Com
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5 }}>
              Access your candidate screen or recruiter desk.
            </p>
          </div>

          {/* Role Switcher - Segmented Control */}
          <div
            style={{
              display: "flex",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "20px",
              backgroundColor: "var(--surface)",
            }}
          >
            <button
              type="button"
              onClick={() => setRole("CANDIDATE")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                backgroundColor:
                  role === "CANDIDATE" ? "var(--ink)" : "var(--surface)",
                color: role === "CANDIDATE" ? "#ffffff" : "var(--muted)",
              }}
            >
              <Video size={14} /> Candidate
            </button>

            <button
              type="button"
              onClick={() => setRole("RECRUITER")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                border: "none",
                borderLeft: "1px solid var(--line)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                backgroundColor:
                  role === "RECRUITER" ? "var(--ink)" : "var(--surface)",
                color: role === "RECRUITER" ? "#ffffff" : "var(--muted)",
              }}
            >
              <Briefcase size={14} /> Recruiter
            </button>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "var(--bad-bg)",
                border: "1px solid rgba(160, 58, 46, 0.2)",
                color: "var(--bad-text)",
                fontSize: "0.8125rem",
                marginBottom: "18px",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "var(--ink)",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  color="var(--muted)"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder={
                    role === "CANDIDATE"
                      ? "alex.mercer@example.com"
                      : "recruiter@job.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    color: "var(--ink)",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "var(--ink)",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  color="var(--muted)"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    color: "var(--ink)",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              fullWidth
              style={{ padding: "10px 16px" }}
            >
              {loading
                ? "Authenticating..."
                : `Sign in as ${role === "CANDIDATE" ? "Candidate" : "Recruiter"}`}
              <ArrowRight size={16} />
            </PrimaryButton>
          </form>

          {/* 1-Click Demo Logins */}
          <div
            style={{
              margin: "24px 0 16px",
              paddingTop: "18px",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div
              className="ds-eyebrow"
              style={{
                fontSize: "10px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              Quick Demo Fill
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <SecondaryButton
                type="button"
                onClick={() => fillDemo("CANDIDATE", "alex.mercer@example.com")}
                fullWidth
                style={{
                  justifyContent: "flex-start",
                  padding: "7px 10px",
                  fontSize: "0.75rem",
                }}
              >
                <Video size={13} color="var(--accent)" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Alex Mercer</span>
              </SecondaryButton>

              <SecondaryButton
                type="button"
                onClick={() => fillDemo("CANDIDATE", "elena.rostova@example.com")}
                fullWidth
                style={{
                  justifyContent: "flex-start",
                  padding: "7px 10px",
                  fontSize: "0.75rem",
                }}
              >
                <Video size={13} color="var(--accent)" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Elena Rostova</span>
              </SecondaryButton>

              <SecondaryButton
                type="button"
                onClick={() => fillDemo("RECRUITER", "sarah.jenkins@nexus.ai")}
                fullWidth
                style={{
                  justifyContent: "flex-start",
                  padding: "7px 10px",
                  fontSize: "0.75rem",
                }}
              >
                <Users size={13} color="var(--accent)" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Sarah Jenkins</span>
              </SecondaryButton>

              <SecondaryButton
                type="button"
                onClick={() => fillDemo("RECRUITER", "priya.sharma@nexustech.io")}
                fullWidth
                style={{
                  justifyContent: "flex-start",
                  padding: "7px 10px",
                  fontSize: "0.75rem",
                }}
              >
                <Users size={13} color="var(--accent)" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Priya Sharma</span>
              </SecondaryButton>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8125rem",
              color: "var(--muted)",
            }}
          >
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}
            >
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
