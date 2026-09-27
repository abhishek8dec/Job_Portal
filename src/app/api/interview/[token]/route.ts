import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api";
import { loadSessionByToken, hasSubmitted } from "@/lib/interview";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { session } = await loadSessionByToken(token);

    const questionsWithStatus = session.questions.map((q, idx) => {
      const submitted = hasSubmitted(q);
      const attemptsUsed = q.responses.length;
      const allowedTotal = 1 + q.retakesAllowed;
      const retakesRemaining = Math.max(0, allowedTotal - attemptsUsed);
      const latestResponse =
        q.responses.length > 0
          ? q.responses[q.responses.length - 1]
          : null;

      return {
        id: q.id,
        order: q.order ?? idx,
        prompt: q.prompt,
        timeLimitSeconds: q.timeLimitSeconds,
        retakesAllowed: q.retakesAllowed,
        attemptsUsed,
        retakesRemaining,
        isSubmitted: submitted,
        latestResponse,
      };
    });

    const activeQuestionIndex = questionsWithStatus.findIndex(
      (q) => !q.isSubmitted
    );

    return NextResponse.json({
      session: {
        id: session.id,
        token: session.token,
        candidateName: session.candidateName,
        candidateEmail: session.candidateEmail,
        status: session.status,
        consent: session.consent,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        job: session.job,
        questions: questionsWithStatus,
        activeQuestionIndex:
          activeQuestionIndex === -1 ? questionsWithStatus.length : activeQuestionIndex,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
