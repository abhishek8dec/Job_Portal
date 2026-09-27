import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fastCache } from "@/lib/cache";

// Fallback seed jobs to ensure database has rich sample roles across all industries & experience levels
const DEFAULT_JOBS = [
  {
    title: "Junior Financial Analyst & Accounts Associate",
    company: "Apex Financial Group",
    department: "Accounting & Finance",
    location: "Chicago, IL / Hybrid",
    type: "Full-Time · Fresher / Entry-Level",
    salary: "$65,000 - $80,000",
    description:
      "Launchpad role for accounting and finance graduates. Perform general ledger reconciliations, balance sheet variance analysis, and GAAP financial modeling.",
  },
  {
    title: "Senior Corporate Controller & Tax Advisory Manager",
    company: "Deloitte & Meridian Advisory",
    department: "Accounting & Finance",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (6+ yrs)",
    salary: "$145,000 - $185,000",
    description:
      "Lead corporate financial governance, statutory audit oversight, multi-entity consolidation, and corporate tax strategy under US GAAP and IFRS.",
  },
  {
    title: "Logistics Operations Trainee & Freight Dispatcher",
    company: "TransGlobal Freight & Supply",
    department: "Logistics & Supply Chain",
    location: "Dallas, TX / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$58,000 - $72,000",
    description:
      "Entry-level position for recent supply chain graduates. Coordinate multi-modal fleet shipments, carrier dispatching, and Bill of Lading (BOL) verification.",
  },
  {
    title: "Global Supply Chain Director & Distribution Head",
    company: "Maersk & TransGlobal Logistics",
    department: "Logistics & Supply Chain",
    location: "Atlanta, GA / Hybrid",
    type: "Full-Time · Executive (8+ yrs)",
    salary: "$165,000 - $210,000",
    description:
      "Direct end-to-end supply chain resilience, automated fulfillment center robotics, ocean/air carrier contracting, and cross-border customs compliance.",
  },
  {
    title: "Graduate Mechanical Engineer – CAD & Testing",
    company: "Titan Precision Manufacturing",
    department: "Mechanical & Manufacturing",
    location: "Detroit, MI / On-site",
    type: "Full-Time · Graduate Track",
    salary: "$72,000 - $88,000",
    description:
      "Graduate rotation program for BS/MS Mechanical Engineering graduates. Participate in 3D SolidWorks drafting, GD&T tolerancing, strain testing, and CNC prototyping.",
  },
  {
    title: "Principal Mechanical Design Engineer (Robotics & Automation)",
    company: "Titan Robotics Systems",
    department: "Mechanical & Manufacturing",
    location: "Boston, MA / On-site",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$155,000 - $195,000",
    description:
      "Lead mechanical architecture of automated industrial robotic arms, high-precision harmonic gear trains, mechatronics calibration, and FEA vibration dampening.",
  },
  {
    title: "Junior Quality Control Chemist & Lab Analyst",
    company: "BioPharm Dynamics Laboratories",
    department: "Pharma & Healthcare",
    location: "Philadelphia, PA / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$68,000 - $82,000",
    description:
      "Hands-on analytical chemistry launchpad for chemistry and pharmacology graduates. Execute HPLC/GC chromatography, raw material assays, and cGMP compliance.",
  },
  {
    title: "Senior Clinical Trial Manager & Regulatory Affairs Head",
    company: "BioPharm Clinical Research",
    department: "Pharma & Healthcare",
    location: "Bridgewater, NJ / Hybrid",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$165,000 - $215,000",
    description:
      "Lead global Phase II and Phase III multi-center clinical trials, FDA Investigational New Drug (IND) submissions, GCP auditor adherence, and protocol safety review.",
  },
  {
    title: "Associate Software Engineer (Graduate Trainee)",
    company: "Nexus Technologies",
    department: "Technology & IT",
    location: "Austin, TX / Bangalore / Remote",
    type: "Full-Time · Fresher Friendly",
    salary: "$75,000 - $95,000",
    description:
      "Rotational software engineering program for computer science graduates. Build modern web services, RESTful APIs, automated unit tests, and CI/CD pipelines.",
  },
  {
    title: "Principal AI & Distributed Systems Architect",
    company: "Job.Com Systems Lab",
    department: "Technology & IT",
    location: "San Francisco, CA / Remote",
    type: "Full-Time · Principal (8+ yrs)",
    salary: "$190,000 - $240,000",
    description:
      "Lead technical architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, and candidate assessment infrastructure.",
  },
  {
    title: "Talent Acquisition Specialist & HR Operations Lead",
    company: "Horizon People Operations",
    department: "Sales, Operations & HR",
    location: "Denver, CO / Hybrid",
    type: "Full-Time · Mid-Level (2-5 yrs)",
    salary: "$70,000 - $90,000",
    description:
      "Lead university campus recruitment drives, ATS candidate workflow hygiene, interviewer rubric calibration, and new employee onboarding.",
  },
  {
    title: "Senior Product Experience & Design Systems Lead",
    company: "Job.Com Design Lab",
    department: "Product Experience",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (5+ yrs)",
    salary: "$150,000 - $185,000",
    description:
      "Design calm, accessible candidate interview canvases and intuitive recruiter decision workspaces compliant with WCAG 2.1 AA accessibility.",
  },
];

/**
 * GET /api/jobs
 * Lists all active jobs with application count
 */
export async function GET() {
  try {
    const { data: jobs, isCached } = await fastCache.wrap(
      "jobs:active",
      async () => {
        let fetchedJobs = await prisma.job.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: {
            recruiter: {
              select: { id: true, name: true, company: true },
            },
            _count: {
              select: { sessions: true },
            },
          },
        });

        // Auto-seed default jobs if none exist in the database
        if (fetchedJobs.length === 0) {
          for (const dj of DEFAULT_JOBS) {
            await prisma.job.create({
              data: dj,
            });
          }

          fetchedJobs = await prisma.job.findMany({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            include: {
              recruiter: {
                select: { id: true, name: true, company: true },
              },
              _count: {
                select: { sessions: true },
              },
            },
          });
        }

        return fetchedJobs;
      },
      30_000 // 30-second high-speed TTL
    );

    return NextResponse.json(
      { jobs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45",
          "X-Cache": isCached ? "HIT" : "MISS",
        },
      }
    );
  } catch (e) {
    return errorResponse(e);
  }
}

/**
 * POST /api/jobs
 * Recruiter creates a new job with JD, requirements, and custom interview questions
 */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      title,
      company,
      department,
      location,
      type,
      salary,
      description,
      questions,
    } = body;

    if (!title || !department || !location || !salary || !description) {
      throw new HttpError(
        400,
        "Title, department, location, salary, and description are required"
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        company: company || (user?.company || "Job.Com"),
        department,
        location,
        type: type || "Full-Time",
        salary,
        description,
        status: "ACTIVE",
        questionsJson: questions && Array.isArray(questions) && questions.length > 0
          ? JSON.stringify(questions)
          : null,
        recruiterId: user?.role === "RECRUITER" ? user.id : null,
      },
    });

    // Invalidate cached jobs so new role appears immediately across all 1,000+ users
    fastCache.invalidate("jobs:active");

    return NextResponse.json({
      success: true,
      job,
      message: "Job position created successfully",
    });
  } catch (e) {
    return errorResponse(e);
  }
}
