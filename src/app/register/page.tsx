"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Eyebrow, Card, PrimaryButton } from "@/components/ds";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER">("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          company: role === "RECRUITER" ? company : null,
          title,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.user.role === "RECRUITER") {
        router.push("/recruiter");
      } else {
        router.push("/candidate/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration error");
    } finally {
      setLoading(false);
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
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Card style={{ padding: "32px", border: "1px solid var(--line)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Eyebrow style={{ marginBottom: "6px" }}>CREATE ACCOUNT</Eyebrow>
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
              Join Job.Com
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5 }}>
              Create your candidate profile or recruiter workspace.
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "5px",
                  color: "var(--ink)",
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User
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
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
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

            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "5px",
                  color: "var(--ink)",
                }}
              >
                Work or Personal Email
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
                  placeholder="jordan.lee@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
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

            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "5px",
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
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
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

            {/* Recruiter specific fields */}
            {role === "RECRUITER" && (
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    marginBottom: "5px",
                    color: "var(--ink)",
                  }}
                >
                  Hiring Organization / Company
                </label>
                <div style={{ position: "relative" }}>
                  <Building
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
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="ds-focus"
                    style={{
                      width: "100%",
                      padding: "9px 12px 9px 36px",
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
            )}

            {/* Role headline / title */}
            <div style={{ marginBottom: "22px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  marginBottom: "5px",
                  color: "var(--ink)",
                }}
              >
                {role === "CANDIDATE" ? "Professional Headline" : "Your Role / Title"}
              </label>
              <div style={{ position: "relative" }}>
                <Briefcase
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
                  type="text"
                  placeholder={
                    role === "CANDIDATE"
                      ? "e.g. Senior Full-Stack Engineer"
                      : "e.g. Head of Talent Acquisition"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="ds-focus"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
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
                ? "Creating Account..."
                : `Register as ${role === "CANDIDATE" ? "Candidate" : "Recruiter"}`}
              <ArrowRight size={16} />
            </PrimaryButton>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.8125rem",
              color: "var(--muted)",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}
            >
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
