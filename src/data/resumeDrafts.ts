export interface ResumeData {
  id: string;
  templateStyle: "editorial" | "minimal" | "executive";
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    year: string;
    honors?: string;
  }>;
  skills: string[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
  }>;
}

export const BLANK_RESUME: ResumeData = {
  id: "blank",
  templateStyle: "editorial",
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  experience: [
    {
      id: "exp-1",
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: true,
      bullets: [""],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "",
      degree: "",
      field: "",
      year: "",
      honors: "",
    },
  ],
  skills: [],
  certifications: [],
};

export const RESUME_DRAFTS: Record<string, { label: string; category: string; data: ResumeData }> = {
  "acct-fresher": {
    label: "🎓 Accounting & Finance (Fresher) · Aarav Mehta",
    category: "Accounting & Finance",
    data: {
      id: "acct-fresher",
      templateStyle: "editorial",
      personalInfo: {
        fullName: "Aarav Mehta",
        title: "Junior Financial Analyst & Accounts Associate",
        email: "aarav.mehta@example.com",
        phone: "+1 (312) 555-0142",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/aarav-mehta-finance",
        website: "aaravmehta.portfolio",
      },
      summary:
        "Detail-oriented Finance graduate with a strong foundation in double-entry bookkeeping, general ledger reconciliations, and US GAAP standards. Proficient in advanced Excel financial modeling, variance reporting, and QuickBooks. Eager to contribute disciplined analytical execution and zero-defect ledger hygiene to a growing corporate finance team.",
      experience: [
        {
          id: "exp-acct-1",
          company: "Apex Financial Group",
          role: "Finance & Accounting Intern",
          location: "Chicago, IL",
          startDate: "Jan 2026",
          endDate: "May 2026",
          current: false,
          bullets: [
            "Conducted daily bank reconciliations across 4 institutional accounts, resolving $120,000+ in timing variances within 24 hours.",
            "Assisted month-end close by preparing journal entries and auditing accounts payable disbursements under US GAAP.",
            "Built automated Excel variance templates utilizing VLOOKUP and dynamic pivot tables, reducing monthly reporting cycle by 6 hours.",
          ],
        },
      ],
      education: [
        {
          id: "edu-acct-1",
          school: "University of Illinois at Urbana-Champaign",
          degree: "Bachelor of Science",
          field: "Accountancy & Finance",
          year: "2025",
          honors: "Magna Cum Laude · 3.84 GPA",
        },
      ],
      skills: [
        "General Ledger",
        "Bank Reconciliation",
        "US GAAP",
        "Financial Modeling",
        "QuickBooks",
        "Excel (VLOOKUP, Pivots)",
        "Accounts Payable/Receivable",
        "Variance Analysis",
      ],
      certifications: [
        {
          id: "cert-acct-1",
          name: "CPA Exam Candidate (AUD & FAR Completed)",
          issuer: "AICPA",
          year: "2026",
        },
      ],
    },
  },

  "acct-senior": {
    label: "⭐ Senior Financial Controller (CPA) · David Kramer",
    category: "Accounting & Finance",
    data: {
      id: "acct-senior",
      templateStyle: "executive",
      personalInfo: {
        fullName: "David Kramer, CPA",
        title: "Senior Corporate Controller & Tax Advisory Lead",
        email: "david.kramer@example.com",
        phone: "+1 (212) 555-0199",
        location: "New York, NY",
        linkedin: "linkedin.com/in/david-kramer-cpa",
      },
      summary:
        "Certified Public Accountant with 7+ years directing corporate accounting, statutory audit defense, and global financial consolidations under US GAAP and IFRS. Proven track record leading SOX 404 internal controls, treasury operations, and SAP S/4HANA migrations for multi-entity enterprises with $150M+ annual revenue.",
      experience: [
        {
          id: "exp-acct-s1",
          company: "Deloitte & Meridian Advisory",
          role: "Corporate Accounting Controller",
          location: "New York, NY",
          startDate: "Mar 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Direct consolidated financial reporting for 8 international subsidiaries across 3 operating currencies with zero statutory audit adjustments.",
            "Spearheaded enterprise SOX 404 internal control overhaul, remediating 14 material deficiency findings and slashing external audit fees by $85,000.",
            "Engineered automated cash forecasting model covering $45M treasury pool, enhancing liquidity yield by 140 bps.",
          ],
        },
      ],
      education: [
        {
          id: "edu-acct-s1",
          school: "New York University (Stern School of Business)",
          degree: "Master of Science",
          field: "Professional Accounting",
          year: "2018",
        },
      ],
      skills: [
        "US GAAP / IFRS",
        "SOX 404 Compliance",
        "Multi-Entity Consolidation",
        "SAP S/4HANA",
        "Statutory Audit Defense",
        "Corporate Tax Strategy",
        "FP&A Forecasting",
        "Treasury Management",
      ],
      certifications: [
        {
          id: "cert-acct-s1",
          name: "Certified Public Accountant (CPA)",
          issuer: "New York State Board",
          year: "2019",
        },
      ],
    },
  },

  "log-fresher": {
    label: "🎓 Logistics & Supply Chain (Fresher) · Chloe Dubois",
    category: "Logistics & Supply Chain",
    data: {
      id: "log-fresher",
      templateStyle: "minimal",
      personalInfo: {
        fullName: "Chloe Dubois",
        title: "Logistics Operations Coordinator & Freight Dispatcher",
        email: "chloe.dubois@example.com",
        phone: "+1 (214) 555-0183",
        location: "Dallas, TX",
        linkedin: "linkedin.com/in/chloe-dubois-logistics",
      },
      summary:
        "Dynamic Supply Chain Management graduate with specialized practical training in multimodal transportation dispatching, Bill of Lading (BOL) verification, and warehouse fulfillment telemetry. Proficient in TMS applications, Incoterms 2020 rules, and real-time carrier exception management.",
      experience: [
        {
          id: "exp-log-1",
          company: "TransGlobal Freight & Supply",
          role: "Operations Dispatch Trainee",
          location: "Dallas, TX",
          startDate: "Jun 2025",
          endDate: "Feb 2026",
          current: false,
          bullets: [
            "Coordinated dispatch scheduling for 28 daily interstate freight carriers, achieving 98.6% on-time delivery SLA.",
            "Verified customs documentation and Bill of Lading (BOL) compliance for 450+ ocean and surface shipments.",
            "Resolved transit exception alerts in real-time, reducing customer detention charges by $22,000.",
          ],
        },
      ],
      education: [
        {
          id: "edu-log-1",
          school: "University of North Texas",
          degree: "Bachelor of Business Administration",
          field: "Logistics & Supply Chain Management",
          year: "2025",
          honors: "Dean's Honor Roll",
        },
      ],
      skills: [
        "Freight Forwarding",
        "Bill of Lading (BOL)",
        "Incoterms 2020",
        "TMS & WMS Systems",
        "Fleet Dispatching",
        "Customs Documentation",
        "Route Planning",
        "Inventory Tracking",
      ],
      certifications: [
        {
          id: "cert-log-1",
          name: "Certified in Logistics, Transportation & Distribution (CLTD)",
          issuer: "ASCM",
          year: "2025",
        },
      ],
    },
  },

  "mech-fresher": {
    label: "🎓 Mechanical Engineering (GET) · Kevin Zhao",
    category: "Mechanical & Manufacturing",
    data: {
      id: "mech-fresher",
      templateStyle: "editorial",
      personalInfo: {
        fullName: "Kevin Zhao",
        title: "Graduate Mechanical Engineer – CAD & Testing",
        email: "kevin.zhao@example.com",
        phone: "+1 (313) 555-0177",
        location: "Detroit, MI",
        linkedin: "linkedin.com/in/kevin-zhao-cad",
      },
      summary:
        "High-aptitude Mechanical Engineering graduate with intensive practical project experience in SolidWorks 3D drafting, Geometric Dimensioning & Tolerancing (GD&T ASME Y14.5), and CNC manufacturing floor inspection. Skilled in finite element stress analysis (FEA), mechatronics integration, and rapid 3D prototyping.",
      experience: [
        {
          id: "exp-mech-1",
          company: "Titan Precision Manufacturing",
          role: "Mechanical Engineering Intern",
          location: "Detroit, MI",
          startDate: "May 2025",
          endDate: "Dec 2025",
          current: false,
          bullets: [
            "Designed 18 parametric 3D sheet-metal and CNC-machined sub-assemblies in SolidWorks compliant with ASME Y14.5 GD&T.",
            "Conducted static stress and thermal strain simulations in ANSYS Workbench, preventing premature prototype shear failure.",
            "Collaborated with CNC machine shop floor to inspect tool wear and reduce prototype fabrication turnaround by 3 days.",
          ],
        },
      ],
      education: [
        {
          id: "edu-mech-1",
          school: "University of Michigan (Ann Arbor)",
          degree: "Bachelor of Science in Engineering",
          field: "Mechanical Engineering",
          year: "2025",
          honors: "Tau Beta Pi Engineering Honor Society",
        },
      ],
      skills: [
        "SolidWorks 3D CAD",
        "AutoCAD",
        "GD&T (ASME Y14.5)",
        "ANSYS FEA",
        "DFM & DFA",
        "CNC Machining Basics",
        "Tolerance Stack-Up",
        "Rapid Prototyping",
      ],
      certifications: [
        {
          id: "cert-mech-1",
          name: "Certified SolidWorks Professional (CSWP)",
          issuer: "Dassault Systèmes",
          year: "2024",
        },
      ],
    },
  },

  "pharma-senior": {
    label: "⭐ Pharma Regulatory Affairs Head · Dr. Sophia Martinez",
    category: "Pharmaceuticals & Healthcare",
    data: {
      id: "pharma-senior",
      templateStyle: "executive",
      personalInfo: {
        fullName: "Dr. Sophia Martinez, Pharm.D",
        title: "Principal Regulatory Affairs & Clinical Operations Lead",
        email: "dr.sophia@example.com",
        phone: "+1 (617) 555-0164",
        location: "Boston, MA",
        linkedin: "linkedin.com/in/sophia-martinez-pharma",
      },
      summary:
        "Doctor of Pharmacy with 8+ years leading global pharmaceutical regulatory submissions (IND, NDA, ANDA) and cGMP audit defense for FDA and EMA markets. Proven track record securing 5 major market authorizations, directing eCTD Module 1-5 dossiers, and leading sterile injectable OOS root-cause investigations.",
      experience: [
        {
          id: "exp-pharma-1",
          company: "BioPharm Clinical Research",
          role: "Head of Global Regulatory Submissions",
          location: "Boston, MA",
          startDate: "Feb 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Authored and successfully submitted 3 NDA and 4 ANDA dossiers to US FDA and EMA in eCTD specifications with zero major objections.",
            "Led cGMP pre-approval inspection (PAI) readiness audits across 2 commercial sterile manufacturing facilities, achieving 100% compliance.",
            "Spearheaded root-cause investigations for 12 complex Out-of-Specification (OOS) batch alerts, preventing product recalls.",
          ],
        },
      ],
      education: [
        {
          id: "edu-pharma-1",
          school: "Northeastern University",
          degree: "Doctor of Pharmacy (Pharm.D)",
          field: "Pharmaceutical Sciences & Regulatory Policy",
          year: "2017",
        },
      ],
      skills: [
        "FDA & EMA Submissions",
        "eCTD Dossier (Mod 1-5)",
        "ICH-GCP Compliance",
        "cGMP Audits & Inspection Readiness",
        "OOS Batch Root Cause",
        "Pharmacovigilance",
        "Clinical Protocol Authoring",
        "21 CFR Part 11",
      ],
      certifications: [
        {
          id: "cert-pharma-1",
          name: "Regulatory Affairs Certified (RAC Dual - US/EU)",
          issuer: "RAPS",
          year: "2020",
        },
      ],
    },
  },
};
