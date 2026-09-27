import { prisma } from "@/lib/db";
import { HttpError } from "@/lib/api";

export const GRACE_SECONDS = 30;

export interface SessionQuestionResponse {
  id: string;
  questionId: string;
  attempt: number;
  status: string;
  storageKey: string | null;
  videoUrl: string | null;
  recordedAt: Date;
  submittedAt: Date | null;
  score?: number | null;
  feedback?: string | null;
}

export interface SessionQuestion {
  id: string;
  sessionId: string;
  prompt: string;
  timeLimitSeconds: number;
  retakesAllowed: number;
  order: number;
  responses: SessionQuestionResponse[];
}

export interface InterviewSessionData {
  id: string;
  token: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string | null;
  job?: {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    type: string;
    salary: string;
  } | null;
  status: string; // "INVITED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED"
  consent: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  questions: SessionQuestion[];
}

export function hasSubmitted(question: SessionQuestion): boolean {
  if (!question || !question.responses) return false;
  return question.responses.some((r) => r.status === "SUBMITTED");
}

export async function loadSessionByToken(token: string): Promise<{ session: InterviewSessionData }> {
  if (!token) {
    throw new HttpError(400, "Interview token is required");
  }

  const session = await prisma.interviewSession.findUnique({
    where: { token },
    include: {
      job: true,
      questions: {
        orderBy: { order: "asc" },
        include: {
          responses: {
            orderBy: { attempt: "asc" },
          },
        },
      },
    },
  });

  if (!session) {
    throw new HttpError(404, "Invalid or expired interview session");
  }

  return { session: session as unknown as InterviewSessionData };
}
