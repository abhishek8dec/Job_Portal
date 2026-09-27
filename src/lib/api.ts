import { NextResponse } from "next/server";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export function errorResponse(e: unknown): NextResponse {
  console.error("[API Error]", e);

  if (e instanceof HttpError) {
    return NextResponse.json(
      { error: e.message, status: e.status },
      { status: e.status }
    );
  }

  const message = e instanceof Error ? e.message : "Internal Server Error";
  return NextResponse.json(
    { error: message, status: 500 },
    { status: 500 }
  );
}
