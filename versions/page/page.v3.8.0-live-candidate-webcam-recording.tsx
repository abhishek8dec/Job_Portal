"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Video,
  Camera,
  Lock,
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
  Phone,
  HelpCircle,
  ShieldCheck,
  Check,
  Pause,
  RotateCw,
  Mic,
  Volume2,
  FileText,
  Send,
  Layers,
  Download,
  TrendingUp,
  Activity,
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
  experienceLevel?: "Fresher" | "Mid-Level" | "Senior" | "Executive";
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
    id: "job-acct-fresher",
    title: "Junior Financial Analyst & Accounts Associate",
    company: "Apex Financial Group",
    department: "Accounting & Finance",
    location: "Chicago, IL / Hybrid",
    type: "Full-Time · Fresher / Entry-Level",
    salary: "$65,000 - $80,000",
    description:
      "Launchpad opportunity for recent accounting and finance graduates. Perform monthly balance sheet reconciliations, ledger variance audits, accounts payable tracking, and financial modeling in Excel.",
    tags: ["GAAP", "Excel Modeling", "General Ledger", "Freshers Welcome", "QuickBooks"],
    experienceLevel: "Fresher",
  },
  {
    id: "job-acct-senior",
    title: "Senior Corporate Controller & Tax Advisory Manager",
    company: "Deloitte & Meridian Advisory",
    department: "Accounting & Finance",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (6+ yrs)",
    salary: "$145,000 - $185,000",
    description:
      "Direct corporate financial governance, SOX 404 internal control testing, international multi-subsidiary consolidations, and corporate tax strategy under US GAAP and IFRS standards.",
    tags: ["CPA Required", "IFRS / US GAAP", "Corporate Tax", "Statutory Audit", "ERP Systems"],
    experienceLevel: "Senior",
  },
  {
    id: "job-log-fresher",
    title: "Logistics Operations Trainee & Freight Dispatcher",
    company: "TransGlobal Freight & Supply",
    department: "Logistics & Supply Chain",
    location: "Dallas, TX / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$58,000 - $72,000",
    description:
      "Entry-level position for recent supply chain or business graduates. Coordinate multi-modal fleet shipments, carrier dispatching, Bill of Lading (BOL) verification, and real-time transit tracking.",
    tags: ["Supply Chain Graduate", "TMS Systems", "Bill of Lading", "Fleet Dispatch", "Inventory Control"],
    experienceLevel: "Fresher",
  },
  {
    id: "job-log-senior",
    title: "Global Supply Chain Director & Distribution Head",
    company: "Maersk & TransGlobal Logistics",
    department: "Logistics & Supply Chain",
    location: "Atlanta, GA / Hybrid",
    type: "Full-Time · Executive (8+ yrs)",
    salary: "$165,000 - $210,000",
    description:
      "Oversee end-to-end supply chain resilience, automated fulfillment center robotics, ocean/air carrier contracting, and cross-border customs compliance across 12 distribution nodes.",
    tags: ["Global Logistics", "WMS / SAP", "Customs Compliance", "3PL Procurement", "Cold Chain"],
    experienceLevel: "Executive",
  },
  {
    id: "job-mech-fresher",
    title: "Graduate Mechanical Engineer – CAD & Testing",
    company: "Titan Precision Manufacturing",
    department: "Mechanical & Manufacturing",
    location: "Detroit, MI / On-site",
    type: "Full-Time · Graduate Track",
    salary: "$72,000 - $88,000",
    description:
      "Graduate rotation program for BS/MS Mechanical Engineering graduates. Participate in 3D SolidWorks drafting, Geometric Dimensioning & Tolerancing (GD&T), structural strain testing, and CNC prototyping.",
    tags: ["Fresh Graduate", "SolidWorks", "AutoCAD", "GD&T", "Rapid Prototyping"],
    experienceLevel: "Fresher",
  },
  {
    id: "job-mech-senior",
    title: "Principal Mechanical Design Engineer (Robotics & Automation)",
    company: "Titan Robotics Systems",
    department: "Mechanical & Manufacturing",
    location: "Boston, MA / On-site",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$155,000 - $195,000",
    description:
      "Lead mechanical architecture of automated industrial robotic arms, high-precision harmonic gear trains, mechatronics calibration, and finite element analysis (FEA) vibration dampening.",
    tags: ["Mechatronics", "FEA Analysis", "Robotic Kinematics", "SolidWorks Simulation", "ISO 9001"],
    experienceLevel: "Senior",
  },
  {
    id: "job-pharma-fresher",
    title: "Junior Quality Control Chemist & Lab Analyst",
    company: "BioPharm Dynamics Laboratories",
    department: "Pharma & Healthcare",
    location: "Philadelphia, PA / On-site",
    type: "Full-Time · Fresher Friendly",
    salary: "$68,000 - $82,000",
    description:
      "Hands-on analytical chemistry launchpad for chemistry and pharmacology graduates. Execute HPLC/GC chromatography, raw material dissolution assays, and cGMP compliance documentation.",
    tags: ["BSc Chemistry / Pharma", "HPLC / GC", "Wet Chemistry", "cGMP Compliance", "Freshers"],
    experienceLevel: "Fresher",
  },
  {
    id: "job-pharma-senior",
    title: "Senior Clinical Trial Manager & Regulatory Affairs Head",
    company: "BioPharm Clinical Research",
    department: "Pharma & Healthcare",
    location: "Bridgewater, NJ / Hybrid",
    type: "Full-Time · Senior (7+ yrs)",
    salary: "$165,000 - $215,000",
    description:
      "Lead global Phase II and Phase III multi-center clinical trials, FDA Investigational New Drug (IND) submissions, GCP auditor adherence, and clinical study protocol amendments.",
    tags: ["Clinical Trials", "FDA IND / NDA", "ICH-GCP", "Medical Affairs", "IRB Governance"],
    experienceLevel: "Senior",
  },
  {
    id: "job-tech-fresher",
    title: "Associate Software Engineer (Graduate Trainee)",
    company: "Nexus Technologies",
    department: "Technology & IT",
    location: "Austin, TX / Bangalore / Remote",
    type: "Full-Time · Fresher Friendly",
    salary: "$75,000 - $95,000",
    description:
      "Rotational software engineering program for computer science graduates. Build modern web services, RESTful APIs, automated test suites, and assist in cloud CI/CD pipeline deployments.",
    tags: ["CS Graduate", "JavaScript / Python", "SQL Databases", "Git & CI/CD", "Freshers Welcome"],
    experienceLevel: "Fresher",
  },
  {
    id: "job-tech-senior",
    title: "Principal AI & Distributed Systems Architect",
    company: "Job.Com Systems Lab",
    department: "Technology & IT",
    location: "San Francisco, CA (Remote Friendly)",
    type: "Full-Time · Principal (8+ yrs)",
    salary: "$190,000 - $240,000",
    description:
      "Lead technical architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, server-enforced countdown integrity, and candidate rubric calibration.",
    tags: ["Distributed Systems", "WebRTC / S3", "Microservices", "Go / TypeScript", "High Concurrency"],
    experienceLevel: "Senior",
  },
  {
    id: "job-hr-mid",
    title: "Talent Acquisition Specialist & HR Operations Lead",
    company: "Horizon People Operations",
    department: "Sales, Operations & HR",
    location: "Denver, CO / Hybrid",
    type: "Full-Time · Mid-Level (2-5 yrs)",
    salary: "$70,000 - $90,000",
    description:
      "Lead university campus recruitment drives, ATS candidate workflow hygiene, interviewer rubric calibration, and new employee onboarding experience.",
    tags: ["Campus Recruiting", "ATS Systems", "HR Compliance", "Candidate Experience", "Onboarding"],
    experienceLevel: "Mid-Level",
  },
  {
    id: "job-design-senior",
    title: "Senior Product Experience & Design Systems Lead",
    company: "Job.Com Design Lab",
    department: "Product Experience",
    location: "New York, NY / Hybrid",
    type: "Full-Time · Senior (5+ yrs)",
    salary: "$150,000 - $185,000",
    description:
      "Design calm, accessible candidate interview canvases and intuitive recruiter decision workspaces compliant with WCAG 2.1 AA accessibility standards.",
    tags: ["Figma", "Design Systems", "Accessibility", "Candidate UX", "Motion"],
    experienceLevel: "Senior",
  },
];

const DEMO_QUESTIONS = [
  {
    title: "Accounting: Bank Reconciliation",
    industry: "Accounting & Finance",
    difficulty: "Fresher / Entry-Level",
    timeLimit: 30,
    prompt: "“Walk us through how you perform a month-end bank reconciliation and resolve discrepancies between the general ledger and bank statements.”",
    tip: "Focus on timing differences, outstanding checks, deposits in transit, and bank errors.",
    sampleSynthesis:
      "Candidate articulated structured four-step reconciliation: matching ledger records against statement feeds, identifying timing differences (outstanding checks and deposits in transit), and booking adjusting journal entries for bank charges.",
    score: 92,
    scores: {
      technical: 94,
      resilience: 90,
      clarity: 92,
    },
  },
  {
    title: "Logistics: Delayed Freight Rerouting",
    industry: "Logistics & Supply Chain",
    difficulty: "Fresher / Operations",
    timeLimit: 30,
    prompt: "“How do you prioritize and re-route delayed freight shipments when severe weather or port congestion impacts customer delivery ETAs?”",
    tip: "Highlight carrier dispatch communication, Bill of Lading updates, and proactive customer milestone alerts.",
    sampleSynthesis:
      "Demonstrated swift operational composure under delay bottlenecks. Articulated carrier triage by delivery criticality, updated TMS tracking status, and alerted receiving distribution leads with revised arrival windows.",
    score: 89,
    scores: {
      technical: 90,
      resilience: 91,
      clarity: 87,
    },
  },
  {
    title: "Mechanical: GD&T Tolerances",
    industry: "Mechanical & Manufacturing",
    difficulty: "Graduate / Testing",
    timeLimit: 30,
    prompt: "“Explain Geometric Dimensioning & Tolerancing (GD&T) principles, specifically how you establish datum references and calculate position tolerances.”",
    tip: "Reference ASME Y14.5 standards, maximum material condition (MMC), and coordinate measuring machine (CMM) verification.",
    sampleSynthesis:
      "Exceptional grasp of mechanical tolerancing fundamentals. Clearly explained primary/secondary/tertiary datum planes, maximum material condition (MMC) bonus tolerance, and real-world machining cost implications.",
    score: 94,
    scores: {
      technical: 96,
      resilience: 92,
      clarity: 94,
    },
  },
  {
    title: "Pharma: OOS Batch Investigation",
    industry: "Pharma & Healthcare",
    difficulty: "Senior / Quality Control",
    timeLimit: 30,
    prompt: "“What exact procedure do you follow if an analytical chromatography sample produces an Out-of-Specification (OOS) result during routine commercial batch release?”",
    tip: "Detail Phase I laboratory investigation, instrument calibration check, standard prep re-testing, and FDA cGMP compliance.",
    sampleSynthesis:
      "Flawless adherence to FDA cGMP guidelines for OOS investigations. Outlined immediate test stoppage, instrument baseline verification, standard/reagent re-check, and multidisciplinary QA root cause analysis prior to batch disposition.",
    score: 95,
    scores: {
      technical: 97,
      resilience: 93,
      clarity: 95,
    },
  },
  {
    title: "Software: High-Throughput Ingestion",
    industry: "Technology & Software",
    difficulty: "Principal / Architect",
    timeLimit: 30,
    prompt: "“Explain how you would architect a high-throughput, asynchronous video ingestion pipeline that gracefully handles intermittent cellular drops.”",
    tip: "Focus on edge chunking, client IndexedDB buffers, pre-signed upload URLs, and idempotent server assembly.",
    sampleSynthesis:
      "Candidate articulated asynchronous queuing with Kafka and dead-letter queues. Strong awareness of backpressure mechanisms, pre-signed S3 upload tokens, and client-side indexedDB buffering for network drop resilience.",
    score: 93,
    scores: {
      technical: 95,
      resilience: 92,
      clarity: 91,
    },
  },
];

