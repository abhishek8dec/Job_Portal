const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const path = require("path");
const dbPath = path.resolve(__dirname, "../prisma/dev.db");
const prisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

const PASSWORD = "Password123!";
const HASHED_PASSWORD = hashPassword(PASSWORD);

// ─── 5 Recruiters across Major Industries ──────────────────────────────────────────
const RECRUITERS = [
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@nexus.ai",
    company: "Nexus Technologies / Job.Com",
    title: "VP of Global Talent & Technical Recruitment",
    department: "Technology & Software",
  },
  {
    name: "Robert Sterling",
    email: "robert.sterling@apexfinancial.com",
    company: "Apex Financial & Corporate Advisory",
    title: "Head of Talent & Corporate Finance Staffing",
    department: "Accounting & Finance",
  },
  {
    name: "Maria Sanchez",
    email: "maria.sanchez@transglobal.com",
    company: "TransGlobal Freight & Supply Chain",
    title: "VP of Supply Chain & Logistics Staffing",
    department: "Logistics & Supply Chain",
  },
  {
    name: "Vikram Sengupta",
    email: "vikram.sengupta@titanmfg.com",
    company: "Titan Precision Manufacturing & Robotics",
    title: "Chief Engineering & Plant Recruiter",
    department: "Mechanical & Manufacturing",
  },
  {
    name: "Dr. Aris Thorne",
    email: "aris.thorne@biopharm.org",
    company: "BioPharm Dynamics Research Labs",
    title: "Head of Clinical & Scientific Staffing",
    department: "Pharma & Healthcare",
  },
];

