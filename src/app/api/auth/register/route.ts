import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { hashPassword, signSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, company, title } = body;

    if (!name || !email || !password) {
      throw new HttpError(400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      throw new HttpError(400, "Password must be at least 6 characters");
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      throw new HttpError(409, "An account with this email already exists");
    }

    const userRole = role === "RECRUITER" ? "RECRUITER" : "CANDIDATE";
    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: userRole,
        company: userRole === "RECRUITER" ? company?.trim() || "Job.Com Partner" : null,
        title: title?.trim() || (userRole === "RECRUITER" ? "Talent Partner" : "Candidate"),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        title: true,
      },
    });

    const token = signSessionToken(user.id, user.role);

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (e) {
    return errorResponse(e);
  }
}
