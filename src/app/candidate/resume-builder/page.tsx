"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Check,
  Wand2,
  ZoomIn,
  ZoomOut,
  PhoneCall,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  X,
  CreditCard,
} from "lucide-react";
import { ResumeData, BLANK_RESUME, RESUME_DRAFTS } from "@/data/resumeDrafts";

const INDUSTRY_OPTIONS = [
  "Accounting & Finance",
  "Logistics & Supply Chain",
  "Mechanical & Manufacturing",
  "Pharmaceuticals & Healthcare",
  "Technology & Software",
  "Sales, Operations & HR",
];

interface ExpertMentor {
  id: string;
  name: string;
  role: string;
  formerCompany: string;
  industry: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  sessionFee: string;
  sessionDuration: string;
  availability: string[];
}

const EXPERT_MENTORS: ExpertMentor[] = [
  {
    id: "exp-acct",
    name: "Robert Sterling, CPA",
    role: "Former Audit Director & Staffing Lead",
    formerCompany: "Deloitte / Apex Financial",
    industry: "Accounting & Finance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 4.95,
    reviewsCount: 142,
    sessionFee: "₹1,000",
    sessionDuration: "30 Minutes",
    availability: ["Today, 3:30 PM", "Today, 5:30 PM", "Tomorrow, 11:00 AM", "Tomorrow, 4:00 PM"],
  },
  {
    id: "exp-log",
    name: "Maria Sanchez",
    role: "Global Head of Supply Chain Talent",
    formerCompany: "Maersk / TransGlobal Logistics",
    industry: "Logistics & Supply Chain",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    rating: 4.92,
    reviewsCount: 98,
    sessionFee: "₹1,000",
    sessionDuration: "30 Minutes",
    availability: ["Today, 4:00 PM", "Tomorrow, 10:30 AM", "Tomorrow, 2:00 PM"],
  },
  {
    id: "exp-mech",
    name: "Vikram Sengupta, PE",
    role: "Principal Engineering Recruiter",
    formerCompany: "Titan Heavy Industries",
    industry: "Mechanical & Manufacturing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 4.98,
    reviewsCount: 164,
    sessionFee: "₹1,000",
    sessionDuration: "30 Minutes",
    availability: ["Today, 6:00 PM", "Tomorrow, 9:30 AM", "Tomorrow, 3:30 PM"],
  },
  {
    id: "exp-pharma",
    name: "Dr. Aris Thorne, Ph.D.",
    role: "VP of Regulatory Compliance",
    formerCompany: "BioPharm Global / Pfizer",
    industry: "Pharmaceuticals & Healthcare",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 4.97,
    reviewsCount: 112,
    sessionFee: "₹1,000",
    sessionDuration: "30 Minutes",
    availability: ["Tomorrow, 11:30 AM", "Tomorrow, 5:00 PM", "Day After, 2:00 PM"],
  },
  {
    id: "exp-tech",
    name: "Sarah Jenkins",
    role: "Former Staff Technical Recruiter",
    formerCompany: "Google / Nexus AI",
    industry: "Technology & Software",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 4.99,
    reviewsCount: 230,
    sessionFee: "₹1,000",
    sessionDuration: "30 Minutes",
    availability: ["Today, 5:00 PM", "Tomorrow, 1:00 PM", "Tomorrow, 6:00 PM"],
  },
];

