import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    // Clear previous demo records if requested or initialize
    const existingJobsCount = await prisma.job.count();
    if (existingJobsCount > 0) {
      return NextResponse.json({
        message: "Database already populated",
        readyTokens: ["demo-candidate-1", "demo-candidate-2"],
      });
    }

    // 1. Create Jobs
    const job1 = await prisma.job.create({
      data: {
        title: "Principal AI & Full-Stack Architect",
        company: "Job.Com",
        department: "Core Engineering",
        location: "San Francisco, CA (Remote Friendly)",
        type: "Full-time",
        salary: "$190,000 - $240,000 + Equity",
        description:
          "Lead the architecture of Job.Com's next-gen asynchronous video screening, real-time media ingestion, and candidate assessment infrastructure.",
        status: "ACTIVE",
      },
    });

    const job2 = await prisma.job.create({
      data: {
        title: "Staff Systems Reliability & Cloud Architect",
        company: "Job.Com",
        department: "Infrastructure",
        location: "Austin, TX / Remote",
        type: "Full-time",
        salary: "$175,000 - $220,000",
        description:
          "Design resilient media ingestion pipelines, edge video encoding, and automated scaling for thousands of concurrent video interviews.",
        status: "ACTIVE",
      },
    });

    const job3 = await prisma.job.create({
      data: {
        title: "Senior Product Designer (Design Systems)",
        company: "Job.Com",
        department: "Product Experience",
        location: "New York, NY / Hybrid",
        type: "Full-time",
        salary: "$150,000 - $185,000",
        description:
          "Create human-centered, accessible candidate interview rooms and intuitive recruiter decision workspaces.",
        status: "ACTIVE",
      },
    });

    // 2. Create Candidate 1 (Ready to interview)
    const session1 = await prisma.interviewSession.create({
      data: {
        token: "demo-candidate-1",
        candidateName: "Alex Mercer",
        candidateEmail: "alex.mercer@example.com",
        jobId: job1.id,
        status: "INVITED",
        consent: false,
        questions: {
          create: [
            {
              prompt:
                "Introduce yourself and share why your experience makes you uniquely suited for this Principal Architect role.",
              timeLimitSeconds: 90,
              retakesAllowed: 1,
              order: 0,
            },
            {
              prompt:
                "Walk us through how you would architect a distributed server-authoritative timer and video upload pipeline that prevents candidate tampering.",
              timeLimitSeconds: 120,
              retakesAllowed: 1,
              order: 1,
            },
            {
              prompt:
                "Tell us about a time you resolved a major production bottleneck under strict deadline constraints.",
              timeLimitSeconds: 90,
              retakesAllowed: 1,
              order: 2,
            },
          ],
        },
      },
    });

    // 3. Create Candidate 2 (Already completed, for recruiter review demo)
    const session2 = await prisma.interviewSession.create({
      data: {
        token: "demo-candidate-2",
        candidateName: "Elena Rostova",
        candidateEmail: "elena.rostova@example.com",
        jobId: job1.id,
        status: "COMPLETED",
        consent: true,
        startedAt: new Date(Date.now() - 3600 * 1000),
        completedAt: new Date(Date.now() - 1800 * 1000),
        questions: {
          create: [
            {
              prompt:
                "Introduce yourself and share why your experience makes you uniquely suited for this Principal Architect role.",
              timeLimitSeconds: 90,
              retakesAllowed: 1,
              order: 0,
              responses: {
                create: [
                  {
                    attempt: 1,
                    status: "SUBMITTED",
                    storageKey: "interviews/demo2/q1/attempt_1.webm",
                    videoUrl:
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    recordedAt: new Date(Date.now() - 3500 * 1000),
                    submittedAt: new Date(Date.now() - 3420 * 1000),
                    score: 95,
                    feedback: "Exceptional clarity, strong communication and concise technical background.",
                  },
                ],
              },
            },
            {
              prompt:
                "Walk us through how you would architect a distributed server-authoritative timer and video upload pipeline that prevents candidate tampering.",
              timeLimitSeconds: 120,
              retakesAllowed: 1,
              order: 1,
              responses: {
                create: [
                  {
                    attempt: 1,
                    status: "SUBMITTED",
                    storageKey: "interviews/demo2/q2/attempt_1.webm",
                    videoUrl:
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                    recordedAt: new Date(Date.now() - 3000 * 1000),
                    submittedAt: new Date(Date.now() - 2900 * 1000),
                    score: 92,
                    feedback: "Thorough understanding of server authority, signed URLs, and clock skew mitigations.",
                  },
                ],
              },
            },
            {
              prompt:
                "Tell us about a time you resolved a major production bottleneck under strict deadline constraints.",
              timeLimitSeconds: 90,
              retakesAllowed: 1,
              order: 2,
              responses: {
                create: [
                  {
                    attempt: 1,
                    status: "SUBMITTED",
                    storageKey: "interviews/demo2/q3/attempt_1.webm",
                    videoUrl:
                      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                    recordedAt: new Date(Date.now() - 2500 * 1000),
                    submittedAt: new Date(Date.now() - 2440 * 1000),
                    score: 88,
                    feedback: "Good incident response methodology, articulated root cause analysis clearly.",
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      demoTokens: [session1.token, session2.token],
      jobsCount: 3,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
