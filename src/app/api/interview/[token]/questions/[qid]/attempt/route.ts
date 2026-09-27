import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { loadSessionByToken, hasSubmitted, GRACE_SECONDS } from "@/lib/interview";
import { createUploadUrl, keyFor } from "@/lib/storage";
import { prisma } from "@/lib/db";

/**
 * Opens an attempt. Server decides: retake allowance, question order, deadline.
 * A client-side timer is UI sugar only — this row's recordedAt is the authority.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ token: string; qid: string }> }) {
  try {
    const { token, qid } = await params;
    const s = await loadSessionByToken(token);
    const { session } = s;
    if (session.status !== "IN_PROGRESS" || !session.consent)
      throw new HttpError(409, "Session not active");

    const idx = session.questions.findIndex((q) => q.id === qid);
    if (idx === -1) throw new HttpError(404, "Unknown question");
    for (let i = 0; i < idx; i++)
      if (!hasSubmitted(session.questions[i])) throw new HttpError(409, "Previous questions must be answered first");
    const q = session.questions[idx];
    if (hasSubmitted(q)) throw new HttpError(409, "This question is already submitted");

    const attemptsUsed = q.responses.length;           // RECORDING + SUBMITTED rows both count
    const allowedTotal = 1 + q.retakesAllowed;
    if (attemptsUsed >= allowedTotal)
      throw new HttpError(403, "No attempts remaining for this question");

    const resp = await prisma.interviewResponse.create({
      data: { questionId: q.id, attempt: attemptsUsed + 1, status: "RECORDING" },
    });
    const key = keyFor(session.id, q.id, resp.attempt);
    const upload = await createUploadUrl(key);
    return NextResponse.json({
      attempt: resp.attempt,
      retakesRemaining: allowedTotal - resp.attempt,
      deadline: resp.recordedAt.getTime() + q.timeLimitSeconds * 1000, // hard stop for recording
      graceSeconds: GRACE_SECONDS,                                    // upload allowance
      upload,
    });
  } catch (e) { return errorResponse(e); }
}
