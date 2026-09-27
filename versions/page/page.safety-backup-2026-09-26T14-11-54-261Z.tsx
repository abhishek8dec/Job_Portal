"use client";
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
} from "lucide-react";

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

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Hero Section */}
      <section
        style={{
          padding: "70px 24px 50px",
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          className="badge badge-indigo"
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            fontSize: "0.85rem",
          }}
        >
          <Sparkles size={16} /> Server-Authoritative Video Hiring Platform
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
            lineHeight: 1.1,
            marginBottom: "20px",
            background: "linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Fair, Tamper-Proof & High-Speed
          <br />
          <span
            style={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Video Interviews on Job.Com
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-secondary)",
            maxWidth: "760px",
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
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "60px",
          }}
        >
          <Link
            href="/interview/demo-candidate-1"
            className="btn btn-primary"
            style={{ padding: "14px 28px", fontSize: "1.05rem" }}
          >
            <Play size={18} fill="#ffffff" />
            Launch Candidate Interview Room
          </Link>
          <Link
            href="/recruiter"
            className="btn btn-secondary"
            style={{ padding: "14px 28px", fontSize: "1.05rem" }}
          >
            <Users size={18} color="#06b6d4" />
            Open Recruiter Evaluation Desk
          </Link>
          <Link
            href="/specs"
            className="btn btn-secondary"
            style={{ padding: "14px 28px", fontSize: "1.05rem" }}
          >
            <Terminal size={18} color="#10b981" />
            Inspect Backend API Logic
          </Link>
        </div>

        {/* Architecture Pill Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            textAlign: "left",
          }}
        >
          <div className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Clock size={22} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>
              Server-Enforced Deadlines
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Client timers are UI visual feedback only. The database <code style={{ color: "#a5b4fc" }}>recordedAt</code> timestamp is the final authority with strict grace period validation.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(6, 182, 212, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <RotateCcw size={22} color="#22d3ee" />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>
              Strict Retake Quotas
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Every recording attempt consumes a retake ticket. Once <code style={{ color: "#67e8f9" }}>1 + retakesAllowed</code> is reached, subsequent attempts are rejected with 403 Forbidden.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(244, 63, 94, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <ShieldAlert size={22} color="#fb7185" />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>
              Sequential Question Locking
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Candidates cannot look ahead or cherry-pick questions. The server rejects out-of-order attempts if previous questions have not been submitted.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "24px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Video size={22} color="#34d399" />
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>
              Direct Cloud Uploads
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              High-bandwidth video streams never bottleneck application servers. Attempts provision scoped upload URLs with dedicated session storage keys.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section
        style={{
          padding: "50px 24px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: "10px" }}>
              Live Openings
            </div>
            <h2 style={{ fontSize: "2rem" }}>Featured Positions at Job.Com</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem" }}>
              Experience how candidates apply and immediately take the interactive video screening assessment.
            </p>
          </div>

          <Link
            href="/interview/demo-candidate-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--accent-secondary)",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Start Demo as Alex Mercer <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-card glass-card-interactive"
              style={{
                padding: "28px",
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
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <h3 style={{ fontSize: "1.3rem" }}>{job.title}</h3>
                  <span className="badge badge-indigo">{job.type}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Briefcase size={15} color="#94a3b8" /> {job.dept}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={15} color="#94a3b8" /> {job.location}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <DollarSign size={15} color="#10b981" /> {job.salary}
                  </span>
                </div>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                    marginBottom: "16px",
                  }}
                >
                  {job.description}
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.78rem",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minWidth: "220px",
                }}
              >
                <Link
                  href={`/interview/${job.token}`}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  <Video size={16} />
                  Start Video Screen
                </Link>
                <Link
                  href="/recruiter"
                  className="btn btn-secondary"
                  style={{ width: "100%", fontSize: "0.85rem" }}
                >
                  <Users size={15} />
                  View Recruiter Queue
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