// ─── 12 Job Requisitions spanning Freshers & Experienced across Industries ─────────
const JOBS = [
  // ── Accounting & Finance
  {
    id: "job-acct-fresher",
    title: "Junior Financial Analyst & Accounts Associate",
    company: "Apex Financial Group",
    department: "Accounting & Finance",
    location: "Chicago, IL / Hybrid",
    type: "Full-Time · Fresher / Entry-Level",
    salary: "$65,000 - $80,000",
    description: "Launchpad opportunity for recent accounting and finance graduates. Perform monthly balance sheet reconciliations, ledger variance audits, accounts payable tracking, and financial modeling in Excel.",
    recruiterEmail: "robert.sterling@apexfinancial.com",
    questions: [
      "Walk us through how you perform a month-end bank reconciliation and resolve discrepancies between the general ledger and bank statements.",
      "Explain the core relationship between the Balance Sheet, Income Statement, and Cash Flow Statement using a concrete retail business scenario.",
      "How do you maintain 100% precision when recording high-volume journal entries under tight fiscal period-end deadlines?"
    ]
  },
  {
    id: "job-acct-senior",
    title: "Senior Corporate Controller & Tax Advisory Manager",
    company: "Deloitte & Meridian Advisory",
    department: "Accounting & Finance",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (6+ yrs)",
    salary: "$145,000 - $185,000",
    description: "Direct corporate governance, SOX 404 internal control testing, international multi-subsidiary consolidations, and corporate tax strategy under US GAAP and IFRS standards.",
    recruiterEmail: "robert.sterling@apexfinancial.com",
    questions: [
      "Describe your methodology for leading a complex multi-currency consolidation with foreign exchange translation and intercompany eliminations.",
      "How have you restructured an internal control framework (SOX 404) to remediate recurring material audit deficiencies?",
      "Explain a scenario where your strategic tax modeling directly safeguarded executive EBITDA margins."
    ]
  },

  // ── Logistics & Supply Chain
  {
    id: "job-log-fresher",
    title: "Logistics Operations Trainee & Freight Dispatcher",
    company: "TransGlobal Freight & Supply",
    department: "Logistics & Supply Chain",
    location: "Dallas, TX / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$58,000 - $72,000",
    description: "Entry-level position for recent supply chain or business graduates. Coordinate multi-modal fleet shipments, carrier dispatching, Bill of Lading (BOL) verification, and real-time shipment exception tracking.",
    recruiterEmail: "maria.sanchez@transglobal.com",
    questions: [
      "How do you prioritize and re-route delayed freight shipments when severe weather or port congestion threatens customer SLAs?",
      "Explain your understanding of standard international shipping documents, specifically the Bill of Lading, Commercial Invoice, and Packing List.",
      "Describe how you communicate calmly and effectively with truck carriers and warehouse supervisors under high-stress delivery crunches."
    ]
  },
  {
    id: "job-log-senior",
    title: "Global Supply Chain Director & Distribution Head",
    company: "Maersk & TransGlobal Logistics",
    department: "Logistics & Supply Chain",
    location: "Atlanta, GA / Hybrid",
    type: "Full-Time · Executive (8+ yrs)",
    salary: "$165,000 - $210,000",
    description: "Oversee end-to-end supply chain resilience, automated fulfillment center robotics, ocean/air carrier contracting, and cross-border customs compliance across 12 distribution nodes.",
    recruiterEmail: "maria.sanchez@transglobal.com",
    questions: [
      "How do you architect a diversified cross-border supply chain that hedges against sudden tariff disruptions and oceanic lane bottlenecks?",
      "Walk through a major automated Warehouse Management System (WMS) implementation you led, focusing on change management and throughput metrics.",
      "What negotiation strategies do you employ when renegotiating multi-million dollar annual carrier master agreements?"
    ]
  },

  // ── Mechanical & Manufacturing Engineering
  {
    id: "job-mech-fresher",
    title: "Graduate Mechanical Engineer – CAD & Testing",
    company: "Titan Precision Manufacturing",
    department: "Mechanical & Manufacturing",
    location: "Detroit, MI / On-site",
    type: "Full-Time · Graduate Track",
    salary: "$72,000 - $88,000",
    description: "Graduate rotation program for BS/MS Mechanical Engineering graduates. Participate in 3D SolidWorks drafting, Geometric Dimensioning & Tolerancing (GD&T), structural strain testing, and CNC prototyping.",
    recruiterEmail: "vikram.sengupta@titanmfg.com",
    questions: [
      "Explain Geometric Dimensioning & Tolerancing (GD&T) principles, specifically how you establish datum references and calculate position tolerances.",
      "Describe a mechanical design or prototype project where physical testing diverged from CAD simulation, and how you iterated the design.",
      "How do you evaluate material selection (e.g. 6061-T6 Aluminum vs 316 Stainless) regarding thermal expansion, tensile strength, and manufacturing cost?"
    ]
  },
  {
    id: "job-mech-senior",
    title: "Principal Mechanical Design Engineer (Robotics & Automation)",
    company: "Titan Robotics Systems",
    department: "Mechanical & Manufacturing",
    location: "Boston, MA / On-site",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$155,000 - $195,000",
    description: "Lead mechanical architecture of automated industrial robotic arms, high-precision harmonic gear trains, mechatronics calibration, and finite element analysis (FEA) vibration dampening.",
    recruiterEmail: "vikram.sengupta@titanmfg.com",
    questions: [
      "Detail your approach to finite element analysis (FEA) for high-cycle dynamic fatigue in robotic joints subjected to harmonic vibration.",
      "How do you eliminate thermal drift and maintain sub-micron repeatability in precision automated CNC tooling across factory temperature swings?",
      "Describe how you coordinate with firmware and electrical teams during joint bring-up and kinematic motor calibration."
    ]
  },

  // ── Pharmaceuticals & Healthcare
  {
    id: "job-pharma-fresher",
    title: "Junior Quality Control Chemist & Lab Analyst",
    company: "BioPharm Dynamics Laboratories",
    department: "Pharma & Healthcare",
    location: "Philadelphia, PA / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$68,000 - $82,000",
    description: "Hands-on analytical chemistry launchpad for chemistry, biochemistry, and pharmacology graduates. Execute HPLC/GC chromatography, raw material dissolution assays, and cGMP compliance documentation.",
    recruiterEmail: "aris.thorne@biopharm.org",
    questions: [
      "Explain the fundamental operating mechanism of High-Performance Liquid Chromatography (HPLC) and how you troubleshoot baseline drift.",
      "Walk through the strict documentation protocol required under Good Laboratory Practice (GLP) when recording raw analytical spectrophotometric data.",
      "What exact procedure do you follow if a sample test yield falls Out-of-Specification (OOS) during commercial batch release?"
    ]
  },
  {
    id: "job-pharma-senior",
    title: "Senior Clinical Trial Manager & Regulatory Affairs Head",
    company: "BioPharm Clinical Research",
    department: "Pharma & Healthcare",
    location: "Bridgewater, NJ / Hybrid",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$165,000 - $215,000",
    description: "Lead global Phase II and Phase III multi-center clinical trials, FDA Investigational New Drug (IND) submissions, GCP auditor adherence, and clinical study protocol amendments.",
    recruiterEmail: "aris.thorne@biopharm.org",
    questions: [
      "How do you manage complex multi-site clinical trial protocol amendments without delaying patient cohort enrollment timelines?",
      "Walk through your direct experience defending a pivotal clinical efficacy dossier before an FDA or EMA advisory committee panel.",
      "Describe your protocol for investigating and reporting a Suspected Unexpected Serious Adverse Reaction (SUSAR) under statutory 7-day deadlines."
    ]
  },

  // ── Technology & Software
  {
    id: "job-tech-fresher",
    title: "Associate Software Engineer (Graduate Trainee)",
    company: "Nexus Technologies",
    department: "Technology & IT",
    location: "Bangalore, India / Austin, TX / Remote",
    type: "Full-Time · Fresher Friendly",
    salary: "$75,000 - $95,000",
    description: "Rotational software engineering program for computer science graduates. Build modern web services, RESTful APIs, automated test suites, and assist in cloud CI/CD pipeline deployments.",
    recruiterEmail: "sarah.jenkins@nexus.ai",
    questions: [
      "Explain the operational difference between synchronous and asynchronous code execution in JavaScript or Python, with an example of handling API latency.",
      "Describe how you design a normalized relational database schema for an e-commerce or booking service with appropriate foreign keys.",
      "How do you approach writing thorough unit tests, and how do you safeguard against unexpected edge cases or null pointer exceptions?"
    ]
  },
  {
    id: "job-tech-senior",
    title: "Principal AI & Distributed Systems Architect",
    company: "Job.Com Systems Lab",
    department: "Technology & IT",
    location: "San Francisco, CA (Remote Friendly)",
    type: "Full-Time · Principal (8+ yrs)",
    salary: "$190,000 - $240,000 + Equity",
    description: "Lead technical architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, server-enforced countdown integrity, and candidate rubric calibration.",
    recruiterEmail: "sarah.jenkins@nexus.ai",
    questions: [
      "Explain how you would architect a high-throughput, asynchronous video ingestion pipeline that gracefully handles intermittent cellular drops.",
      "How do you enforce single-use interview attempt tokens and prevent double-submission race conditions across concurrent client connections?",
      "Walk through an instance where you pushed back on an executive product deadline in order to remediate critical architectural technical debt."
    ]
  },

  // ── HR, Operations & Product Experience
  {
    id: "job-hr-mid",
    title: "Talent Acquisition Specialist & HR Operations Lead",
    company: "Horizon People Operations",
    department: "Sales, Operations & HR",
    location: "Denver, CO / Hybrid",
    type: "Full-Time · Mid-Level (2-5 yrs)",
    salary: "$70,000 - $90,000",
    description: "Lead university campus recruitment drives, ATS candidate workflow hygiene, interviewer rubric calibration, and new employee onboarding experience.",
    recruiterEmail: "robert.sterling@apexfinancial.com",
    questions: [
      "How do you design a structured, unbiased interview rubric for campus freshers that evaluates potential rather than years of experience?",
      "Describe your strategy for partnering with hiring managers to calibrate job descriptions and resolve slow candidate review cycles.",
      "How do you leverage ATS analytics to identify drop-off bottlenecks in the candidate hiring funnel?"
    ]
  },
  {
    id: "job-design-senior",
    title: "Senior Product Experience & Design Systems Lead",
    company: "Job.Com Design Lab",
    department: "Product Experience",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (5+ yrs)",
    salary: "$150,000 - $185,000",
    description: "Design calm, accessible candidate interview canvases and intuitive recruiter decision workspaces compliant with WCAG 2.1 AA accessibility standards.",
    recruiterEmail: "sarah.jenkins@nexus.ai",
    questions: [
      "How do you design an asynchronous recording interface that mitigates candidate performance anxiety through clear sensory cues?",
      "Walk through how you maintain and version a multi-platform design token system across web, mobile, and third-party embeds.",
      "Describe a user research study you conducted that fundamentally altered a critical workflow in a core enterprise product."
    ]
  },
];