export default function ResumeBuilderPage() {
  // Main Resume State
  const [resume, setResume] = useState<ResumeData>(BLANK_RESUME);
  const [activeTab, setActiveTab] = useState<
    "contact" | "summary" | "experience" | "education" | "skills" | "certs" | "audit" | "expert"
  >("contact");

  const [selectedDraftKey, setSelectedDraftKey] = useState<string>("blank");
  const [zoom, setZoom] = useState<number>(100);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Auto-saved");

  // AI Feature States
  const [aiIndustry, setAiIndustry] = useState<string>("Accounting & Finance");
  const [aiSeniority, setAiSeniority] = useState<"Fresher" | "Mid-Level" | "Senior">("Fresher");
  const [aiRawNotes, setAiRawNotes] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);

  // Bullet Polishing State
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [polishedOptions, setPolishedOptions] = useState<{ id: string; bullets: string[] } | null>(null);

  // Skill Suggestions State
  const [isFetchingSkills, setIsFetchingSkills] = useState<boolean>(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // ATS Audit State
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    rating: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  // Expert 1-on-1 Guidance Modal & Booking State
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertMentor>(EXPERT_MENTORS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(EXPERT_MENTORS[0].availability[0]);
  const [expertCandidateName, setExpertCandidateName] = useState<string>("");
  const [expertCandidateEmail, setExpertCandidateEmail] = useState<string>("");
  const [expertCandidatePhone, setExpertCandidatePhone] = useState<string>("");
  const [expertNotes, setExpertNotes] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingReceipt, setBookingReceipt] = useState<any | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobcom_resume_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.personalInfo) {
          setResume(parsed);
          setSelectedDraftKey("custom");
          setSaveStatus("saved");
          setLastSavedTime("Restored draft");
          setExpertCandidateName(parsed.personalInfo.fullName || "");
          setExpertCandidateEmail(parsed.personalInfo.email || "");
          setExpertCandidatePhone(parsed.personalInfo.phone || "");
          return;
        }
      }
      // Default to Accounting Fresher as rich showcase
      const initial = RESUME_DRAFTS["acct-fresher"].data;
      setResume(initial);
      setSelectedDraftKey("acct-fresher");
      setExpertCandidateName(initial.personalInfo.fullName);
      setExpertCandidateEmail(initial.personalInfo.email);
      setExpertCandidatePhone(initial.personalInfo.phone);
    } catch {
      setResume(RESUME_DRAFTS["acct-fresher"].data);
      setSelectedDraftKey("acct-fresher");
    }
  }, []);

  // Save to LocalStorage
  const saveToLocalStorage = (data: ResumeData) => {
    try {
      setSaveStatus("saving");
      localStorage.setItem("jobcom_resume_draft", JSON.stringify(data));
      setSaveStatus("saved");
      const d = new Date();
      setLastSavedTime(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
      );
    } catch {
      setSaveStatus("unsaved");
    }
  };

  const updateResume = (updated: ResumeData) => {
    setResume(updated);
    setSaveStatus("unsaved");
    saveToLocalStorage(updated);
    if (updated.personalInfo.fullName) setExpertCandidateName(updated.personalInfo.fullName);
    if (updated.personalInfo.email) setExpertCandidateEmail(updated.personalInfo.email);
    if (updated.personalInfo.phone) setExpertCandidatePhone(updated.personalInfo.phone);
  };

  // Draft Loader Handler
  const handleSelectDraft = (key: string) => {
    setSelectedDraftKey(key);
    if (key === "blank") {
      updateResume(JSON.parse(JSON.stringify(BLANK_RESUME)));
      setAtsResult(null);
    } else if (RESUME_DRAFTS[key]) {
      updateResume(JSON.parse(JSON.stringify(RESUME_DRAFTS[key].data)));
      setAtsResult(null);
    }
  };

  // Trigger ATS Audit
  const runAtsAudit = async (currentResume = resume) => {
    try {
      setIsAuditing(true);
      const res = await fetch("/api/ai/resume-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "audit_ats",
          resume: currentResume,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAtsResult({
          score: data.score,
          rating: data.rating,
          strengths: data.strengths || [],
          improvements: data.improvements || [],
        });
      }
    } catch (e) {
      console.error("ATS Audit error:", e);
    } finally {
      setIsAuditing(false);
    }
  };

  // Generate AI Summaries
  const generateAiSummaries = async () => {
    try {
      setIsGeneratingSummary(true);
      const res = await fetch("/api/ai/resume-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance_summary",
          roleTitle: resume.personalInfo.title || "Specialist",
          industry: aiIndustry,
          experienceLevel: aiSeniority,
          rawNotes: aiRawNotes,
          keySkills: resume.skills,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setSummarySuggestions(data.suggestions);
      }
    } catch (e) {
      console.error("AI Summary error:", e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Polish a specific bullet point
  const polishBulletPoint = async (expId: string, bulletIdx: number, rawBullet: string) => {
    if (!rawBullet.trim()) return;
    const bulletKey = `${expId}-${bulletIdx}`;
    try {
      setPolishingId(bulletKey);
      const res = await fetch("/api/ai/resume-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "polish_bullet",
          rawBullet,
          roleTitle: resume.personalInfo.title || "Professional",
          industry: aiIndustry,
        }),
      });
      const data = await res.json();
      if (data.success && data.polished) {
        setPolishedOptions({
          id: bulletKey,
          bullets: data.polished,
        });
      }
    } catch (e) {
      console.error("Polish Bullet error:", e);
    } finally {
      setPolishingId(null);
    }
  };

  // Fetch Recommended Skills
  const fetchIndustrySkills = async () => {
    try {
      setIsFetchingSkills(true);
      const res = await fetch("/api/ai/resume-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest_skills",
          industry: aiIndustry,
          roleTitle: resume.personalInfo.title,
        }),
      });
      const data = await res.json();
      if (data.success && data.skills) {
        setSuggestedSkills(data.skills);
      }
    } catch (e) {
      console.error("Skill suggestion error:", e);
    } finally {
      setIsFetchingSkills(false);
    }
  };

  // Book Expert Consultation (Rs 1000 for 30 mins)
  const handleBookExpert = async () => {
    if (!expertCandidateName || !expertCandidateEmail || !expertCandidatePhone) {
      alert("Please enter your name, email, and phone number to schedule your expert session.");
      return;
    }
    try {
      setIsBooking(true);
      const res = await fetch("/api/candidate/expert-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: expertCandidateName,
          candidateEmail: expertCandidateEmail,
          candidatePhone: expertCandidatePhone,
          expertId: selectedExpert.id,
          industry: selectedExpert.industry,
          slot: selectedSlot,
          notes: expertNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingReceipt(data);
      } else {
        alert(data.error || "Failed to schedule session");
      }
    } catch (e) {
      console.error("Booking error:", e);
      alert("Unable to reach expert scheduling service. Please retry.");
    } finally {
      setIsBooking(false);
    }
  };

  // Export as JSON
  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${(resume.personalInfo.fullName || "Candidate").replace(/\s+/g, "_")}_Resume.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Trigger Browser Print (PDF)
  const handlePrint = () => {
    window.print();
  };

  // Calculate live ATS estimate
  const getLiveScore = () => {
    if (atsResult) return atsResult.score;
    let s = 45;
    if (resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone) s += 15;
    if (resume.summary && resume.summary.length >= 80) s += 15;
    if (resume.experience.length > 0) s += 15;
    if (resume.skills.length >= 6) s += 10;
    return Math.min(100, s);
  };

  const liveScore = getLiveScore();

  return (
    <div className="resume-builder-page" style={{ minHeight: "100vh", backgroundColor: "var(--paper, #FAF8F5)" }}>
      {/* Print Specific CSS to isolate the resume canvas */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          nav,
          header,
          footer,
          .pricing-announcement-bar,
          .resume-toolbar,
          .resume-editor-pane,
          .preview-controls,
          .no-print {
            display: none !important;
          }
          .resume-preview-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .resume-sheet {
            box-shadow: none !important;
            border: none !important;
            margin: 0 auto !important;
            padding: 24mm 20mm !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Pricing Transparency Announcement Bar */}
      <div
        className="pricing-announcement-bar no-print"
        style={{
          backgroundColor: "#1B4332",
          color: "#ffffff",
          padding: "8px 16px",
          fontSize: "0.8125rem",
          fontWeight: 500,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            FREE CANDIDATE OFFERING
          </span>
          <span>
            Building & updating your resume with AI is <strong>100% Free</strong>. Need dedicated 1-on-1 human guidance?
          </span>
        </div>

        <button
          onClick={() => {
            setBookingReceipt(null);
            setShowExpertModal(true);
          }}
          style={{
            backgroundColor: "#F59E0B",
            color: "#1A1A1A",
            border: "none",
            borderRadius: "4px",
            padding: "4px 12px",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <PhoneCall size={12} /> Book 30-Min Expert Advice (₹1,000)
        </button>
      </div>

      {/* Top Application Toolbar */}
      <header
        className="resume-toolbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid var(--line, #E5E5DF)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Left Brand & Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link
              href="/candidate/dashboard"
              style={{
                fontSize: "0.8125rem",
                color: "var(--muted, #666660)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              ← Candidate Workspace
            </Link>
            <div style={{ height: "16px", width: "1px", backgroundColor: "#E5E5DF" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--ink, #1C1B18)",
                    margin: 0,
                  }}
                >
                  AI Resume Studio
                </h1>
                <span
                  style={{
                    backgroundColor: "rgba(27, 67, 50, 0.1)",
                    color: "#1B4332",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    letterSpacing: "0.06em",
                  }}
                >
                  100% FREE ATS ENGINE
                </span>
              </div>
            </div>
          </div>

          {/* Center Draft & Template Pickers */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Draft Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted, #666660)" }}>
                START FROM:
              </span>
              <select
                value={selectedDraftKey}
                onChange={(e) => handleSelectDraft(e.target.value)}
                style={{
                  backgroundColor: "#F9F9F8",
                  border: "1px solid var(--line, #E5E5DF)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "0.8125rem",
                  color: "var(--ink, #1C1B18)",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <option value="blank">✍️ Blank (Start from Scratch)</option>
                <optgroup label="Multi-Industry Drafts (Fresher & Experienced)">
                  {Object.entries(RESUME_DRAFTS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
                {selectedDraftKey === "custom" && <option value="custom">📁 Custom Loaded Draft</option>}
              </select>
            </div>

            {/* Template Style */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted, #666660)" }}>
                THEME:
              </span>
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: "6px",
                  border: "1px solid var(--line, #E5E5DF)",
                  padding: "2px",
                  backgroundColor: "#F9F9F8",
                }}
              >
                {(["editorial", "minimal", "executive"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateResume({ ...resume, templateStyle: style })}
                    style={{
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      backgroundColor: resume.templateStyle === style ? "#ffffff" : "transparent",
                      color: resume.templateStyle === style ? "#1B4332" : "var(--muted, #666660)",
                      boxShadow: resume.templateStyle === style ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                      textTransform: "capitalize",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Expert Advice Button */}
            <button
              onClick={() => {
                setBookingReceipt(null);
                setShowExpertModal(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #FCD34D",
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Book a 30-min consultation call with an industry expert for ₹1,000"
            >
              <PhoneCall size={14} />
              <span>Expert Advice</span>
              <span
                style={{
                  backgroundColor: "#F59E0B",
                  color: "#ffffff",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                }}
              >
                ₹1,000 / 30m
              </span>
            </button>

            {/* ATS Score Indicator */}
            <button
              onClick={() => {
                setActiveTab("audit");
                runAtsAudit();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(27, 67, 50, 0.2)",
                backgroundColor: liveScore >= 80 ? "rgba(27, 67, 50, 0.08)" : "rgba(230, 150, 0, 0.1)",
                color: liveScore >= 80 ? "#1B4332" : "#995C00",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Click to run full ATS Keyword and Structure Audit"
            >
              <Sparkles size={14} />
              <span>ATS {liveScore}%</span>
            </button>

            {/* Save Status */}
            <span style={{ fontSize: "0.75rem", color: "var(--muted, #666660)" }}>
              {saveStatus === "saving" ? "Saving..." : `Saved (${lastSavedTime})`}
            </span>

            {/* Download JSON */}
            <button
              onClick={downloadJson}
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--line, #E5E5DF)",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--ink, #1C1B18)",
              }}
            >
              <Download size={14} /> JSON
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: "#1B4332",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 16px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Editor (Left) & Real-time Canvas (Right) */}
      <main
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "24px 20px 80px",
          display: "grid",
          gridTemplateColumns: "minmax(420px, 600px) 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* ======================================================== */}
        {/* LEFT COLUMN: EDITOR CONTROLS & AI ASSISTANTS */}
        {/* ======================================================== */}
        <section
          className="resume-editor-pane"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid var(--line, #E5E5DF)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
            overflow: "hidden",
          }}
        >
          {/* Sub Navigation Tabs */}
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              borderBottom: "1px solid var(--line, #E5E5DF)",
              backgroundColor: "#FAF9F6",
              padding: "4px 8px 0",
              gap: "4px",
            }}
          >
            {[
              { id: "contact", label: "Contact", icon: Mail },
              { id: "summary", label: "AI Summary", icon: Wand2 },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Award },
              { id: "certs", label: "Certifications", icon: FileText },
              { id: "audit", label: "ATS Audit", icon: Sparkles },
              { id: "expert", label: "Expert 1-on-1 (₹1,000)", icon: PhoneCall, highlight: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 14px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    border: "none",
                    borderBottom: isActive ? "2px solid #1B4332" : "2px solid transparent",
                    backgroundColor: isActive
                      ? "#ffffff"
                      : tab.highlight
                      ? "rgba(245, 158, 11, 0.08)"
                      : "transparent",
                    color: isActive ? "#1B4332" : tab.highlight ? "#B45309" : "var(--muted, #666660)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px",
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panes */}
          <div style={{ padding: "24px" }}>
            {/* ----------------- TAB: CONTACT INFO ----------------- */}
            {activeTab === "contact" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      margin: "0 0 4px",
                    }}
                  >
                    Personal & Contact Information
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                    Clear, error-free contact credentials are fundamental for recruiter outreach and ATS indexing.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, fullName: e.target.value },
                        })
                      }
                      placeholder="e.g. Elena Rostova"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      PROFESSIONAL HEADLINE / TITLE *
                    </label>
                    <input
                      type="text"
                      value={resume.personalInfo.title}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, title: e.target.value },
                        })
                      }
                      placeholder="e.g. Senior CPA & Controller | Supply Chain Analyst"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, email: e.target.value },
                        })
                      }
                      placeholder="elena@example.com"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      value={resume.personalInfo.phone}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, phone: e.target.value },
                        })
                      }
                      placeholder="+1 (555) 019-2834"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      LOCATION (CITY, STATE / COUNTRY)
                    </label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, location: e.target.value },
                        })
                      }
                      placeholder="Chicago, IL or Remote"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      LINKEDIN PROFILE / URL
                    </label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin || ""}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, linkedin: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/username"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                      PORTFOLIO OR PERSONAL WEBSITE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={resume.personalInfo.website || ""}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, website: e.target.value },
                        })
                      }
                      placeholder="portfolio.io or github.com/username"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setActiveTab("summary")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Next: AI Summary <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: AI SUMMARY GENERATOR ----------------- */}
            {activeTab === "summary" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Executive Summary & Value Proposition
                    </h3>
                    <span
                      style={{
                        backgroundColor: "rgba(27, 67, 50, 0.12)",
                        color: "#1B4332",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "3px",
                      }}
                    >
                      100% FREE AI
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                    Craft a concise 3-4 sentence hook highlighting your core discipline, key accomplishments, and target role.
                  </p>
                </div>

                {/* Current Active Summary Box */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    <span>ACTIVE RESUME SUMMARY</span>
                    <span style={{ color: resume.summary.length >= 80 ? "#1B4332" : "#995C00" }}>
                      {resume.summary.length} characters (Target: 80–350)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={resume.summary}
                    onChange={(e) => updateResume({ ...resume, summary: e.target.value })}
                    placeholder="Write your executive summary or use the AI Generator below to draft one..."
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--line, #E5E5DF)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* AI Summary Generator Accordion / Box */}
                <div
                  style={{
                    backgroundColor: "rgba(27, 67, 50, 0.04)",
                    border: "1px solid rgba(27, 67, 50, 0.2)",
                    borderRadius: "8px",
                    padding: "16px 18px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <Wand2 size={16} style={{ color: "#1B4332" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1B4332" }}>
                      Generate Tailored AI Summaries
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                        TARGET INDUSTRY
                      </label>
                      <select
                        value={aiIndustry}
                        onChange={(e) => setAiIndustry(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--line, #E5E5DF)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {INDUSTRY_OPTIONS.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                        EXPERIENCE LEVEL
                      </label>
                      <select
                        value={aiSeniority}
                        onChange={(e) => setAiSeniority(e.target.value as typeof aiSeniority)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--line, #E5E5DF)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        <option value="Fresher">🎓 Fresher / Entry-Level Graduate</option>
                        <option value="Mid-Level">💼 Mid-Level Professional (3-7 yrs)</option>
                        <option value="Senior">🏛️ Senior / Lead / Executive (8+ yrs)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                      ROUGH NOTES / SPECIALIZATIONS (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={aiRawNotes}
                      onChange={(e) => setAiRawNotes(e.target.value)}
                      placeholder="e.g. Top 5% in class, audited GL accounts, certified in SolidWorks..."
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </div>

                  <button
                    onClick={generateAiSummaries}
                    disabled={isGeneratingSummary}
                    style={{
                      width: "100%",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: isGeneratingSummary ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Sparkles size={14} />
                    {isGeneratingSummary ? "Generating 3 Calibrated Summaries..." : "Generate 3 AI Summaries"}
                  </button>

                  {/* Generated Variations */}
                  {summarySuggestions.length > 0 && (
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink, #1C1B18)" }}>
                        CHOOSE A VARIATION TO APPLY:
                      </span>
                      {summarySuggestions.map((text, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid rgba(27, 67, 50, 0.2)",
                            borderRadius: "6px",
                            padding: "10px 12px",
                            fontSize: "0.8125rem",
                            lineHeight: 1.45,
                            color: "var(--ink, #1C1B18)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "6px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#1B4332",
                                textTransform: "uppercase",
                              }}
                            >
                              Option {idx + 1} · {idx === 0 ? "Executive & Strategic" : idx === 1 ? "High Agency" : "Impact Focused"}
                            </span>
                            <button
                              onClick={() => {
                                updateResume({ ...resume, summary: text });
                              }}
                              style={{
                                backgroundColor: "rgba(27, 67, 50, 0.1)",
                                border: "none",
                                borderRadius: "4px",
                                color: "#1B4332",
                                padding: "3px 8px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Check size={12} /> Use This Summary
                            </button>
                          </div>
                          <p style={{ margin: 0 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                  <button
                    onClick={() => setActiveTab("contact")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--line, #E5E5DF)",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Contact
                  </button>
                  <button
                    onClick={() => setActiveTab("experience")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Next: Work Experience <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: WORK EXPERIENCE & STAR POLISHER ----------------- */}
            {activeTab === "experience" && (
              <div>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Professional Experience & Internships
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                      Highlight your roles using active verbs and the STAR framework (Situation, Task, Action, Result).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newExp = {
                        id: `exp-${Date.now()}`,
                        company: "New Organization",
                        role: "Target Role",
                        location: "City, State",
                        startDate: "Jan 2026",
                        endDate: "Present",
                        current: true,
                        bullets: ["Led key daily operations and delivered measurable outcomes."],
                      };
                      updateResume({ ...resume, experience: [newExp, ...resume.experience] });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "rgba(27, 67, 50, 0.1)",
                      color: "#1B4332",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                {resume.experience.length === 0 ? (
                  <div
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      border: "1px dashed var(--line, #E5E5DF)",
                      borderRadius: "8px",
                    }}
                  >
                    <Briefcase size={28} style={{ color: "var(--muted, #666660)", marginBottom: "8px" }} />
                    <p style={{ fontSize: "0.875rem", color: "var(--muted, #666660)", margin: "0 0 12px" }}>
                      No work experience added yet. Freshers can also list relevant internships, capstone projects, or academic lab leadership.
                    </p>
                    <button
                      onClick={() => {
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          company: "Example Company / University Lab",
                          role: "Associate / Intern",
                          location: "Remote",
                          startDate: "Jan 2026",
                          endDate: "Present",
                          current: true,
                          bullets: ["Conducted analytical research and prepared detailed reports."],
                        };
                        updateResume({ ...resume, experience: [newExp] });
                      }}
                      style={{
                        backgroundColor: "#1B4332",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Add First Experience Item
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {resume.experience.map((exp, expIdx) => (
                      <div
                        key={exp.id || expIdx}
                        style={{
                          border: "1px solid var(--line, #E5E5DF)",
                          borderRadius: "8px",
                          padding: "16px",
                          backgroundColor: "#FAF9F6",
                        }}
                      >
                        {/* Role Header Controls */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1B4332" }}>
                            EXPERIENCE #{expIdx + 1}
                          </span>
                          <button
                            onClick={() => {
                              const updated = resume.experience.filter((_, i) => i !== expIdx);
                              updateResume({ ...resume, experience: updated });
                            }}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#B91C1C",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        {/* Role details grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "10px",
                            marginBottom: "14px",
                          }}
                        >
                          <div>
                            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                              JOB TITLE / POSITION *
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const list = [...resume.experience];
                                list[expIdx].role = e.target.value;
                                updateResume({ ...resume, experience: list });
                              }}
                              placeholder="e.g. Financial Analyst"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--line, #E5E5DF)",
                                fontSize: "0.8125rem",
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                              ORGANIZATION / COMPANY *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const list = [...resume.experience];
                                list[expIdx].company = e.target.value;
                                updateResume({ ...resume, experience: list });
                              }}
                              placeholder="e.g. Apex Global"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--line, #E5E5DF)",
                                fontSize: "0.8125rem",
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                              START DATE
                            </label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => {
                                const list = [...resume.experience];
                                list[expIdx].startDate = e.target.value;
                                updateResume({ ...resume, experience: list });
                              }}
                              placeholder="Jan 2024"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--line, #E5E5DF)",
                                fontSize: "0.8125rem",
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                              END DATE
                            </label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => {
                                const list = [...resume.experience];
                                list[expIdx].endDate = e.target.value;
                                updateResume({ ...resume, experience: list });
                              }}
                              placeholder="Present or Jun 2025"
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--line, #E5E5DF)",
                                fontSize: "0.8125rem",
                              }}
                            />
                          </div>
                        </div>

                        {/* Bullets List with AI Polish */}
                        <div style={{ marginTop: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "6px",
                            }}
                          >
                            <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--ink, #1C1B18)" }}>
                              RESPONSIBILITIES & QUANTIFIABLE BULLETS
                            </label>
                            <span style={{ fontSize: "0.7rem", color: "#1B4332", fontWeight: 600 }}>
                              Tip: Click ✨ AI Polish for instant STAR rewrite!
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {exp.bullets.map((bullet, bIdx) => {
                              const bulletKey = `${exp.id || expIdx}-${bIdx}`;
                              const isPolishingThis = polishingId === bulletKey;
                              const hasOptions =
                                polishedOptions && polishedOptions.id === bulletKey;

                              return (
                                <div key={bIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#1B4332", fontWeight: 700, marginTop: "6px" }}>•</span>
                                    <textarea
                                      rows={2}
                                      value={bullet}
                                      onChange={(e) => {
                                        const list = [...resume.experience];
                                        list[expIdx].bullets[bIdx] = e.target.value;
                                        updateResume({ ...resume, experience: list });
                                      }}
                                      placeholder="e.g. Audited 200+ vendor disbursements, identifying $14,000 in duplicates..."
                                      style={{
                                        flex: 1,
                                        padding: "6px 8px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--line, #E5E5DF)",
                                        fontSize: "0.8125rem",
                                        fontFamily: "inherit",
                                        lineHeight: 1.4,
                                      }}
                                    />
                                    {/* AI Polish Button */}
                                    <button
                                      type="button"
                                      onClick={() => polishBulletPoint(exp.id || String(expIdx), bIdx, bullet)}
                                      disabled={isPolishingThis || !bullet.trim()}
                                      title="Polish bullet using STAR Framework and action verbs"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        backgroundColor: "rgba(27, 67, 50, 0.1)",
                                        color: "#1B4332",
                                        border: "none",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: isPolishingThis ? "wait" : "pointer",
                                        whiteSpace: "nowrap",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <Wand2 size={12} />
                                      {isPolishingThis ? "..." : "AI Polish"}
                                    </button>
                                    {/* Delete bullet button */}
                                    {exp.bullets.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const list = [...resume.experience];
                                          list[expIdx].bullets = list[expIdx].bullets.filter((_, i) => i !== bIdx);
                                          updateResume({ ...resume, experience: list });
                                        }}
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "none",
                                          color: "#999",
                                          cursor: "pointer",
                                          padding: "4px",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>

                                  {/* AI Polished Suggestions Drawer */}
                                  {hasOptions && (
                                    <div
                                      style={{
                                        marginLeft: "16px",
                                        marginTop: "4px",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid rgba(27, 67, 50, 0.25)",
                                        borderRadius: "6px",
                                        padding: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          marginBottom: "6px",
                                        }}
                                      >
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1B4332" }}>
                                          ✨ STAR-ENHANCED BULLET SUGGESTIONS
                                        </span>
                                        <button
                                          onClick={() => setPolishedOptions(null)}
                                          style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "var(--muted, #666660)",
                                            fontSize: "0.7rem",
                                            cursor: "pointer",
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        {polishedOptions.bullets.map((opt, optIdx) => (
                                          <div
                                            key={optIdx}
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                              gap: "8px",
                                              padding: "6px 8px",
                                              borderRadius: "4px",
                                              backgroundColor: "#F9F9F8",
                                              fontSize: "0.78rem",
                                              lineHeight: 1.35,
                                            }}
                                          >
                                            <span style={{ flex: 1 }}>{opt}</span>
                                            <button
                                              onClick={() => {
                                                const list = [...resume.experience];
                                                list[expIdx].bullets[bIdx] = opt;
                                                updateResume({ ...resume, experience: list });
                                                setPolishedOptions(null);
                                              }}
                                              style={{
                                                backgroundColor: "#1B4332",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "4px",
                                                padding: "3px 8px",
                                                fontSize: "0.7rem",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              Accept
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => {
                                const list = [...resume.experience];
                                list[expIdx].bullets.push("Achieved measurable results through disciplined daily execution.");
                                updateResume({ ...resume, experience: list });
                              }}
                              style={{
                                alignSelf: "flex-start",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#1B4332",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                padding: "4px 0",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Plus size={12} /> Add Another Bullet
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <button
                    onClick={() => setActiveTab("summary")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--line, #E5E5DF)",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Summary
                  </button>
                  <button
                    onClick={() => setActiveTab("education")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Next: Education <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: EDUCATION ----------------- */}
            {activeTab === "education" && (
              <div>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Education & Academic Honors
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                      Degrees, academic institutions, graduation dates, and relevant distinctions.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newEdu = {
                        id: `edu-${Date.now()}`,
                        school: "University / Institute Name",
                        degree: "Bachelor of Science",
                        field: "Discipline / Major",
                        year: "2026",
                        honors: "Dean's List / Cum Laude",
                      };
                      updateResume({ ...resume, education: [...resume.education, newEdu] });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "rgba(27, 67, 50, 0.1)",
                      color: "#1B4332",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> Add Degree
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {resume.education.map((edu, eduIdx) => (
                    <div
                      key={edu.id || eduIdx}
                      style={{
                        border: "1px solid var(--line, #E5E5DF)",
                        borderRadius: "8px",
                        padding: "16px",
                        backgroundColor: "#FAF9F6",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1B4332" }}>
                          ACADEMIC PROGRAM #{eduIdx + 1}
                        </span>
                        {resume.education.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = resume.education.filter((_, i) => i !== eduIdx);
                              updateResume({ ...resume, education: updated });
                            }}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#B91C1C",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                            INSTITUTION / UNIVERSITY *
                          </label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const list = [...resume.education];
                              list[eduIdx].school = e.target.value;
                              updateResume({ ...resume, education: list });
                            }}
                            placeholder="e.g. University of Illinois at Urbana-Champaign"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--line, #E5E5DF)",
                              fontSize: "0.8125rem",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                            DEGREE TYPE *
                          </label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const list = [...resume.education];
                              list[eduIdx].degree = e.target.value;
                              updateResume({ ...resume, education: list });
                            }}
                            placeholder="e.g. Bachelor of Science"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--line, #E5E5DF)",
                              fontSize: "0.8125rem",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                            FIELD / MAJOR *
                          </label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              const list = [...resume.education];
                              list[eduIdx].field = e.target.value;
                              updateResume({ ...resume, education: list });
                            }}
                            placeholder="e.g. Accountancy, Mechanical Eng, Supply Chain"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--line, #E5E5DF)",
                              fontSize: "0.8125rem",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                            GRADUATION YEAR
                          </label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const list = [...resume.education];
                              list[eduIdx].year = e.target.value;
                              updateResume({ ...resume, education: list });
                            }}
                            placeholder="2025"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--line, #E5E5DF)",
                              fontSize: "0.8125rem",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>
                            HONORS / GPA (OPTIONAL)
                          </label>
                          <input
                            type="text"
                            value={edu.honors || ""}
                            onChange={(e) => {
                              const list = [...resume.education];
                              list[eduIdx].honors = e.target.value;
                              updateResume({ ...resume, education: list });
                            }}
                            placeholder="e.g. Summa Cum Laude, GPA 3.8/4.0"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--line, #E5E5DF)",
                              fontSize: "0.8125rem",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <button
                    onClick={() => setActiveTab("experience")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--line, #E5E5DF)",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Experience
                  </button>
                  <button
                    onClick={() => setActiveTab("skills")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Next: Industry Skills <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: INDUSTRY SKILLS ----------------- */}
            {activeTab === "skills" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Technical & Industry Domain Skills
                    </h3>
                    <span
                      style={{
                        backgroundColor: "rgba(27, 67, 50, 0.12)",
                        color: "#1B4332",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "3px",
                      }}
                    >
                      ATS KEYWORDS
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                    ATS parsers search for exact domain keywords. Include 8-12 foundational technical and process competencies.
                  </p>
                </div>

                {/* Active Skills List */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    <span>ACTIVE SKILLS ON YOUR RESUME ({resume.skills.length})</span>
                    <span style={{ color: resume.skills.length >= 6 ? "#1B4332" : "#995C00" }}>
                      {resume.skills.length < 6 ? "Need 6+ for high ATS rating" : "Great keyword volume"}
                    </span>
                  </label>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      minHeight: "48px",
                      padding: "8px",
                      border: "1px solid var(--line, #E5E5DF)",
                      borderRadius: "6px",
                      backgroundColor: "#FAF9F6",
                    }}
                  >
                    {resume.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          backgroundColor: "#ffffff",
                          border: "1px solid rgba(27, 67, 50, 0.2)",
                          color: "var(--ink, #1C1B18)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = resume.skills.filter((_, i) => i !== sIdx);
                            updateResume({ ...resume, skills: updated });
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#999",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            padding: "0 2px",
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {resume.skills.length === 0 && (
                      <span style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", padding: "4px" }}>
                        No skills added yet. Click suggestions below or add custom skills.
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Skill Input */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                  <input
                    type="text"
                    id="new-skill-input"
                    placeholder="Type custom skill (e.g. Python, US GAAP, Six Sigma) and press Add"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !resume.skills.includes(val)) {
                          updateResume({ ...resume, skills: [...resume.skills, val] });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--line, #E5E5DF)",
                      fontSize: "0.8125rem",
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById("new-skill-input") as HTMLInputElement;
                      if (input && input.value.trim() && !resume.skills.includes(input.value.trim())) {
                        updateResume({ ...resume, skills: [...resume.skills, input.value.trim()] });
                        input.value = "";
                      }
                    }}
                    style={{
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    + Add Skill
                  </button>
                </div>

                {/* AI Industry Presets Recommender */}
                <div
                  style={{
                    backgroundColor: "rgba(27, 67, 50, 0.04)",
                    border: "1px solid rgba(27, 67, 50, 0.2)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Wand2 size={15} style={{ color: "#1B4332" }} />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1B4332" }}>
                        1-Click Industry Keyword Suggestions
                      </span>
                    </div>
                    <select
                      value={aiIndustry}
                      onChange={(e) => setAiIndustry(e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.75rem",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <button
                      onClick={fetchIndustrySkills}
                      disabled={isFetchingSkills}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(27, 67, 50, 0.3)",
                        color: "#1B4332",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isFetchingSkills ? "Retrieving Keywords..." : `Fetch Keywords for ${aiIndustry}`}
                    </button>
                  </div>

                  {suggestedSkills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      {suggestedSkills.map((keyword, kIdx) => {
                        const alreadyAdded = resume.skills.includes(keyword);
                        return (
                          <button
                            key={kIdx}
                            onClick={() => {
                              if (!alreadyAdded) {
                                updateResume({ ...resume, skills: [...resume.skills, keyword] });
                              }
                            }}
                            disabled={alreadyAdded}
                            style={{
                              backgroundColor: alreadyAdded ? "rgba(0,0,0,0.05)" : "#ffffff",
                              color: alreadyAdded ? "var(--muted, #666660)" : "#1B4332",
                              border: alreadyAdded ? "1px solid #ddd" : "1px solid rgba(27, 67, 50, 0.3)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: alreadyAdded ? "default" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {alreadyAdded ? <Check size={11} /> : "+"} {keyword}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <button
                    onClick={() => setActiveTab("education")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--line, #E5E5DF)",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Education
                  </button>
                  <button
                    onClick={() => setActiveTab("certs")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Next: Certifications <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: CERTIFICATIONS ----------------- */}
            {activeTab === "certs" && (
              <div>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Licenses, Credentials & Certifications
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                      Highlight formal licenses (CPA, PMP, RAC, FE/EIT, Six Sigma, AWS, etc.).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newCert = {
                        id: `cert-${Date.now()}`,
                        name: "Credential Name",
                        issuer: "Issuing Organization",
                        year: "2025",
                      };
                      updateResume({
                        ...resume,
                        certifications: [...(resume.certifications || []), newCert],
                      });
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "rgba(27, 67, 50, 0.1)",
                      color: "#1B4332",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={14} /> Add Certification
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(resume.certifications || []).map((cert, cIdx) => (
                    <div
                      key={cert.id || cIdx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr 80px 32px",
                        gap: "8px",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        backgroundColor: "#FAF9F6",
                      }}
                    >
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const list = [...(resume.certifications || [])];
                          list[cIdx].name = e.target.value;
                          updateResume({ ...resume, certifications: list });
                        }}
                        placeholder="e.g. Certified Public Accountant (CPA)"
                        style={{
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--line, #E5E5DF)",
                          fontSize: "0.8125rem",
                        }}
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const list = [...(resume.certifications || [])];
                          list[cIdx].issuer = e.target.value;
                          updateResume({ ...resume, certifications: list });
                        }}
                        placeholder="e.g. AICPA / Board"
                        style={{
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--line, #E5E5DF)",
                          fontSize: "0.8125rem",
                        }}
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const list = [...(resume.certifications || [])];
                          list[cIdx].year = e.target.value;
                          updateResume({ ...resume, certifications: list });
                        }}
                        placeholder="2024"
                        style={{
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--line, #E5E5DF)",
                          fontSize: "0.8125rem",
                        }}
                      />
                      <button
                        onClick={() => {
                          const list = (resume.certifications || []).filter((_, i) => i !== cIdx);
                          updateResume({ ...resume, certifications: list });
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#B91C1C",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(resume.certifications || []).length === 0 && (
                    <div style={{ padding: "16px", textAlign: "center", color: "var(--muted, #666660)", fontSize: "0.8125rem" }}>
                      No certifications listed. Add any licenses or professional certificates to boost credibility.
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                  <button
                    onClick={() => setActiveTab("skills")}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--line, #E5E5DF)",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Skills
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("audit");
                      runAtsAudit();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Run ATS Audit <Sparkles size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: ATS AUDIT & ENGINE ----------------- */}
            {activeTab === "audit" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      Applicant Tracking System (ATS) Audit
                    </h3>
                    <span
                      style={{
                        backgroundColor: "rgba(27, 67, 50, 0.12)",
                        color: "#1B4332",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "3px",
                      }}
                    >
                      AI CALIBRATED
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                    Our ATS engine analyzes contact completeness, executive summary depth, quantifiable metrics, and keyword density.
                  </p>
                </div>

                {/* Score Big Display */}
                <div
                  style={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid var(--line, #E5E5DF)",
                    borderRadius: "10px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      color: liveScore >= 80 ? "#1B4332" : liveScore >= 65 ? "#995C00" : "#B91C1C",
                      lineHeight: 1,
                    }}
                  >
                    {liveScore}
                    <span style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--muted, #666660)" }}>
                      /100
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: "8px",
                      color: liveScore >= 80 ? "#1B4332" : liveScore >= 65 ? "#995C00" : "#B91C1C",
                    }}
                  >
                    {liveScore >= 80
                      ? "Outstanding · High Interview Call-Back Probability"
                      : liveScore >= 65
                      ? "Good · Minor Quantifiable Polish Needed"
                      : "Action Required · Needs Additional Details"}
                  </div>

                  <button
                    onClick={() => runAtsAudit()}
                    disabled={isAuditing}
                    style={{
                      marginTop: "16px",
                      backgroundColor: "#1B4332",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: isAuditing ? "wait" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Sparkles size={14} /> {isAuditing ? "Auditing Resume..." : "Re-Run Comprehensive AI Audit"}
                  </button>
                </div>

                {/* Strengths & Improvements */}
                {atsResult && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                    {/* Strengths */}
                    {atsResult.strengths.length > 0 && (
                      <div
                        style={{
                          border: "1px solid rgba(27, 67, 50, 0.2)",
                          borderRadius: "8px",
                          padding: "16px",
                          backgroundColor: "rgba(27, 67, 50, 0.03)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#1B4332",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <CheckCircle2 size={14} /> IDENTIFIED ATS STRENGTHS
                        </span>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                          {atsResult.strengths.map((str, sIdx) => (
                            <li key={sIdx} style={{ color: "var(--ink, #1C1B18)" }}>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {atsResult.improvements.length > 0 && (
                      <div
                        style={{
                          border: "1px solid rgba(230, 150, 0, 0.3)",
                          borderRadius: "8px",
                          padding: "16px",
                          backgroundColor: "rgba(230, 150, 0, 0.05)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#995C00",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "8px",
                          }}
                        >
                          <AlertCircle size={14} /> RECOMMENDED IMPROVEMENTS
                        </span>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                          {atsResult.improvements.map((imp, iIdx) => (
                            <li key={iIdx} style={{ color: "var(--ink, #1C1B18)" }}>
                              {imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ----------------- TAB: EXPERT 1-ON-1 GUIDANCE ----------------- */}
            {activeTab === "expert" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: "0 0 4px",
                      }}
                    >
                      1-on-1 Expert Advice & Live Guidance
                    </h3>
                    <span
                      style={{
                        backgroundColor: "#FEF3C7",
                        color: "#92400E",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "1px 8px",
                        borderRadius: "10px",
                        border: "1px solid #FCD34D",
                      }}
                    >
                      ₹1,000 / 30 MIN
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted, #666660)", margin: 0 }}>
                    While AI creation is 100% free, candidates seeking dedicated human review can book a 30-minute private call with an experienced industry hiring manager.
                  </p>
                </div>

                {/* Pricing Model Comparison Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {/* Card 1: Free AI */}
                  <div
                    style={{
                      border: "1px solid rgba(27, 67, 50, 0.2)",
                      borderRadius: "8px",
                      padding: "14px",
                      backgroundColor: "rgba(27, 67, 50, 0.03)",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1B4332", textTransform: "uppercase" }}>
                      AI Studio
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1B4332", margin: "2px 0 6px" }}>
                      FREE
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.75rem", color: "var(--muted, #666660)", lineHeight: 1.5 }}>
                      <li>Build from scratch or templates</li>
                      <li>AI Executive Summary generator</li>
                      <li>STAR bullet polisher</li>
                      <li>Unlimited PDF downloads</li>
                    </ul>
                  </div>

                  {/* Card 2: Chargeable Expert Advice */}
                  <div
                    style={{
                      border: "2px solid #F59E0B",
                      borderRadius: "8px",
                      padding: "14px",
                      backgroundColor: "#FFFBEB",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#B45309", textTransform: "uppercase" }}>
                      Expert 1-on-1 Review
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#B45309", margin: "2px 0 6px" }}>
                      ₹1,000 <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>/ 30 min</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.75rem", color: "#92400E", lineHeight: 1.5 }}>
                      <li>Live 30-min call with hiring lead</li>
                      <li>Line-by-line resume critique</li>
                      <li>Role positioning & salary tactics</li>
                      <li>Annotated PDF returned post-call</li>
                    </ul>
                  </div>
                </div>

                {/* Available Mentors */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--ink, #1C1B18)" }}>
                    SELECT AN INDUSTRY SPECIALIST:
                  </span>
                  {EXPERT_MENTORS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedExpert(m);
                        setSelectedSlot(m.availability[0]);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: selectedExpert.id === m.id ? "2px solid #1B4332" : "1px solid var(--line, #E5E5DF)",
                        backgroundColor: selectedExpert.id === m.id ? "rgba(27, 67, 50, 0.04)" : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ink, #1C1B18)" }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted, #666660)" }}>
                          {m.role} · {m.formerCompany}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#1B4332", fontWeight: 600, marginTop: "2px" }}>
                          ⭐ {m.rating} ({m.reviewsCount} candidate reviews)
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#B45309" }}>
                          ₹1,000
                        </span>
                        <div style={{ fontSize: "0.6875rem", color: "var(--muted, #666660)" }}>30 min session</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setBookingReceipt(null);
                    setShowExpertModal(true);
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "#B45309",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 16px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <PhoneCall size={16} /> Schedule 30-Min Session with {selectedExpert.name} (₹1,000)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: LIVE ATS-COMPLIANT DOCUMENT CANVAS */}
        {/* ======================================================== */}
        <section
          className="resume-preview-container"
          style={{
            position: "sticky",
            top: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Preview Canvas Zoom Controls */}
          <div
            className="preview-controls no-print"
            style={{
              width: "100%",
              maxWidth: "800px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              padding: "0 4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted, #666660)" }}>
                LIVE PREVIEW:
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "#ffffff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid var(--line, #E5E5DF)",
                  textTransform: "capitalize",
                }}
              >
                {resume.templateStyle} Theme
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setZoom(Math.max(70, zoom - 10))}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid var(--line, #E5E5DF)",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                <ZoomOut size={12} />
              </button>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, minWidth: "38px", textAlign: "center" }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(130, zoom + 10))}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid var(--line, #E5E5DF)",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* Paper Document Canvas */}
          <div
            className="resume-sheet"
            style={{
              width: "100%",
              maxWidth: "800px",
              backgroundColor: "#ffffff",
              boxShadow: "0 12px 38px rgba(0, 0, 0, 0.08)",
              border: "1px solid var(--line, #E5E5DF)",
              borderRadius: "4px",
              padding: "44px 48px",
              color: "#1A1A1A",
              fontFamily: "var(--font-heading), var(--font-body), sans-serif",
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              transition: "transform 0.15s ease",
            }}
          >
            {/* ================= TEMPLATE: EXECUTIVE ================= */}
            {resume.templateStyle === "executive" && (
              <div
                style={{
                  margin: "-44px -48px 24px -48px",
                  padding: "28px 48px",
                  backgroundColor: "#0F172A",
                  color: "#ffffff",
                }}
              >
                <h1
                  style={{
                    fontSize: "2.1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    margin: "0 0 4px",
                    color: "#ffffff",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {resume.personalInfo.fullName || "Candidate Name"}
                </h1>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#94A3B8",
                    marginBottom: "12px",
                  }}
                >
                  {resume.personalInfo.title || "Target Professional Title"}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "14px",
                    fontSize: "0.8125rem",
                    color: "#CBD5E1",
                  }}
                >
                  {resume.personalInfo.email && <span>✉ {resume.personalInfo.email}</span>}
                  {resume.personalInfo.phone && <span>☎ {resume.personalInfo.phone}</span>}
                  {resume.personalInfo.location && <span>📍 {resume.personalInfo.location}</span>}
                  {resume.personalInfo.linkedin && <span>🔗 {resume.personalInfo.linkedin}</span>}
                </div>
              </div>
            )}

            {/* ================= TEMPLATE: EDITORIAL & MINIMAL HEADER ================= */}
            {resume.templateStyle !== "executive" && (
              <header style={{ marginBottom: "22px", borderBottom: "2px solid #1A1A1A", paddingBottom: "16px" }}>
                <h1
                  style={{
                    fontSize: resume.templateStyle === "editorial" ? "2.3rem" : "1.9rem",
                    fontWeight: 700,
                    margin: "0 0 4px",
                    letterSpacing: "-0.025em",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {resume.personalInfo.fullName || "Candidate Name"}
                </h1>
                <div
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: resume.templateStyle === "editorial" ? "#1B4332" : "#4A4A4A",
                    marginBottom: "8px",
                  }}
                >
                  {resume.personalInfo.title || "Target Professional Title"}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    fontSize: "0.8125rem",
                    color: "#555550",
                  }}
                >
                  {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
                  {resume.personalInfo.phone && <span>· {resume.personalInfo.phone}</span>}
                  {resume.personalInfo.location && <span>· {resume.personalInfo.location}</span>}
                  {resume.personalInfo.linkedin && <span>· {resume.personalInfo.linkedin}</span>}
                  {resume.personalInfo.website && <span>· {resume.personalInfo.website}</span>}
                </div>
              </header>
            )}

            {/* Executive Summary */}
            {resume.summary && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid #D5D5CF",
                    paddingBottom: "4px",
                    marginBottom: "8px",
                    color: resume.templateStyle === "executive" ? "#0F172A" : "#1B4332",
                  }}
                >
                  Executive Summary
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.55,
                    color: "#2C2C28",
                    margin: 0,
                    textAlign: "justify",
                  }}
                >
                  {resume.summary}
                </p>
              </section>
            )}

            {/* Experience Section */}
            {resume.experience && resume.experience.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid #D5D5CF",
                    paddingBottom: "4px",
                    marginBottom: "12px",
                    color: resume.templateStyle === "executive" ? "#0F172A" : "#1B4332",
                  }}
                >
                  Professional Experience
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} style={{ breakInside: "avoid" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1A1A1A" }}>
                          {exp.role || "Role Title"}
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#666", fontWeight: 500 }}>
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8125rem",
                          color: "#4A4A45",
                          fontWeight: 600,
                          marginBottom: "6px",
                        }}
                      >
                        <span>{exp.company || "Company"}</span>
                        <span>{exp.location}</span>
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "18px",
                          fontSize: "0.835rem",
                          lineHeight: 1.5,
                          color: "#2C2C28",
                        }}
                      >
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: "3px" }}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {resume.education && resume.education.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid #D5D5CF",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                    color: resume.templateStyle === "executive" ? "#0F172A" : "#1B4332",
                  }}
                >
                  Education
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} style={{ breakInside: "avoid" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1A1A1A" }}>
                          {edu.degree} in {edu.field}
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#666" }}>{edu.year}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8125rem",
                          color: "#4A4A45",
                        }}
                      >
                        <span>{edu.school}</span>
                        {edu.honors && <span style={{ fontStyle: "italic" }}>{edu.honors}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Section */}
            {resume.skills && resume.skills.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid #D5D5CF",
                    paddingBottom: "4px",
                    marginBottom: "8px",
                    color: resume.templateStyle === "executive" ? "#0F172A" : "#1B4332",
                  }}
                >
                  Core Domain & Technical Competencies
                </h2>
                <div
                  style={{
                    fontSize: "0.835rem",
                    lineHeight: 1.6,
                    color: "#2C2C28",
                  }}
                >
                  {resume.skills.join("  •  ")}
                </div>
              </section>
            )}

            {/* Certifications Section */}
            {resume.certifications && resume.certifications.length > 0 && (
              <section style={{ marginBottom: "10px" }}>
                <h2
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid #D5D5CF",
                    paddingBottom: "4px",
                    marginBottom: "8px",
                    color: resume.templateStyle === "executive" ? "#0F172A" : "#1B4332",
                  }}
                >
                  Certifications & Professional Credentials
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {resume.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8125rem",
                        color: "#2C2C28",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {cert.name} — <span style={{ color: "#555" }}>{cert.issuer}</span>
                      </span>
                      <span style={{ color: "#666" }}>{cert.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Expert Review Callout beneath Canvas */}
          <div
            className="no-print"
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              borderRadius: "8px",
              backgroundColor: "#FFFBEB",
              border: "1px solid #FCD34D",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "800px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#92400E" }}>
                  Want a Senior Hiring Manager to review this resume?
                </span>
                <span
                  style={{
                    backgroundColor: "#F59E0B",
                    color: "#ffffff",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                  }}
                >
                  ₹1,000 / 30m
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#B45309" }}>
                Book a 1-on-1 private call for line-by-line critique, ATS keyword optimization, and video interview coaching.
              </p>
            </div>
            <button
              onClick={() => {
                setBookingReceipt(null);
                setShowExpertModal(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#B45309",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              <PhoneCall size={14} /> Book Expert Review (₹1,000)
            </button>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* EXPERT 1-ON-1 GUIDANCE MODAL (Rs 1,000 / 30 mins) */}
      {/* ======================================================== */}
      {showExpertModal && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              border: "1px solid var(--line, #E5E5DF)",
              padding: "24px 28px",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      backgroundColor: "#FEF3C7",
                      color: "#92400E",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      border: "1px solid #FCD34D",
                    }}
                  >
                    PREMIUM CANDIDATE OFFERING
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted, #666660)" }}>
                    AI Builder is 100% Free · Expert Calls Chargeable
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.375rem",
                    fontWeight: 700,
                    color: "var(--ink, #1C1B18)",
                    margin: 0,
                  }}
                >
                  30-Minute 1-on-1 Expert Resume Guidance
                </h2>
              </div>
              <button
                onClick={() => setShowExpertModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: If already booked, show receipt; otherwise show booking form */}
            {bookingReceipt ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(27, 67, 50, 0.1)",
                    color: "#1B4332",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  Expert Session Confirmed!
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted, #666660)", margin: "0 0 20px" }}>
                  A calendar invite and meeting details have been sent to <strong>{expertCandidateEmail}</strong>.
                </p>

                {/* Receipt Card */}
                <div
                  style={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid var(--line, #E5E5DF)",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "left",
                    fontSize: "0.8125rem",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--muted, #666660)" }}>Receipt #:</span>
                    <span style={{ fontWeight: 700 }}>{bookingReceipt.receipt?.receiptNumber}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--muted, #666660)" }}>Expert Mentor:</span>
                    <span style={{ fontWeight: 700 }}>{bookingReceipt.booking?.expertName}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--muted, #666660)" }}>Scheduled Slot:</span>
                    <span style={{ fontWeight: 700 }}>{bookingReceipt.booking?.slot}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--muted, #666660)" }}>Service Fee:</span>
                    <span style={{ fontWeight: 800, color: "#1B4332" }}>₹1,000 (Paid / Confirmed)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px dashed #ddd" }}>
                    <span style={{ color: "var(--muted, #666660)" }}>Video Meeting Room:</span>
                    <a
                      href={bookingReceipt.booking?.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#1B4332", fontWeight: 700, textDecoration: "underline" }}
                    >
                      Open Meeting Room →
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setShowExpertModal(false)}
                  style={{
                    backgroundColor: "#1B4332",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 24px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Done & Return to Builder
                </button>
              </div>
            ) : (
              <div>
                {/* Expert Picker */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>
                    SELECT EXPERT MENTOR:
                  </label>
                  <select
                    value={selectedExpert.id}
                    onChange={(e) => {
                      const exp = EXPERT_MENTORS.find((m) => m.id === e.target.value) || EXPERT_MENTORS[0];
                      setSelectedExpert(exp);
                      setSelectedSlot(exp.availability[0]);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--line, #E5E5DF)",
                      fontSize: "0.875rem",
                      marginBottom: "8px",
                    }}
                  >
                    {EXPERT_MENTORS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — {m.role} ({m.formerCompany})
                      </option>
                    ))}
                  </select>

                  {/* Selected Expert Snapshot */}
                  <div
                    style={{
                      backgroundColor: "#FAF9F6",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      border: "1px solid var(--line, #E5E5DF)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--ink, #1C1B18)" }}>
                      {selectedExpert.name} · <span style={{ color: "#1B4332" }}>⭐ {selectedExpert.rating} Rating</span>
                    </div>
                    <div style={{ color: "var(--muted, #666660)", fontSize: "0.75rem" }}>
                      Specialization: {selectedExpert.industry} | Former: {selectedExpert.formerCompany}
                    </div>
                  </div>
                </div>

                {/* Slot Selector */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>
                    CHOOSE AVAILABLE TIME SLOT (30 MIN):
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {selectedExpert.availability.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: selectedSlot === slot ? "2px solid #1B4332" : "1px solid var(--line, #E5E5DF)",
                          backgroundColor: selectedSlot === slot ? "rgba(27, 67, 50, 0.08)" : "#ffffff",
                          color: selectedSlot === slot ? "#1B4332" : "var(--ink, #1C1B18)",
                          fontWeight: selectedSlot === slot ? 700 : 500,
                          fontSize: "0.8125rem",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        🕒 {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Contact Inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      value={expertCandidateName}
                      onChange={(e) => setExpertCandidateName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      value={expertCandidateEmail}
                      onChange={(e) => setExpertCandidateEmail(e.target.value)}
                      placeholder="aarav@example.com"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      value={expertCandidatePhone}
                      onChange={(e) => setExpertCandidatePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, marginBottom: "4px" }}>
                      QUESTIONS / FOCUS AREA FOR EXPERT (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={expertNotes}
                      onChange={(e) => setExpertNotes(e.target.value)}
                      placeholder="e.g. Target role is Senior Financial Analyst at Big 4, want advice on bullet metrics..."
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--line, #E5E5DF)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </div>
                </div>

                {/* Pricing & Guarantee Box */}
                <div
                  style={{
                    backgroundColor: "#FEF3C7",
                    border: "1px solid #FCD34D",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#92400E" }}>
                      Total Consultation Fee: ₹1,000
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#B45309" }}>
                      30-Minute 1-on-1 Session · 100% Satisfaction Guarantee
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#92400E",
                    }}
                  >
                    ₹1,000
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleBookExpert}
                  disabled={isBooking}
                  style={{
                    width: "100%",
                    backgroundColor: "#1B4332",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "12px 20px",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    cursor: isBooking ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <CreditCard size={18} />
                  {isBooking ? "Confirming Session with Expert..." : "Confirm & Schedule Expert Review (₹1,000)"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
