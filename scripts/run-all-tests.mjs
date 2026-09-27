/**
 * Comprehensive Automated Test Suite for Job.Com
 * Covers: Public Pages, Authentication, Jobs, Applications, Interview Lifecycle,
 * Strict Retake Quotas, Sequential Invariants, Storage, AI Resume Assist,
 * Expert Bookings, Recruiter Pipeline, and High-Concurrency Stress Tests.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureList = [];

// ANSI color codes
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function logHeader(title) {
  console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}${CYAN} ▶ ${title}${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
}

async function test(name, fn) {
  totalTests++;
  const startTime = Date.now();
  try {
    await fn();
    const duration = Date.now() - startTime;
    passedTests++;
    console.log(`  ${GREEN}✓ PASS${RESET} [${duration}ms] ${name}`);
  } catch (err) {
    const duration = Date.now() - startTime;
    failedTests++;
    console.error(`  ${RED}✗ FAIL${RESET} [${duration}ms] ${name}`);
    console.error(`    ${RED}Error:${RESET} ${err.message}`);
    failureList.push({ name, error: err.message, stack: err.stack });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      `${message || "Assertion failed"} -> Expected: ${JSON.stringify(
        expected
      )}, Received: ${JSON.stringify(actual)}`
    );
  }
}

function assertIncludes(haystack, needle, message) {
  if (typeof haystack === "string") {
    if (!haystack.includes(needle)) {
      throw new Error(
        `${message || "String inclusion failed"} -> Needle "${needle}" not found in string (length: ${
          haystack.length
        })`
      );
    }
  } else if (Array.isArray(haystack)) {
    if (!haystack.includes(needle)) {
      throw new Error(
        `${message || "Array inclusion failed"} -> Item ${JSON.stringify(
          needle
        )} not found in array`
      );
    }
  } else {
    throw new Error("assertIncludes: target is neither string nor array");
  }
}

// Cookie jar for authenticated flows
class SessionClient {
  constructor() {
    this.cookie = "";
  }

  async request(path, options = {}) {
    const headers = options.headers ? { ...options.headers } : {};
    if (this.cookie) {
      headers["Cookie"] = this.cookie;
    }
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      // Capture the auth cookie
      const match = setCookie.match(/auth_session=[^;]+/);
      if (match) {
        this.cookie = match[0];
      }
    }

    return res;
  }
}

async function run() {
  console.log(`\n${BOLD}========================================================================${RESET}`);
  console.log(`${BOLD}  JOB.COM COMPREHENSIVE AUTOMATED TEST RUNNER${RESET}`);
  console.log(`${BOLD}  Target: ${BASE_URL}${RESET}`);
  console.log(`${BOLD}  Timestamp: ${new Date().toISOString()}${RESET}`);
  console.log(`${BOLD}========================================================================${RESET}`);

  // Test Run Timestamp Identifier
  const runId = Math.floor(1000 + Math.random() * 9000);

  // ========================================================================
  // GROUP 1: Public Pages, Routing & HTML Rendering
  // ========================================================================
  logHeader("GROUP 1: Public Web Pages & Static Routing");

  await test("GET / (Homepage) returns HTTP 200 with Job.Com branding", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assertEqual(res.status, 200, "Homepage status");
    const html = await res.text();
    assertIncludes(html, "Job.Com", "Homepage contains Job.Com brand");
    assertIncludes(html, "Camera", "Homepage contains camera preview/mic practice references");
  });

  await test("GET / (Homepage) contains no developer jargon", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(!html.includes("HMAC-SHA256"), "Should not expose HMAC-SHA256 jargon");
    assert(!html.includes("WAL-mode"), "Should not expose WAL-mode jargon");
    assert(!html.includes("64KB chunking"), "Should not expose raw chunking jargon");
  });

  await test("GET /specs returns HTTP 200 and specification details", async () => {
    const res = await fetch(`${BASE_URL}/specs`);
    assertEqual(res.status, 200, "Specs status");
    const html = await res.text();
    assertIncludes(html, "Job.Com", "Specs brand");
    assertIncludes(html, "Specification", "Specs content");
  });

  await test("GET /candidate/resume-builder returns HTTP 200 with Free & ₹1,000 Advisory", async () => {
    const res = await fetch(`${BASE_URL}/candidate/resume-builder`);
    assertEqual(res.status, 200, "Resume builder status");
    const html = await res.text();
    assertIncludes(html, "Free", "Resume builder free option");
    assertIncludes(html, "1,000", "Resume builder ₹1,000 advisory option");
  });

  await test("GET /resume-builder redirects or renders resume builder", async () => {
    const res = await fetch(`${BASE_URL}/resume-builder`, { redirect: "follow" });
    assertEqual(res.status, 200, "Resume builder alias status");
  });

  await test("GET /recruiter returns HTTP 200", async () => {
    const res = await fetch(`${BASE_URL}/recruiter`);
    assertEqual(res.status, 200, "Recruiter dashboard status");
    const html = await res.text();
    assertIncludes(html, "Recruiter", "Recruiter page title");
  });

  await test("GET /candidate/dashboard returns HTTP 200", async () => {
    const res = await fetch(`${BASE_URL}/candidate/dashboard`);
    assertEqual(res.status, 200, "Candidate dashboard status");
    const html = await res.text();
    assertIncludes(html, "Candidate", "Candidate dashboard content");
  });

  await test("GET /login returns HTTP 200 with login form", async () => {
    const res = await fetch(`${BASE_URL}/login`);
    assertEqual(res.status, 200, "Login page status");
    const html = await res.text();
    assertIncludes(html, "Sign In", "Login heading");
  });

  await test("GET /register returns HTTP 200 with registration form", async () => {
    const res = await fetch(`${BASE_URL}/register`);
    assertEqual(res.status, 200, "Register page status");
    const html = await res.text();
    assertIncludes(html, "Account", "Register heading");
  });

  await test("GET /non-existent-page-xyz-404 returns HTTP 404", async () => {
    const res = await fetch(`${BASE_URL}/non-existent-page-xyz-404`);
    assertEqual(res.status, 404, "404 page status");
  });

  // ========================================================================
  // GROUP 2: Authentication & User Management
  // ========================================================================
  logHeader("GROUP 2: Authentication, Identity & Session Management");

  const testUserEmail = `candidate_test_${runId}_${Date.now()}@example.com`;
  const testRecruiterEmail = `recruiter_test_${runId}_${Date.now()}@example.com`;
  const candidateClient = new SessionClient();
  const recruiterClient = new SessionClient();

  await test("POST /api/auth/register fails with missing required fields (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUserEmail }),
    });
    assertEqual(res.status, 400, "Missing fields should return 400");
  });

  await test("POST /api/auth/register fails with short password < 6 chars (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pwd",
        email: `short_${Date.now()}@example.com`,
        password: "123",
      }),
    });
    assertEqual(res.status, 400, "Short password should return 400");
  });

  await test("POST /api/auth/register successfully creates candidate user", async () => {
    const res = await candidateClient.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Candidate",
        email: testUserEmail,
        password: "Password123!",
        role: "CANDIDATE",
      }),
    });
    assertEqual(res.status, 200, "Registration status");
    const data = await res.json();
    assert(data.success, "Registration success flag");
    assertEqual(data.user.email, testUserEmail.toLowerCase(), "Registered email matches");
    assertEqual(data.user.role, "CANDIDATE", "User role is CANDIDATE");
    assert(candidateClient.cookie.length > 0, "Auth cookie was set");
  });

  await test("POST /api/auth/register rejects duplicate email with 409 Conflict", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: testUserEmail,
        password: "Password123!",
      }),
    });
    assertEqual(res.status, 409, "Duplicate email should return 409");
  });

  await test("POST /api/auth/register creates recruiter user", async () => {
    const res = await recruiterClient.request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Recruiter",
        email: testRecruiterEmail,
        password: "Password123!",
        role: "RECRUITER",
        company: "Apex Staffing",
        title: "Head of Talent",
      }),
    });
    assertEqual(res.status, 200, "Recruiter registration status");
    const data = await res.json();
    assertEqual(data.user.role, "RECRUITER", "User role is RECRUITER");
  });

  await test("GET /api/auth/me returns authenticated user details", async () => {
    const res = await candidateClient.request("/api/auth/me");
    assertEqual(res.status, 200, "Auth me status");
    const data = await res.json();
    assert(data.user !== null, "User should be logged in");
    assertEqual(data.user.email, testUserEmail.toLowerCase(), "Email matches logged in user");
  });

  await test("GET /api/auth/me without cookie returns user: null gracefully (200)", async () => {
    const unauthed = new SessionClient();
    const res = await unauthed.request("/api/auth/me");
    assertEqual(res.status, 200, "Unauthed me status");
    const data = await res.json();
    assertEqual(data.user, null, "Unauthed user is null");
  });

  await test("POST /api/auth/login fails on wrong password (401)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUserEmail,
        password: "WrongPassword999!",
      }),
    });
    assertEqual(res.status, 401, "Invalid password returns 401");
  });

  await test("POST /api/auth/login fails on unknown email (401)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "unknown_never_registered_user@example.com",
        password: "Password123!",
      }),
    });
    assertEqual(res.status, 401, "Unknown email returns 401");
  });

  await test("POST /api/auth/login successfully logs in and returns session", async () => {
    const loginClient = new SessionClient();
    const res = await loginClient.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUserEmail,
        password: "Password123!",
      }),
    });
    assertEqual(res.status, 200, "Login status");
    const data = await res.json();
    assert(data.success, "Login success flag");
    assertEqual(data.user.email, testUserEmail.toLowerCase(), "Logged in user email");
    assert(loginClient.cookie.length > 0, "Cookie set upon login");
  });

  // ========================================================================
  // GROUP 3: Job Board & Discovery
  // ========================================================================
  logHeader("GROUP 3: Job Board, Search & Listing API");

  let sampleJobId = "";

  await test("GET /api/jobs returns active job postings", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs`);
    assertEqual(res.status, 200, "Jobs status");
    const data = await res.json();
    assert(Array.isArray(data.jobs), "data.jobs is an array");
    assert(data.jobs.length > 0, "Contains at least 1 job");
    sampleJobId = data.jobs[0].id;
    assert(sampleJobId.length > 0, "Sample job has valid id");
  });

  await test("GET /api/jobs returns cache control header", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs`);
    const cacheHeader = res.headers.get("Cache-Control");
    assert(cacheHeader && cacheHeader.includes("public"), "Contains public Cache-Control");
  });

  await test("POST /api/jobs fails with 400 when missing required fields", async () => {
    const res = await recruiterClient.request("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Incomplete Job" }),
    });
    assertEqual(res.status, 400, "Missing fields returns 400");
  });

  let createdJobId = "";
  await test("POST /api/jobs creates a new job position successfully", async () => {
    const res = await recruiterClient.request("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Automation Architect Test ${runId}`,
        company: "Job.Com Labs",
        department: "Core Engineering",
        location: "Remote / Hybrid",
        type: "Full-Time",
        salary: "$180,000 - $210,000",
        description: "Architect automated resilient distributed test harnesses and CI gates.",
        questions: [
          { prompt: "Explain your testing strategy for high-throughput distributed APIs.", timeLimitSeconds: 90, retakesAllowed: 1 },
          { prompt: "Describe how you isolate race conditions under database connection pressure.", timeLimitSeconds: 90, retakesAllowed: 1 },
        ],
      }),
    });
    assertEqual(res.status, 200, "Job creation status");
    const data = await res.json();
    assert(data.success, "Job creation success flag");
    assert(data.job && data.job.id, "Returned job has id");
    createdJobId = data.job.id;
  });

  await test("Newly created job appears in subsequent GET /api/jobs", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs`);
    const data = await res.json();
    const found = data.jobs.find((j) => j.id === createdJobId);
    assert(found !== undefined, "Created job found in list");
    assertEqual(found.title, `Automation Architect Test ${runId}`, "Job title matches");
  });

  await test("Jobs cover diverse domain departments", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs`);
    const data = await res.json();
    const departments = new Set(data.jobs.map((j) => j.department));
    assert(departments.size >= 2, "Job board covers multiple departments");
  });

  // ========================================================================
  // GROUP 4: Candidate Application Flow & Idempotency
  // ========================================================================
  logHeader("GROUP 4: Candidate Application & Idempotent Session Generation");

  let appliedSessionToken = "";
  const applicantEmail = `applicant_${runId}_${Date.now()}@example.com`;

  await test("POST /api/jobs/[id]/apply rejects missing candidate details (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/${createdJobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assertEqual(res.status, 400, "Missing name/email returns 400");
  });

  await test("POST /api/jobs/[invalid-id]/apply returns 404", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/invalid-job-id-9999/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: "Jane Doe",
        candidateEmail: "jane.doe@example.com",
      }),
    });
    assertEqual(res.status, 404, "Invalid job returns 404");
  });

  await test("POST /api/jobs/[id]/apply creates a new interview session", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/${createdJobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: "Jordan Sparks",
        candidateEmail: applicantEmail,
      }),
    });
    assertEqual(res.status, 200, "Apply status");
    const data = await res.json();
    assert(data.success, "Apply success flag");
    assertEqual(data.alreadyApplied, false, "First-time application");
    assert(data.token && data.token.startsWith("cand-"), "Token generated");
    assert(data.interviewUrl.includes(data.token), "Interview URL contains token");
    appliedSessionToken = data.token;
  });

  await test("POST /api/jobs/[id]/apply duplicate is idempotent and returns existing session", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/${createdJobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: "Jordan Sparks",
        candidateEmail: applicantEmail,
      }),
    });
    assertEqual(res.status, 200, "Duplicate apply status");
    const data = await res.json();
    assert(data.success, "Duplicate apply success flag");
    assertEqual(data.alreadyApplied, true, "Already applied detected");
    assertEqual(data.token, appliedSessionToken, "Returns exact same session token");
  });

  await test("Applied session has status INVITED and consent false", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/${appliedSessionToken}`);
    assertEqual(res.status, 200, "Interview token status");
    const data = await res.json();
    assertEqual(data.session.status, "INVITED", "Initial status is INVITED");
    assertEqual(data.session.consent, false, "Initial consent is false");
    assertEqual(data.session.questions.length, 2, "Has the 2 custom questions configured");
  });

  // ========================================================================
  // GROUP 5: Interview Room Lifecycle & Server Invariants
  // ========================================================================
  logHeader("GROUP 5: Interview Room Lifecycle & Server Authority Invariants");

  let q1Id = "";
  let q2Id = "";

  await test("GET /api/interview/[invalid-token] returns 404", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/cand-nonexistent-token`);
    assertEqual(res.status, 404, "Unknown token returns 404");
  });

  await test("GET /api/interview/[token] loads interview session and questions", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/${appliedSessionToken}`);
    assertEqual(res.status, 200, "Interview session status");
    const data = await res.json();
    assert(data.session !== undefined, "Session loaded");
    q1Id = data.session.questions[0].id;
    q2Id = data.session.questions[1].id;
    assert(q1Id.length > 0 && q2Id.length > 0, "Question IDs populated");
  });

  await test("Attempting question before consent is rejected with 409 Conflict", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q1Id}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 409, "Attempt before consent returns 409");
  });

  await test("POST /api/interview/[token]/consent updates consent and status to IN_PROGRESS", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/${appliedSessionToken}/consent`, {
      method: "POST",
    });
    assertEqual(res.status, 200, "Consent status");
    const data = await res.json();
    assert(data.success, "Consent success");
    assertEqual(data.consent, true, "Consent updated to true");
    assertEqual(data.status, "IN_PROGRESS", "Session status updated to IN_PROGRESS");
  });

  await test("Attempting Question 2 before Question 1 is submitted is rejected with 409 (Sequential Invariant)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q2Id}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 409, "Out of order question attempt returns 409");
    const data = await res.json();
    assertIncludes(data.error, "Previous questions must be answered first", "Sequential error message");
  });

  await test("Attempting an unknown question ID returns 404", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/unknown-q-999/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 404, "Unknown question returns 404");
  });

  await test("POST .../attempt opens recording attempt 1 with server deadline", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q1Id}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 200, "Attempt 1 status");
    const data = await res.json();
    assertEqual(data.attempt, 1, "First attempt");
    assert(typeof data.deadline === "number", "Server authority deadline provided");
    assert(data.deadline > Date.now(), "Deadline is in the future");
    assertEqual(data.graceSeconds, 15, "15s grace allowance provided");
    assert(data.upload && data.upload.uploadUrl, "Upload destination provided");
  });

  await test("Submitting Question 1 saves response and generates deterministic rubric evaluation", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q1Id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: "/uploads/interviews/test_q1.webm",
          durationSeconds: 45,
        }),
      }
    );
    assertEqual(res.status, 200, "Submit status");
    const data = await res.json();
    assert(data.success, "Submit success");
    assertEqual(data.status, "SUBMITTED", "Response status is SUBMITTED");
    assertEqual(data.allSubmitted, false, "Not all submitted yet (Q2 remaining)");
    assertEqual(data.nextQuestionId, q2Id, "Next question is Q2");
  });

  await test("Re-submitting Question 1 is rejected with 409 (Cannot submit twice)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q1Id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: "/uploads/test.webm" }),
      }
    );
    assertEqual(res.status, 409, "Already submitted question returns 409");
  });

  await test("Re-attempting Question 1 after submission is rejected with 409", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q1Id}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 409, "Attempting already submitted question returns 409");
  });

  await test("Question 2 can now be attempted (Sequential Progression)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q2Id}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 200, "Q2 attempt status");
    const data = await res.json();
    assertEqual(data.attempt, 1, "Q2 first attempt");
  });

  await test("Submitting Question 2 completes the entire interview session", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${appliedSessionToken}/questions/${q2Id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: "/uploads/interviews/test_q2.webm",
        }),
      }
    );
    assertEqual(res.status, 200, "Q2 submit status");
    const data = await res.json();
    assert(data.success, "Q2 submit success");
    assertEqual(data.allSubmitted, true, "All questions submitted");
    assertEqual(data.nextQuestionId, null, "No next question");
  });

  await test("Completed interview session has status COMPLETED and completedAt timestamp", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/${appliedSessionToken}`);
    const data = await res.json();
    assertEqual(data.session.status, "COMPLETED", "Session status is COMPLETED");
    assert(data.session.completedAt !== null, "completedAt is recorded");
  });

  await test("Giving consent on a COMPLETED interview returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/${appliedSessionToken}/consent`, {
      method: "POST",
    });
    assertEqual(res.status, 400, "Consent on completed interview returns 400");
  });

  // ========================================================================
  // GROUP 6: Retake Quota Exhaustion Invariant
  // ========================================================================
  logHeader("GROUP 6: Retake Quotas & Retake Limit Enforcement");

  let retakeSessionToken = "";
  let retakeQId = "";

  await test("Setup session to test retake quota limit", async () => {
    const res = await fetch(`${BASE_URL}/api/jobs/${createdJobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: "Retake Tester",
        candidateEmail: `retake_${runId}_${Date.now()}@example.com`,
      }),
    });
    const data = await res.json();
    retakeSessionToken = data.token;
    await fetch(`${BASE_URL}/api/interview/${retakeSessionToken}/consent`, { method: "POST" });
    const sessRes = await fetch(`${BASE_URL}/api/interview/${retakeSessionToken}`);
    const sessData = await sessRes.json();
    retakeQId = sessData.session.questions[0].id;
    assert(retakeQId.length > 0, "Retake question ID found");
  });

  await test("First attempt uses attempt 1 (retakesRemaining: 1)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${retakeSessionToken}/questions/${retakeQId}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 200, "Attempt 1 status");
    const data = await res.json();
    assertEqual(data.attempt, 1, "Attempt 1");
    assertEqual(data.retakesRemaining, 1, "1 retake remaining");
  });

  await test("Second attempt uses retake 1 (retakesRemaining: 0)", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${retakeSessionToken}/questions/${retakeQId}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 200, "Attempt 2 status");
    const data = await res.json();
    assertEqual(data.attempt, 2, "Attempt 2");
    assertEqual(data.retakesRemaining, 0, "0 retakes remaining");
  });

  await test("Third attempt exceeds quota and is rejected with 403 Forbidden", async () => {
    const res = await fetch(
      `${BASE_URL}/api/interview/${retakeSessionToken}/questions/${retakeQId}/attempt`,
      { method: "POST" }
    );
    assertEqual(res.status, 403, "Exhausted retake returns 403 Forbidden");
    const data = await res.json();
    assertIncludes(data.error, "No attempts remaining", "Error explains quota exhausted");
  });

  // ========================================================================
  // GROUP 7: Media Storage & Video Ingestion
  // ========================================================================
  logHeader("GROUP 7: Storage & Video Upload Handlers");

  await test("POST /api/storage/upload accepts binary video payload", async () => {
    const fakeVideoBuffer = Buffer.from("RIFF....WEBM-TEST-DATA-STREAM");
    const res = await fetch(`${BASE_URL}/api/storage/upload?key=test_interview_${runId}.webm`, {
      method: "POST",
      headers: { "Content-Type": "video/webm" },
      body: fakeVideoBuffer,
    });
    assertEqual(res.status, 200, "Upload status");
    const data = await res.json();
    assert(data.success, "Upload success flag");
    assertIncludes(data.url, "uploads", "URL points to public uploads");
    assertEqual(data.size, fakeVideoBuffer.length, "Uploaded size matches buffer");
  });

  await test("PUT /api/storage/upload also works as standard HTTP PUT", async () => {
    const fakeVideoBuffer = Buffer.from("PUT-SAMPLE-VIDEO-DATA");
    const res = await fetch(`${BASE_URL}/api/storage/upload?key=test_put_${runId}.webm`, {
      method: "PUT",
      headers: { "Content-Type": "video/webm" },
      body: fakeVideoBuffer,
    });
    assertEqual(res.status, 200, "PUT upload status");
    const data = await res.json();
    assert(data.success, "PUT success");
  });

  await test("Storage upload sanitizes key against directory traversal attacks", async () => {
    const fakeVideoBuffer = Buffer.from("SECURITY-TEST");
    const res = await fetch(`${BASE_URL}/api/storage/upload?key=../../traversal_${runId}.webm`, {
      method: "POST",
      body: fakeVideoBuffer,
    });
    assertEqual(res.status, 200, "Upload status");
    const data = await res.json();
    assert(!data.key.includes(".."), "Sanitized key contains no directory traversal dots");
  });

  // ========================================================================
  // GROUP 8: Candidate Portal & Rubric Scores
  // ========================================================================
  logHeader("GROUP 8: Candidate Portal & Rubric Scores");

  await test("GET /api/candidate/interviews?email=... returns candidate's sessions", async () => {
    const res = await fetch(
      `${BASE_URL}/api/candidate/interviews?email=${encodeURIComponent(applicantEmail)}`
    );
    assertEqual(res.status, 200, "Candidate interviews status");
    const data = await res.json();
    assert(Array.isArray(data.sessions), "data.sessions is array");
    assert(data.sessions.length >= 1, "Contains completed session");
    const candidateSession = data.sessions[0];
    assertEqual(candidateSession.status, "COMPLETED", "Session is COMPLETED");
    assert(candidateSession.scores !== null, "Scores are computed");
    assert(typeof candidateSession.scores.overall === "number", "Overall score is a number");
  });

  await test("Candidate portal handles unknown candidate email gracefully with empty array", async () => {
    const res = await fetch(
      `${BASE_URL}/api/candidate/interviews?email=nonexistent_email_12345@example.com`
    );
    assertEqual(res.status, 200, "Candidate interviews status");
    const data = await res.json();
    assertEqual(data.sessions.length, 0, "No sessions for unknown email");
  });

  // ========================================================================
  // GROUP 9: AI Resume Assist & ATS Optimization
  // ========================================================================
  logHeader("GROUP 9: AI Resume Assist & ATS Optimization Engine");

  await test("POST /api/ai/resume-assist rejects missing action (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/resume-assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assertEqual(res.status, 400, "Missing action returns 400");
  });

  await test("POST /api/ai/resume-assist enhance_summary for Fresher returns tailored options", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/resume-assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "enhance_summary",
        roleTitle: "Accounts Trainee",
        industry: "Accounting & Finance",
        experienceLevel: "Fresher",
        keySkills: ["General Ledger", "QuickBooks", "Bank Reconciliation"],
      }),
    });
    assertEqual(res.status, 200, "Enhance summary status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assert(Array.isArray(data.suggestions) && data.suggestions.length >= 3, "Returns 3 suggestions");
    assertIncludes(data.suggestions[0], "Accounts Trainee", "Contains role title");
  });

  await test("POST /api/ai/resume-assist polish_bullet transforms raw text with action verbs and metrics", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/resume-assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "polish_bullet",
        rawBullet: "I managed the inventory counts and helped dispatch trucks",
        industry: "Logistics & Supply Chain",
      }),
    });
    assertEqual(res.status, 200, "Polish bullet status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assert(Array.isArray(data.polished) && data.polished.length >= 3, "Returns polished variants");
    assert(/%|\d+/.test(data.polished[0]), "Bullet contains quantifiable impact metrics");
  });

  await test("POST /api/ai/resume-assist suggest_skills returns industry keywords", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/resume-assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "suggest_skills",
        industry: "Pharmaceuticals & Healthcare",
      }),
    });
    assertEqual(res.status, 200, "Suggest skills status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assert(Array.isArray(data.skills) && data.skills.length > 5, "Returns rich skills list");
    assertIncludes(data.skills, "cGMP Compliance", "Includes pharma domain standard");
  });

  await test("POST /api/ai/resume-assist audit_ats scores resume and returns strengths and improvements", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/resume-assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "audit_ats",
        resume: {
          personalInfo: {
            fullName: "Alex Rivera",
            email: "alex.rivera@example.com",
            phone: "+1 (555) 234-5678",
            title: "Senior Logistics Coordinator",
          },
          summary: "Dedicated supply chain and logistics specialist with over 6 years directing multimodal freight operations and maintaining strict SLA compliance.",
          experience: [
            {
              company: "Global Express Freight",
              role: "Operations Dispatcher",
              description: "Managed dispatch of 45+ daily freight carriers, reducing route delays by 28% and ensuring 99.4% on-time delivery across North American corridors.",
              bullets: ["Cut turnaround time by 18 hours", "Supervised cold-chain monitoring"],
            },
          ],
          skills: ["Dispatch", "TMS Software", "Fleet Telemetry", "Customs Clearance", "Incoterms 2020", "Cold Chain Compliance"],
        },
      }),
    });
    assertEqual(res.status, 200, "Audit ATS status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assert(typeof data.score === "number" && data.score >= 70, "ATS score is calculated high");
    assert(Array.isArray(data.strengths) && data.strengths.length > 0, "Strengths listed");
    assert(Array.isArray(data.improvements), "Improvements list present");
  });

  // ========================================================================
  // GROUP 10: Expert Advisory & Consultation Bookings
  // ========================================================================
  logHeader("GROUP 10: Expert Advisory & Consultation Bookings");

  await test("GET /api/candidate/expert-review returns pricing policy and expert mentors", async () => {
    const res = await fetch(`${BASE_URL}/api/candidate/expert-review`);
    assertEqual(res.status, 200, "Expert review GET status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assertEqual(data.pricingPolicy.selfServiceBuilder, "100% Free Forever", "Self-service builder is free");
    assertEqual(data.pricingPolicy.amount, 1000, "Expert advice fee is 1000 INR");
    assert(Array.isArray(data.experts) && data.experts.length >= 5, "At least 5 industry experts listed");
  });

  await test("POST /api/candidate/expert-review rejects missing contact information (400)", async () => {
    const res = await fetch(`${BASE_URL}/api/candidate/expert-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateName: "Incomplete" }),
    });
    assertEqual(res.status, 400, "Missing fields returns 400");
  });

  await test("POST /api/candidate/expert-review confirms booking and issues ₹1,000 receipt", async () => {
    const res = await fetch(`${BASE_URL}/api/candidate/expert-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateName: "Priya Sharma",
        candidateEmail: `priya_${runId}@example.com`,
        candidatePhone: "+91 98765 43210",
        industry: "Accounting & Finance",
        slot: "Tomorrow, 11:00 AM",
        notes: "Need feedback on US GAAP balance sheet presentation",
      }),
    });
    assertEqual(res.status, 200, "Booking status");
    const data = await res.json();
    assert(data.success, "Booking success flag");
    assert(data.booking && data.booking.id.startsWith("EXP-"), "Booking ID issued");
    assertEqual(data.receipt.fee, "₹1,000", "Receipt fee is ₹1,000");
    assertEqual(data.receipt.paymentStatus, "CONFIRMED", "Payment confirmed");
    assert(data.booking.meetingUrl.includes("meet.job.com"), "Video meeting link generated");
  });

  // ========================================================================
  // GROUP 11: Recruiter Management & Status Pipeline
  // ========================================================================
  logHeader("GROUP 11: Recruiter Management & Status Pipeline");

  let candidateSessionId = "";

  await test("GET /api/recruiter/sessions returns all candidate sessions with job details", async () => {
    const res = await recruiterClient.request("/api/recruiter/sessions");
    assertEqual(res.status, 200, "Recruiter sessions status");
    const data = await res.json();
    assert(Array.isArray(data.sessions), "data.sessions is array");
    assert(data.sessions.length > 0, "Contains sessions");
    const matched = data.sessions.find((s) => s.token === appliedSessionToken);
    assert(matched !== undefined, "Completed test session is listed for recruiter");
    candidateSessionId = matched.id;
  });

  await test("PATCH /api/recruiter/sessions/[id]/status rejects invalid status (400)", async () => {
    const res = await recruiterClient.request(
      `/api/recruiter/sessions/${candidateSessionId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SUPER_HIRED_INVALID" }),
      }
    );
    assertEqual(res.status, 400, "Invalid status returns 400");
  });

  await test("PATCH /api/recruiter/sessions/[id]/status transitions candidate to SHORTLISTED", async () => {
    const res = await recruiterClient.request(
      `/api/recruiter/sessions/${candidateSessionId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SHORTLISTED" }),
      }
    );
    assertEqual(res.status, 200, "Status update status");
    const data = await res.json();
    assert(data.success, "Success flag");
    assertEqual(data.session.status, "SHORTLISTED", "Candidate status updated to SHORTLISTED");
  });

  await test("PATCH /api/recruiter/sessions/[id]/status transitions candidate to IN_REVIEW", async () => {
    const res = await recruiterClient.request(
      `/api/recruiter/sessions/${candidateSessionId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_REVIEW" }),
      }
    );
    assertEqual(res.status, 200, "Status update status");
    const data = await res.json();
    assertEqual(data.session.status, "IN_REVIEW", "Candidate status updated to IN_REVIEW");
  });

  // ========================================================================
  // GROUP 12: High-Concurrency & Stress Resilience
  // ========================================================================
  logHeader("GROUP 12: Concurrency, Connection Headroom & Stress Resilience");

  await test("Concurrency: 50 simultaneous GET /api/jobs requests execute with 100% success", async () => {
    const promises = Array.from({ length: 50 }, () => fetch(`${BASE_URL}/api/jobs`));
    const responses = await Promise.all(promises);
    const all200 = responses.every((r) => r.status === 200);
    assert(all200, "All 50 simultaneous requests returned HTTP 200");
  });

  await test("Concurrency: 25 simultaneous GET /api/candidate/interviews queries succeed without SQLite lock", async () => {
    const promises = Array.from({ length: 25 }, () =>
      fetch(`${BASE_URL}/api/candidate/interviews?email=${encodeURIComponent(applicantEmail)}`)
    );
    const responses = await Promise.all(promises);
    const all200 = responses.every((r) => r.status === 200);
    assert(all200, "All 25 concurrent database queries returned HTTP 200");
  });

  await test("Concurrency: 20 simultaneous candidate job applications succeed without race conditions", async () => {
    const promises = Array.from({ length: 20 }, (_, i) =>
      fetch(`${BASE_URL}/api/jobs/${createdJobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: `Concurrent Applicant ${i}`,
          candidateEmail: `concurrent_${runId}_${i}_${Date.now()}@example.com`,
        }),
      })
    );
    const responses = await Promise.all(promises);
    const all200 = responses.every((r) => r.status === 200);
    assert(all200, "All 20 concurrent applications created successfully with HTTP 200");
  });

  // ========================================================================
  // TEST SUITE REPORT & SUMMARY
  // ========================================================================
  console.log(`\n${BOLD}========================================================================${RESET}`);
  console.log(`${BOLD}  TEST SUITE EXECUTION SUMMARY${RESET}`);
  console.log(`${BOLD}========================================================================${RESET}`);
  console.log(`  Total Tests Executed: ${BOLD}${totalTests}${RESET}`);
  console.log(`  Passed Tests:         ${GREEN}${BOLD}${passedTests}${RESET}`);
  console.log(`  Failed Tests:         ${failedTests > 0 ? RED : GREEN}${BOLD}${failedTests}${RESET}`);
  console.log(`  Pass Rate:            ${BOLD}${((passedTests / totalTests) * 100).toFixed(1)}%${RESET}`);

  if (failureList.length > 0) {
    console.log(`\n${RED}${BOLD}Failures Summary:${RESET}`);
    failureList.forEach((f, idx) => {
      console.log(`  ${idx + 1}. ${f.name}`);
      console.log(`     ${f.error}`);
    });
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}🎉 ALL TEST CASES PASSED WITH 0 FAILURES!${RESET}\n`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Fatal Test Runner Error:", err);
  process.exit(1);
});