// ─── 12 Candidates spanning Freshers & Experienced across Industries ───────────────
const CANDIDATES = [
  // ── Freshers / Entry-Level
  {
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    title: "Junior Financial Analyst & Accounts Associate (Recent B.Com / Finance Grad)",
    jobId: "job-acct-fresher",
    department: "Accounting & Finance",
    experienceLevel: "Fresher / Entry-Level",
    status: "COMPLETED",
    token: "aarav-mehta-acct-2026",
    score: 92,
    consent: true,
  },
  {
    name: "Chloe Dubois",
    email: "chloe.dubois@example.com",
    title: "Logistics Operations Trainee & Dispatch Coordinator (BS Supply Chain 2026)",
    jobId: "job-log-fresher",
    department: "Logistics & Supply Chain",
    experienceLevel: "Fresher / Entry-Level",
    status: "COMPLETED",
    token: "chloe-dubois-log-2026",
    score: 89,
    consent: true,
  },
  {
    name: "Kevin Zhao",
    email: "kevin.zhao@example.com",
    title: "Graduate Mechanical Engineer – CAD & Prototyping (BS Mech Eng 2026)",
    jobId: "job-mech-fresher",
    department: "Mechanical & Manufacturing",
    experienceLevel: "Fresher / Entry-Level",
    status: "COMPLETED",
    token: "kevin-zhao-mech-2026",
    score: 94,
    consent: true,
  },
  {
    name: "Ananya Deshmukh",
    email: "ananya.deshmukh@example.com",
    title: "QC Analytical Chemist & Lab Technician (B.Sc Chemistry / Pharmacology)",
    jobId: "job-pharma-fresher",
    department: "Pharma & Healthcare",
    experienceLevel: "Fresher / Entry-Level",
    status: "COMPLETED",
    token: "ananya-deshmukh-qc-2026",
    score: 91,
    consent: true,
  },
  {
    name: "Jordan Reed",
    email: "jordan.reed@example.com",
    title: "Associate Software Engineer – Graduate Trainee (BS Computer Science 2026)",
    jobId: "job-tech-fresher",
    department: "Technology & IT",
    experienceLevel: "Fresher / Entry-Level",
    status: "COMPLETED",
    token: "jordan-reed-swe-2026",
    score: 95,
    consent: true,
  },
  {
    name: "Rachel Green",
    email: "rachel.green@example.com",
    title: "Junior Talent Coordinator & Campus Recruiter (BA Psychology / HR)",
    jobId: "job-hr-mid",
    department: "Sales, Operations & HR",
    experienceLevel: "Fresher / Entry-Level",
    status: "IN_PROGRESS",
    token: "rachel-green-hr-2026",
    score: 88,
    consent: true,
  },

  // ── Experienced Professionals
  {
    name: "David Kramer",
    email: "david.kramer@example.com",
    title: "Senior Corporate Controller & Tax Advisory Manager (CPA, 8 yrs exp)",
    jobId: "job-acct-senior",
    department: "Accounting & Finance",
    experienceLevel: "Senior Level (6+ yrs)",
    status: "COMPLETED",
    token: "david-kramer-tax-2026",
    score: 96,
    consent: true,
  },
  {
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    title: "Global Supply Chain Director & Distribution Head (10 yrs exp)",
    jobId: "job-log-senior",
    department: "Logistics & Supply Chain",
    experienceLevel: "Executive (8+ yrs)",
    status: "COMPLETED",
    token: "marcus-vance-supply-2026",
    score: 93,
    consent: true,
  },
  {
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    title: "Principal Mechanical Design Engineer (Robotics Automation, 7 yrs exp)",
    jobId: "job-mech-senior",
    department: "Mechanical & Manufacturing",
    experienceLevel: "Senior Level (7+ yrs)",
    status: "COMPLETED",
    token: "elena-rostova-mech-2026",
    score: 97,
    consent: true,
  },
  {
    name: "Dr. Sophia Martinez",
    email: "dr.sophia.martinez@example.com",
    title: "Senior Clinical Trial Manager & Regulatory Affairs Head (PharmD, 9 yrs exp)",
    jobId: "job-pharma-senior",
    department: "Pharma & Healthcare",
    experienceLevel: "Senior Level (7+ yrs)",
    status: "COMPLETED",
    token: "sophia-martinez-pharma-2026",
    score: 95,
    consent: true,
  },
  {
    name: "Alex Mercer",
    email: "alex.mercer@example.com",
    title: "Principal AI & Distributed Systems Architect (9 yrs exp)",
    jobId: "job-tech-senior",
    department: "Technology & IT",
    experienceLevel: "Principal (8+ yrs)",
    status: "COMPLETED",
    token: "alex-mercer-ai-2026",
    score: 93,
    consent: true,
  },
  {
    name: "Maya Lin",
    email: "maya.lin@example.com",
    title: "Senior Product Experience & Design Systems Lead (6 yrs exp)",
    jobId: "job-design-senior",
    department: "Product Experience",
    experienceLevel: "Senior Level (5+ yrs)",
    status: "COMPLETED",
    token: "maya-lin-design-2026",
    score: 90,
    consent: true,
  },
];

