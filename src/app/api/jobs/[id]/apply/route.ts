import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// Default role-specific question sets
function getQuestionsForJob(title: string, dept: string) {
  const isEngineering =
    dept.toLowerCase().includes("engineer") ||
    dept.toLowerCase().includes("infra") ||
    title.toLowerCase().includes("architect") ||
    title.toLowerCase().includes("engineer");

  const isDesign =
    dept.toLowerCase().includes("design") ||
    title.toLowerCase().includes("designer") ||
    dept.toLowerCase().includes("product");

  if (isEngineering) {
    return [
      {
        prompt: `Explain how you would architect a high-throughput, distributed ingestion service for ${title}. What tradeoffs would you make between latency and consistency?`,
        timeLimitSeconds: 120,
        retakesAllowed: 1,
      },
      {
        prompt:
          "Walk us through a critical production incident or architecture bottleneck you diagnosed and resolved under pressure.",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
      },
      {
        prompt:
          "How do you enforce rigorous automated testing, code review standards, and API contracts across a distributed engineering team?",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
      },
    ];
  }

  if (isDesign) {
    return [
      {
        prompt: `Walk us through your design process for ${title}. How do you bridge the gap between user research, accessibility, and high-fidelity interaction design?`,
        timeLimitSeconds: 120,
        retakesAllowed: 1,
      },
      {
        prompt:
          "Describe how you structure a reusable design system and maintain token consistency across complex web applications.",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
      },
      {
        prompt:
          "Share an example of a difficult stakeholder disagreement on product direction and how you used prototypes and evidence to reach consensus.",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
      },
    ];
  }

  return [
    {
      prompt: `Why are you interested in the ${title} position at Job.Com, and what unique experience makes you a strong fit?`,
      timeLimitSeconds: 90,
      retakesAllowed: 1,
    },
    {
      prompt:
        "Describe a major project where you had to prioritize competing deadlines with limited resources. How did you ensure quality delivery?",
      timeLimitSeconds: 90,
      retakesAllowed: 1,
    },
    {
      prompt:
        "How do you communicate complex technical or operational concepts to cross-functional partners and leadership?",
      timeLimitSeconds: 90,
      retakesAllowed: 1,
    },
  ];
}

/**
 * POST /api/jobs/[id]/apply
 * 1-Click candidate application & instant interview session generation
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const body = await req.json().catch(() => ({}));

    const candidateName = body.candidateName || user?.name;
    const candidateEmail = body.candidateEmail || user?.email;

    if (!candidateName || !candidateEmail) {
      throw new HttpError(
        400,
        "Candidate full name and email address are required to apply"
      );
    }

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new HttpError(404, "Job position not found");
    }

    // Check if candidate already has an active session for this job
    const existingSession = await prisma.interviewSession.findFirst({
      where: {
        jobId: job.id,
        candidateEmail: candidateEmail.toLowerCase().trim(),
      },
      include: {
        questions: true,
      },
    });

    if (existingSession) {
      return NextResponse.json({
        success: true,
        alreadyApplied: true,
        session: existingSession,
        token: existingSession.token,
        interviewUrl: `/interview/${existingSession.token}`,
        message: "You have an existing application for this role. Redirecting to your session.",
      });
    }

    // Provision new interview session
    const token = `cand-${crypto.randomBytes(4).toString("hex")}`;
    let questionList: { prompt: string; timeLimitSeconds: number; retakesAllowed: number }[] = [];

    if (job.questionsJson) {
      try {
        const parsed = JSON.parse(job.questionsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          questionList = parsed.map((item: unknown) => {
            if (typeof item === "string") {
              return { prompt: item, timeLimitSeconds: 90, retakesAllowed: 1 };
            }
            const obj = item as { prompt?: string; timeLimitSeconds?: number; retakesAllowed?: number };
            return {
              prompt: obj.prompt || "Please explain your approach and experience.",
              timeLimitSeconds: obj.timeLimitSeconds ? Number(obj.timeLimitSeconds) : 90,
              retakesAllowed: obj.retakesAllowed ? Number(obj.retakesAllowed) : 1,
            };
          });
        }
      } catch (e) {
        console.warn("Could not parse job.questionsJson:", e);
      }
    }

    if (questionList.length === 0) {
      questionList = getQuestionsForJob(job.title, job.department);
    }

    const session = await prisma.interviewSession.create({
      data: {
        token,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.toLowerCase().trim(),
        candidateId: user?.id || null,
        jobId: job.id,
        status: "INVITED",
        consent: false,
        questions: {
          create: questionList.map((q, idx) => ({
            prompt: q.prompt,
            timeLimitSeconds: q.timeLimitSeconds,
            retakesAllowed: q.retakesAllowed,
            order: idx,
          })),
        },
      },
      include: {
        job: true,
        questions: true,
      },
    });

    return NextResponse.json({
      success: true,
      alreadyApplied: false,
      session,
      token: session.token,
      interviewUrl: `/interview/${session.token}`,
      message: "Application submitted! Your video interview room is ready.",
    });
  } catch (e) {
    return errorResponse(e);
  }
}
