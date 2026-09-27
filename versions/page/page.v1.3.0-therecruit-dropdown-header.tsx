"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  ShieldAlert,
  Clock,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Terminal,
  Play,
  Briefcase,
  MapPin,
  DollarSign,
  Search,
} from "lucide-react";
import {
  Eyebrow,
  SectionHeader,
  Card,
  PrimaryButton,
  SecondaryButton,
  Chip,
  StatusPill,
} from "@/components/ds";

export default function HomePage() {
  const jobs = [
    {
      id: "job-1",
      title: "Principal AI & Full-Stack Architect",
      dept: "Core Engineering",
      location: "San Francisco, CA (Remote Friendly)",
      type: "Full-Time",
      salary: "$190,000 - $240,000",
      description:
        "Lead the architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, and candidate assessment infrastructure.",
      token: "demo-candidate-1",
      tags: ["TypeScript", "Next.js", "MediaRecorder", "Prisma"],
    },
    {
      id: "job-2",
      title: "Staff Systems Reliability & Cloud Architect",
      dept: "Infrastructure",
      location: "Austin, TX / Remote",
      type: "Full-Time",
      salary: "$175,000 - $220,000",
      description:
        "Design resilient media ingestion pipelines, edge video encoding, and automated scaling for thousands of concurrent video interviews.",
      token: "demo-candidate-1",
      tags: ["Kubernetes", "AWS S3", "WebRTC", "Go"],
    },
    {
      id: "job-3",
      title: "Senior Product Designer (Design Systems)",
      dept: "Product Experience",
      location: "New York, NY / Hybrid",
      type: "Full-Time",
      salary: "$150,000 - $185,000",
      description:
        "Create human-centered, accessible candidate interview rooms and intuitive recruiter decision workspaces.",
      token: "demo-candidate-1",
      tags: ["Figma", "Design Systems", "Accessibility", "Motion"],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main
      className="ds-theme"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        paddingBottom: "80px",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: "70px 24px 40px",
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <Eyebrow>01 / PLATFORM ARCHITECTURE · VIDEO SCREENING</Eyebrow>
        </div>

        <h1
          className="font-serif tracking-tight"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            lineHeight: 1.15,
            marginBottom: "20px",
            color: "var(--ink)",
            fontWeight: 600,
            letterSpacing: "-0.025em",
          }}
        >
          Fair, Tamper-Proof & High-Speed
          <br />
          <span>Video Interviews on Job.Com</span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--muted)",
            maxWidth: "720px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Designed for modern engineering and product teams. The candidate timer is server-enforced, retakes are strictly guarded, and sequential question order prevents skipping.
        </p>

        {/* Quick Launcher Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "50px",
          }}
        >
          <Link
            href="/interview/demo-candidate-1"
            className="ds-btn-primary"
            style={{ padding: "10px 20px" }}
          >
            <Play size={16} fill="currentColor" />
            Launch Candidate Interview Room
          </Link>
          <Link
            href="/recruiter"
            className="ds-btn-secondary"
            style={{ padding: "10px 20px" }}
          >
            <Users size={16} color="var(--accent)" />
            Open Recruiter Evaluation Desk
          </Link>
          <Link
            href="/specs"
            className="ds-btn-secondary"
            style={{ padding: "10px 20px" }}
          >
            <Terminal size={16} color="var(--muted)" />
            Inspect Backend API Logic
          </Link>
        </div>

        {/* Architecture Pill Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
            textAlign: "left",
          }}
        >
          <Card style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Clock size={16} />
              </div>
              <h3 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Server-Enforced Deadlines
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              Client timers are UI visual feedback only. The database <code style={{ color: "var(--accent)", fontWeight: 500 }}>recordedAt</code> timestamp is the final authority with strict grace period validation.
            </p>
          </Card>

          <Card style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <RotateCcw size={16} />
              </div>
              <h3 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Strict Retake Quotas
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              Every recording attempt consumes a retake ticket. Once <code style={{ color: "var(--accent)", fontWeight: 500 }}>1 + retakesAllowed</code> is reached, subsequent attempts are rejected with 403 Forbidden.
            </p>
          </Card>

          <Card style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <ShieldAlert size={16} />
              </div>
              <h3 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Sequential Question Locking
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              Candidates cannot look ahead or cherry-pick questions. The server rejects out-of-order attempts if previous questions have not been submitted.
            </p>
          </Card>

          <Card style={{ padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Video size={16} />
              </div>
              <h3 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Direct Cloud Uploads
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              High-bandwidth video streams never bottleneck application servers. Attempts provision scoped upload URLs with dedicated session storage keys.
            </p>
          </Card>
        </div>
      </section>

      {/* Search Bar Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <Card style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Search size={18} color="var(--muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search roles by title, department, or skill (e.g. AI, Architecture, Figma)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ds-focus"
            style={{
              width: "100%",
              border: "none",
              backgroundColor: "transparent",
              fontSize: "0.875rem",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                fontSize: "0.8125rem",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              Clear
            </button>
          )}
          <PrimaryButton style={{ flexShrink: 0, padding: "7px 16px" }}>
            Search Roles
          </PrimaryButton>
        </Card>
      </section>

      {/* Featured Jobs Section */}
      <section
        style={{
          padding: "20px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <Eyebrow>02 / OPEN POSITIONS</Eyebrow>
            <h2
              className="font-serif tracking-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2rem",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.2,
                margin: "4px 0",
              }}
            >
              Featured Positions at Job.Com
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Experience how candidates apply and immediately take the interactive video screening assessment.
            </p>
          </div>

          <Link
            href="/interview/demo-candidate-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "underline",
            }}
          >
            Start Demo as Alex Mercer <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredJobs.length === 0 ? (
            <Card style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                No positions found matching &quot;{searchQuery}&quot;. Try another search term.
              </p>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card
                key={job.id}
                style={{
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "24px",
                }}
              >
                <div style={{ flex: "1 1 500px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h3
                        className="font-serif"
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {job.title}
                      </h3>
                    </div>

                    <StatusPill variant="good">
                      Strong match
                    </StatusPill>
                  </div>

                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--muted)",
                      marginBottom: "12px",
                    }}
                  >
                    <span>{job.dept}</span>
                    <span style={{ margin: "0 6px" }}>·</span>
                    <span>{job.location}</span>
                    <span style={{ margin: "0 6px" }}>·</span>
                    <span>{job.type}</span>
                    <span style={{ margin: "0 6px" }}>·</span>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                      {job.salary}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      marginBottom: "14px",
                    }}
                  >
                    {job.description}
                  </p>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {job.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: "200px",
                  }}
                >
                  <Link
                    href={`/interview/${job.token}`}
                    className="ds-btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Video size={15} />
                    Start Video Screen
                  </Link>
                  <Link
                    href="/recruiter"
                    className="ds-btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Users size={15} />
                    View Recruiter Queue
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
