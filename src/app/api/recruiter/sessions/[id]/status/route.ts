import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * PATCH /api/recruiter/sessions/[id]/status
 * Update candidate status (e.g. SHORTLISTED, REJECTED, IN_REVIEW)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      throw new HttpError(400, "Status is required");
    }

    const validStatuses = ["INVITED", "IN_PROGRESS", "COMPLETED", "SHORTLISTED", "REJECTED", "IN_REVIEW"];
    if (!validStatuses.includes(status)) {
      throw new HttpError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const session = await prisma.interviewSession.update({
      where: { id },
      data: { status },
      include: {
        job: true,
        questions: {
          include: {
            responses: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      session,
      message: `Candidate marked as ${status}`,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
