import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";

interface EnhanceSummaryRequest {
  action: "enhance_summary";
  roleTitle?: string;
  industry?: string;
  experienceLevel?: "Fresher" | "Mid-Level" | "Senior" | "Executive";
  rawNotes?: string;
  keySkills?: string[];
}

interface PolishBulletRequest {
  action: "polish_bullet";
  rawBullet: string;
  roleTitle?: string;
  industry?: string;
}

interface SuggestSkillsRequest {
  action: "suggest_skills";
  industry: string;
  roleTitle?: string;
  experienceLevel?: string;
}

interface AuditAtsRequest {
  action: "audit_ats";
  resume: {
    personalInfo: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      title?: string;
    };
    summary?: string;
    experience?: Array<{
      company: string;
      role: string;
      description?: string;
      bullets?: string[];
    }>;
    education?: Array<{
      school: string;
      degree: string;
    }>;
    skills?: string[];
  };
}

type ResumeAssistBody =
  | EnhanceSummaryRequest
  | PolishBulletRequest
  | SuggestSkillsRequest
  | AuditAtsRequest;

// Action verbs library for bullet polishing
const ACTION_VERBS = [
  "Spearheaded", "Architected", "Engineered", "Optimized", "Consolidated",
  "Streamlined", "Accelerated", "Formulated", "Governed", "Negotiated",
  "Overhauled", "Orchestrated", "Implemented", "Audited", "Standardized",
];

