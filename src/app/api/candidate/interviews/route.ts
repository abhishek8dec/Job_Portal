import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const url = new URL(req.url);
    const emailParam = url.searchParams.get("email");

    const targetEmail = emailParam?.trim().toLowerCase() || user?.email?.toLowerCase() || "alex.mercer@example.com";
    const targetUserId = user?.id || null;

    const whereClause = targetUserId
      ? {
          OR: [
            { candidateId: targetUserId },
            { candidateEmail: targetEmail },
          ],
        }
      : {
          candidateEmail: targetEmail,
        };

    const sessions = await prisma.interviewSession.findMany({
      where: whereClause,
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

    const shaped = sessions.map((s) => {
      const answeredCount = s.questions.filter((q) =>
        q.responses.some((r) => r.status === "SUBMITTED")
      ).length;

      // Extract aggregate rubric score if completed
      let totalScore = 0;
      let scoreCount = 0;
      let techTotal = 0;
      let commTotal = 0;
      let probTotal = 0;

      s.questions.forEach((q) => {
        const lastResp = q.responses[q.responses.length - 1];
        if (lastResp?.score) {
          totalScore += lastResp.score;
          scoreCount++;
        }
        if (lastResp?.feedback) {
          try {
            const fb = JSON.parse(lastResp.feedback);
            if (fb.technicalScore) techTotal += fb.technicalScore;
            if (fb.clarityScore) commTotal += fb.clarityScore;
            if (fb.problemSolvingScore) probTotal += fb.problemSolvingScore;
          } catch (_) {}
        }
      });

      const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : null;
      const techScore = scoreCount > 0 ? Math.round(techTotal / scoreCount) : null;
      const commScore = scoreCount > 0 ? Math.round(commTotal / scoreCount) : null;
      const probScore = scoreCount > 0 ? Math.round(probTotal / scoreCount) : null;

      return {
        id: s.id,
        token: s.token,
        status: s.status,
        candidateName: s.candidateName,
        candidateEmail: s.candidateEmail,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        createdAt: s.createdAt,
        job: s.job,
        totalQuestions: s.questions.length,
        answeredQuestions: answeredCount,
        interviewUrl: `/interview/${s.token}`,
        scores: avgScore
          ? {
              overall: avgScore,
              technical: techScore || avgScore,
              communication: commScore || avgScore,
              problemSolving: probScore || avgScore,
            }
          : null,
      };
    });

    return NextResponse.json({
      sessions: shaped,
      candidate: user || {
        name: sessions[0]?.candidateName || "Candidate",
        email: targetEmail,
        role: "CANDIDATE",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}

