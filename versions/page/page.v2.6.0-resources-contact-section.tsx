"use client";
import React, { useState, useEffect } from "react";
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
  X,
  ExternalLink,
  Copy,
  PlusCircle,
  Mail,
} from "lucide-react";
import {
  Eyebrow,
  SectionHeader,
  Card,
  PrimaryButton,
  SecondaryButton,
  Chip,
  StatusPill,
  ScoreBar,
} from "@/components/ds";

interface JobItem {
  id: string;
  title: string;
  company?: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  token?: string;
  tags?: string[];
  _count?: {
    sessions: number;
  };
}

interface AppliedSession {
  id: string;
  token: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  interviewUrl: string;
  date: string;
}

const FALLBACK_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Principal AI & Full-Stack Architect",
    company: "Job.Com",
    department: "Core Engineering",
    location: "San Francisco, CA (Remote Friendly)",
    type: "Full-Time",
    salary: "$190,000 - $240,000",
    description:
      "Lead the architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, and candidate assessment infrastructure.",
    tags: ["TypeScript", "Next.js", "MediaRecorder", "Prisma"],
  },
  {
    id: "job-2",
    title: "Staff Systems Reliability & Cloud Architect",
    company: "Job.Com",
    department: "Infrastructure",
    location: "Austin, TX / Remote",
    type: "Full-Time",
    salary: "$175,000 - $220,000",
    description:
      "Design resilient media ingestion pipelines, edge video encoding, and automated scaling for thousands of concurrent video interviews.",
    tags: ["Kubernetes", "AWS S3", "WebRTC", "Go"],
  },
  {
    id: "job-3",
    title: "Senior Product Designer (Design Systems)",
    company: "Job.Com",
    department: "Product Experience",
    location: "New York, NY / Hybrid",
    type: "Full-Time",
    salary: "$150,000 - $185,000",
    description:
      "Create human-centered, accessible candidate interview rooms and intuitive recruiter decision workspaces.",
    tags: ["Figma", "Design Systems", "Accessibility", "Motion"],
  },
];

