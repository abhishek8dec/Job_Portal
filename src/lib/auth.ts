import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const AUTH_SECRET = process.env.AUTH_SECRET || "job-com-super-secret-auth-key-2026";
export const AUTH_COOKIE_NAME = "job_com_auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
  company?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
}

/**
 * Hash password with salt using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(computedHash, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Sign session token: base64(userId:role:expiresAt):signature
 */
export function signSessionToken(userId: string, role: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = Buffer.from(`${userId}:${role}:${expiresAt}`).toString("base64");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verify and parse session token
 */
export function verifySessionToken(token: string): { userId: string; role: string } | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(payload)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      )
    ) {
      return null;
    }

    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    const [userId, role, expiresAtStr] = decoded.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) {
      return null; // Expired
    }

    return { userId, role };
  } catch {
    return null;
  }
}

/**
 * Server-side helper to get current authenticated user
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const verified = verifySessionToken(token);
    if (!verified) return null;

    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        title: true,
        avatarUrl: true,
      },
    });

    if (!user) return null;
    return user as SessionUser;
  } catch {
    return null;
  }
}
