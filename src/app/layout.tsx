import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { BrandIcon } from "@/components/BrandLogo";
import { ShieldCheck, Video, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Job.Com - Fast, Fair & Easy Video Interviews for Every Role",
  description:
    "The modern platform for video interviews and resume building. Fair timers, stress-free retakes, instant AI scoring, and zero scheduling hassle.",
  applicationName: "Job.Com",
  authors: [{ name: "Job.Com Team" }],
  keywords: [
    "video interview",
    "online interview",
    "job search",
    "resume builder",
    "AI evaluation",
    "hiring platform",
  ],
  openGraph: {
    title: "Job.Com - Fast, Fair & Easy Video Interviews for Every Role",
    description:
      "Video interview and resume platform designed to make hiring fair, fast, and simple for everyone.",
    siteName: "Job.Com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "var(--paper)", color: "var(--ink)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Calm Editorial Footer matching Job.Com Design Language */}
        <footer
          style={{
            borderTop: "1px solid var(--line)",
            backgroundColor: "var(--paper)",
            padding: "60px 28px 36px",
            marginTop: "60px",
          }}
        >
          <div
            style={{
              maxWidth: "1520px",
              margin: "0 auto",
            }}
          >
            {/* Top Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "40px",
                marginBottom: "48px",
              }}
            >
              {/* Col 1: Brand & Slogan */}
              <div style={{ maxWidth: "340px" }}>
                <Link
                  href="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    textDecoration: "none",
                    color: "var(--ink)",
                    marginBottom: "14px",
                  }}
                >
                  <BrandIcon size={26} />
                  <span style={{ fontSize: "1.25rem", fontFamily: "var(--font-heading), var(--font-body), sans-serif" }}>
                    <span style={{ fontWeight: 700 }}>Job</span>
                    <span style={{ fontWeight: 400, color: "var(--accent)" }}>.Com</span>
                  </span>
                </Link>

                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                  Fast, fair, and simple video interviews for every industry. Helping jobseekers stand out and employers hire the best talent with ease.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.75rem",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(30, 90, 65, 0.06)",
                    color: "var(--accent)",
                    fontWeight: 500,
                  }}
                >
                  <ShieldCheck size={14} color="var(--accent)" />
                  <span>Server-Authoritative Authority Active</span>
                </div>
              </div>

              {/* Col 2: Product */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  Product
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem" }}>
                  <li>
                    <Link href="/#open-positions" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      1-Click Video Screening
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruiter" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Recruiter Evaluation Desk
                    </Link>
                  </li>
                  <li>
                    <Link href="/candidate/dashboard" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Candidate Scorecard Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/interview/demo-candidate-1" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Interactive Demo Hub
                    </Link>
                  </li>
                  <li>
                    <Link href="/#pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Transparent Plans
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Architecture & Trust */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  Architecture & Trust
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem" }}>
                  <li>
                    <Link href="/specs#deadlines" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Server-Enforced Deadlines
                    </Link>
                  </li>
                  <li>
                    <Link href="/specs#retakes" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Strict Retake Quotas
                    </Link>
                  </li>
                  <li>
                    <Link href="/specs#sequential" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Sequential Question Locking
                    </Link>
                  </li>
                  <li>
                    <Link href="/specs#uploads" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Direct Cloud Uploads
                    </Link>
                  </li>
                  <li>
                    <Link href="/specs" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Full Technical Blueprint
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Portals & Access */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  Workspace Portals
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem" }}>
                  <li>
                    <Link href="/login" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Sign In to Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Create Employer Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruiter" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Review Candidate Queue
                    </Link>
                  </li>
                  <li>
                    <Link href="/candidate/dashboard" style={{ color: "var(--muted)", textDecoration: "none" }}>
                      Lookup My Applications
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                      Contact & Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: "1px solid var(--line)",
                paddingTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
                fontSize: "0.8125rem",
                color: "var(--muted)",
              }}
            >
              <div>
                © 2026 Job.Com, Inc. All rights reserved.
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span>Next.js 15 & Prisma</span>
                <span>·</span>
                <span>SQLite Multi-Tenant Store</span>
                <span>·</span>
                <span style={{ color: "var(--accent)" }}>Calm Editorial Theme</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
