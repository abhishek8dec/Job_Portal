import { NextResponse } from "next/server";
import { errorResponse, HttpError } from "@/lib/api";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

// Maximum allowable video payload per question (100MB)
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export async function PUT(req: Request) {
  return handleUpload(req);
}

export async function POST(req: Request) {
  return handleUpload(req);
}

async function handleUpload(req: Request) {
  try {
    const url = new URL(req.url);
    const rawKey = url.searchParams.get("key") || `interviews/default_${Date.now()}.webm`;
    
    // Clean key to prevent directory traversal
    const safeKey = rawKey.replace(/[^a-zA-Z0-9_\-\.\/]/g, "").replace(/\.\./g, "");

    const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
    const targetFilePath = path.join(publicUploadsDir, safeKey);
    const targetDirPath = path.dirname(targetFilePath);

    await fs.mkdir(targetDirPath, { recursive: true });

    let writtenBytes = 0;

    // Stream directly to disk to maintain < 64KB memory footprint per connection
    // (Crucial for scaling to 1,000+ simultaneous candidate video uploads without Node.js OOM)
    if (req.body) {
      const nodeStream = Readable.fromWeb(req.body as unknown as import("stream/web").ReadableStream);
      const writeStream = fsSync.createWriteStream(targetFilePath);

      nodeStream.on("data", (chunk: Buffer) => {
        writtenBytes += chunk.length;
        if (writtenBytes > MAX_UPLOAD_BYTES) {
          nodeStream.destroy(new Error("Upload exceeded 100MB maximum limit"));
        }
      });

      await pipeline(nodeStream, writeStream);
    } else {
      const arrayBuffer = await req.arrayBuffer();
      writtenBytes = arrayBuffer.byteLength;
      if (writtenBytes > MAX_UPLOAD_BYTES) {
        throw new HttpError(413, "Upload exceeded 100MB maximum limit");
      }
      await fs.writeFile(targetFilePath, Buffer.from(arrayBuffer));
    }

    const publicUrl = `/uploads/${safeKey}`;

    return NextResponse.json({
      success: true,
      key: safeKey,
      url: publicUrl,
      size: writtenBytes,
    });
  } catch (e) {
    return errorResponse(e);
  }
}

