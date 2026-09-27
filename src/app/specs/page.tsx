"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  Lock,
  Cloud,
  ArrowRight,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import {
  Eyebrow,
  Card,
  StatusPill,
} from "@/components/ds";

export default function SpecsPage() {
  return (
    <main
      className="ds-theme"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        padding: "60px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
            <Eyebrow>OUR HIRING PROMISE</Eyebrow>
          </div>
          <h1
            className="font-serif tracking-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              lineHeight: 1.15,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "16px",
            }}
          >
            Fair &amp; Transparent Video Interviews
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--muted)",
              maxWidth: "740px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Job interviews should be stress-free, equal, and fair for every applicant. Here is how Job.Com ensures an even playing field for candidates and hiring teams alike.
          </p>
        </div>

        {/* 4 Fairness Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          <Card id="deadlines" style={{ padding: "26px", scrollMarginTop: "90px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "var(--accent)",
              }}
            >
              <Clock size={22} />
            </div>
            <h3
              className="font-serif"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}
            >
              1. Equal Answer Timers
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Every candidate gets the exact same amount of time to answer each question (usually 60 to 120 seconds). Timers are kept consistent by the system so every candidate has an equal opportunity to respond.
            </p>
          </Card>

          <Card id="retakes" style={{ padding: "26px", scrollMarginTop: "90px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "var(--accent)",
              }}
            >
              <RotateCcw size={22} />
            </div>
            <h3
              className="font-serif"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}
            >
              2. Free Retake Per Question
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
              We know answering questions on camera can feel awkward at first. If you stumble or cough, you can click &quot;Record Again&quot; for a fresh 30-second start. Only your chosen recording is submitted.
            </p>
          </Card>

          <Card id="sequential" style={{ padding: "26px", scrollMarginTop: "90px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "var(--accent)",
              }}
            >
              <Lock size={22} />
            </div>
            <h3
              className="font-serif"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}
            >
              3. Structured Question Order
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Every applicant answers questions in the same order. This gives employers a direct, side-by-side comparison of candidate thinking and communication for the exact same problem.
            </p>
          </Card>

          <Card id="uploads" style={{ padding: "26px", scrollMarginTop: "90px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: "var(--accent)",
              }}
            >
              <Cloud size={22} />
            </div>
            <h3
              className="font-serif"
              style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}
            >
              4. Safe &amp; Private Storage
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Your video recordings are private. They are encrypted and only accessible by authorized recruiters and hiring managers who are evaluating your application for that specific role.
            </p>
          </Card>
        </div>

        {/* Visual Standards Checklist */}
        <Card style={{ padding: "36px", marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
              borderBottom: "1px solid var(--line)",
              paddingBottom: "16px",
            }}
          >
            <div>
              <Eyebrow>OUR COMMITMENT TO APPLICANTS</Eyebrow>
              <h2
                className="font-serif"
                style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 0" }}
              >
                Candidate Bill of Rights
              </h2>
            </div>
            <StatusPill variant="good">
              100% Fair Hiring Certified
            </StatusPill>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Practice as Much as You Want
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  You can test your webcam, check lighting, and record practice answers on our homepage or in the interview room before starting your actual interview.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Never Scored on Background Noise
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  Our AI evaluation focuses solely on your practical answer content, clarity, and job knowledge—never on accent, appearance, or background surroundings.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Real Human Review
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  AI feedback serves as an objective summary tool for hiring teams, but actual humans always make the hiring decisions.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Full Progress Transparency
                </h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                  Track your application through every step in your Candidate Workspace so you are never left guessing where you stand.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action Footer Card */}
        <Card
          style={{
            padding: "36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            border: "1.5px solid var(--accent)",
          }}
        >
          <div>
            <Eyebrow>TRY IT YOURSELF</Eyebrow>
            <h3
              className="font-serif"
              style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 6px" }}
            >
              Experience Job.Com Today
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", margin: 0 }}>
              Try a sample candidate interview or explore the employer review desk.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/interview/demo-candidate-1" className="ds-btn-primary" style={{ padding: "10px 20px" }}>
              Try Candidate Experience
            </Link>
            <Link href="/recruiter" className="ds-btn-secondary" style={{ padding: "10px 20px" }}>
              Open Recruiter Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
