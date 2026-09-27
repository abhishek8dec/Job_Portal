export interface UploadDescriptor {
  url: string;
  method: string;
  key: string;
  expiresAt: number;
}

/**
 * Returns a standardized storage key for candidate interview attempts.
 */
export function keyFor(sessionId: string, qid: string, attempt: number): string {
  return `interviews/${sessionId}/${qid}/attempt_${attempt}.webm`;
}

/**
 * In this prototype, creates an upload target URL handled by our internal streaming upload API.
 * In a multi-cloud production environment (AWS S3 / Cloudflare R2), this generates a presigned PUT URL.
 */
export async function createUploadUrl(key: string): Promise<UploadDescriptor> {
  // 15-minute expiration timestamp
  const expiresAt = Date.now() + 15 * 60 * 1000;
  
  return {
    url: `/api/storage/upload?key=${encodeURIComponent(key)}`,
    method: "PUT",
    key,
    expiresAt,
  };
}
