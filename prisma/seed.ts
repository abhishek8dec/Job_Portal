import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database with users and interviews...");
  await prisma.interviewResponse.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.interviewSession.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = hashPassword("password123");

  // 1. Create Default Users
  const recruiterUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "recruiter@job.com",
      password: defaultPassword,
      role: "RECRUITER",
      company: "Job.Com",
      title: "Head of Talent & Recruitment",
    },
  });

  const candidateUser1 = await prisma.user.create({
    data: {
      name: "Alex Mercer",
      email: "alex.mercer@example.com",
      password: defaultPassword,
      role: "CANDIDATE",
      title: "Principal Software Engineer",
    },
  });

  const candidateUser2 = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena.rostova@example.com",
      password: defaultPassword,
      role: "CANDIDATE",
      title: "Senior Full-Stack Architect",
    },
  });

  // 2. Create Jobs
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
      recruiterId: recruiterUser.id,
    },
  });

  await prisma.job.create({
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
      recruiterId: recruiterUser.id,
    },
  });

  await prisma.job.create({
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
      recruiterId: recruiterUser.id,
    },
  });

  // 3. Candidate 1 (Alex Mercer - Assigned & Ready to test)
  const session1 = await prisma.interviewSession.create({
    data: {
      token: "demo-candidate-1",
      candidateName: "Alex Mercer",
      candidateEmail: "alex.mercer@example.com",
      candidateId: candidateUser1.id,
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

  // 4. Candidate 2 (Elena Rostova - Completed with video responses)
  const session2 = await prisma.interviewSession.create({
    data: {
      token: "demo-candidate-2",
      candidateName: "Elena Rostova",
      candidateEmail: "elena.rostova@example.com",
      candidateId: candidateUser2.id,
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

  console.log("Seeding complete with default accounts:");
  console.log("Recruiter User: recruiter@job.com (password123)");
  console.log("Candidate User 1: alex.mercer@example.com (password123)");
  console.log("Candidate User 2: elena.rostova@example.com (password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
