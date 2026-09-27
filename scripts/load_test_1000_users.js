/**
 * Job.Com High-Concurrency Load Testing Suite
 * Simulates 1,000 simultaneous concurrent users hitting the platform
 * Measures throughput (RPS), latency percentiles (p50, p95, p99), and success rates.
 */

const http = require("http");

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || "1000", 10);
const ENDPOINT = process.argv[2] || process.env.TEST_ENDPOINT || "/api/jobs";

function makeRequest(url, agent, userIndex = 0) {
  return new Promise((resolve) => {
    const startTime = process.hrtime.bigint();
    const parsed = new URL(url);
    const clientIp = `192.168.${Math.floor(userIndex / 250) + 1}.${(userIndex % 250) + 1}`;

    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: "GET",
        agent,
        headers: {
          "User-Agent": "JobCom-LoadTest/1.0",
          Accept: "application/json",
          "X-Forwarded-For": clientIp,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const endTime = process.hrtime.bigint();
          const latencyMs = Number(endTime - startTime) / 1_000_000;
          resolve({
            status: res.statusCode,
            latencyMs,
            cacheHeader: res.headers["x-cache"],
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        });
      }
    );

    req.on("error", (err) => {
      const endTime = process.hrtime.bigint();
      const latencyMs = Number(endTime - startTime) / 1_000_000;
      resolve({
        status: 0,
        error: err.message,
        latencyMs,
        success: false,
      });
    });

    req.setTimeout(30000, () => {
      req.destroy(new Error("Timeout (30s)"));
    });

    req.end();
  });
}

async function runLoadTest() {
  console.log("\n============================================================");
  console.log(`🚀 STARTING LOAD TEST: ${CONCURRENT_USERS} SIMULTANEOUS CONCURRENT USERS`);
  console.log(`Target URL: ${BASE_URL}${ENDPOINT}`);
  console.log("============================================================\n");

  const agent = new http.Agent({
    keepAlive: true,
    maxSockets: 1000,
    maxTotalSockets: 1000,
  });

  // Prime the cache with 1 warm-up request
  console.log("Warming up cache and server connections...");
  await makeRequest(`${BASE_URL}${ENDPOINT}`, agent, 0);
  console.log("Warm-up complete. Launching 1,000 simultaneous requests now...\n");

  const wallClockStart = process.hrtime.bigint();

  // Dispatch all requests concurrently
  const requestPromises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    requestPromises.push(makeRequest(`${BASE_URL}${ENDPOINT}`, agent, i));
  }

  const results = await Promise.all(requestPromises);
  const wallClockEnd = process.hrtime.bigint();
  const totalDurationSec = Number(wallClockEnd - wallClockStart) / 1_000_000_000;

  // Analyze Results
  let successCount = 0;
  let failureCount = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  const latencies = [];
  const errorBreakdown = {};

  for (const r of results) {
    latencies.push(r.latencyMs);
    if (r.success) {
      successCount++;
    } else {
      failureCount++;
      const errKey = r.error ? `Err: ${r.error}` : `HTTP ${r.status}`;
      errorBreakdown[errKey] = (errorBreakdown[errKey] || 0) + 1;
    }

    if (r.cacheHeader === "HIT") {
      cacheHits++;
    } else if (r.cacheHeader === "MISS") {
      cacheMisses++;
    }
  }

  latencies.sort((a, b) => a - b);

  const minLatency = latencies[0].toFixed(2);
  const maxLatency = latencies[latencies.length - 1].toFixed(2);
  const sumLatency = latencies.reduce((acc, v) => acc + v, 0);
  const avgLatency = (sumLatency / latencies.length).toFixed(2);
  const p50 = latencies[Math.floor(latencies.length * 0.5)].toFixed(2);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(2);
  const p99 = latencies[Math.floor(latencies.length * 0.99)].toFixed(2);
  const rps = (CONCURRENT_USERS / totalDurationSec).toFixed(1);
  const successRate = ((successCount / CONCURRENT_USERS) * 100).toFixed(2);

  console.log("------------------------------------------------------------");
  console.log("                  LOAD TEST BENCHMARK REPORT                ");
  console.log("------------------------------------------------------------");
  console.log(`Total Simulated Users:    ${CONCURRENT_USERS}`);
  console.log(`Total Wall-Clock Time:    ${totalDurationSec.toFixed(3)}s`);
  console.log(`Throughput:               ${rps} requests/second`);
  console.log(`Successful Requests:      ${successCount} / ${CONCURRENT_USERS} (${successRate}%)`);
  console.log(`Failed Requests:          ${failureCount}`);
  if (failureCount > 0) {
    console.log("Error Breakdown:", JSON.stringify(errorBreakdown));
  }
  console.log(`Cache Efficiency:         ${cacheHits} HITs, ${cacheMisses} MISSes`);
  console.log("------------------------------------------------------------");
  console.log("LATENCY DISTRIBUTION (ms):");
  console.log(`  Min:                    ${minLatency} ms`);
  console.log(`  Average:                ${avgLatency} ms`);
  console.log(`  50th Percentile (p50):  ${p50} ms`);
  console.log(`  95th Percentile (p95):  ${p95} ms`);
  console.log(`  99th Percentile (p99):  ${p99} ms`);
  console.log(`  Max:                    ${maxLatency} ms`);
  console.log("------------------------------------------------------------");

  if (failureCount === 0 && parseFloat(successRate) >= 99.9) {
    console.log("✅ VERDICT: PASSED! System successfully handled 1,000 simultaneous users with 100% reliability!\n");
  } else {
    console.log("⚠️ VERDICT: High load observed, some requests failed or timed out.\n");
  }

  agent.destroy();
}

runLoadTest().catch((err) => {
  console.error("Load test error:", err);
  process.exit(1);
});