const DEFAULT_DEMO_TOKEN = "demo-candidate-1";

async function seed() {
  console.log(" Starting comprehensive multi-industry dataset seeding for Job.Com...");

  // 1. Clean existing records in correct order to satisfy foreign keys
  await prisma.interviewResponse.deleteMany({});
  await prisma.interviewQuestion.deleteMany({});
  await prisma.interviewSession.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.user.deleteMany({});

  console.log(" Cleared existing tables.");

  // 2. Insert Recruiters
  const recruiterMap = new Map();
  for (const r of RECRUITERS) {
    const created = await prisma.user.create({
      data: {
        name: r.name,
        email: r.email,
        password: HASHED_PASSWORD,
        role: "RECRUITER",
        company: r.company,
        title: r.title,
      },
    });
    recruiterMap.set(r.email, created.id);
    console.log(` Created Recruiter [${r.department}]: ${r.name} (${r.email})`);
  }

  // Also create universal fallback recruiter recruiter@job.com
  const defaultRecruiter = await prisma.user.create({
    data: {
      name: "Lead Talent Partner",
      email: "recruiter@job.com",
      password: HASHED_PASSWORD,
      role: "RECRUITER",
      company: "Job.Com",
      title: "Global Talent Lead",
    },
  });
  console.log(` Created Default Recruiter: recruiter@job.com`);

  // 3. Insert Jobs
  const jobMap = new Map();
  for (const j of JOBS) {
    const recId = recruiterMap.get(j.recruiterEmail) || defaultRecruiter.id;
    const created = await prisma.job.create({
      data: {
        id: j.id,
        title: j.title,
        company: j.company,
        department: j.department,
        location: j.location,
        type: j.type,
        salary: j.salary,
        description: j.description,
        status: "ACTIVE",
        questionsJson: JSON.stringify(j.questions),
        recruiterId: recId,
      },
    });
    jobMap.set(j.id, created);
    console.log(` Created Job [${j.department}]: ${j.title}`);
  }

  // 4. Insert Candidates and their Interview Sessions
  for (const c of CANDIDATES) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        password: HASHED_PASSWORD,
        role: "CANDIDATE",
        title: c.title,
      },
    });

    const job = jobMap.get(c.jobId);
    const questionsList = job && job.questionsJson ? JSON.parse(job.questionsJson) : [
      "Please introduce yourself and your relevant domain experience.",
      "Describe a challenging problem you solved in your field and your specific methodology.",
      "How do you collaborate effectively with cross-functional team members?"
    ];

    const session = await prisma.interviewSession.create({
      data: {
        token: c.token,
        candidateName: c.name,
        candidateEmail: c.email,
        candidateId: user.id,
        jobId: c.jobId,
        status: c.status,
        consent: c.consent,
        startedAt: c.status !== "INVITED" ? new Date(Date.now() - 3600000) : null,
        completedAt: c.status === "COMPLETED" ? new Date() : null,
      },
    });

    // Create questions and responses
    for (let i = 0; i < questionsList.length; i++) {
      const prompt = questionsList[i];
      const q = await prisma.interviewQuestion.create({
        data: {
          sessionId: session.id,
          prompt,
          timeLimitSeconds: 90,
          retakesAllowed: 1,
          order: i,
        },
      });

      if (c.status === "COMPLETED") {
        await prisma.interviewResponse.create({
          data: {
            questionId: q.id,
            attempt: 1,
            status: "SUBMITTED",
            storageKey: `recordings/${session.token}/q${i + 1}.webm`,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            score: Math.min(100, Math.max(70, c.score + (i % 2 === 0 ? 1 : -2))),
            feedback: `Evaluator feedback for ${c.name} (${c.experienceLevel}): Demonstrated clear structured methodology, strong technical foundation, and precise domain vocabulary.`,
            submittedAt: new Date(),
          },
        });
      }
    }

    console.log(` Created Candidate [${c.department} | ${c.experienceLevel}]: ${c.name} (${c.email})`);
  }

  // 5. Seed default demo token session (/interview/demo-candidate-1)
  const firstJob = jobMap.get("job-tech-senior") || Array.from(jobMap.values())[0];
  const demoCandidateUser = await prisma.user.findUnique({
    where: { email: "alex.mercer@example.com" },
  });

  const demoSession = await prisma.interviewSession.create({
    data: {
      token: DEFAULT_DEMO_TOKEN,
      candidateName: "Demo Candidate (Live Sandbox)",
      candidateEmail: "demo@job.com",
      candidateId: demoCandidateUser ? demoCandidateUser.id : null,
      jobId: firstJob.id,
      status: "INVITED",
      consent: true,
    },
  });

  const demoQuestions = [
    "Explain how you would architect a high-throughput, asynchronous pipeline that gracefully handles network latency drops.",
    "How do you enforce single-use attempt tokens and prevent double-submission race conditions across concurrent client connections?",
    "Describe an instance where you balanced urgent executive deadlines against technical debt and engineering rigor."
  ];

  for (let i = 0; i < demoQuestions.length; i++) {
    await prisma.interviewQuestion.create({
      data: {
        sessionId: demoSession.id,
        prompt: demoQuestions[i],
        timeLimitSeconds: 90,
        retakesAllowed: 1,
        order: i,
      },
    });
  }

  console.log(` Created Live Demo Sandbox Token: ${DEFAULT_DEMO_TOKEN}`);
  console.log("\n Multi-Industry Database Seeding Complete!");
  console.log(" Universal Testing Password for all accounts: Password123!");
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
