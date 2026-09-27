import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";

interface ExpertProfile {
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

const EXPERT_PROFILES: ExpertProfile[] = [
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

// In-memory booked sessions store
const BOOKINGS_STORE: Array<{
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  expertId: string;
  expertName: string;
  industry: string;
  slot: string;
  notes?: string;
  amount: string;
  duration: string;
  meetingUrl: string;
  createdAt: string;
}> = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    pricingPolicy: {
      selfServiceBuilder: "100% Free Forever",
      expertAdvice: "₹1,000 per 30-Minute 1-on-1 Session",
      currency: "INR",
      amount: 1000,
      durationMinutes: 30,
    },
    experts: EXPERT_PROFILES,
    totalBookingsHandled: BOOKINGS_STORE.length + 840,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      candidateName,
      candidateEmail,
      candidatePhone,
      expertId,
      industry = "Accounting & Finance",
      slot,
      notes,
    } = body;

    if (!candidateName || !candidateEmail || !candidatePhone) {
      throw new HttpError(400, "Please provide your full name, email address, and phone number.");
    }

    const matchedExpert =
      EXPERT_PROFILES.find((e) => e.id === expertId) ||
      EXPERT_PROFILES.find((e) => e.industry === industry) ||
      EXPERT_PROFILES[0];

    const bookingId = `EXP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const meetingUrl = `https://meet.job.com/expert-room/${bookingId.toLowerCase()}`;

    const newBooking = {
      id: bookingId,
      candidateName,
      candidateEmail,
      candidatePhone,
      expertId: matchedExpert.id,
      expertName: matchedExpert.name,
      industry: matchedExpert.industry,
      slot: slot || matchedExpert.availability[0],
      notes: notes || "General resume critique and video interview positioning",
      amount: "₹1,000",
      duration: "30 Minutes",
      meetingUrl,
      createdAt: new Date().toISOString(),
    };

    BOOKINGS_STORE.push(newBooking);

    return NextResponse.json({
      success: true,
      message: "Expert 1-on-1 session confirmed successfully!",
      booking: newBooking,
      receipt: {
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        billedTo: candidateName,
        email: candidateEmail,
        service: "30-Minute 1-on-1 Expert Resume Guidance & Mock Interview Call",
        expertMentor: matchedExpert.name,
        credentials: `${matchedExpert.role} (${matchedExpert.formerCompany})`,
        fee: "₹1,000",
        tax: "Inclusive of GST",
        paymentStatus: "CONFIRMED",
        instructions:
          "Your expert will review your current Job.Com resume draft prior to the call. Please join the meeting room 2 minutes early with your webcam enabled.",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
