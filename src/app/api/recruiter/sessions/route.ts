import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  try {
    const sessions = await prisma.interviewSession.findMany({
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ sessions });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateName, candidateEmail, jobId, customQuestions } = body;

    if (!candidateName || !candidateEmail) {
      throw new HttpError(400, "Candidate name and email are required");
    }

    const token = `cand-${crypto.randomBytes(4).toString("hex")}`;

    // Standard questions or custom questions
    const defaultQuestions = [
      {
        prompt: "Tell us about your background and what excites you about this role at Job.Com.",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
        order: 0,
      },
      {
        prompt: "Describe a high-stakes technical challenge you solved and how you validated the outcome.",
        timeLimitSeconds: 120,
        retakesAllowed: 1,
        order: 1,
      },
      {
        prompt: "How do you approach team collaboration, code reviews, and resolving technical disagreements?",
        timeLimitSeconds: 90,
        retakesAllowed: 1,
        order: 2,
      },
    ];

    const questionsToCreate =
      customQuestions && customQuestions.length > 0
        ? customQuestions
        : defaultQuestions;

    const session = await prisma.interviewSession.create({
      data: {
        token,
        candidateName,
        candidateEmail,
        jobId: jobId || null,
        status: "INVITED",
        consent: false,
        questions: {
          create: questionsToCreate.map(
            (q: { prompt: string; timeLimitSeconds?: number; retakesAllowed?: number }, idx: number) => ({
              prompt: q.prompt,
              timeLimitSeconds: q.timeLimitSeconds ?? 90,
              retakesAllowed: q.retakesAllowed ?? 1,
              order: idx,
            })
          ),
        },
      },
      include: {
        job: true,
        questions: true,
      },
    });

    return NextResponse.json({
      success: true,
      session,
      interviewUrl: `/interview/${session.token}`,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
