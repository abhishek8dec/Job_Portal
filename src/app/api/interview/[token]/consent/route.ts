import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { loadSessionByToken } from "@/lib/interview";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { session } = await loadSessionByToken(token);

    if (session.status === "COMPLETED") {
      throw new HttpError(400, "Interview already completed");
    }

    const updated = await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        consent: true,
        status: "IN_PROGRESS",
        startedAt: session.startedAt ?? new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      status: updated.status,
      consent: updated.consent,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