const DEMO_CANDIDATES = [
  {
    name: "Aarav Mehta",
    role: "Junior Financial Analyst & Accounts Associate",
    department: "Accounting & Finance",
    experienceLevel: "Fresher / Entry-Level",
    score: 92,
    recommendation: "Strong Hire · Advance to Technical Panel",
    duration: "02:15",
    chapters: [
      { time: "00:10", title: "General Ledger & Bank Reconciliation" },
      { time: "00:48", title: "Financial Statement Interconnection" },
      { time: "01:30", title: "Period-End Accuracy & Audit Trail" },
    ],
    transcript:
      "“...When performing month-end bank reconciliations, I start by pulling the general ledger cash account and matching against verified bank feeds. Any timing differences—such as outstanding checks or deposits in transit—are tagged immediately. If an unexplained variance appears, I trace journal entries down to source invoices in QuickBooks...”",
    rubric: [
      { label: "GAAP & Accounting Fundamentals", score: 94 },
      { label: "Attention to Detail & Accuracy", score: 92 },
      { label: "Structured Problem Solving", score: 90 },
    ],
    highlights: [
      "Top-percentile university graduate in accounting with direct regional audit internship experience",
      "Demonstrated rigorous double-entry bookkeeping discipline and discrepancy escalation logic",
      "Calm, articulate explanation of P&L, Balance Sheet, and Cash Flow relationships",
    ],
    probe: "Recommended for Round 2: Ask about experience with multi-currency foreign exchange transaction entries.",
  },
  {
    name: "Chloe Dubois",
    role: "Logistics Operations Trainee & Dispatch Coordinator",
    department: "Logistics & Supply Chain",
    experienceLevel: "Fresher / Entry-Level",
    score: 89,
    recommendation: "Strong Hire · Advance to Operations Desk",
    duration: "02:08",
    chapters: [
      { time: "00:12", title: "Carrier Dispatch & Route Scheduling" },
      { time: "00:44", title: "Bill of Lading & Customs Verification" },
      { time: "01:25", title: "Delay Escalation & Warehouse Hand-off" },
    ],
    transcript:
      "“...In supply chain logistics, minutes matter when weather threatens a lane. I monitor live TMS telematics. When a shipment encounters port congestion, I review the Bill of Lading priority, evaluate alternative cross-dock hubs, and immediately notify warehouse supervisors to re-allocate dock doors before trucks queue...”",
    rubric: [
      { label: "Supply Chain & Freight Knowledge", score: 90 },
      { label: "Crisis Management & Composure", score: 91 },
      { label: "Carrier & Stakeholder Communication", score: 87 },
    ],
    highlights: [
      "Certified in logistics analytics with practical freight terminal dispatch knowledge",
      "Clear understanding of multi-modal Bill of Lading (BOL) and export compliance documents",
      "Proactive, solution-oriented communication during freight bottleneck simulations",
    ],
    probe: "Recommended for Round 2: Inquire about experience with automated warehouse management systems (WMS).",
  },
  {
    name: "Elena Rostova",
    role: "Principal Mechanical Design Engineer",
    department: "Mechanical & Manufacturing",
    experienceLevel: "Senior Level (7+ yrs)",
    score: 97,
    recommendation: "Exceptional Lead · Immediate Offer Consideration",
    duration: "02:45",
    chapters: [
      { time: "00:15", title: "6-Axis Kinematics & Cycloidal Drives" },
      { time: "00:54", title: "FEA Dynamic Fatigue & Harmonic Resonance" },
      { time: "01:42", title: "Sub-Micron CNC Thermal Drift Mitigation" },
    ],
    transcript:
      "“...To achieve sub-micron repeatability in articulated robotic arms, thermal equilibrium is critical. In our last high-speed automation line, we simulated cyclic harmonic resonance across the cycloidal reducers using ANSYS FEA. We selected 7075-T6 aluminum housings with symmetrical cooling fins, reducing thermal drift by 74% under continuous 24/7 duty cycles...”",
    rubric: [
      { label: "Mechanical Architecture & FEA", score: 98 },
      { label: "Robotics & Mechatronics Mastery", score: 96 },
      { label: "Design for Manufacturing (DFM)", score: 97 },
    ],
    highlights: [
      "World-class mechanical design background in robotic arms and precision gearing",
      "Author of 3 automation patents with proven zero-backlash harmonic drive integration",
      "Exceptional cross-functional synergy with embedded firmware and control theory engineers",
    ],
    probe: "Recommended for Round 2: Deep dive into cleanroom ISO 5 robotic sealing strategies.",
  },
  {
    name: "Dr. Sophia Martinez",
    role: "Senior Clinical Trial Manager & Regulatory Affairs Head",
    department: "Pharma & Healthcare",
    experienceLevel: "Senior Level (7+ yrs)",
    score: 95,
    recommendation: "Strong Hire · Advance to Scientific Review Board",
    duration: "02:30",
    chapters: [
      { time: "00:14", title: "Phase III Multi-Center Trial Oversight" },
      { time: "00:50", title: "FDA Investigational New Drug (IND) Filings" },
      { time: "01:38", title: "SUSAR Adverse Event Statutory Reporting" },
    ],
    transcript:
      "“...Governing global Phase III oncology trials requires flawless compliance with ICH-GCP guidelines. When multi-site protocol amendments are necessary, I coordinate with principal investigators and Institutional Review Boards (IRBs) simultaneously. In our last submission, our audit trail had zero 483 inspection observations from FDA inspectors...”",
    rubric: [
      { label: "Clinical Operations & GCP Governance", score: 97 },
      { label: "FDA / EMA Regulatory Dossier Defense", score: 94 },
      { label: "Patient Safety & Ethics Protocols", score: 95 },
    ],
    highlights: [
      "Doctor of Pharmacy (PharmD) with 9 years directing international multi-center oncology trials",
      "Successfully authored and defended 4 FDA IND and 2 EMA marketing authorization dossiers",
      "Comprehensive mastery of electronic data capture (EDC) and pharmacovigilance safety reporting",
    ],
    probe: "Recommended for Round 2: Review decentralized and hybrid clinical trial protocol management.",
  },
  {
    name: "Alex Mercer",
    role: "Principal AI & Distributed Systems Architect",
    department: "Technology & IT",
    experienceLevel: "Principal (8+ yrs)",
    score: 93,
    recommendation: "Strong Hire · Advance to Technical Panel",
    duration: "02:18",
    chapters: [
      { time: "00:10", title: "Server-Enforced Timer Integrity" },
      { time: "00:45", title: "Asynchronous Media Ingestion Topology" },
      { time: "01:30", title: "HMAC Cryptographic Verification Tokens" },
    ],
    transcript:
      "“...Client-side clocks cannot be trusted in high-stakes video evaluations. Our server issues a signed HMAC token when the prompt unlocks. Even if a candidate manipulates browser devtools, the server timestamp authority closes the ingestion window strictly on deadline...”",
    rubric: [
      { label: "Distributed Systems Architecture", score: 95 },
      { label: "Anti-Tamper & Security Design", score: 94 },
      { label: "Real-Time Media Streaming Reliability", score: 91 },
    ],
    highlights: [
      "9 years building distributed WebRTC media streaming and high-concurrency ingestion platforms",
      "Strong understanding of browser MediaRecorder constraints across WebKit & Chromium",
      "Pragmatic approach to server-side cryptographic audit receipts and automated rubric scoring",
    ],
    probe: "Recommended for Round 2: Explore offline synchronization recovery under multi-minute disconnection.",
  },
];

const ATS_PREVIEWS = {
  greenhouse: {
    name: "Greenhouse Harvest API",
    endpoint: "https://harvest.greenhouse.io/v1/candidates/98214/activity_feed/notes",
    headers: {
      "Authorization": "Bearer gh_live_7x892a01...",
      "Content-Type": "application/json",
      "X-JobCom-Signature": "sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    payload: {
      event: "screening.completed",
      candidate_id: "cand_98214",
      candidate_name: "Elena Rostova",
      requisition_id: "req_eng_401",
      stage: "ASYNC_SCREENING",
      recommendation: "STRONG_HIRE",
      overall_score: 95,
      rubric: {
        systems_architecture: 96,
        failure_mode_resilience: 94,
        verbal_articulation: 95,
      },
      recording_archive_url: "https://storage.job.com/vault/ses_ro_9512.webm",
      transcript_summary: "Candidate articulated resilient chunked upload architecture with exponential backoff.",
    },
  },
  lever: {
    name: "Lever Postings & Opportunities API",
    endpoint: "https://api.lever.co/v1/opportunities/opp_49102/stage",
    headers: {
      "Authorization": "Bearer lev_sec_89104...",
      "Content-Type": "application/json",
      "X-JobCom-Signature": "sha256=1a2b3c4d...",
    },
    payload: {
      event: "video_screening.finalized",
      opportunity_id: "opp_49102",
      candidate_email: "elena.rostova@example.com",
      to_stage_id: "panel_onsite_round",
      hiring_rubric: {
        overall_rating: 4.8,
        dimensions: { technical: 96, communication: 95 },
      },
      feedback_note: "Job.Com AI screening passed with 95/100 score. Committee PDF generated.",
    },
  },
  ashby: {
    name: "Ashby Interview & Feedback API",
    endpoint: "https://api.ashbyhq.com/interview_feedback.submit",
    headers: {
      "Ashby-Api-Key": "ashby_live_891...",
      "Content-Type": "application/json",
    },
    payload: {
      event: "interviewRound.completed",
      candidateId: "ashby_c_7719",
      interviewStage: "Take-Home Video Screening",
      scorecard: {
        recommendation: "Definitely Yes",
        normalizedScore: 95,
        evaluator: "Job.Com Calibrated AI Rubric",
      },
      attachmentUrl: "https://storage.job.com/dossier/elena-rostova-summary.pdf",
    },
  },
  workday: {
    name: "Workday Human Capital Management",
    endpoint: "https://wd2-impl.workday.com/ccx/service/recruiting/v38.0",
    headers: {
      "SOAPAction": "Submit_Candidate_Assessment",
      "Content-Type": "application/xml",
    },
    payload: {
      event: "Assessment_Result_Update",
      applicant_reference: "WD_APP_55102",
      status: "ASSESSMENT_PASSED",
      assessment_score: "95.0",
      integration_status: "SYNCHRONIZED",
    },
  },
};

