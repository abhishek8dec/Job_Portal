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

        {/* Primary Hero CTAs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "24px",
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

          {/* Department Chips */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>
              Filter Dept:
            </span>
            {departments.map((dept) => {
              const active = selectedDept === dept;
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
                  {dept === "ALL" ? "All Departments" : dept}
                </button>
              );
            })}
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
              Apply with 1-click and immediately take your asynchronous video screening assessment.
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
                      Asynchronous Video Screening Workflow
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
