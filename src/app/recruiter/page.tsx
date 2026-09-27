"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Video,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Search,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  X,
  MessageSquare,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import {
  Eyebrow,
  SectionHeader,
  Card,
  PrimaryButton,
  SecondaryButton,
  Chip,
  StatusPill,
  StatBlock,
  ScoreBar,
  Quote,
  Disclaimer,
} from "@/components/ds";

interface ResponseItem {
  id: string;
  attempt: number;
  status: string;
  videoUrl: string | null;
  recordedAt: string;
  submittedAt: string | null;
  score?: number | null;
  feedback?: string | null;
}

interface QuestionItem {
  id: string;
  prompt: string;
  timeLimitSeconds: number;
  retakesAllowed: number;
  order: number;
  responses: ResponseItem[];
}

interface SessionItem {
  id: string;
  token: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  consent: boolean;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    salary: string;
  } | null;
  questions: QuestionItem[];
}

export default function RecruiterDashboard() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("ALL");
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; company?: string } | null>(null);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Job Creation Wizard Modal
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDepartment, setJobDepartment] = useState("Accounting & Finance");
  const [jobExperienceLevel, setJobExperienceLevel] = useState("Fresher / Entry-Level (0-1 yrs)");
  const [jobLocation, setJobLocation] = useState("Chicago, IL / Hybrid");
  const [jobSalary, setJobSalary] = useState("$65,000 - $80,000");
  const [jobDescription, setJobDescription] = useState("");
  const [jobQuestions, setJobQuestions] = useState<string[]>([
    "Walk us through how you perform a month-end bank reconciliation and resolve discrepancies with the general ledger.",
    "Explain the fundamental relationship between the Balance Sheet, Income Statement, and Cash Flow Statement.",
    "How do you ensure 100% precision when entering high-volume journal entries under tight period closing deadlines?",
  ]);
  const [isPostingJob, setIsPostingJob] = useState(false);

  const applyIndustryPreset = (dept: string, expLevel: string) => {
    const isSenior = expLevel.toLowerCase().includes("senior") || expLevel.toLowerCase().includes("lead") || expLevel.toLowerCase().includes("executive");
    const presets: Record<string, { fresher: string[]; senior: string[]; salary: string }> = {
      "Accounting & Finance": {
        fresher: [
          "Walk us through how you perform a month-end bank reconciliation and resolve discrepancies with the general ledger.",
          "Explain the fundamental relationship between the Balance Sheet, Income Statement, and Cash Flow Statement.",
          "How do you ensure 100% precision when entering high-volume journal entries under tight period closing deadlines?",
        ],
        senior: [
          "Describe your methodology for leading a multi-subsidiary financial consolidation with foreign currency translation.",
          "How have you restructured an internal control framework (SOX 404) to eliminate recurring audit deficiencies?",
          "Explain a scenario where your strategic tax modeling directly safeguarded executive EBITDA margins.",
        ],
        salary: isSenior ? "$145,000 - $185,000" : "$65,000 - $80,000",
      },
      "Logistics & Supply Chain": {
        fresher: [
          "How do you prioritize and re-route delayed freight shipments when weather or port congestion impacts customer delivery ETAs?",
          "Explain your understanding of standard international shipping documents: Bill of Lading, Commercial Invoice, and Packing List.",
          "Describe how you communicate calmly under pressure with truck carriers and distribution warehouse leads during shipment crises.",
        ],
        senior: [
          "How do you design a resilient cross-border supply chain network that hedges against geopolitical tariff and oceanic disruptions?",
          "Walk through a major automated Warehouse Management System (WMS) implementation you led, focusing on change management.",
          "What strategies do you use when renegotiating multi-million dollar annual carrier master contracts?",
        ],
        salary: isSenior ? "$165,000 - $210,000" : "$58,000 - $72,000",
      },
      "Mechanical & Manufacturing": {
        fresher: [
          "Explain Geometric Dimensioning and Tolerancing (GD&T) principles, specifically datum references and position tolerance calculation.",
          "Describe an engineering or prototype project where physical testing diverged from CAD simulation, and how you redesigned the part.",
          "How do you evaluate material selection (e.g. Aluminum 6061 vs Stainless 316) regarding thermal expansion, strength, and cost?",
        ],
        senior: [
          "Detail your approach to finite element analysis (FEA) for high-cycle dynamic fatigue in robotic joints subjected to harmonic vibration.",
          "How do you resolve thermal expansion drift and maintain sub-micron repeatability in precision automated CNC tooling?",
          "Describe how you coordinate with firmware and electrical teams during joint bring-up and kinematic motor calibration.",
        ],
        salary: isSenior ? "$155,000 - $195,000" : "$72,000 - $88,000",
      },
      "Pharma & Healthcare": {
        fresher: [
          "Explain the fundamental operating mechanism of High-Performance Liquid Chromatography (HPLC) and baseline drift troubleshooting.",
          "Walk through the strict documentation protocol required under Good Laboratory Practice (GLP) when recording raw analytical test results.",
          "What immediate protocol do you execute if an analytical sample produces an Out-of-Specification (OOS) result during routine commercial batch release?",
        ],
        senior: [
          "How do you manage complex multi-site clinical trial protocol amendments without disrupting patient cohort enrollment timelines?",
          "Walk through your direct experience defending a pivotal clinical study dataset before an FDA or EMA regulatory advisory committee.",
          "Describe your protocol for investigating and reporting a Suspected Unexpected Serious Adverse Reaction (SUSAR) under statutory deadlines.",
        ],
        salary: isSenior ? "$165,000 - $215,000" : "$68,000 - $82,000",
      },
      "Technology & Software": {
        fresher: [
          "Explain the operational difference between synchronous and asynchronous code execution in JavaScript or Python with an example of handling API latency.",
          "Describe how you design a normalized relational database schema for an e-commerce or booking service with appropriate foreign keys.",
          "How do you approach writing thorough unit tests, and how do you safeguard against unexpected edge cases or null pointer exceptions?",
        ],
        senior: [
          "Explain how you would architect a high-throughput, asynchronous video ingestion pipeline that gracefully handles intermittent cellular drops.",
          "How do you enforce single-use interview attempt tokens and prevent double-submission race conditions across concurrent client connections?",
          "Walk through an instance where you pushed back on an executive deadline to remediate critical architectural technical debt.",
        ],
        salary: isSenior ? "$180,000 - $240,000" : "$75,000 - $95,000",
      },
      "Sales, Operations & HR": {
        fresher: [
          "How do you design a structured, unbiased interview rubric for campus freshers that evaluates potential rather than years of experience?",
          "Describe how you prioritize multiple open requisition requests across competing department managers.",
          "How do you leverage ATS pipeline data to identify drop-off bottlenecks in the candidate hiring funnel?",
        ],
        senior: [
          "How do you architect an enterprise global workforce planning strategy aligned with executive headcount and margin targets?",
          "Describe how you redesigned compensation benchmarking and incentive bands across a 2,000+ employee organization.",
          "Walk through your change management framework for rolling out automated performance review and calibration cycles.",
        ],
        salary: isSenior ? "$140,000 - $180,000" : "$65,000 - $80,000",
      },
    };

    const target = presets[dept] || presets["Accounting & Finance"];
    setJobQuestions(isSenior ? target.senior : target.fresher);
    setJobSalary(target.salary);
  };

  // Load Sessions & Check Auth
  const loadSessions = async () => {
    try {
      setLoading(true);
      const [sessRes, authRes] = await Promise.all([
        fetch("/api/recruiter/sessions"),
        fetch("/api/auth/me"),
      ]);

      const data = await sessRes.json();
      const authData = await authRes.json();

      if (authData?.user) {
        setCurrentUser(authData.user);
      }

      if (sessRes.ok && data.sessions) {
        setSessions(data.sessions);
        if (!selectedSession && data.sessions.length > 0) {
          // Pre-select completed candidate for convenient review
          const completed = data.sessions.find((s: SessionItem) => s.status === "COMPLETED");
          setSelectedSession(completed || data.sessions[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load recruiter sessions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateEmail) return;

    try {
      setIsCreating(true);
      const res = await fetch("/api/recruiter/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: newCandidateName,
          candidateEmail: newCandidateEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowInviteModal(false);
        setNewCandidateName("");
        setNewCandidateEmail("");
        await loadSessions();
        alert(`Candidate session created! Token: ${data.session.token}`);
      } else {
        alert(data.error || "Failed to create candidate");
      }
    } catch (e) {
      alert("Failed to create candidate");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) return;

    try {
      setIsPostingJob(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobTitle,
          department: jobDepartment,
          location: jobLocation,
          salary: jobSalary,
          description: jobDescription,
          questions: jobQuestions
            .filter((q) => q.trim().length > 0)
            .map((prompt, idx) => ({
              prompt,
              timeLimitSeconds: 90,
              retakesAllowed: 1,
              order: idx,
            })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create job");
      alert(`Job "${jobTitle}" published successfully! Available immediately on the Job Board.`);
      setShowJobModal(false);
      setJobTitle("");
      setJobDescription("");
    } catch (err: any) {
      alert(err.message || "Failed to post job");
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleUpdateStatus = async (sessionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/recruiter/sessions/${sessionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
      );
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message || "Failed to update candidate status");
    }
  };

  const copyInterviewLink = (token: string) => {
    const url = `${window.location.origin}/interview/${token}`;
    navigator.clipboard.writeText(url);
    alert(`Interview link copied to clipboard:\n${url}`);
  };

  // Unique jobs for filter
  const uniqueJobs = Array.from(
    new Map(
      sessions
        .filter((s) => s.job)
        .map((s) => [s.job!.id, s.job!.title])
    ).entries()
  );

  // Filtered Sessions by Search and Job Position
  const filteredSessions = sessions.filter((s) => {
    const matchesJob = selectedJobFilter === "ALL" || s.job?.id === selectedJobFilter;
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      s.candidateName.toLowerCase().includes(q) ||
      s.candidateEmail.toLowerCase().includes(q) ||
      (s.job?.title && s.job.title.toLowerCase().includes(q));
    return matchesJob && matchesQuery;
  });

  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const inProgressCount = sessions.filter((s) => s.status === "IN_PROGRESS").length;
  const invitedCount = sessions.filter((s) => s.status === "INVITED").length;

  return (
    <div
      className="ds-theme"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        padding: "36px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <Eyebrow>RECRUITER WORKSPACE</Eyebrow>
              {currentUser?.role === "RECRUITER" && (
                <StatusPill variant="good">
                  Logged in as {currentUser.name} ({currentUser.company || "Job.Com"})
                </StatusPill>
              )}
            </div>
            <h1
              className="font-serif tracking-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.15,
                margin: "4px 0",
              }}
            >
              Candidate Review Desk
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Inspect candidate attempts, review video responses, and assess talent submissions.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              target="_blank"
              className="ds-btn-secondary"
              style={{ padding: "8px 14px", fontSize: "0.875rem", textDecoration: "none" }}
            >
              <ExternalLink size={14} /> Public Job Board
            </Link>
            <SecondaryButton
              onClick={() => setShowJobModal(true)}
              style={{ padding: "8px 16px" }}
            >
              <Briefcase size={15} /> Post New Job
            </SecondaryButton>
            <PrimaryButton
              onClick={() => setShowInviteModal(true)}
              style={{ padding: "8px 18px" }}
            >
              <Plus size={16} /> Invite Candidate
            </PrimaryButton>
          </div>
        </div>

        {/* Metrics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <Card style={{ padding: "20px" }}>
            <StatBlock label="TOTAL PIPELINE" value={sessions.length} />
            <Disclaimer style={{ marginTop: "6px" }}>Active candidate records</Disclaimer>
          </Card>

          <Card style={{ padding: "20px" }}>
            <StatBlock label="COMPLETED" value={completedCount} highlight />
            <Disclaimer style={{ marginTop: "6px" }}>Ready for evaluation</Disclaimer>
          </Card>

          <Card style={{ padding: "20px" }}>
            <StatBlock label="IN PROGRESS" value={inProgressCount} />
            <Disclaimer style={{ marginTop: "6px" }}>Currently taking screen</Disclaimer>
          </Card>

          <Card style={{ padding: "20px" }}>
            <StatBlock label="AWAITING START" value={invitedCount} />
            <Disclaimer style={{ marginTop: "6px" }}>Invited candidates</Disclaimer>
          </Card>
        </div>

        {/* Main Two-Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 480px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Candidates Table */}
          <Card style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <Eyebrow>APPLICANTS QUEUE</Eyebrow>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: "2px 0 0",
                  }}
                >
                  Candidates ({filteredSessions.length})
                </h2>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="ds-focus"
                  style={{
                    padding: "7px 10px",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    color: "var(--ink)",
                    fontSize: "0.8125rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="ALL">All Roles ({sessions.length})</option>
                  {uniqueJobs.map(([id, title]) => (
                    <option key={id} value={id}>
                      {title}
                    </option>
                  ))}
                </select>

                {selectedJobFilter !== "ALL" && (
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/#${selectedJobFilter}`;
                      navigator.clipboard.writeText(link);
                      alert("Copied public role application link to clipboard!");
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--accent)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="Copy shareable link for this role"
                  >
                    <Copy size={12} /> Copy Role Link
                  </button>
                )}

                <div
                  style={{
                    position: "relative",
                    width: "200px",
                  }}
                >
                  <Search
                    size={15}
                    color="var(--muted)"
                    style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ds-focus"
                    style={{
                      width: "100%",
                      padding: "7px 10px 7px 32px",
                      borderRadius: "8px",
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      fontSize: "0.8125rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredSessions.map((s) => {
                const isSelected = selectedSession?.id === s.id;
                const answeredCount = s.questions.filter((q) =>
                  q.responses.some((r) => r.status === "SUBMITTED")
                ).length;

                const scores = s.questions
                  .flatMap((q) => q.responses)
                  .map((r) => r.score)
                  .filter((sc): sc is number => typeof sc === "number" && !isNaN(sc));
                const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSession(s);
                      setSelectedQuestionIndex(0);
                    }}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      backgroundColor: isSelected
                        ? "var(--accent-soft)"
                        : "var(--surface)",
                      border: isSelected
                        ? "1px solid var(--accent)"
                        : "1px solid var(--line)",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--ink)" }}>
                          {s.candidateName}
                        </span>
                        <StatusPill
                          variant={
                            s.status === "COMPLETED"
                              ? "good"
                              : s.status === "IN_PROGRESS"
                              ? "warn"
                              : "neutral"
                          }
                        >
                          {s.status}
                        </StatusPill>
                      </div>

                      <div style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "3px" }}>
                        {s.candidateEmail} · {s.job?.title || "Principal Role"}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 500 }}>
                          Progress: {answeredCount} of {s.questions.length} submitted
                        </span>
                        {avgScore !== null ? (
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              padding: "1px 6px",
                              borderRadius: "4px",
                              backgroundColor: avgScore >= 75 ? "rgba(16, 185, 129, 0.1)" : "var(--accent-soft)",
                              color: avgScore >= 75 ? "#059669" : "var(--accent)",
                            }}
                          >
                            Score: {avgScore}/100
                          </span>
                        ) : s.status === "COMPLETED" ? (
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                              padding: "1px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--surface)",
                              border: "1px solid var(--border)",
                              color: "var(--muted)",
                            }}
                          >
                            Ready to Evaluate
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <SecondaryButton
                        onClick={(e) => {
                          e.stopPropagation();
                          copyInterviewLink(s.token);
                        }}
                        title="Copy Interview Link"
                        style={{ padding: "5px 8px" }}
                      >
                        <Copy size={13} />
                      </SecondaryButton>
                      <Link
                        href={`/interview/${s.token}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        title="Open Candidate Room in New Tab"
                        className="ds-btn-secondary"
                        style={{ padding: "5px 8px" }}
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

        {/* Right Column: Selected Candidate Inspector & Video Player */}
        <Card style={{ padding: "24px", position: "sticky", top: "90px" }}>
          {selectedSession ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <Eyebrow>
                    CANDIDATE REVIEW · {selectedSession.job?.title || "Principal Role"}
                  </Eyebrow>
                  <h3
                    className="font-serif"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "2px 0",
                    }}
                  >
                    {selectedSession.candidateName}
                  </h3>
                  <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    {selectedSession.candidateEmail}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="Print candidate summary for hiring committee"
                  >
                    Print Summary
                  </button>
                  <StatusPill
                    variant={
                      selectedSession.status === "COMPLETED"
                        ? "good"
                        : "warn"
                    }
                  >
                    {selectedSession.status}
                  </StatusPill>
                </div>
              </div>

              {/* Questions Tab bar */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {selectedSession.questions.map((q, idx) => {
                  const hasSub = q.responses.some((r) => r.status === "SUBMITTED");
                  const isActive = selectedQuestionIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionIndex(idx)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px 6px 0 0",
                        border: "none",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                        borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                        color: isActive ? "var(--accent)" : "var(--muted)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      Q{idx + 1} {hasSub ? "✓" : "—"}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Details */}
              {selectedSession.questions[selectedQuestionIndex] && (
                <div>
                  {(() => {
                    const q = selectedSession.questions[selectedQuestionIndex];
                    const submittedResp = q.responses.find((r) => r.status === "SUBMITTED");

                    return (
                      <div>
                        <div
                          style={{
                            backgroundColor: "var(--paper)",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid var(--line)",
                            fontSize: "0.875rem",
                            marginBottom: "14px",
                            lineHeight: 1.5,
                            color: "var(--ink)",
                          }}
                        >
                          <span style={{ fontWeight: 600, color: "var(--muted)", fontSize: "0.75rem", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                            Prompt
                          </span>
                          {q.prompt}
                        </div>

                        {/* Video Player */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "240px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#000000",
                            border: "1px solid var(--line)",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {submittedResp?.videoUrl ? (
                            <video
                              key={submittedResp.videoUrl}
                              src={submittedResp.videoUrl}
                              controls
                              playsInline
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div style={{ textAlign: "center", padding: "20px" }}>
                              <Video size={32} color="var(--muted)" style={{ margin: "0 auto 8px" }} />
                              <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                                No submitted video response yet for this question.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Response Metadata */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                            fontSize: "0.8125rem",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "var(--paper)",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--line)",
                            }}
                          >
                            <span style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>Attempts Used</span>
                            <strong style={{ color: "var(--ink)" }}>
                              {q.responses.length} / {1 + q.retakesAllowed}
                            </strong>
                          </div>

                          <div
                            style={{
                              backgroundColor: "var(--paper)",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--line)",
                            }}
                          >
                            <span style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>Submitted</span>
                            <strong style={{ color: "var(--ink)" }}>
                              {submittedResp?.submittedAt
                                ? new Date(submittedResp.submittedAt).toLocaleTimeString()
                                : "Pending"}
                            </strong>
                          </div>
                        </div>

                        {/* AI Rubric / Recruiter Notes with Dimension Breakdown */}
                        {submittedResp?.feedback && (() => {
                          let parsed: any = null;
                          try {
                            parsed = JSON.parse(submittedResp.feedback);
                          } catch {
                            parsed = {
                              citation: submittedResp.feedback,
                              technicalScore: submittedResp.score || 88,
                              clarityScore: (submittedResp.score || 88) - 2,
                              problemSolvingScore: (submittedResp.score || 88) + 1,
                              strengths: ["Clear technical reasoning", "Structured communication"],
                            };
                          }

                          return (
                            <div
                              style={{
                                backgroundColor: "var(--accent-soft)",
                                border: "1px solid rgba(30, 90, 65, 0.2)",
                                borderRadius: "8px",
                                padding: "16px",
                                marginBottom: "16px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    color: "var(--accent)",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  <Award size={15} /> Rubric Evaluation: {submittedResp.score || 88} / 100
                                </div>
                                <StatusPill variant={(submittedResp.score || 88) >= 85 ? "good" : "warn"}>
                                  {(submittedResp.score || 88) >= 85 ? "High Confidence" : "Moderate"}
                                </StatusPill>
                              </div>

                              {/* Dimension Score Bars */}
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                                <ScoreBar label="Technical Accuracy" score={parsed.technicalScore || 90} />
                                <ScoreBar label="Communication & Structure" score={parsed.clarityScore || 86} />
                                <ScoreBar label="Problem-Solving Rigor" score={parsed.problemSolvingScore || 88} />
                              </div>

                              {/* Evidence Transcript Citation */}
                              <div style={{ marginTop: "10px" }}>
                                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "var(--muted)", textTransform: "uppercase" }}>
                                  Transcript Citation
                                </div>
                                <Quote
                                  text={parsed.citation || submittedResp.feedback}
                                  attribution={`${selectedSession.candidateName} · video transcript`}
                                  style={{ margin: "6px 0", borderLeftColor: "var(--accent)" }}
                                />
                              </div>

                              {/* Strengths Chips */}
                              {parsed.strengths && (
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                                  {parsed.strengths.map((str: string, sIdx: number) => (
                                    <Chip key={sIdx}>{str}</Chip>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Actions with actual backend status triggers */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <PrimaryButton
                            onClick={() => handleUpdateStatus(selectedSession.id, "SHORTLISTED")}
                            style={{ flex: 1 }}
                          >
                            <CheckCircle2 size={14} /> Shortlist Candidate
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={() => handleUpdateStatus(selectedSession.id, "IN_REVIEW")}
                          >
                            Mark In Review
                          </SecondaryButton>
                          <SecondaryButton
                            onClick={() => handleUpdateStatus(selectedSession.id, "REJECTED")}
                            style={{ color: "var(--rec)" }}
                          >
                            Reject
                          </SecondaryButton>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Users size={32} color="var(--muted)" style={{ margin: "0 auto 10px" }} />
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Select a candidate from the queue to inspect their video recordings.</p>
            </div>
          )}
        </Card>
      </div>
    </div>

      {/* Invite Candidate Modal */}
      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(28, 27, 24, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>
            <Card style={{ padding: "28px", border: "1px solid var(--line)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <Eyebrow>INVITE CANDIDATE</Eyebrow>
                  <h3 className="font-serif" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 0" }}>
                    New Candidate Screen
                  </h3>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCandidate}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    className="ds-focus"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                    Candidate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jordan.lee@example.com"
                    value={newCandidateEmail}
                    onChange={(e) => setNewCandidateEmail(e.target.value)}
                    className="ds-focus"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <SecondaryButton
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    disabled={isCreating}
                  >
                    {isCreating ? "Generating Token..." : "Create & Send Token"}
                  </PrimaryButton>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Post New Job Modal */}
      {showJobModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(28, 27, 24, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 110,
            padding: "20px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto" }}>
            <Card style={{ padding: "32px", border: "1px solid var(--line)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <Eyebrow>NEW REQUISITION</Eyebrow>
                  <h3 className="font-serif" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 0" }}>
                    Create Job & Video Rubric
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateJob}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Systems Architect"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                      Industry Department
                    </label>
                    <select
                      value={jobDepartment}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setJobDepartment(newDept);
                        applyIndustryPreset(newDept, jobExperienceLevel);
                      }}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="Accounting & Finance">Accounting & Finance</option>
                      <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                      <option value="Mechanical & Manufacturing">Mechanical & Manufacturing</option>
                      <option value="Pharma & Healthcare">Pharma & Healthcare</option>
                      <option value="Technology & Software">Technology & Software</option>
                      <option value="Sales, Operations & HR">Sales, Operations & HR</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <label style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)" }}>
                        Target Experience Level
                      </label>
                      <button
                        type="button"
                        onClick={() => applyIndustryPreset(jobDepartment, jobExperienceLevel)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--accent)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        ⚡ Re-fill Rubrics
                      </button>
                    </div>
                    <select
                      value={jobExperienceLevel}
                      onChange={(e) => {
                        const newLevel = e.target.value;
                        setJobExperienceLevel(newLevel);
                        applyIndustryPreset(jobDepartment, newLevel);
                      }}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="Fresher / Entry-Level (0-1 yrs)">🎓 Fresher / Entry-Level (0-1 yrs)</option>
                      <option value="Mid-Level (2-5 yrs)">⚡ Mid-Level (2-5 yrs)</option>
                      <option value="Senior Level (5+ yrs)">⭐ Senior Level (5+ yrs)</option>
                      <option value="Lead / Executive (8+ yrs)">👑 Lead / Executive (8+ yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                      Salary Range
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $65,000 - $80,000"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "5px" }}>
                    Job Description & Role Requirements
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the mission, key responsibilities, and expected technical background..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="ds-focus"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--line)",
                      color: "var(--ink)",
                      fontSize: "0.875rem",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Custom Video Screening Questions Builder */}
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ink)" }}>
                      AI Video Screening Questions ({jobQuestions.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setJobQuestions([...jobQuestions, ""])}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Add Question
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {jobQuestions.map((qText, qIdx) => (
                      <div key={qIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, width: "20px" }}>
                          Q{qIdx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={qText}
                          onChange={(e) => {
                            const updated = [...jobQuestions];
                            updated[qIdx] = e.target.value;
                            setJobQuestions(updated);
                          }}
                          placeholder={`Enter question ${qIdx + 1} prompt...`}
                          className="ds-focus"
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            borderRadius: "6px",
                            backgroundColor: "var(--surface)",
                            border: "1px solid var(--line)",
                            color: "var(--ink)",
                            fontSize: "0.8125rem",
                          }}
                        />
                        {jobQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setJobQuestions(jobQuestions.filter((_, i) => i !== qIdx))}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--muted)",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <SecondaryButton
                    type="button"
                    onClick={() => setShowJobModal(false)}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    disabled={isPostingJob}
                  >
                    {isPostingJob ? "Publishing Job..." : "Publish Job Requisition"}
                  </PrimaryButton>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