export default function HomePage() {
  const [jobs, setJobs] = useState<JobItem[]>(FALLBACK_JOBS);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedExpLevel, setSelectedExpLevel] = useState("ALL");
  const [demoTab, setDemoTab] = useState<"candidate" | "recruiter" | "ats">("candidate");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Candidate Sandbox State & Live Webcam
  const [demoSelectedQuestion, setDemoSelectedQuestion] = useState(0);
  const [demoRecordingState, setDemoRecordingState] = useState<"idle" | "requesting_camera" | "recording" | "review" | "analyzing" | "completed">("idle");
  const [demoSecondsLeft, setDemoSecondsLeft] = useState(30);
  const [demoRetakesUsed, setDemoRetakesUsed] = useState(0);
  const [demoCameraPermission, setDemoCameraPermission] = useState<"granted" | "denied" | "unsupported" | null>(null);
  const [demoCameraError, setDemoCameraError] = useState<string | null>(null);
  const [demoRecordedVideoUrl, setDemoRecordedVideoUrl] = useState<string | null>(null);
  const [demoAudioLevel, setDemoAudioLevel] = useState<number>(0);

  const demoMediaStreamRef = useRef<MediaStream | null>(null);
  const demoLiveVideoRef = useRef<HTMLVideoElement | null>(null);
  const demoRecordedVideoRef = useRef<HTMLVideoElement | null>(null);
  const demoMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const demoRecordedChunksRef = useRef<Blob[]>([]);
  const demoAudioContextRef = useRef<AudioContext | null>(null);
  const demoAnimFrameRef = useRef<number | null>(null);

  // Helper to release camera/mic resources cleanly
  const stopDemoMediaStream = () => {
    if (demoMediaStreamRef.current) {
      demoMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      demoMediaStreamRef.current = null;
    }
    if (demoAnimFrameRef.current) {
      cancelAnimationFrame(demoAnimFrameRef.current);
      clearInterval(demoAnimFrameRef.current);
      demoAnimFrameRef.current = null;
    }
    if (demoAudioContextRef.current) {
      demoAudioContextRef.current.close().catch(() => {});
      demoAudioContextRef.current = null;
    }
    setDemoAudioLevel(0);
  };

  // Sync live stream with video element whenever element is mounted
  useEffect(() => {
    if (demoLiveVideoRef.current && demoMediaStreamRef.current) {
      demoLiveVideoRef.current.srcObject = demoMediaStreamRef.current;
      demoLiveVideoRef.current.play().catch(() => {});
    }
  }, [demoRecordingState]);

  // Clean up media streams when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopDemoMediaStream();
      if (demoRecordedVideoUrl) {
        URL.revokeObjectURL(demoRecordedVideoUrl);
      }
    };
  }, []);

  // Recruiter Sandbox State
  const [demoCandidateIndex, setDemoCandidateIndex] = useState(0);
  const [demoRecruiterPlaying, setDemoRecruiterPlaying] = useState(false);
  const [demoRecruiterSpeed, setDemoRecruiterSpeed] = useState<"1.0x" | "1.25x" | "1.5x">("1.0x");
  const [demoActiveChapter, setDemoActiveChapter] = useState(0);
  const [demoDecisionStatus, setDemoDecisionStatus] = useState<string | null>(null);

  // ATS Webhook Sandbox State
  const [demoAtsProvider, setDemoAtsProvider] = useState<"greenhouse" | "lever" | "ashby" | "workday">("greenhouse");
  const [demoWebhookPingStatus, setDemoWebhookPingStatus] = useState<"idle" | "sending" | "success">("idle");

  // Candidate Sandbox Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (demoRecordingState === "recording") {
      timer = setInterval(() => {
        setDemoSecondsLeft((prev) => {
          if (prev <= 1) {
            // Stop recorder and finish
            if (demoMediaRecorderRef.current && demoMediaRecorderRef.current.state === "recording") {
              try {
                demoMediaRecorderRef.current.stop();
              } catch {}
            }
            stopDemoMediaStream();
            setDemoRecordingState("review");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [demoRecordingState]);

  const handleStartDemoRecording = async () => {
    setDemoCameraError(null);
    setDemoRecordingState("requesting_camera");

    // Request candidate permission for webcam and microphone
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: true,
        });

        demoMediaStreamRef.current = stream;
        setDemoCameraPermission("granted");

        // Attach stream to live video element
        if (demoLiveVideoRef.current) {
          demoLiveVideoRef.current.srcObject = stream;
          demoLiveVideoRef.current.play().catch(() => {});
        }

        // Setup real-time audio level visualizer
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          demoAudioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkAudio = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setDemoAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            demoAnimFrameRef.current = requestAnimationFrame(checkAudio);
          };
          checkAudio();
        } catch {
          // Audio visualizer fallback
        }

        // Initialize MediaRecorder to capture real video response
        demoRecordedChunksRef.current = [];
        try {
          const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
            ? "video/webm;codecs=vp8,opus"
            : "video/webm";
          const recorder = new MediaRecorder(stream, { mimeType: mime });
          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              demoRecordedChunksRef.current.push(event.data);
            }
          };
          recorder.onstop = () => {
            if (demoRecordedChunksRef.current.length > 0) {
              const blob = new Blob(demoRecordedChunksRef.current, { type: "video/webm" });
              const url = URL.createObjectURL(blob);
              setDemoRecordedVideoUrl(url);
            }
          };
          demoMediaRecorderRef.current = recorder;
          recorder.start(500);
        } catch (recErr) {
          console.warn("MediaRecorder start failed, proceeding with stream view:", recErr);
        }

        setDemoSecondsLeft(30);
        setDemoRecordingState("recording");
      } catch (err: any) {
        console.warn("Camera permission error:", err);
        setDemoCameraPermission("denied");
        setDemoRecordingState("idle");
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setDemoCameraError(
            "Camera and Microphone permission was denied. Please click the lock or camera icon in your browser address bar, set Camera & Microphone to 'Allow', then click 'Start 30s Practice Recording' again."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setDemoCameraError(
            "No webcam or microphone was detected on this device. Please connect a camera or verify your hardware settings."
          );
        } else {
          setDemoCameraError(
            `Camera error (${err.name || "Access Denied"}). Ensure no other application is using your webcam and that you are using HTTPS or localhost.`
          );
        }
      }
    } else {
      setDemoCameraPermission("unsupported");
      setDemoRecordingState("idle");
      setDemoCameraError(
        "Your browser or connection does not support camera access. Note that remote testing requires HTTPS."
      );
    }
  };

  const handleStartSimulatedDemoRecording = () => {
    stopDemoMediaStream();
    setDemoCameraError(null);
    setDemoSecondsLeft(30);
    setDemoRecordingState("recording");

    // Synthetic audio level modulation for simulated mode
    const interval = setInterval(() => {
      setDemoAudioLevel(Math.floor(Math.random() * 50) + 25);
    }, 150);
    demoAnimFrameRef.current = interval as unknown as number;
  };

  const handleStopDemoRecording = () => {
    if (demoMediaRecorderRef.current && demoMediaRecorderRef.current.state === "recording") {
      try {
        demoMediaRecorderRef.current.stop();
      } catch {}
    }
    stopDemoMediaStream();
    setDemoRecordingState("review");
  };

  const handleUseDemoRetake = () => {
    if (demoRetakesUsed < 1) {
      setDemoRetakesUsed((prev) => prev + 1);
      if (demoRecordedVideoUrl) {
        URL.revokeObjectURL(demoRecordedVideoUrl);
        setDemoRecordedVideoUrl(null);
      }
      handleStartDemoRecording();
    }
  };

  const handleSubmitDemoRecording = () => {
    setDemoRecordingState("analyzing");
    setTimeout(() => {
      setDemoRecordingState("completed");
    }, 1200);
  };

  const handleResetDemo = () => {
    stopDemoMediaStream();
    if (demoRecordedVideoUrl) {
      URL.revokeObjectURL(demoRecordedVideoUrl);
      setDemoRecordedVideoUrl(null);
    }
    setDemoRecordingState("idle");
    setDemoSecondsLeft(30);
    setDemoCameraError(null);
  };

  const handleSendWebhookPing = () => {
    setDemoWebhookPingStatus("sending");
    setTimeout(() => {
      setDemoWebhookPingStatus("success");
      setTimeout(() => setDemoWebhookPingStatus("idle"), 4000);
    }, 600);
  };

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

  const fillSampleInquiry = (type: "candidate" | "ats" | "rubric") => {
    setContactSent(false);
    if (type === "candidate") {
      setContactName("Elena Rostova");
      setContactEmail("elena.rostova@example.com");
      setContactMessage("Hi Job.Com support, I noticed my webcam permissions were reset in Chrome on Mac. How can I ensure my microphone is calibrated before Question 2?");
    } else if (type === "ats") {
      setContactName("David Chen (VP Talent)");
      setContactEmail("d.chen@apextechnologies.io");
      setContactMessage("We run 150+ engineering interviews a month and want to connect Job.Com's async video screening directly into our Greenhouse ATS. What does enterprise onboarding look like?");
    } else {
      setContactName("Maya Patel (Head of People)");
      setContactEmail("maya@scaleinnovations.com");
      setContactMessage("Can we configure custom AI rubric criteria for staff-level systems design interviews with 3-minute video time limits and export printable PDF summaries for our committee?");
    }
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

  // Filter jobs by search, department, and experience level
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      (job.tags && job.tags.some((t) => t.toLowerCase().includes(query))) ||
      job.description.toLowerCase().includes(query);

    const matchesDept =
      selectedDept === "ALL" ||
      job.department.toLowerCase().includes(selectedDept.toLowerCase());

    const titleAndType = `${job.title} ${job.type} ${job.description}`.toLowerCase();
    const matchesExp =
      selectedExpLevel === "ALL" ||
      (selectedExpLevel === "Fresher" && (
        titleAndType.includes("fresher") ||
        titleAndType.includes("graduate") ||
        titleAndType.includes("entry") ||
        titleAndType.includes("junior") ||
        titleAndType.includes("trainee") ||
        (job.tags && job.tags.some((t) => t.toLowerCase().includes("fresher") || t.toLowerCase().includes("graduate")))
      )) ||
      (selectedExpLevel === "Mid-Level" && (
        titleAndType.includes("mid") ||
        titleAndType.includes("specialist") ||
        titleAndType.includes("coordinator")
      )) ||
      (selectedExpLevel === "Senior" && (
        titleAndType.includes("senior") ||
        titleAndType.includes("lead") ||
        titleAndType.includes("principal") ||
        titleAndType.includes("director") ||
        titleAndType.includes("executive") ||
        titleAndType.includes("head") ||
        (job.tags && job.tags.some((t) => t.toLowerCase().includes("senior") || t.toLowerCase().includes("cpa")))
      ));

    return matchesQuery && matchesDept && matchesExp;
  });

  const departments = [
    "ALL",
    "Accounting & Finance",
    "Logistics & Supply Chain",
    "Mechanical & Manufacturing",
    "Pharma & Healthcare",
    "Technology & IT",
    "Sales, Operations & HR",
  ];

  const experienceLevels = [
    { id: "ALL", label: "All Experience Levels" },
    { id: "Fresher", label: "🎓 Freshers / Entry-Level (0-1 yrs)" },
    { id: "Mid-Level", label: "⚡ Mid-Level (2-5 yrs)" },
    { id: "Senior", label: "⭐ Senior & Leadership (5+ yrs)" },
  ];

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
          maxWidth: "1520px",
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
            Multi-Industry Video Interview Platform · Freshers to Executives
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
          <span>Video Interviews Across All Industries</span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--muted)",
            maxWidth: "920px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Designed for hiring teams across Accounting, Logistics, Mechanical Engineering, Pharmaceuticals, Healthcare, and Technology. Objective, anti-cheat video evaluations built for university freshers and seasoned executives alike.
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
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            maxWidth: "1520px",
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
              <Sparkles size={16} color="var(--accent)" />
              <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                All Industry Verticals
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Dedicated rubrics for Accounting, Logistics, Mechanical, Pharma, IT, and HR.
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
              <Users size={16} color="var(--accent)" />
              <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Freshers to Executives
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Calibrated evaluation depth from university entry-level through principal leadership.
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
              <Clock size={16} color="var(--accent)" />
              <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Server-Enforced Timers
              </h3>
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
              <h3 className="font-serif" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Controlled Retake Quotas
              </h3>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Recruiters set fixed retake allowances per question for natural, authentic responses.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Section (Demo Hub) */}
      <section
        id="demo"
        style={{
          maxWidth: "1520px",
          margin: "12px auto 44px",
          padding: "0 24px",
          scrollMarginTop: "80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Eyebrow>INTERACTIVE DEMO PLAYGROUND</Eyebrow>
          <h2
            className="font-serif tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              fontWeight: 600,
              color: "var(--ink)",
              margin: "6px 0 12px",
              lineHeight: 1.2,
            }}
          >
            Experience Job.Com in Real Time
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1rem",
              maxWidth: "660px",
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            Test our tamper-proof video screening room as an applicant, evaluate submissions with AI rubrics as a hiring manager, or simulate enterprise ATS webhook event streaming.
          </p>

          {/* 3-Way Tab Switcher */}
          <div
            style={{
              display: "inline-flex",
              padding: "4px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              gap: "4px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                setDemoTab("candidate");
                setDemoDecisionStatus(null);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: demoTab === "candidate" ? "var(--ink)" : "transparent",
                color: demoTab === "candidate" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Video size={15} />
              Candidate Sandbox
            </button>
            <button
              onClick={() => {
                setDemoTab("recruiter");
                setDemoDecisionStatus(null);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: demoTab === "recruiter" ? "var(--ink)" : "transparent",
                color: demoTab === "recruiter" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={15} />
              Recruiter Evaluation Desk
            </button>
            <button
              onClick={() => {
                setDemoTab("ats");
                setDemoDecisionStatus(null);
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: demoTab === "ats" ? "var(--ink)" : "transparent",
                color: demoTab === "ats" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Terminal size={15} />
              ATS Webhook Pipeline
            </button>
          </div>
        </div>

        {/* Tab 1: Candidate Sandbox */}
        {demoTab === "candidate" && (
          <Card
            style={{
              padding: "32px",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              backgroundColor: "var(--paper)",
            }}
          >
            {/* Question Selector Bar */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Select Assessment Prompt:
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <StatusPill variant="good">
                    {DEMO_QUESTIONS[demoSelectedQuestion].difficulty}
                  </StatusPill>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    1 Retake Allowed
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {DEMO_QUESTIONS.map((q, idx) => (
                  <button
                    key={q.title}
                    onClick={() => {
                      setDemoSelectedQuestion(idx);
                      handleResetDemo();
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "7px",
                      border: demoSelectedQuestion === idx ? "1px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: demoSelectedQuestion === idx ? "var(--accent-soft)" : "var(--surface)",
                      color: demoSelectedQuestion === idx ? "var(--accent)" : "var(--ink)",
                      fontSize: "0.8125rem",
                      fontWeight: demoSelectedQuestion === idx ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Q{idx + 1}: {q.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Screen */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "28px",
                alignItems: "start",
              }}
            >
              {/* Left: Prompt & Real-Time Assessment Guidance */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ACTIVE QUESTION #{demoSelectedQuestion + 1} OF 3
                  </span>
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: "0 0 14px",
                    lineHeight: 1.4,
                  }}
                >
                  {DEMO_QUESTIONS[demoSelectedQuestion].prompt}
                </h3>

                <div
                  style={{
                    padding: "12px 14px",
                    backgroundColor: "var(--surface)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Sparkles size={13} color="var(--accent)" /> Rubric Evaluation Hint:
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                    {DEMO_QUESTIONS[demoSelectedQuestion].tip}
                  </p>
                </div>

                {/* Candidate Guarantees List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8125rem", color: "var(--muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={14} color="var(--accent)" />
                    <span>Server-enforced deadline ({DEMO_QUESTIONS[demoSelectedQuestion].timeLimit}s max window)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <RotateCcw size={14} color="var(--accent)" />
                    <span>Attempt quota: {demoRetakesUsed === 0 ? "1 retake remaining" : "0 retakes remaining (quota used)"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={14} color="var(--accent)" />
                    <span>Cryptographic session receipt issued upon completion</span>
                  </div>
                </div>

                <div style={{ marginTop: "24px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <Link
                    href="/interview/demo-candidate-1"
                    className="ds-btn-secondary"
                    style={{ padding: "8px 16px", fontSize: "0.8125rem", textDecoration: "none" }}
                  >
                    <ExternalLink size={13} /> Open Fullscreen Candidate Room
                  </Link>
                </div>
              </div>

              {/* Right: Live Interactive Video & Audio Simulator */}
              <div
                style={{
                  backgroundColor: "#111111",
                  borderRadius: "12px",
                  padding: "20px",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
              >
                {/* Header Status Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    paddingBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {demoRecordingState === "recording" ? (
                      <>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            boxShadow: "0 0 8px #ef4444",
                          }}
                        />
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", letterSpacing: "0.05em" }}>
                          REC IN PROGRESS
                        </span>
                      </>
                    ) : demoRecordingState === "analyzing" ? (
                      <>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#60a5fa" }}>
                          AI EVALUATING...
                        </span>
                      </>
                    ) : demoRecordingState === "completed" ? (
                      <>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10b981" }}>
                          EVALUATION COMPLETE
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#9ca3af" }}>
                          CAMERA STANDBY
                        </span>
                      </>
                    )}
                  </div>

                  {/* Monospace Countdown Timer */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: demoSecondsLeft <= 10 && demoRecordingState === "recording" ? "#ef4444" : "#fbbf24",
                      backgroundColor: "rgba(251, 191, 36, 0.12)",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontVariantNumeric: "tabular-nums",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock size={12} />
                    00:{demoSecondsLeft < 10 ? `0${demoSecondsLeft}` : demoSecondsLeft} / 00:30
                  </div>
                </div>

                {/* Simulated Camera Canvas / Viewport */}
                {demoRecordingState === "completed" ? (
                  /* Completed State: Rich AI Rubric Result Card */
                  <div
                    style={{
                      backgroundColor: "#1a1a1a",
                      borderRadius: "8px",
                      padding: "18px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "0.6875rem", color: "#9ca3af", textTransform: "uppercase" }}>
                          AI Rubric Overall Assessment
                        </div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff" }}>
                          {DEMO_QUESTIONS[demoSelectedQuestion].score} / 100 · Strong Hire
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          color: "#34d399",
                        }}
                      >
                        PASS · ROUND 2
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#d1d5db" }}>
                        <span>Technical Depth &amp; Architecture</span>
                        <span style={{ fontWeight: 600, color: "#34d399" }}>{DEMO_QUESTIONS[demoSelectedQuestion].scores.technical}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#2e2e2e", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: `${DEMO_QUESTIONS[demoSelectedQuestion].scores.technical}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "9999px" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#d1d5db" }}>
                        <span>Failure Mode &amp; Resilience</span>
                        <span style={{ fontWeight: 600, color: "#34d399" }}>{DEMO_QUESTIONS[demoSelectedQuestion].scores.resilience}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#2e2e2e", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: `${DEMO_QUESTIONS[demoSelectedQuestion].scores.resilience}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "9999px" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#d1d5db" }}>
                        <span>Communication &amp; Articulation</span>
                        <span style={{ fontWeight: 600, color: "#34d399" }}>{DEMO_QUESTIONS[demoSelectedQuestion].scores.clarity}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: "#2e2e2e", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: `${DEMO_QUESTIONS[demoSelectedQuestion].scores.clarity}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "9999px" }} />
                      </div>
                    </div>

                    <p style={{ fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.45, margin: "0 0 14px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
                      &quot;{DEMO_QUESTIONS[demoSelectedQuestion].sampleSynthesis}&quot;
                    </p>

                    <button
                      onClick={handleResetDemo}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backgroundColor: "#2a2a2a",
                        color: "#ffffff",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <RotateCw size={13} /> Reset Simulation / Test Another Prompt
                    </button>
                  </div>
                ) : demoRecordingState === "analyzing" ? (
                  /* Analyzing State */
                  <div
                    style={{
                      height: "170px",
                      borderRadius: "8px",
                      backgroundColor: "#191919",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    <Sparkles size={28} color="var(--accent)" className="animate-spin" />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff", marginBottom: "4px" }}>
                        Calibrating AI Rubric...
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                        Analyzing speech cadence, keyword density, and distributed architecture trade-offs.
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Idle, Requesting Camera, Recording, or Review Canvas */
                  <div>
                    {/* Camera Permission / Device Error Banner */}
                    {demoCameraError && (
                      <div
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.35)",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <ShieldAlert size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#fca5a5", marginBottom: "4px" }}>
                            Camera &amp; Microphone Permission Required
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#d1d5db", lineHeight: 1.45, marginBottom: "8px" }}>
                            {demoCameraError}
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              onClick={handleStartDemoRecording}
                              style={{
                                padding: "5px 12px",
                                borderRadius: "5px",
                                border: "none",
                                backgroundColor: "var(--accent)",
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <RotateCcw size={12} /> Retry Permission
                            </button>
                            <button
                              onClick={handleStartSimulatedDemoRecording}
                              style={{
                                padding: "5px 12px",
                                borderRadius: "5px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                backgroundColor: "#262626",
                                color: "#d1d5db",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              Test with Simulated Video
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Main Video Viewport Container */}
                    <div
                      style={{
                        height: "230px",
                        borderRadius: "10px",
                        backgroundColor: "#0d0d0d",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.12)",
                        marginBottom: "14px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {demoRecordingState === "requesting_camera" ? (
                        /* Requesting Permission State */
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "20px",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(37, 99, 235, 0.15)",
                              border: "1px solid rgba(37, 99, 235, 0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              animation: "pulse 1.5s infinite",
                            }}
                          >
                            <Camera size={24} color="#60a5fa" />
                          </div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                            Requesting Webcam &amp; Microphone Permission
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#9ca3af", maxWidth: "340px", lineHeight: 1.45 }}>
                            Please click <strong>&quot;Allow&quot;</strong> on the browser pop-up prompt in the upper-left of your window to activate your webcam.
                          </div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: "rgba(255,255,255,0.06)",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              fontSize: "0.6875rem",
                              color: "#60a5fa",
                              marginTop: "4px",
                            }}
                          >
                            <Lock size={11} /> Secure In-Browser MediaStream
                          </div>
                        </div>
                      ) : demoRecordingState === "recording" ? (
                        /* Active Live Recording Viewport */
                        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#000000" }}>
                          {demoMediaStreamRef.current ? (
                            <video
                              ref={(el) => {
                                demoLiveVideoRef.current = el;
                                if (el && demoMediaStreamRef.current && el.srcObject !== demoMediaStreamRef.current) {
                                  el.srcObject = demoMediaStreamRef.current;
                                  el.play().catch(() => {});
                                }
                              }}
                              autoPlay
                              playsInline
                              muted
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transform: "scaleX(-1)", // Mirror image for candidate
                                display: "block",
                              }}
                            />
                          ) : (
                            /* Simulated Stream Canvas if running simulated */
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#111827",
                                gap: "10px",
                              }}
                            >
                              <Video size={36} color="#3b82f6" />
                              <span style={{ fontSize: "0.8125rem", color: "#93c5fd", fontWeight: 500 }}>
                                Simulated Webcam Feed Active
                              </span>
                              {/* Animated Soundwave */}
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "30px" }}>
                                {[35, 65, 85, 45, 95, 75, 40, 60, 90, 50, 70, 30].map((h, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      width: "4px",
                                      height: `${h}%`,
                                      backgroundColor: "var(--accent)",
                                      borderRadius: "2px",
                                      animation: `pulse 0.6s ease-in-out infinite alternate ${i * 0.05}s`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Top Overlay Badge Bar */}
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              right: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pointerEvents: "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "rgba(239, 68, 68, 0.9)",
                                color: "#ffffff",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                              }}
                            >
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ffffff",
                                  animation: "pulse 1s infinite",
                                }}
                              />
                              LIVE REC · 00:{demoSecondsLeft < 10 ? `0${demoSecondsLeft}` : demoSecondsLeft}
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "#e5e7eb",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "0.6875rem",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <Video size={11} color="#10b981" /> HD 720p · 30fps
                            </div>
                          </div>

                          {/* Bottom Overlay Badge Bar (Live Audio Meter) */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              left: "10px",
                              right: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pointerEvents: "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "rgba(0, 0, 0, 0.75)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                padding: "4px 10px",
                                borderRadius: "6px",
                              }}
                            >
                              <Mic size={12} color={demoAudioLevel > 15 ? "#10b981" : "#9ca3af"} />
                              <div
                                style={{
                                  width: "60px",
                                  height: "6px",
                                  backgroundColor: "rgba(255,255,255,0.2)",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${Math.max(10, Math.min(100, demoAudioLevel))}%`,
                                    height: "100%",
                                    backgroundColor: demoAudioLevel > 75 ? "#ef4444" : "#10b981",
                                    transition: "width 0.1s ease",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "0.6875rem", color: "#d1d5db", fontVariantNumeric: "tabular-nums" }}>
                                Mic {demoAudioLevel}%
                              </span>
                            </div>

                            <div
                              style={{
                                backgroundColor: "rgba(0,0,0,0.75)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "#9ca3af",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontSize: "0.6875rem",
                              }}
                            >
                              Auto-stops at 0s
                            </div>
                          </div>
                        </div>
                      ) : demoRecordingState === "review" ? (
                        /* Review State: Real Video Playback or Synthesis */
                        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#000000" }}>
                          {demoRecordedVideoUrl ? (
                            <video
                              ref={demoRecordedVideoRef}
                              src={demoRecordedVideoUrl}
                              controls
                              autoPlay
                              playsInline
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "16px",
                                textAlign: "center",
                              }}
                            >
                              <CheckCircle2 size={36} color="#10b981" style={{ marginBottom: "8px" }} />
                              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                                30s Practice Response Captured
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>
                                Ready to transmit to Job.Com Calibrated AI Rubric
                              </span>
                            </div>
                          )}
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              backgroundColor: "rgba(16, 185, 129, 0.9)",
                              color: "#ffffff",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              pointerEvents: "none",
                            }}
                          >
                            Recorded Response (Review Mode)
                          </div>
                        </div>
                      ) : (
                        /* Idle State Standby */
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(255,255,255,0.05)",
                              border: "1px dashed rgba(255,255,255,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <Camera size={22} color="#9ca3af" />
                          </div>
                          <span style={{ fontSize: "0.875rem", color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>
                            Live Webcam &amp; Mic Practice Standby
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#9ca3af", maxWidth: "340px", lineHeight: 1.45, marginBottom: "12px" }}>
                            Clicking below will prompt your browser to request webcam &amp; microphone permission for candidate recording.
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                            <span style={{ fontSize: "0.6875rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                              <ShieldCheck size={12} color="#10b981" /> 100% In-Browser Privacy
                            </span>
                            <span style={{ fontSize: "0.6875rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Clock size={12} color="#3b82f6" /> 30s Max Timer
                            </span>
                            <span style={{ fontSize: "0.6875rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
                              <RotateCcw size={12} color="#f59e0b" /> 1 Free Retake
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {demoRecordingState === "requesting_camera" && (
                        <button
                          disabled
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "7px",
                            border: "none",
                            backgroundColor: "#3b82f6",
                            color: "#ffffff",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            opacity: 0.85,
                            cursor: "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <Sparkles size={14} className="animate-spin" /> Waiting for Candidate Permission...
                        </button>
                      )}

                      {demoRecordingState === "idle" && (
                        <button
                          onClick={handleStartDemoRecording}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "7px",
                            border: "none",
                            backgroundColor: "var(--accent)",
                            color: "#ffffff",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <Play size={14} fill="#ffffff" /> Start 30s Practice Recording
                        </button>
                      )}

                      {demoRecordingState === "recording" && (
                        <>
                          <button
                            onClick={handleStopDemoRecording}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "7px",
                              border: "none",
                              backgroundColor: "#ef4444",
                              color: "#ffffff",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <Pause size={14} /> Stop &amp; Review
                          </button>
                          {demoRetakesUsed < 1 && (
                            <button
                              onClick={handleUseDemoRetake}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "7px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                backgroundColor: "#262626",
                                color: "#ffffff",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <RotateCcw size={13} /> Retake (1 left)
                            </button>
                          )}
                        </>
                      )}

                      {demoRecordingState === "review" && (
                        <>
                          <button
                            onClick={handleSubmitDemoRecording}
                            style={{
                              flex: 1,
                              padding: "10px",
                              borderRadius: "7px",
                              border: "none",
                              backgroundColor: "var(--accent)",
                              color: "#ffffff",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            <Sparkles size={14} /> Submit to AI Evaluation Rubric
                          </button>
                          {demoRetakesUsed < 1 ? (
                            <button
                              onClick={handleUseDemoRetake}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "7px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                backgroundColor: "#262626",
                                color: "#ffffff",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <RotateCcw size={13} /> Re-record (1 left)
                            </button>
                          ) : (
                            <button
                              onClick={handleResetDemo}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "7px",
                                border: "1px solid rgba(255,255,255,0.2)",
                                backgroundColor: "#262626",
                                color: "#ffffff",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Reset
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Tab 2: Recruiter Evaluation Desk */}
        {demoTab === "recruiter" && (
          <Card
            style={{
              padding: "32px",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              backgroundColor: "var(--paper)",
            }}
          >
            {/* Candidate Selector Switcher */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Applicant Evaluation Queue:
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  3 candidate screenings ready for committee review
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                {DEMO_CANDIDATES.map((cand, idx) => (
                  <button
                    key={cand.name}
                    onClick={() => {
                      setDemoCandidateIndex(idx);
                      setDemoActiveChapter(0);
                      setDemoDecisionStatus(null);
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: demoCandidateIndex === idx ? "2px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: demoCandidateIndex === idx ? "var(--accent-soft)" : "var(--surface)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)" }}>{cand.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{cand.role}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          color: "var(--accent)",
                          display: "block",
                        }}
                      >
                        {cand.score}%
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "var(--muted)" }}>{cand.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Decision Confirmation Toast if triggered */}
            {demoDecisionStatus && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#065f46",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>{demoDecisionStatus}</span>
                </div>
                <button
                  onClick={() => setDemoDecisionStatus(null)}
                  style={{ background: "none", border: "none", color: "#065f46", cursor: "pointer", fontSize: "0.75rem" }}
                >
                  ✕ Dismiss
                </button>
              </div>
            )}

            {/* Candidate Review Workspace Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "28px",
                alignItems: "start",
              }}
            >
              {/* Left Column: Simulated Video Player & Transcript */}
              <div>
                <div
                  style={{
                    backgroundColor: "#121212",
                    borderRadius: "10px",
                    padding: "18px",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                        {DEMO_CANDIDATES[demoCandidateIndex].name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                        Question 1 of 3: Technical Architecture
                      </div>
                    </div>
                    <span style={{ fontSize: "0.6875rem", padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.1)", color: "#e5e7eb" }}>
                      HD 1080p · WebM
                    </span>
                  </div>

                  {/* Simulated Screen with Play button */}
                  <div
                    style={{
                      height: "140px",
                      borderRadius: "6px",
                      backgroundColor: "#1e1e1e",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.06)",
                      marginBottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => setDemoRecruiterPlaying(!demoRecruiterPlaying)}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: demoRecruiterPlaying ? "#ef4444" : "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {demoRecruiterPlaying ? <Pause size={18} fill="#ffffff" color="#ffffff" /> : <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: "2px" }} />}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {demoRecruiterPlaying ? "Streaming Video Recording (Click to Pause)" : "Click to Play Candidate Video Stream"}
                    </span>
                  </div>

                  {/* Playback Controls & Speed Toggle */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#9ca3af" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Volume2 size={14} color="#9ca3af" />
                      <span>{DEMO_CANDIDATES[demoCandidateIndex].chapters[demoActiveChapter].time} / {DEMO_CANDIDATES[demoCandidateIndex].duration}</span>
                    </div>

                    <div style={{ display: "flex", gap: "4px" }}>
                      {(["1.0x", "1.25x", "1.5x"] as const).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setDemoRecruiterSpeed(spd)}
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: demoRecruiterSpeed === spd ? "var(--accent)" : "rgba(255,255,255,0.1)",
                            color: demoRecruiterSpeed === spd ? "#ffffff" : "#9ca3af",
                            fontSize: "0.6875rem",
                            cursor: "pointer",
                          }}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chapter Bookmarks */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Jump to Key Timestamp Bookmarks:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {DEMO_CANDIDATES[demoCandidateIndex].chapters.map((ch, idx) => (
                      <button
                        key={ch.time}
                        onClick={() => setDemoActiveChapter(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: demoActiveChapter === idx ? "1px solid var(--accent)" : "1px solid var(--border)",
                          backgroundColor: demoActiveChapter === idx ? "var(--accent-soft)" : "var(--surface)",
                          fontSize: "0.75rem",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--ink)",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)" }}>{ch.time}</span>
                        <span>{ch.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Synchronized Live Transcript Snippet */}
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "var(--surface)",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.8125rem",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                    Synchronized Transcript:
                  </div>
                  <p style={{ margin: 0, fontStyle: "italic", color: "var(--ink)" }}>
                    {DEMO_CANDIDATES[demoCandidateIndex].transcript}
                  </p>
                </div>
              </div>

              {/* Right Column: AI Rubric Breakdown & Decision Actions */}
              <div>
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid var(--border)",
                    marginBottom: "18px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>
                        Calibrated AI Assessment
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)" }}>
                        {DEMO_CANDIDATES[demoCandidateIndex].score} / 100
                      </div>
                    </div>
                    <StatusPill variant="good">
                      {DEMO_CANDIDATES[demoCandidateIndex].recommendation}
                    </StatusPill>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {DEMO_CANDIDATES[demoCandidateIndex].rubric.map((r) => (
                      <ScoreBar key={r.label} label={r.label} score={r.score} />
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--ink)", marginBottom: "8px", textTransform: "uppercase" }}>
                      Key Strengths &amp; Observations:
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8125rem", color: "var(--muted)" }}>
                      {DEMO_CANDIDATES[demoCandidateIndex].highlights.map((h, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                          <Check size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: "14px", padding: "10px", backgroundColor: "var(--paper)", borderRadius: "6px", border: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--ink)" }}>
                    <span style={{ fontWeight: 600, color: "var(--accent)" }}>Round 2 Suggestion: </span>
                    {DEMO_CANDIDATES[demoCandidateIndex].probe}
                  </div>
                </div>

                {/* Recruiter 1-Click Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button
                    onClick={() => setDemoDecisionStatus(`Candidate ${DEMO_CANDIDATES[demoCandidateIndex].name} advanced to Round 2 (Panel Interview)`)}
                    className="ds-btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.875rem", cursor: "pointer" }}
                  >
                    <CheckCircle2 size={15} /> Advance {DEMO_CANDIDATES[demoCandidateIndex].name.split(" ")[0]} to Round 2
                  </button>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setDemoDecisionStatus(`Evaluation summary PDF dossier generated for ${DEMO_CANDIDATES[demoCandidateIndex].name}`)}
                      className="ds-btn-secondary"
                      style={{ flex: 1, justifyContent: "center", padding: "9px", fontSize: "0.8125rem", cursor: "pointer" }}
                    >
                      <FileText size={14} /> Export PDF Dossier
                    </button>
                    <Link
                      href="/recruiter"
                      className="ds-btn-secondary"
                      style={{ flex: 1, justifyContent: "center", padding: "9px", fontSize: "0.8125rem", textDecoration: "none" }}
                    >
                      <Users size={14} /> Full Recruiter Desk →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: ATS Webhook Pipeline */}
        {demoTab === "ats" && (
          <Card
            style={{
              padding: "32px",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              backgroundColor: "var(--paper)",
            }}
          >
            {/* ATS Switcher */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Connected ATS Platform:
                  </span>
                </div>
                <StatusPill variant="good">
                  Webhook Event: screening.completed
                </StatusPill>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(["greenhouse", "lever", "ashby", "workday"] as const).map((prov) => (
                  <button
                    key={prov}
                    onClick={() => {
                      setDemoAtsProvider(prov);
                      setDemoWebhookPingStatus("idle");
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "7px",
                      border: demoAtsProvider === prov ? "1px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: demoAtsProvider === prov ? "var(--accent-soft)" : "var(--surface)",
                      color: demoAtsProvider === prov ? "var(--accent)" : "var(--ink)",
                      fontSize: "0.8125rem",
                      fontWeight: demoAtsProvider === prov ? 700 : 500,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {prov === "greenhouse" ? "Greenhouse" : prov === "lever" ? "Lever" : prov === "ashby" ? "Ashby" : "Workday"}
                  </button>
                ))}
              </div>
            </div>

            {/* Webhook Endpoint & JSON Payload Box */}
            <div
              style={{
                backgroundColor: "#111111",
                borderRadius: "10px",
                padding: "20px",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                marginBottom: "20px",
                overflowX: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>POST</span>
                  <span style={{ color: "#9ca3af" }}>{ATS_PREVIEWS[demoAtsProvider].endpoint}</span>
                </div>
                <span style={{ fontSize: "0.6875rem", color: "#9ca3af" }}>HTTPS / JSON</span>
              </div>

              <pre style={{ margin: 0, color: "#d1d5db", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(ATS_PREVIEWS[demoAtsProvider].payload, null, 2)}
              </pre>
            </div>

            {/* Test Webhook Button & Simulated Response */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                Payloads are cryptographically signed with HMAC-SHA256 headers for enterprise audit compliance.
              </div>

              <button
                onClick={handleSendWebhookPing}
                disabled={demoWebhookPingStatus === "sending"}
                className="ds-btn-primary"
                style={{ padding: "9px 20px", fontSize: "0.875rem", cursor: "pointer" }}
              >
                {demoWebhookPingStatus === "sending" ? (
                  <>
                    <Sparkles size={14} className="animate-spin" /> Dispatching HTTP POST...
                  </>
                ) : demoWebhookPingStatus === "success" ? (
                  <>
                    <CheckCircle2 size={14} color="#10b981" /> HTTP 200 OK (38ms)
                  </>
                ) : (
                  <>
                    <Send size={14} /> Send Test Webhook Ping
                  </>
                )}
              </button>
            </div>

            {demoWebhookPingStatus === "success" && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#065f46",
                  fontSize: "0.8125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CheckCircle2 size={16} color="#059669" />
                <span>
                  <strong>Webhook Delivered Successfully!</strong> Response code: <code>200 OK</code>. Candidate Elena Rostova synchronized to {ATS_PREVIEWS[demoAtsProvider].name} in 38ms.
                </span>
              </div>
            )}
          </Card>
        )}

        {/* 3-Step Walkthrough: How Job.Com Works */}
        <div style={{ marginTop: "44px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              STREAMLINED HIRING WORKFLOW
            </span>
            <h2 className="font-serif" style={{ fontSize: "1.75rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 0" }}>
              How Job.Com Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", letterSpacing: "0.06em" }}>01 / CONFIGURE</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Post Role & Custom Questions
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Recruiters craft position-calibrated prompts, set strict answer timers (e.g. 90s - 180s), and specify retake quotas.
              </p>
            </div>

            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", letterSpacing: "0.06em" }}>02 / RECORD</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                On-Demand Video Screening
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Applicants take the screening room whenever ready. Camera check, server timers, and sequential question order ensure fairness.
              </p>
            </div>

            <div style={{ padding: "22px", backgroundColor: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", letterSpacing: "0.06em" }}>03 / DECIDE</div>
              <h4 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                AI Rubrics & Shortlisting
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Hiring managers review persistent recordings, scorecards, and move candidates to Round 2 with 1-click status transitions.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Configured Demo Scenarios Grid */}
        <div style={{ marginTop: "44px", borderTop: "1px solid var(--border)", paddingTop: "36px" }}>
          <div style={{ textAlign: "center", marginBottom: "22px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              INTERACTIVE DEMO SANDBOX
            </span>
            <h3 className="font-serif" style={{ fontSize: "1.6rem", fontWeight: 600, color: "var(--ink)", margin: "4px 0 0" }}>
              Explore Pre-Configured Demo Sessions
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "6px" }}>
              Test both sides of Job.Com: experience live candidate video screening or evaluate submissions as a hiring manager.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
            {/* Demo 1 */}
            <Card style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>DEMO 01 · CANDIDATE</span>
                  <StatusPill variant="good">Live Camera</StatusPill>
                </div>
                <h4 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Alex Mercer (Live Screen)
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px" }}>
                  Principal AI Architect · 3 Questions
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Live webcam feed, real-time microphone volume visualizer, and server-enforced countdown timer.
                </p>
              </div>
              <Link
                href="/interview/demo-candidate-1"
                className="ds-btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "0.8125rem", marginTop: "16px", textDecoration: "none" }}
              >
                <Play size={13} fill="#ffffff" /> Launch Candidate Demo
              </Link>
            </Card>

            {/* Demo 2 */}
            <Card style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>DEMO 02 · RECRUITER</span>
                  <StatusPill variant="good">Score 94%</StatusPill>
                </div>
                <h4 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Elena Rostova (Review)
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px" }}>
                  Senior Full-Stack Architect · Video Ready
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Stream recorded video responses, inspect automated rubric scorebars, and export committee PDF summary.
                </p>
              </div>
              <Link
                href="/recruiter"
                className="ds-btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "0.8125rem", marginTop: "16px", textDecoration: "none" }}
              >
                <Sparkles size={13} color="var(--accent)" /> Open Review Desk Demo
              </Link>
            </Card>

            {/* Demo 3 */}
            <Card style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>DEMO 03 · PORTAL</span>
                  <StatusPill variant="neutral">Stage Tracker</StatusPill>
                </div>
                <h4 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Candidate Tracking Portal
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px" }}>
                  Self-Service Dashboard · alex.mercer
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Inspect the 4-stage application progress stepper: Applied → Video Screening → Review → Decision.
                </p>
              </div>
              <Link
                href="/candidate/dashboard?email=alex.mercer@example.com"
                className="ds-btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "0.8125rem", marginTop: "16px", textDecoration: "none" }}
              >
                <Users size={13} /> View Portal Demo
              </Link>
            </Card>

            {/* Demo 4 */}
            <Card style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em" }}>DEMO 04 · SECURITY</span>
                  <StatusPill variant="neutral">Anti-Tamper</StatusPill>
                </div>
                <h4 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Anti-Tamper Engine Audit
                </h4>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px" }}>
                  Server Timestamp Authority · Retakes
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Inspect technical specifications: server deadline authority, sequential question locks, and cloud uploads.
                </p>
              </div>
              <Link
                href="/specs"
                className="ds-btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "0.8125rem", marginTop: "16px", textDecoration: "none" }}
              >
                <ShieldCheck size={13} color="var(--accent)" /> View Technical Audit
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Screening Rooms Banner (If candidate has applied previously) */}
      {savedApplications.length > 0 && (
        <section
          style={{
            maxWidth: "1520px",
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
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.06em" }}>
                  ACTIVE INTERVIEW SESSION FOUND
                </div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>
                  {savedApplications[0].jobTitle} (<span style={{ fontFamily: "var(--font-mono)" }}>{savedApplications[0].token}</span>)
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

      {/* Search Bar & Multi-Industry / Experience Filter Section */}
      <section
        style={{
          maxWidth: "1520px",
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <Card style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Main Search Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Search size={18} color="var(--muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search across Accounting, Logistics, Mechanical, Pharma, IT (e.g. Audit, Supply Chain, SolidWorks, Formulation, Python, Fresher)..."
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

          {/* Industry Vertical Chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>
                  Industry:
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
                        padding: "5px 11px",
                        fontSize: "0.75rem",
                        fontWeight: active ? 600 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {dept === "ALL" ? `All Industries (${count})` : `${dept} (${count})`}
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

            {/* Experience Level Filter Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "4px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>
                Experience:
              </span>
              {experienceLevels.map((exp) => {
                const active = selectedExpLevel === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setSelectedExpLevel(exp.id)}
                    style={{
                      backgroundColor: active ? "var(--accent)" : "transparent",
                      color: active ? "#ffffff" : "var(--ink)",
                      border: active ? "1px solid var(--accent)" : "1px dashed var(--line)",
                      borderRadius: "9999px",
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      fontWeight: active ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {exp.label}
                  </button>
                );
              })}

              <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: "auto" }}>
                Showing <strong>{filteredJobs.length}</strong> matching position{filteredJobs.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Featured Jobs Section */}
      <section
        id="open-positions"
        style={{
          padding: "20px 24px",
          maxWidth: "1520px",
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
            <Eyebrow>FEATURED ROLES & MULTI-INDUSTRY OPPORTUNITIES</Eyebrow>
            <h2
              className="font-serif tracking-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.1rem",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.2,
                margin: "4px 0",
              }}
            >
              Active Requisitions Across All Sectors
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Explore verified positions across Accounting, Logistics, Mechanical, Pharma, Tech, and HR — open for Freshers and Experienced candidates.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="/Sample_Login_Credentials_and_Test_Data.xlsx"
              download
              className="ds-btn-secondary"
              style={{ padding: "8px 14px", fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Download size={14} /> Download Test Data (Excel)
            </a>
            <Link
              href="/recruiter"
              className="ds-btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.875rem" }}
            >
              <PlusCircle size={15} /> Post New Role
            </Link>
          </div>
        </div>

        {/* 2-Column Responsive Desktop Grid: Jobs on Left, High-Utility Sidebar on Right */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "28px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Job Cards List */}
          <div style={{ flex: "1 1 840px", minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
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
                        gap: "8px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {/* Experience Level Pill */}
                      {(() => {
                        const str = `${job.title} ${job.type} ${job.description}`.toLowerCase();
                        if (str.includes("fresher") || str.includes("graduate") || str.includes("entry") || str.includes("junior") || str.includes("trainee")) {
                          return (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "rgba(16, 185, 129, 0.12)",
                                color: "#065f46",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              🎓 Freshers Welcome
                            </span>
                          );
                        } else if (str.includes("senior") || str.includes("lead") || str.includes("principal") || str.includes("director") || str.includes("executive")) {
                          return (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "rgba(59, 130, 246, 0.12)",
                                color: "#1e40af",
                                border: "1px solid rgba(59, 130, 246, 0.25)",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              ⭐ Experienced (5+ yrs)
                            </span>
                          );
                        } else {
                          return (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "rgba(245, 158, 11, 0.12)",
                                color: "#92400e",
                                border: "1px solid rgba(245, 158, 11, 0.25)",
                                padding: "2px 8px",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              ⚡ Mid-Level (2-5 yrs)
                            </span>
                          );
                        }
                      })()}

                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>{job.company || "Job.Com"}</span>
                      <span>·</span>
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

          {/* Right Column: High-Utility Command Sidebar */}
          <div
            style={{
              flex: "1 1 360px",
              minWidth: "320px",
              maxWidth: "420px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "sticky",
              top: "84px",
            }}
          >
            {/* Widget 1: Live Multi-Industry Recruitment Pulse */}
            <Card
              style={{
                padding: "20px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Live Recruitment Pulse
                  </span>
                </div>
                <StatusPill variant="good">Real-Time</StatusPill>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  {
                    icon: "🎓",
                    name: "Aarav Mehta",
                    type: "Fresher",
                    role: "Junior Financial Analyst",
                    company: "Apex Financial",
                    action: "Completed screening",
                    score: "92/100",
                    time: "3m ago",
                    badgeColor: "#065f46",
                    badgeBg: "rgba(16, 185, 129, 0.12)",
                  },
                  {
                    icon: "⭐",
                    name: "Titan Precision",
                    type: "Employer",
                    role: "Mechanical Design Lead",
                    company: "Titan Dynamics",
                    action: "Opened 2 requisitions",
                    score: "Active",
                    time: "12m ago",
                    badgeColor: "#1e40af",
                    badgeBg: "rgba(59, 130, 246, 0.12)",
                  },
                  {
                    icon: "🎓",
                    name: "Chloe Dubois",
                    type: "Fresher",
                    role: "Logistics Operations Trainee",
                    company: "Vanguard Freight",
                    action: "Submitted video answers",
                    score: "89/100",
                    time: "24m ago",
                    badgeColor: "#065f46",
                    badgeBg: "rgba(16, 185, 129, 0.12)",
                  },
                  {
                    icon: "⭐",
                    name: "BioPharm Clinical",
                    type: "Employer",
                    role: "Clinical Trial Manager",
                    company: "Biogenix Healthcare",
                    action: "Evaluated submission",
                    score: "95/100",
                    time: "38m ago",
                    badgeColor: "#7c2d12",
                    badgeBg: "rgba(234, 88, 12, 0.12)",
                  },
                  {
                    icon: "🎓",
                    name: "Kevin Zhao",
                    type: "Fresher GET",
                    role: "Graduate Mechanical Engineer",
                    company: "Titan Precision",
                    action: "Completed GD&T CAD test",
                    score: "91/100",
                    time: "52m ago",
                    badgeColor: "#065f46",
                    badgeBg: "rgba(16, 185, 129, 0.12)",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem", lineHeight: 1.2 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                        <span style={{ fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: "0.6875rem", color: "var(--muted)", flexShrink: 0 }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", margin: "1px 0" }}>
                        {item.role} · <span style={{ color: "var(--accent)" }}>{item.company}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <span style={{ fontSize: "0.6875rem", color: "var(--ink)" }}>{item.action}</span>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            padding: "1px 6px",
                            borderRadius: "4px",
                            backgroundColor: item.badgeBg,
                            color: item.badgeColor,
                          }}
                        >
                          {item.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Widget 2: Multi-Industry Hiring Velocity & Speed Metrics */}
            <Card
              style={{
                padding: "20px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--paper)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "14px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <TrendingUp size={16} color="var(--accent)" />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Platform Hiring Velocity
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div style={{ padding: "10px", backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase" }}>Avg Turnaround</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginTop: "2px" }}>18.4 hrs</div>
                  <div style={{ fontSize: "0.6875rem", color: "#059669" }}>91% faster than CVs</div>
                </div>
                <div style={{ padding: "10px", backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase" }}>Freshers Fast-Track</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginTop: "2px" }}>71%</div>
                  <div style={{ fontSize: "0.6875rem", color: "#059669" }}>Direct to Interview</div>
                </div>
              </div>

              {/* Vertical Progress Bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  Sector Turnaround Velocity
                </div>
                {[
                  { sector: "Accounting & Finance", pct: 94 },
                  { sector: "Logistics & Supply Chain", pct: 91 },
                  { sector: "Mechanical Engineering", pct: 89 },
                  { sector: "Pharmaceuticals", pct: 96 },
                  { sector: "Technology & Software", pct: 93 },
                ].map((s) => (
                  <div key={s.sector}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "2px" }}>
                      <span style={{ color: "var(--ink)" }}>{s.sector}</span>
                      <span style={{ fontWeight: 600, color: "var(--accent)" }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: "4px", backgroundColor: "var(--border)", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${s.pct}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "9999px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Widget 3: 1-Click Excel Test Dataset */}
            <Card
              style={{
                padding: "20px",
                border: "1px solid var(--accent)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
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
                    flexShrink: 0,
                  }}
                >
                  <Download size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)" }}>
                    Sample Credentials Excel
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    Multi-Industry Testing Workbook
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.45 }}>
                Pre-populated with 5 industry recruiters, 12 fresher & senior candidates, and rubrics. Universal password: <strong>Password123!</strong>
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a
                  href="/Sample_Login_Credentials_and_Test_Data.xlsx"
                  download
                  className="ds-btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "8px 12px", fontSize: "0.8125rem" }}
                >
                  <Download size={14} /> Download Excel (.xlsx)
                </a>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href="/recruiter"
                    className="ds-btn-secondary"
                    style={{ flex: 1, justifyContent: "center", padding: "6px 8px", fontSize: "0.75rem" }}
                  >
                    Recruiter Portal
                  </Link>
                  <Link
                    href="/candidate/dashboard"
                    className="ds-btn-secondary"
                    style={{ flex: 1, justifyContent: "center", padding: "6px 8px", fontSize: "0.75rem" }}
                  >
                    Candidate Hub
                  </Link>
                </div>
              </div>
            </Card>

            {/* Widget 4: Campus 2026 Batch & Freshers Fast-Track */}
            <Card
              style={{
                padding: "20px",
                border: "1px solid var(--border)",
                backgroundColor: "rgba(16, 185, 129, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>🎓</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#065f46" }}>
                  Graduating in 2025 / 2026?
                </span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0 0 12px", lineHeight: 1.45 }}>
                Bypass traditional resume gatekeeping. Record a 15-minute video interview demonstrating your actual thinking and domain fundamentals directly to hiring managers.
              </p>
              <button
                onClick={() => setSelectedExpLevel("Fresher")}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  backgroundColor: "#ffffff",
                  color: "#065f46",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <span>Filter 6 Freshers Openings</span>
                <ArrowRight size={13} />
              </button>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{
          padding: "50px 24px 20px",
          maxWidth: "1520px",
          margin: "0 auto",
          scrollMarginTop: "80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Eyebrow>TRANSPARENT PLANS & PRICING</Eyebrow>
          <h2
            className="font-serif tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              fontWeight: 600,
              color: "var(--ink)",
              margin: "6px 0 12px",
              lineHeight: 1.2,
            }}
          >
            Predictable Pricing for High-Agency Teams
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "620px", margin: "0 auto 24px", lineHeight: 1.6 }}>
            Eliminate scheduling ping-pong. Upgrade as your hiring requisition volume scales, with zero seat limits or hidden candidate surcharges.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "9999px" }}>
            <button
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: billingCycle === "monthly" ? "var(--ink)" : "transparent",
                color: billingCycle === "monthly" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: billingCycle === "annual" ? "var(--ink)" : "transparent",
                color: billingCycle === "annual" ? "var(--paper)" : "var(--muted)",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>Annual Billing</span>
              <span style={{ fontSize: "0.6875rem", padding: "2px 6px", borderRadius: "9999px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#059669", fontWeight: 700 }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "stretch" }}>
          {/* Tier 1: Starter / Pilot */}
          <Card
            style={{
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  STARTER PILOT
                </span>
                <StatusPill variant="neutral">Free Forever</StatusPill>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "16px 0 10px" }}>
                <span className="font-serif" style={{ fontSize: "2.8rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
                  $0
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>/ month</span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "24px" }}>
                For seed-stage startups and founding teams wanting to test video screening on key open positions.
              </p>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginBottom: "28px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                  What&apos;s Included:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "var(--ink)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Up to <strong>3 active job requisitions</strong></span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span><strong>25 candidate video screenings</strong> / mo</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Server-enforced deadline timers</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Controlled 1-retake quota guard</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>14-day cloud recording retention</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/recruiter"
              className="ds-btn-secondary"
              style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.9375rem", textDecoration: "none" }}
            >
              Start Free Screening
            </Link>
          </Card>

          {/* Tier 2: Growth / Scale (Featured) */}
          <Card
            style={{
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "2px solid var(--accent)",
              backgroundColor: "var(--paper)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--accent)",
                color: "#ffffff",
                padding: "3px 14px",
                borderRadius: "9999px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              RECOMMENDED · POPULAR
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  GROWTH & SCALE
                </span>
                <StatusPill variant="good">Full AI Suite</StatusPill>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "16px 0 10px" }}>
                <span className="font-serif" style={{ fontSize: "2.8rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
                  {billingCycle === "annual" ? "$119" : "$149"}
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
                  / month {billingCycle === "annual" && <span style={{ fontSize: "0.75rem", color: "#059669" }}>(billed annually)</span>}
                </span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "24px" }}>
                For scaling engineering, product, and operations teams managing active multi-candidate pipelines.
              </p>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginBottom: "28px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                  Everything in Starter, plus:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "var(--ink)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span><strong>Unlimited active job postings</strong></span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span><strong>250 candidate video screenings</strong> / mo</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span><strong>Custom AI rubrics</strong> &amp; multi-dimensional scoring</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Custom question time limits (30s – 300s)</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Hiring committee printable PDF exports</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>90-day persistent video stream retention</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/register"
              className="ds-btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.9375rem", textDecoration: "none" }}
            >
              Start 14-Day Free Pro Trial
              <ArrowRight size={15} />
            </Link>
          </Card>

          {/* Tier 3: Enterprise */}
          <Card
            style={{
              padding: "36px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  ENTERPRISE CUSTOM
                </span>
                <StatusPill variant="neutral">SOC-2 & ATS</StatusPill>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", margin: "16px 0 10px" }}>
                <span className="font-serif" style={{ fontSize: "2.8rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
                  Custom
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>volume tiers</span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "24px" }}>
                For high-volume recruitment organizations requiring custom ATS webhooks, SSO, and dedicated compliance SLAs.
              </p>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginBottom: "28px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                  Enterprise Capabilities:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "var(--ink)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span><strong>Unlimited candidate video screenings</strong></span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Greenhouse, Lever, Ashby & Workday webhooks</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>SAML / Okta SSO & role-based RBAC</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Custom retention & zero-storage data options</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>99.99% server availability SLA</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Check size={16} color="var(--accent)" />
                    <span>Dedicated Talent Success Partner</span>
                  </li>
                </ul>
              </div>
            </div>

            <a
              href="#contact"
              className="ds-btn-secondary"
              style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.9375rem", textDecoration: "none" }}
            >
              Contact Enterprise Sales
            </a>
          </Card>
        </div>

        {/* Pricing Trust Badge */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "32px", flexWrap: "wrap", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={15} color="var(--accent)" /> No credit card required for 14-day trial
          </span>
          <span>·</span>
          <span>Cancel or switch plans anytime</span>
          <span>·</span>
          <span>SOC-2 Type II Certified infrastructure</span>
        </div>
      </section>

      {/* Contact & Support Section (Resources) */}
      <section
        id="contact"
        style={{
          padding: "40px 24px 20px",
          maxWidth: "1520px",
          margin: "0 auto",
          scrollMarginTop: "80px",
        }}
      >
        <Card style={{ padding: "40px", border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "start", marginBottom: "40px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Eyebrow>RESOURCES · GET IN TOUCH</Eyebrow>
                <StatusPill variant="good">Support Online</StatusPill>
              </div>
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
                Need help with an active video screening session, custom ATS webhook integration, or employer billing? Our engineering and support team responds promptly.
              </p>

              {/* Department Contact Channels */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Candidate & AV Help (SLA &lt; 15 mins)</div>
                    <a href="mailto:support@job.com" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>support@job.com</a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Enterprise Hiring & Custom Rubrics</div>
                    <a href="mailto:hiring@job.com" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>hiring@job.com</a>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Toll-Free Employer Advisory</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)" }}>+1 (800) 562-2661 · Ext. 4</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" }}>Security, SOC-2 & Anti-Tamper Audit</div>
                    <a href="mailto:security@job.com" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>security@job.com</a>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                  Global Headquarters & Hubs
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8125rem" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>San Francisco (HQ)</div>
                    <div style={{ color: "var(--muted)" }}>550 Montgomery St, Suite 400</div>
                    <div style={{ color: "var(--muted)" }}>San Francisco, CA 94111</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>New York Studio</div>
                    <div style={{ color: "var(--muted)" }}>120 Broadway, 18th Floor</div>
                    <div style={{ color: "var(--muted)" }}>New York, NY 10271</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form with Demo Preset Buttons */}
            <div style={{ backgroundColor: "var(--surface)", padding: "28px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <h3 className="font-serif" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                  Send a Message
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Avg reply: ~12m</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0 0 16px" }}>
                Directly reaches our talent operations and technical engineering desk.
              </p>

              {/* Demo Preset Buttons */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.6875rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Quick Fill Demo Scenario:
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => fillSampleInquiry("candidate")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--paper)",
                      fontSize: "0.6875rem",
                      color: "var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    Candidate AV Help
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleInquiry("ats")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--paper)",
                      fontSize: "0.6875rem",
                      color: "var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    Enterprise ATS
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSampleInquiry("rubric")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--paper)",
                      fontSize: "0.6875rem",
                      color: "var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    Custom Rubrics
                  </button>
                </div>
              </div>

              {contactSent ? (
                <div style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--accent-soft)", borderRadius: "8px", border: "1px solid rgba(217, 119, 6, 0.2)" }}>
                  <CheckCircle2 size={28} color="var(--accent)" style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>
                    Inquiry Dispatched to Support
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.5 }}>
                    Ticket #JP-8429 opened for <strong>{contactEmail}</strong>. Our on-duty talent specialist will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSent(false);
                      setContactName("");
                      setContactEmail("");
                      setContactMessage("");
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--paper)",
                      fontSize: "0.75rem",
                      color: "var(--ink)",
                      cursor: "pointer",
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "var(--ink)", marginBottom: "6px" }}>
                      Your Full Legal Name
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
                      Message or Technical Issue
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your inquiry, screening token, or platform question..."
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

          {/* Quick FAQ Strip */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <HelpCircle size={16} color="var(--accent)" />
              <h3 className="font-serif" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                Frequently Asked Screening Questions
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ padding: "14px", backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <h4 className="font-serif" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Can I retake a video question?
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Retakes are governed by the hiring company (typically 1 retake allowed). If permitted, you will see a &quot;Retake&quot; button after stopping your recording.
                </p>
              </div>
              <div style={{ padding: "14px", backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <h4 className="font-serif" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  What if my internet connection drops?
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  Your session token saves your place. Reopen your private interview link anytime to resume where you left off.
                </p>
              </div>
              <div style={{ padding: "14px", backgroundColor: "var(--surface)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <h4 className="font-serif" style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>
                  Is my camera continuously monitored?
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
                  No. Video is strictly recorded only during active question countdowns when the red recording badge is illuminated.
                </p>
              </div>
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
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px", letterSpacing: "0.06em" }}>
                    YOUR INTERVIEW TOKEN
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>
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