export default function HomePage() {
  const [jobs, setJobs] = useState<JobItem[]>(FALLBACK_JOBS);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [previewTab, setPreviewTab] = useState<"candidate" | "recruiter">("candidate");

  // 1-Click Apply Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobItem | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<{
    token: string;
    interviewUrl: string;
    message: string;
    alreadyApplied: boolean;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  // Stored applied sessions
  const [savedApplications, setSavedApplications] = useState<AppliedSession[]>([]);

  // Fetch live jobs from API
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (res.ok && data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }

    // Retrieve saved user info from localStorage if present
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("JobCom_candidateName");
      const storedEmail = localStorage.getItem("JobCom_candidateEmail");
      if (storedName) setApplicantName(storedName);
      if (storedEmail) setApplicantEmail(storedEmail);

      const storedApps = localStorage.getItem("JobCom_applied_sessions");
      if (storedApps) {
        try {
          setSavedApplications(JSON.parse(storedApps));
        } catch (_) {}
      }
    }

    loadJobs();
  }, []);

  // Handle 1-Click Apply Submission
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply || !applicantName.trim() || !applicantEmail.trim()) return;

    try {
      setIsApplying(true);
      const res = await fetch(`/api/jobs/${selectedJobForApply.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: applicantName.trim(),
          candidateEmail: applicantEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Save credentials in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("JobCom_candidateName", applicantName.trim());
        localStorage.setItem("JobCom_candidateEmail", applicantEmail.trim());

        const newApp: AppliedSession = {
          id: data.session?.id || data.token,
          token: data.token,
          jobTitle: selectedJobForApply.title,
          candidateName: applicantName.trim(),
          candidateEmail: applicantEmail.trim(),
          interviewUrl: data.interviewUrl,
          date: new Date().toLocaleDateString(),
        };

        const updated = [newApp, ...savedApplications.filter((a) => a.token !== data.token)];
        setSavedApplications(updated);
        localStorage.setItem("JobCom_applied_sessions", JSON.stringify(updated));
      }

      setApplyResult({
        token: data.token,
        interviewUrl: data.interviewUrl,
        message: data.message,
        alreadyApplied: data.alreadyApplied || false,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Application error");
    } finally {
      setIsApplying(false);
    }
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter jobs by search and department
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      (job.tags && job.tags.some((t) => t.toLowerCase().includes(query)));

    const matchesDept =
      selectedDept === "ALL" ||
      job.department.toLowerCase().includes(selectedDept.toLowerCase());

    return matchesQuery && matchesDept;
  });

  const departments = ["ALL", "Engineering", "Infrastructure", "Product Experience", "AI Intelligence"];

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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              fontSize: "0.8125rem",
              color: "var(--ink)",
              fontWeight: 500,
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent)" }} />
            The Modern Standard for Video Interviews
          </span>
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

        {/* Primary Hero CTAs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          <Link
            href="/recruiter"
            className="ds-btn-primary"
            style={{ padding: "11px 24px", fontSize: "0.9375rem" }}
          >
            Start Hiring Free
            <ArrowRight size={15} />
          </Link>
          <a
            href="#open-positions"
            className="ds-btn-secondary"
            style={{ padding: "11px 22px", fontSize: "0.9375rem", textDecoration: "none" }}
          >
            <Briefcase size={15} />
            Browse Open Positions
          </a>
        </div>

        {/* Core Architecture Guarantees & Trust Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
            maxWidth: "1140px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--surface)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Clock size={16} color="var(--accent)" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>Server-Enforced Timers</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Strict countdowns governed on the server prevent client-side timer manipulation or pauses.
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--surface)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <RotateCcw size={16} color="var(--accent)" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>Controlled Retake Quotas</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Recruiters set fixed retake allowances per question for natural, authentic responses.
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--surface)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Sparkles size={16} color="var(--accent)" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>Calibrated AI Rubrics</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Standardized scoring across technical depth, problem-solving, and communication.
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--surface)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <CheckCircle2 size={16} color="var(--accent)" />
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>Zero Scheduling Friction</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Candidates record on their own schedule; hiring teams review candidates asynchronously.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Section */}
      <section
        style={{
          maxWidth: "1140px",
          margin: "12px auto 44px",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "4px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              gap: "6px",
            }}
          >
            <button
              onClick={() => setPreviewTab("candidate")}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: previewTab === "candidate" ? "var(--ink)" : "transparent",
                color: previewTab === "candidate" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Video size={15} />
              Candidate Screening Room
            </button>
            <button
              onClick={() => setPreviewTab("recruiter")}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: previewTab === "recruiter" ? "var(--ink)" : "transparent",
                color: previewTab === "recruiter" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={15} />
              Recruiter Evaluation Desk
            </button>
          </div>
        </div>

        {/* Dynamic Preview Card */}
        {previewTab === "candidate" ? (
          <Card style={{ padding: "30px", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Live Candidate Simulation
                  </span>
                  <StatusPill variant="good">Question 1 of 3</StatusPill>
                </div>
                <h3 className="font-serif" style={{ fontSize: "1.35rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.3 }}>
                  &ldquo;Describe how you design fault-tolerant distributed services under high network partition risk.&rdquo;
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "20px" }}>
                  Candidates see the prompt, their webcam preview, and an un-pausable server timer. Responses are sequentially recorded without skipping.
                </p>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                  <Link
                    href="/interview/demo-candidate-1"
                    className="ds-btn-primary"
                    style={{ padding: "8px 18px", fontSize: "0.875rem" }}
                  >
                    <Play size={14} fill="#ffffff" /> Try Live Demo Room
                  </Link>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    Includes AV calibration & mic check
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: "#121212", borderRadius: "12px", padding: "20px", color: "#ffffff", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", color: "#ef4444" }}>RECORDING ACTIVE</span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", fontFamily: "monospace", color: "#fbbf24", fontWeight: 600, backgroundColor: "rgba(251, 191, 36, 0.15)", padding: "2px 8px", borderRadius: "4px" }}>
                    01:42 / 02:00
                  </div>
                </div>

                <div style={{ height: "130px", borderRadius: "8px", backgroundColor: "#1e1e1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.15)", marginBottom: "14px" }}>
                  <Video size={28} color="#9ca3af" style={{ marginBottom: "6px" }} />
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Webcam & Microphone Synchronized</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#9ca3af" }}>
                  <span>Attempt 1 of 2 (1 retake allowed)</span>
                  <span style={{ color: "#34d399" }}>Audio Level: 68% OK</span>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card style={{ padding: "30px", border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Recruiter Evaluation Desk
                  </span>
                  <StatusPill variant="good">Candidate: Alex Mercer</StatusPill>
                </div>
                <h3 className="font-serif" style={{ fontSize: "1.35rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.3 }}>
                  Standardized AI Rubric Scoring & Instant Decisioning
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "20px" }}>
                  Hiring managers stream candidate video recordings and inspect objective multi-dimensional evaluations across Technical Depth, Clarity, and Problem-Solving.
                </p>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                  <Link
                    href="/recruiter"
                    className="ds-btn-primary"
                    style={{ padding: "8px 18px", fontSize: "0.875rem" }}
                  >
                    <Sparkles size={14} /> Open Recruiter Workspace
                  </Link>
                  <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    Filter by role, invite applicants & export summaries
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", padding: "20px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Overall Assessment</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)" }}>91 / 100 · Strong Hire</div>
                  </div>
                  <span style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#059669", fontWeight: 600 }}>
                    Recommended Round 2
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <ScoreBar label="Technical Depth & Architecture" score={94} />
                  <ScoreBar label="Problem Solving & Trade-offs" score={90} />
                  <ScoreBar label="Communication & Articulation" score={88} />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 3-Step Walkthrough: How Job.Com Works */}
        <div style={{ marginTop: "44px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              STREAMLINED HIRING WORKFLOW
            </span>
            <h2 className="font-serif" style={{ fontSize: "1.75rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 0" }}>
              How Job.Com Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "8px" }}>01 / CONFIGURE</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Post Role & Custom Questions
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Recruiters craft position-calibrated prompts, set strict answer timers (e.g. 90s - 180s), and specify retake quotas.
              </p>
            </div>

            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "8px" }}>02 / RECORD</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                On-Demand Video Screening
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Applicants take the screening room whenever ready. Camera check, server timers, and sequential question order ensure fairness.
              </p>
            </div>

            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "8px" }}>03 / DECIDE</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                AI Rubrics & Shortlisting
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Hiring managers review persistent recordings, scorecards, and move candidates to Round 2 with 1-click status transitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Screening Rooms Banner (If candidate has applied previously) */}
      {savedApplications.length > 0 && (
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto 24px",
            padding: "0 24px",
          }}
        >
          <Card
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--accent)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Video size={18} />
              </div>
              <div>
                <div style={{ fontSize: "0.8125rem", color: "var(--accent)", fontWeight: 600 }}>
                  ACTIVE INTERVIEW SESSION FOUND
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>
                  {savedApplications[0].jobTitle} ({savedApplications[0].token})
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link
                href={savedApplications[0].interviewUrl}
                className="ds-btn-primary"
                style={{ padding: "8px 16px", fontSize: "0.875rem" }}
              >
                <Play size={14} fill="#ffffff" />
                Resume Screening Room
              </Link>
              <Link
                href={`/candidate/dashboard?email=${encodeURIComponent(savedApplications[0].candidateEmail)}`}
                className="ds-btn-secondary"
                style={{ padding: "8px 14px", fontSize: "0.875rem" }}
              >
                View Status
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* Search Bar & Department Filter Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <Card style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                fontSize: "0.9375rem",
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
          </div>

          {/* Department Chips & Quick Candidate Jump */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>
                Filter Dept:
              </span>
              {departments.map((dept) => {
                const active = selectedDept === dept;
                const count = dept === "ALL"
                  ? jobs.length
                  : jobs.filter((j) => j.department.toLowerCase().includes(dept.toLowerCase())).length;

                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      backgroundColor: active ? "var(--ink)" : "var(--surface)",
                      color: active ? "var(--paper)" : "var(--muted)",
                      border: active ? "1px solid var(--ink)" : "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {dept === "ALL" ? `All Roles (${count})` : `${dept} (${count})`}
                  </button>
                );
              })}
            </div>

            <Link
              href="/candidate/dashboard"
              style={{
                fontSize: "0.8125rem",
                color: "var(--accent)",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Returning candidate? Access screening status →
            </Link>
          </div>
        </Card>
      </section>

      {/* Featured Jobs Section */}
      <section
        id="open-positions"
        style={{
          padding: "20px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
          scrollMarginTop: "80px",
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
            <Eyebrow>FEATURED ROLES & OPPORTUNITIES</Eyebrow>
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
              Apply with 1-click and immediately begin your on-demand video interview assessment.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              href="/recruiter"
              className="ds-btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.875rem" }}
            >
              <PlusCircle size={15} color="var(--accent)" /> Post New Role
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredJobs.length === 0 ? (
            <Card style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                No positions found matching &quot;{searchQuery}&quot;. Try another search term.
              </p>
            </Card>
          ) : (
            filteredJobs.map((job) => {
              const applicantCount = job._count?.sessions || 0;

              return (
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

                      <StatusPill variant="good">
                        Active Hiring
                      </StatusPill>
                    </div>

                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--muted)",
                        marginBottom: "12px",
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <span>{job.department}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                      <span>·</span>
                      <span style={{ color: "var(--ink)", fontWeight: 500 }}>
                        {job.salary}
                      </span>
                      <span>·</span>
                      <span style={{ color: "var(--accent)", fontWeight: 500 }}>
                        {applicantCount} applicant{applicantCount === 1 ? "" : "s"} screening
                      </span>
                      <span>·</span>
                      <span style={{ color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={12} /> ~15 min assessment
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
                      {(job.tags || ["Video Screening", "AI Evaluated", "High Priority"]).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      minWidth: "220px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedJobForApply(job);
                        setApplyResult(null);
                      }}
                      className="ds-btn-primary"
                      style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}
                    >
                      <Video size={15} />
                      1-Click Apply & Screen
                    </button>
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
              );
            })
          )}
        </div>
      </section>

      {/* Contact & Support Section (Resources) */}
      <section
        id="contact"
        style={{
          padding: "40px 24px 20px",
          maxWidth: "1280px",
          margin: "0 auto",
          scrollMarginTop: "80px",
        }}
      >
        <Card style={{ padding: "40px", border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "start" }}>
            <div>
              <Eyebrow>RESOURCES · GET IN TOUCH</Eyebrow>
              <h2
                className="font-serif tracking-tight"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                  margin: "6px 0 12px",
                  lineHeight: 1.2,
                }}
              >
                Contact & Candidate Support
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "28px" }}>
                Need help with an ongoing video screening, custom ATS integration, or enterprise employer onboarding? Our talent infrastructure team responds promptly.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>General & Candidate Support</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>support@job.com</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Enterprise Hiring & Demos</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>hiring@job.com</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Headquarters</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>San Francisco, CA · Remote First</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div style={{ backgroundColor: "var(--surface)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <h3 className="font-serif" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                Send a Message
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0 0 20px" }}>
                We typically reply within 2 business hours.
              </p>

              {contactSent ? (
                <div style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--accent-soft)", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <CheckCircle2 size={28} color="var(--accent)" style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                    Message Received
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0 }}>
                    Thank you! Our support team will get in touch with you at <strong>{contactEmail}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "6px" }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--paper)",
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "6px" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com or candidate email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--paper)",
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "6px" }}>
                      How can we help?
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Tell us about your screening question, hiring volume, or ATS integration..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "7px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--paper)",
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <PrimaryButton type="submit" style={{ padding: "10px", justifyContent: "center" }}>
                    Send Message
                  </PrimaryButton>
                </form>
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* 1-Click Apply Modal */}
      {selectedJobForApply && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <Card
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "28px",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSelectedJobForApply(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            {!applyResult ? (
              <form onSubmit={handleApplySubmit}>
                <Eyebrow>1-CLICK APPLICATION</Eyebrow>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: "4px 0 8px",
                  }}
                >
                  Apply for {selectedJobForApply.title}
                </h2>

                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    marginBottom: "18px",
                  }}
                >
                  <span>{selectedJobForApply.department}</span> · <span>{selectedJobForApply.location}</span> · <span>{selectedJobForApply.salary}</span>
                </div>

                <div
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--surface)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <Sparkles size={16} color="var(--accent)" />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ink)" }}>
                      On-Demand Video Interview Workflow
                    </span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
                    Upon applying, you will be instantly issued a personal interview session token. You can immediately launch the camera room, answer 3 role-calibrated prompts, and receive comprehensive rubric evaluations.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--paper)",
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Work / Contact Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.mercer@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="ds-focus"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--paper)",
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <SecondaryButton
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    style={{ padding: "8px 16px" }}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    disabled={isApplying}
                    style={{ padding: "8px 20px" }}
                  >
                    {isApplying ? "Provisioning Room..." : "Submit & Launch Screening Room"}
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      color: "var(--accent)",
                    }}
                  >
                    <CheckCircle2 size={28} />
                  </div>
                  <Eyebrow>APPLICATION CONFIRMED</Eyebrow>
                  <h3
                    className="font-serif"
                    style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0" }}
                  >
                    {applyResult.alreadyApplied ? "Existing Session Restored!" : "Screening Room Ready!"}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", margin: "0 auto" }}>
                    {applyResult.message}
                  </p>
                </div>

                <div
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--surface)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px" }}>
                    YOUR INTERVIEW TOKEN
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", fontFamily: "monospace" }}>
                    {applyResult.token}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link
                    href={applyResult.interviewUrl}
                    className="ds-btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.9375rem" }}
                  >
                    <Play size={16} fill="#ffffff" />
                    Enter Video Screening Room Now
                  </Link>

                  <SecondaryButton
                    onClick={() => copyUrl(applyResult.interviewUrl)}
                    style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                  >
                    <Copy size={15} />
                    {copiedLink ? "Link Copied to Clipboard!" : "Copy Private Interview Link"}
                  </SecondaryButton>

                  <Link
                    href={`/candidate/dashboard?email=${encodeURIComponent(applicantEmail)}`}
                    style={{
                      textAlign: "center",
                      fontSize: "0.8125rem",
                      color: "var(--accent)",
                      marginTop: "6px",
                      textDecoration: "underline",
                    }}
                  >
                    Track All My Applications in Candidate Workspace →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </main>
  );
}