// Industry skill presets
const INDUSTRY_SKILL_PRESETS: Record<string, string[]> = {
  "Accounting & Finance": [
    "General Ledger", "US GAAP", "IFRS", "SOX 404 Compliance", "Financial Modeling",
    "Bank Reconciliation", "Corporate Tax", "Statutory Audit", "SAP S/4HANA", "QuickBooks",
    "Accounts Payable / Receivable", "Variance Analysis", "Treasury Management",
  ],
  "Logistics & Supply Chain": [
    "Multimodal Dispatch", "Bill of Lading (BOL)", "Incoterms 2020", "TMS / WMS Software",
    "Freight Forwarding", "Fleet Telemetry", "Customs Clearance", "3PL Contracting",
    "Cold Chain Compliance", "Inventory Optimization", "Route Planning", "SLA Enforcement",
  ],
  "Mechanical & Manufacturing": [
    "SolidWorks 3D CAD", "AutoCAD", "GD&T (ASME Y14.5)", "Finite Element Analysis (FEA)",
    "DFM / DFA Principles", "ANSYS Workbench", "CNC Machining Setup", "Mechatronics",
    "Tooling & Injection Molding", "Failure Mode Effects Analysis (FMEA)", "Tolerance Stack-Up",
  ],
  "Pharmaceuticals & Healthcare": [
    "ICH-GCP Guidelines", "HPLC Chromatography", "Pharmacovigilance", "eCTD Dossier (Module 1-5)",
    "cGMP Compliance", "Out-of-Specification (OOS) Root Cause", "Clinical Protocol Writing",
    "FDA 21 CFR Part 11", "Regulatory Submissions (IND/NDA/ANDA)", "Bioethics",
  ],
  "Technology & Software": [
    "TypeScript", "React", "Node.js", "Python", "Distributed Systems", "SQL & NoSQL",
    "Docker & Kubernetes", "AWS / GCP Infrastructure", "REST & GraphQL APIs",
    "CI/CD Pipelines", "System Architecture", "Performance Profiling",
  ],
  "Sales, Operations & HR": [
    "Structured Behavioral Interviewing", "High-Volume Campus Recruiting", "ATS Workflow Management",
    "Employee Onboarding", "Labor Law Compliance", "Compensation Benchmarking",
    "Performance Management", "Stakeholder Communication", "HRIS Administration",
  ],
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResumeAssistBody;

    if (!body || !body.action) {
      throw new HttpError(400, "Missing required 'action' in request body");
    }

    switch (body.action) {
      case "enhance_summary": {
        const { roleTitle = "Professional", industry = "General", experienceLevel = "Fresher", rawNotes = "", keySkills = [] } = body;

        let suggestions: string[] = [];

        if (experienceLevel === "Fresher") {
          suggestions = [
            `Ambitious and detail-oriented ${roleTitle} graduate with rigorous training in ${industry}. Demonstrated proficiency in ${keySkills.slice(0, 3).join(", ") || "core domain principles"} through hands-on coursework and academic projects. Eager to contribute fresh perspectives, rapid problem-solving, and disciplined execution to high-velocity teams.`,
            `High-agency ${industry} graduate seeking entry-level ${roleTitle} opportunities. Strong foundational command of ${keySkills.slice(0, 3).join(", ") || "industry workflows"} and modern tooling. Recognized for meticulous analytical rigor, fast learning velocity, and collaborative communication.`,
            `Motivated ${roleTitle} candidate passionate about delivering measurable operational value in ${industry}. Skilled in analytical modeling, structured documentation, and ${keySkills[0] || "process improvement"}, ready to hit the ground running on day one.`,
          ];
        } else {
          suggestions = [
            `Results-driven ${roleTitle} with extensive experience scaling operations and technical delivery in ${industry}. Proven track record managing cross-functional initiatives, optimizing ${keySkills.slice(0, 2).join(" and ") || "key workflows"}, and driving measurable efficiency gains under rigorous compliance frameworks.`,
            `Strategic ${roleTitle} specializing in high-impact ${industry} governance. Expert in ${keySkills.slice(0, 3).join(", ") || "domain architecture"}, team leadership, and cross-stakeholder alignment. Consistently improves organizational velocity while maintaining zero-defect standards.`,
            `Dynamic ${roleTitle} leader with a background in transforming ${industry} outcomes. Spearheaded critical projects that reduced turnaround time by 30%+ and strengthened ${keySkills[0] || "core operations"} across multi-entity environments.`,
          ];
        }

        // If candidate provided raw notes, customize option 1
        if (rawNotes.trim().length > 10) {
          suggestions[0] = `${suggestions[0]} Specifically experienced with: ${rawNotes.trim().slice(0, 120)}.`;
        }

        return NextResponse.json({
          success: true,
          suggestions,
        });
      }

      case "polish_bullet": {
        const { rawBullet, roleTitle = "Professional", industry = "General" } = body;
        if (!rawBullet || rawBullet.trim().length === 0) {
          throw new HttpError(400, "rawBullet is required");
        }

        const trimmed = rawBullet.trim();
        const randomVerb1 = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
        const randomVerb2 = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];

        // Generate STAR-aligned enhancements
        const polishedBullets = [
          `${randomVerb1} ${trimmed.toLowerCase().replace(/^(i |we |managed |did |helped with )/i, "")}, boosting team throughput by 24% and achieving 99.2% compliance SLA.`,
          `${randomVerb2} end-to-end ${trimmed.toLowerCase().replace(/^(i |we |worked on |handled )/i, "")} across cross-functional ${industry} workflows, cutting turnaround time by 18 hours.`,
          `Orchestrated ${trimmed.toLowerCase()} utilizing standardized industry protocols, reducing operational variances by 35% across quarterly deliverables.`,
        ];

        return NextResponse.json({
          success: true,
          original: rawBullet,
          polished: polishedBullets,
        });
      }

      case "suggest_skills": {
        const { industry = "Accounting & Finance" } = body;
        const matched = INDUSTRY_SKILL_PRESETS[industry] || INDUSTRY_SKILL_PRESETS["Accounting & Finance"];
        return NextResponse.json({
          success: true,
          industry,
          skills: matched,
        });
      }

      case "audit_ats": {
        const { resume } = body;
        let score = 50; // Base score
        const strengths: string[] = [];
        const improvements: string[] = [];

        // Check 1: Contact Info
        if (resume.personalInfo?.fullName && resume.personalInfo?.email && resume.personalInfo?.phone) {
          score += 10;
          strengths.push("Essential contact details (name, email, phone) are complete.");
        } else {
          improvements.push("Add phone number and professional email for recruiter reach-out.");
        }

        if (resume.personalInfo?.linkedin || resume.personalInfo?.title) {
          score += 5;
          strengths.push("Professional headline and portfolio/LinkedIn provided.");
        } else {
          improvements.push("Include a LinkedIn URL or professional headline to boost discoverability.");
        }

        // Check 2: Executive Summary
        if (resume.summary && resume.summary.length >= 80) {
          score += 15;
          strengths.push("Compelling executive summary (80+ characters) provides quick hiring context.");
        } else {
          improvements.push("Expand your executive summary with your target role, years of experience, and top competencies.");
        }

        // Check 3: Work Experience & Quantifiable Metrics
        const expCount = resume.experience?.length || 0;
        if (expCount > 0) {
          score += 10;
          let hasMetrics = false;
          let totalBullets = 0;

          resume.experience?.forEach((e) => {
            const text = `${e.description || ""} ${(e.bullets || []).join(" ")}`;
            totalBullets += (e.bullets || []).length;
            if (/(\d+%|\$\d+|\d+\+? (hrs|days|clients|users|batches|routes|projects))/i.test(text)) {
              hasMetrics = true;
            }
          });

          if (hasMetrics) {
            score += 10;
            strengths.push("Quantified accomplishments ($ figures or % metrics) detected in experience items.");
          } else {
            improvements.push("Add numbers, percentages, or dollar values to experience bullets (e.g. 'reduced errors by 22%').");
          }

          if (totalBullets >= 4) {
            strengths.push("Strong bullet density demonstrating actionable daily ownership.");
          }
        } else {
          improvements.push("Add at least 1 work experience item, internship, or academic capstone project.");
        }

        // Check 4: Skills Section
        const skillCount = resume.skills?.length || 0;
        if (skillCount >= 6) {
          score = Math.min(100, score + 10);
          strengths.push(`Rich skill profile (${skillCount} keywords) optimizes ATS keyword indexing.`);
        } else {
          improvements.push(`Include at least 6-8 core technical and industry domain skills (currently ${skillCount}).`);
        }

        // Final score capping
        score = Math.max(30, Math.min(100, score));

        return NextResponse.json({
          success: true,
          score,
          rating: score >= 85 ? "Excellent (ATS Ready)" : score >= 70 ? "Good" : "Needs Optimization",
          strengths,
          improvements,
        });
      }

      default:
        throw new HttpError(400, "Unknown action requested");
    }
  } catch (e) {
    return errorResponse(e);
  }
}
