"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Briefcase,
  MapPin,
  DollarSign,
  AlertCircle,
  Play,
  User,
} from "lucide-react";

import {
  Eyebrow,
  Card,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
  StatBlock,
  ScoreBar,
  Chip,
  Disclaimer,
} from "@/components/ds";

interface InterviewSessionSummary {
  id: string;
  token: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  candidateName?: string;
  candidateEmail?: string;
  job?: {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    salary: string;
  } | null;
  totalQuestions: number;
  answeredQuestions: number;
  interviewUrl: string;
  scores?: {
    overall: number;
    technical: number;
    communication: number;
    problemSolving: number;
  } | null;
}

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  title?: string | null;
}

export default function CandidateDashboardPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [interviews, setInterviews] = useState<InterviewSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");

  const loadData = async (targetEmail?: string) => {
    try {
      setLoading(true);
      const url = targetEmail
        ? `/api/candidate/interviews?email=${encodeURIComponent(targetEmail)}`
        : "/api/candidate/interviews";
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load dashboard");
      }

      setCandidate(data.candidate);
      setInterviews(data.sessions || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if URL has ?email= or localStorage has candidateEmail
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("JobCom_candidateEmail") : null;
    const initialEmail = emailFromUrl || storedEmail || "";
    if (initialEmail) {
      setSearchEmail(initialEmail);
      loadData(initialEmail);
    } else {
      loadData();
    }
  }, []);

  const handleSearchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      if (typeof window !== "undefined") {
        localStorage.setItem("JobCom_candidateEmail", searchEmail.trim());
      }
      loadData(searchEmail.trim());
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        }}
      >
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Loading candidate workspace...
        </p>
      </div>
    );
  }

  const completedCount = interviews.filter((s) => s.status === "COMPLETED").length;
  const pendingCount = interviews.filter((s) => s.status !== "COMPLETED").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        padding: "36px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        {/* Welcome Banner */}
        <Card
          style={{
            padding: "28px 32px",
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <Eyebrow>CANDIDATE WORKSPACE</Eyebrow>
            <h1
              className="font-serif tracking-tight"
              style={{ fontSize: "2rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 2px" }}
            >
              Welcome, {candidate?.name || "Candidate"}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              {candidate?.title || "Applicant"} · {candidate?.email}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/candidate/resume-builder"
              className="ds-btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={15} style={{ color: "#1B4332" }} /> AI Resume Builder
            </Link>
            <Link
              href="/"
              className="ds-btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.875rem" }}
            >
              <Briefcase size={15} /> Browse Open Jobs
            </Link>
            <Link
              href="/interview/demo-candidate-1"
              className="ds-btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Play size={14} fill="#ffffff" /> Instant Video Practice
            </Link>
          </div>
        </Card>

        {/* AI Resume Studio Callout Banner */}
        <Card
          style={{
            padding: "24px 28px",
            marginBottom: "28px",
            background: "linear-gradient(135deg, rgba(27, 67, 50, 0.04) 0%, rgba(27, 67, 50, 0.09) 100%)",
            border: "1px solid rgba(27, 67, 50, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#1B4332",
                  background: "rgba(27, 67, 50, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                <Sparkles size={12} /> AI Offering for Candidates
              </span>
              <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                ATS Score Engine · STAR Bullet Polisher · Multi-Industry Drafts
              </span>
            </div>
            <h2
              className="font-serif"
              style={{ fontSize: "1.375rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 6px" }}
            >
              Build or Polish Your Resume with Real-Time AI Assistance
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
              Build and polish your resume with AI 100% Free. Jumpstart with pre-populated drafts across Accounting, Logistics, Mechanical, Pharma, and Tech. Need human feedback? Book a 30-minute 1-on-1 call with an Industry Hiring Expert for ₹1,000.
            </p>
          </div>

          <Link
            href="/candidate/resume-builder"
            className="ds-btn-primary"
            style={{
              padding: "10px 22px",
              fontSize: "0.9375rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            Open AI Resume Studio <ArrowRight size={16} />
          </Link>
        </Card>

        {/* Metrics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <Card style={{ padding: "20px" }}>
            <StatBlock label="TOTAL ASSIGNED" value={interviews.length} />
            <Disclaimer style={{ marginTop: "6px" }}>
              Asynchronous video screenings
            </Disclaimer>
          </Card>

          <Card style={{ padding: "20px" }}>
            <StatBlock label="ACTION REQUIRED" value={pendingCount} />
            <Disclaimer style={{ marginTop: "6px" }}>
              Interviews ready to record
            </Disclaimer>
          </Card>

          <Card style={{ padding: "20px" }}>
            <StatBlock label="COMPLETED" value={completedCount} highlight />
            <Disclaimer style={{ marginTop: "6px" }}>
              Submitted to hiring committee
            </Disclaimer>
          </Card>
        </div>

        {/* Interviews Section */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <Eyebrow>MY ASSESSMENTS</Eyebrow>
              <h2
                className="font-serif"
                style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 2px" }}
              >
                Video Screenings
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Take your server-timed video interviews at your convenience.
              </p>
            </div>

            <form
              onSubmit={handleSearchEmail}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                placeholder="Enter email to lookup applications..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="ds-focus"
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  fontSize: "0.8125rem",
                  color: "var(--ink)",
                  minWidth: "260px",
                }}
              />
              <PrimaryButton type="submit" style={{ padding: "8px 14px", fontSize: "0.8125rem" }}>
                Find My Sessions
              </PrimaryButton>
            </form>
          </div>

          {interviews.length === 0 ? (
            <Card style={{ padding: "44px 20px", textAlign: "center" }}>
              <Video size={36} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
              <h3
                className="font-serif"
                style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}
              >
                No Active Interviews Found
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "20px" }}>
                You haven&apos;t been assigned an interview yet. Explore open roles on the job board to begin!
              </p>
              <Link href="/" className="ds-btn-primary" style={{ padding: "9px 20px" }}>
                View Open Positions
              </Link>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {interviews.map((item) => {
                const isDone = item.status === "COMPLETED";

                return (
                  <Card
                    key={item.id}
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    <div style={{ flex: "1 1 400px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "4px",
                        }}
                      >
                        <h3
                          className="font-serif"
                          style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)" }}
                        >
                          {item.job?.title || "Open Role"}
                        </h3>
                        <StatusPill
                          variant={
                            item.status === "SHORTLISTED"
                              ? "good"
                              : item.status === "REJECTED"
                              ? "bad"
                              : item.status === "COMPLETED"
                              ? "good"
                              : item.status === "IN_PROGRESS"
                              ? "warn"
                              : "neutral"
                          }
                        >
                          {item.status === "SHORTLISTED"
                            ? "Shortlisted for Round 2 🎉"
                            : item.status === "REJECTED"
                            ? "Decision Made · Application Closed"
                            : item.status === "COMPLETED"
                            ? "Under Committee Review"
                            : item.status === "IN_PROGRESS"
                            ? "In Progress · Complete Screening"
                            : "Invited to Screen"}
                        </StatusPill>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "var(--muted)",
                          fontSize: "0.8125rem",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{item.job?.company || "Job.Com"}</span>
                        <span>·</span>
                        <span>{item.job?.department || "General"}</span>
                        <span>·</span>
                        <span>{item.job?.location || "Remote Friendly"}</span>
                        {(() => {
                          const title = (item.job?.title || "").toLowerCase();
                          if (title.includes("junior") || title.includes("trainee") || title.includes("fresher") || title.includes("graduate")) {
                            return (
                              <span style={{ fontSize: "0.6875rem", fontWeight: 600, padding: "1px 6px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#065f46" }}>
                                🎓 Fresher Friendly
                              </span>
                            );
                          } else if (title.includes("senior") || title.includes("lead") || title.includes("principal") || title.includes("director") || title.includes("head") || title.includes("controller")) {
                            return (
                              <span style={{ fontSize: "0.6875rem", fontWeight: 600, padding: "1px 6px", borderRadius: "4px", backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#1e40af" }}>
                                ⭐ Experienced
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: isDone ? "var(--accent)" : "var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: 500,
                        }}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 size={14} color="var(--accent)" />
                            All {item.totalQuestions} questions submitted
                          </>
                        ) : (
                          <>
                            <Clock size={14} color="var(--muted)" />
                            {item.answeredQuestions} of {item.totalQuestions} questions answered
                          </>
                        )}
                      </div>

                      {/* Visual 4-Stage Application Progress Stepper */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "12px",
                          paddingTop: "12px",
                          borderTop: "1px solid var(--border)",
                          flexWrap: "wrap",
                        }}
                      >
                        {[
                          { label: "1. Applied", done: true },
                          { label: "2. Video Screening", done: item.status === "COMPLETED" || item.status === "SHORTLISTED" || item.status === "REJECTED" },
                          { label: "3. Review", done: item.status === "SHORTLISTED" || item.status === "REJECTED" },
                          { label: "4. Decision", done: item.status === "SHORTLISTED" || item.status === "REJECTED" },
                        ].map((step, idx, arr) => (
                          <React.Fragment key={step.label}>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: step.done ? 600 : 400,
                                color: step.done ? "var(--ink)" : "var(--muted)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              {step.done ? (
                                <CheckCircle2 size={12} color="var(--accent)" />
                              ) : (
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--border)" }} />
                              )}
                              {step.label}
                            </span>
                            {idx < arr.length - 1 && (
                              <span style={{ color: "var(--border)", fontSize: "0.75rem" }}>→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div>
                      {isDone ? (
                        <Link
                          href={item.interviewUrl}
                          className="ds-btn-secondary"
                          style={{ padding: "8px 16px", fontSize: "0.875rem" }}
                        >
                          <CheckCircle2 size={15} color="var(--accent)" /> View Receipt
                        </Link>
                      ) : (
                        <Link
                          href={item.interviewUrl}
                          className="ds-btn-primary"
                          style={{ padding: "8px 20px", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Play size={14} fill="#ffffff" /> Launch Interview Room
                        </Link>
                      )}
                    </div>

                    {/* AI Rubric Evaluation Breakdown */}
                    {item.scores && (
                      <div
                        style={{
                          width: "100%",
                          marginTop: "16px",
                          paddingTop: "16px",
                          borderTop: "1px solid var(--border)",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px 14px",
                            backgroundColor: "var(--accent-soft)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <Sparkles size={20} color="var(--accent)" />
                          <div>
                            <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              AI Rubric Score
                            </div>
                            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)" }}>
                              {item.scores.overall}<span style={{ fontSize: "0.8125rem", fontWeight: 400, color: "var(--muted)" }}> / 100</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <ScoreBar label="Technical Accuracy" score={item.scores.technical} />
                        </div>

                        <div>
                          <ScoreBar label="Communication & Structure" score={item.scores.communication} />
                        </div>

                        <div>
                          <ScoreBar label="Problem-Solving Rigor" score={item.scores.problemSolving} />
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
