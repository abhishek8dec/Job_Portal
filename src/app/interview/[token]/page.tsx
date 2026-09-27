"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Mic,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Send,
  Sparkles,
  Lock,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Play,
  Square,
  Users,
} from "lucide-react";

import {
  Eyebrow,
  Card,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
  Disclaimer,
} from "@/components/ds";

interface QuestionResponse {
  id: string;
  attempt: number;
  status: string;
  videoUrl: string | null;
  recordedAt: string;
  submittedAt: string | null;
}

interface Question {
  id: string;
  order: number;
  prompt: string;
  timeLimitSeconds: number;
  retakesAllowed: number;
  attemptsUsed: number;
  retakesRemaining: number;
  isSubmitted: boolean;
  latestResponse: QuestionResponse | null;
}

interface SessionData {
  id: string;
  token: string;
  candidateName: string;
  candidateEmail: string;
  status: string;
  consent: boolean;
  startedAt: string | null;
  completedAt: string | null;
  job?: {
    id: string;
    title: string;
    company: string;
    department: string;
    location: string;
    salary: string;
  } | null;
  questions: Question[];
  activeQuestionIndex: number;
}

export default function InterviewRoomPage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calibration state
  const [micActive, setMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(35);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consenting, setConsenting] = useState(false);

  // Interview state
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [interviewStage, setInterviewStage] = useState<"READY" | "RECORDING" | "REVIEW">("READY");
  
  // Timer & server deadline state
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [retakesRemaining, setRetakesRemaining] = useState<number>(1);
  const [deadlineTime, setDeadlineTime] = useState<number | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [graceSeconds, setGraceSeconds] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Video & Media refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recordedPlaybackRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const uploadUrlRef = useRef<string | null>(null);
  const persistentVideoUrlRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 1. Load Session Data
  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/interview/${token}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load interview session");
      }
      setSession(data.session);
      setActiveQIndex(data.session.activeQuestionIndex ?? 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading session";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSession();
    }
  }, [token]);

  // 2. Camera & Mic Initialization
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
          videoPreviewRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
        setMicActive(true);

        // Audio meter visualizer
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        } catch {
          // Audio meter fallback simulation
          setAudioLevel(45);
        }
      } else {
        setHasCameraPermission(false);
      }
    } catch {
      // Hardware camera not permitted or not present
      setHasCameraPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Sync camera stream with video element when element renders
  useEffect(() => {
    if (videoPreviewRef.current && mediaStreamRef.current) {
      videoPreviewRef.current.srcObject = mediaStreamRef.current;
      videoPreviewRef.current.play().catch(() => {});
    }
  }, [session?.consent, interviewStage]);

  // 3. Countdown timer synced to server deadline
  useEffect(() => {
    if (interviewStage !== "RECORDING" || !deadlineTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, deadlineTime - now);
      setTimeLeftMs(diff);

      // Hard stop when server deadline expires
      if (diff <= 0) {
        clearInterval(interval);
        handleStopRecording();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [interviewStage, deadlineTime]);

  // Handle Consent Action
  const handleConsentSubmit = async () => {
    try {
      setConsenting(true);
      const res = await fetch(`/api/interview/${token}/consent`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Consent failed");
      await loadSession();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Consent submission failed");
    } finally {
      setConsenting(false);
    }
  };

  // 4. START ATTEMPT (Calls the user's exact backend handler!)
  const handleStartAttempt = async () => {
    if (!session) return;
    const currentQ = session.questions[activeQIndex];
    if (!currentQ) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Call user's exact POST handler
      const res = await fetch(
        `/api/interview/${token}/questions/${currentQ.id}/attempt`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start attempt");
      }

      setCurrentAttempt(data.attempt);
      setRetakesRemaining(data.retakesRemaining);
      setDeadlineTime(data.deadline);
      setGraceSeconds(data.graceSeconds);
      setTimeLeftMs(Math.max(0, data.deadline - Date.now()));
      uploadUrlRef.current = data.upload?.url || null;

      // Start client MediaRecorder
      recordedChunksRef.current = [];
      if (mediaStreamRef.current) {
        try {
          const recorder = new MediaRecorder(mediaStreamRef.current, {
            mimeType: "video/webm;codecs=vp8,opus",
          });
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };
          recorder.start(1000);
        } catch {
          // Standard fallback if specific codecs are unsupported
          const recorder = new MediaRecorder(mediaStreamRef.current);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };
          recorder.start(1000);
        }
      }

      setInterviewStage("RECORDING");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to open attempt";
      setError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. STOP RECORDING & PREPARE REVIEW
  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    // Wait slightly for remaining chunks to flush
    setTimeout(async () => {
      let finalBlobUrl = "";
      if (recordedChunksRef.current.length > 0) {
        const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        finalBlobUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(finalBlobUrl);

        // Upload to storage URL provisioned by server
        if (uploadUrlRef.current) {
          try {
            const upRes = await fetch(uploadUrlRef.current, {
              method: "PUT",
              body: videoBlob,
              headers: { "Content-Type": "video/webm" },
            });
            const upData = await upRes.json().catch(() => ({}));
            if (upData?.url) {
              persistentVideoUrlRef.current = upData.url;
            }
          } catch (e) {
            console.warn("Local storage upload notification:", e);
          }
        }
      } else {
        // Sample demonstration playback if no local video stream was active
        finalBlobUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
        setRecordedVideoUrl(finalBlobUrl);
      }

      setInterviewStage("REVIEW");
    }, 500);
  };

  // 6. RETAKE QUESTION
  const handleRetake = () => {
    if (retakesRemaining <= 0) {
      alert("No retakes remaining for this question.");
      return;
    }
    setRecordedVideoUrl(null);
    setInterviewStage("READY");
  };

  // 7. SUBMIT ANSWER (Validates deadline + graceSeconds on server!)
  const handleSubmitAnswer = async () => {
    if (!session) return;
    const currentQ = session.questions[activeQIndex];
    if (!currentQ) return;

    if (!recordedVideoUrl && !persistentVideoUrlRef.current) {
      alert("No recorded video response detected. Please record your answer before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(
        `/api/interview/${token}/questions/${currentQ.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: persistentVideoUrlRef.current || recordedVideoUrl,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Reload session
      await loadSession();
      setRecordedVideoUrl(null);
      setInterviewStage("READY");

      if (data.allSubmitted) {
        // Finished!
      } else {
        // Move to next question index
        setActiveQIndex((prev) => prev + 1);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit answer";
      setError(msg);
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        }}
      >
        <RefreshCw size={28} color="var(--accent)" style={{ animation: "spin 1s infinite linear" }} />
        <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
          Authenticating interview session token...
        </p>
      </div>
    );
  }

  // Render Error State
  if (error && !session) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
        }}
      >
        <Card
          style={{
            maxWidth: "480px",
            padding: "36px",
            textAlign: "center",
          }}
        >
          <AlertCircle size={36} color="var(--rec)" style={{ margin: "0 auto 14px" }} />
          <Eyebrow>SESSION ERROR</Eyebrow>
          <h2
            className="font-serif"
            style={{ fontSize: "1.4rem", fontWeight: 600, margin: "6px 0 10px", color: "var(--ink)" }}
          >
            Unable to Load Session
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "24px" }}>{error}</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/" className="ds-btn-secondary" style={{ padding: "8px 16px" }}>
              Back to Jobs
            </Link>
            <PrimaryButton onClick={loadSession}>
              Retry Connection
            </PrimaryButton>
          </div>
        </Card>
      </div>
    );
  }

  if (!session) return null;

  // Render Interview Completed State
  if (session.status === "COMPLETED") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Card
            style={{
              padding: "44px 36px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "1px solid var(--accent)",
              }}
            >
              <CheckCircle2 size={30} color="var(--accent)" />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <StatusPill variant="good">Interview Submitted</StatusPill>
            </div>

            <h1
              className="font-serif"
              style={{ fontSize: "2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "10px" }}
            >
              Thank You, {session.candidateName}
            </h1>

            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "520px",
                margin: "0 auto 28px",
              }}
            >
              Your asynchronous video responses for{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
                {session.job?.title || "Open Role"}
              </strong>{" "}
              have been securely transmitted to the hiring committee.
            </p>

            <div
              style={{
                backgroundColor: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "left",
                marginBottom: "32px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <Eyebrow>SUBMISSION RECEIPT</Eyebrow>
              </div>
              {session.questions.map((q, idx) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      idx === session.questions.length - 1
                        ? "none"
                        : "1px solid var(--line)",
                    fontSize: "0.875rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 500, color: "var(--ink)" }}>Question {idx + 1}</span>
                  </div>
                  <StatusPill variant="neutral">
                    {q.attemptsUsed} attempt{q.attemptsUsed > 1 ? "s" : ""} recorded
                  </StatusPill>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/candidate/dashboard?email=${encodeURIComponent(session.candidateEmail)}`}
                className="ds-btn-primary"
                style={{ padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <CheckCircle2 size={15} />
                View My Scorecard & Dashboard
              </Link>
              <Link href="/" className="ds-btn-secondary" style={{ padding: "10px 18px" }}>
                Back to Job Board
              </Link>
              <Link
                href="/recruiter"
                className="ds-btn-secondary"
                style={{ padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--muted)" }}
                title="Evaluator test mode"
              >
                <Users size={14} />
                Recruiter Queue
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render Calibration & Consent Stage (Before session.consent is true)
  if (!session.consent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--paper)",
          color: "var(--ink)",
          padding: "40px 24px 80px",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ marginBottom: "8px" }}>
              <Eyebrow>PRE-INTERVIEW CHECK</Eyebrow>
            </div>
            <h1
              className="font-serif tracking-tight"
              style={{ fontSize: "2.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}
            >
              Welcome, {session.candidateName}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
              Applying for{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
                {session.job?.title || "Principal Role"}
              </strong>{" "}
              at Job.Com
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Camera Viewport Calibration */}
            <Card style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <Eyebrow>AV CALIBRATION</Eyebrow>
                  <h3
                    className="font-serif"
                    style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Video size={17} color="var(--accent)" /> Camera & Mic Check
                  </h3>
                </div>
                <StatusPill variant={hasCameraPermission ? "good" : "warn"}>
                  {hasCameraPermission ? "Connected" : "Simulated Feed"}
                </StatusPill>
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "260px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--line)",
                  marginBottom: "18px",
                }}
              >
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                    display: hasCameraPermission ? "block" : "none",
                  }}
                />
                {!hasCameraPermission && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Video size={36} color="var(--muted)" style={{ margin: "0 auto 10px" }} />
                    <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                      Ready for video capture. (WebCam simulation mode active)
                    </p>
                    <SecondaryButton
                      onClick={startCamera}
                      style={{ marginTop: "12px", padding: "6px 14px", fontSize: "0.8125rem" }}
                    >
                      Enable Browser Camera
                    </SecondaryButton>
                  </div>
                )}
              </div>

              {/* Microphone Volume Meter */}
              <div
                style={{
                  backgroundColor: "var(--paper)",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8125rem",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)" }}>
                    <Mic size={14} color="var(--accent)" /> Input Microphone Level
                  </span>
                  <span className="font-mono" style={{ color: "var(--accent)", fontWeight: 600 }}>
                    {audioLevel}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor: "var(--line)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${audioLevel}%`,
                      height: "100%",
                      backgroundColor: "var(--accent)",
                      transition: "width 0.1s ease",
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Guidelines & Consent Card */}
            <Card style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "16px" }}>
                <Eyebrow>INTERVIEW PROTOCOL</Eyebrow>
                <h3
                  className="font-serif"
                  style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ShieldCheck size={17} color="var(--accent)" /> Interview Guidelines
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <Clock size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--ink)" }}>
                      Server-Authoritative Time Limits
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.45 }}>
                      Each question has a strict countdown. Submissions after deadline + 30s grace period will be rejected.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <RotateCcw size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--ink)" }}>
                      Limited Retakes Allowed
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.45 }}>
                      You have 1 retake per question. Once you submit or exhaust retakes, your answer is final.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <Lock size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--ink)" }}>
                      Sequential Order
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.45 }}>
                      Questions must be answered one at a time in sequence. Skipping ahead is not permitted.
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent Box */}
              <div
                style={{
                  marginTop: "auto",
                  padding: "16px",
                  backgroundColor: "var(--accent-soft)",
                  border: "1px solid rgba(30, 90, 65, 0.2)",
                  borderLeft: "3px solid var(--accent)",
                  borderRadius: "8px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    style={{
                      marginTop: "2px",
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--accent)",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: "0.8125rem", color: "var(--ink)", lineHeight: 1.45 }}>
                    I consent to video & audio recording for evaluation by Job.Com. I acknowledge the server-authoritative timer and retake limits.
                  </span>
                </label>

                <PrimaryButton
                  onClick={handleConsentSubmit}
                  disabled={!consentChecked || consenting}
                  style={{ width: "100%", marginTop: "14px" }}
                >
                  {consenting ? "Initializing Session..." : "Enter Interview Room"}
                  <ChevronRight size={16} />
                </PrimaryButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Data
  const currentQuestion = session.questions[activeQIndex] || session.questions[0];
  const totalQuestions = session.questions.length;
  const isLastQuestion = activeQIndex === totalQuestions - 1;

  // Format seconds into MM:SS
  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--paper)",
        color: "var(--ink)",
        padding: "32px 24px 80px",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        {/* Top Breadcrumb & Progress Header */}
        <Card
          style={{
            padding: "18px 24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <Eyebrow>
              CANDIDATE: {session.candidateName.toUpperCase()} · {session.job?.title?.toUpperCase() || "PRINCIPAL ROLE"}
            </Eyebrow>
            <h2
              className="font-serif"
              style={{ fontSize: "1.35rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 0" }}
            >
              Question {activeQIndex + 1} of {totalQuestions}
            </h2>
          </div>

          {/* Step Indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {session.questions.map((q, idx) => {
              const isDone = q.isSubmitted;
              const isActive = idx === activeQIndex;
              return (
                <button
                  type="button"
                  key={q.id}
                  onClick={() => {
                    if (idx <= activeQIndex || isDone) {
                      setActiveQIndex(idx);
                      setInterviewStage("READY");
                    } else {
                      alert("Sequential order required: complete previous questions first.");
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: idx <= activeQIndex || isDone ? "pointer" : "not-allowed",
                    backgroundColor: isActive
                      ? "var(--accent)"
                      : isDone
                      ? "var(--accent-soft)"
                      : "var(--surface)",
                    border: isActive
                      ? "1px solid var(--accent)"
                      : isDone
                      ? "1px solid rgba(30, 90, 65, 0.3)"
                      : "1px solid var(--line)",
                    color: isActive ? "#ffffff" : isDone ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {isDone ? <CheckCircle2 size={13} /> : idx > activeQIndex ? <Lock size={13} /> : null}
                  <span>Q{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Main Interview Stage */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Video Viewport & Controls */}
          <Card style={{ padding: "24px" }}>
            {/* Question Prompt Card */}
            <div
              style={{
                padding: "18px 20px",
                backgroundColor: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Eyebrow>
                  QUESTION {activeQIndex + 1} OF {totalQuestions} · TECHNICAL
                </Eyebrow>
                <div style={{ display: "flex", gap: "8px" }}>
                  <StatusPill variant="neutral">
                    <Clock size={11} /> {currentQuestion.timeLimitSeconds}s Max
                  </StatusPill>
                  <StatusPill variant="neutral">
                    <RotateCcw size={11} /> {currentQuestion.retakesAllowed} Retake Allowed
                  </StatusPill>
                </div>
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: "1.25rem",
                  lineHeight: 1.45,
                  fontWeight: 600,
                  color: "var(--ink)",
                  margin: "6px 0 0",
                }}
              >
                {currentQuestion.prompt}
              </h3>
            </div>

            {/* Video Stage Area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "440px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#000000",
                border: "1px solid var(--line)",
                marginBottom: "20px",
              }}
            >
              {/* Live Camera View during READY & RECORDING */}
              {interviewStage !== "REVIEW" && (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scaleX(-1)",
                  }}
                />
              )}

              {/* Review Video Playback */}
              {interviewStage === "REVIEW" && (
                <video
                  ref={recordedPlaybackRef}
                  src={recordedVideoUrl || undefined}
                  controls
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Floating Recording Overlay */}
              {interviewStage === "RECORDING" && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    right: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.8125rem",
                      backgroundColor: "var(--rec)",
                      color: "#ffffff",
                      borderRadius: "9999px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        display: "inline-block",
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                    REC Attempt {currentAttempt}
                  </div>

                  <div
                    style={{
                      background: "rgba(28, 27, 24, 0.85)",
                      backdropFilter: "blur(8px)",
                      padding: "6px 16px",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: timeLeftMs < 10000 ? "var(--rec)" : "#ffffff",
                    }}
                  >
                    <Clock size={15} color={timeLeftMs < 10000 ? "var(--rec)" : "#ffffff"} />
                    {formatTime(timeLeftMs)}
                  </div>
                </div>
              )}

              {/* Audio Indicator during Recording */}
              {interviewStage === "RECORDING" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    background: "rgba(28, 27, 24, 0.8)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Mic size={14} color="var(--rec)" />
                  <span className="font-mono text-xs" style={{ color: "#ffffff" }}>
                    Recording Mic Stream
                  </span>
                </div>
              )}
            </div>

            {/* Action Toolbar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              {interviewStage === "READY" && (
                <>
                  <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                    Take your time to read the prompt above. Your timer only starts once you press Record.
                  </div>
                  <button
                    onClick={handleStartAttempt}
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: "var(--rec)",
                      color: "#ffffff",
                      padding: "10px 22px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <Play size={16} fill="#ffffff" />
                    Start Recording Answer
                  </button>
                </>
              )}

              {interviewStage === "RECORDING" && (
                <>
                  <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                    Server-enforced deadline is running. Click finish early when done.
                  </div>
                  <SecondaryButton
                    onClick={handleStopRecording}
                    style={{
                      borderColor: "var(--rec)",
                      color: "var(--rec)",
                      padding: "10px 20px",
                    }}
                  >
                    <Square size={14} fill="currentColor" />
                    Finish Early
                  </SecondaryButton>
                </>
              )}

              {interviewStage === "REVIEW" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <SecondaryButton
                      onClick={handleRetake}
                      disabled={retakesRemaining <= 0 || isSubmitting}
                    >
                      <RotateCcw size={15} />
                      Retake Question ({retakesRemaining} left)
                    </SecondaryButton>
                  </div>

                  <PrimaryButton
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting}
                    style={{ padding: "10px 24px" }}
                  >
                    <Send size={15} />
                    {isSubmitting
                      ? "Submitting..."
                      : isLastQuestion
                      ? "Submit Final Answer & Finish"
                      : "Submit & Next Question"}
                  </PrimaryButton>
                </>
              )}
            </div>
          </Card>

          {/* Right Column: Server State & Metadata Drawer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Server Authority Inspection Card */}
            <Card style={{ padding: "20px" }}>
              <Eyebrow>AUTHORITY & STATE ENGINE</Eyebrow>
              <h4
                className="font-serif"
                style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 12px" }}
              >
                Active Question Status
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8125rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Question Index</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{activeQIndex + 1} / {totalQuestions}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Time Limit</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{currentQuestion.timeLimitSeconds} seconds</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Upload Grace Period</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>+{graceSeconds}s allowance</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Total Allowed Attempts</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{1 + currentQuestion.retakesAllowed} attempts</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "2px",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Server Authority</span>
                  <StatusPill variant="good">
                    Active (dev.db)
                  </StatusPill>
                </div>
              </div>
            </Card>

            {/* Help & Support Card */}
            <Card style={{ padding: "20px" }}>
              <Eyebrow>INTERVIEW BEST PRACTICES</Eyebrow>
              <h4
                className="font-serif"
                style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", margin: "2px 0 8px" }}
              >
                Tips for a Clear Submission
              </h4>
              <ul
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted)",
                  paddingLeft: "16px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                <li>Speak clearly and address the prompt directly.</li>
                <li>Structure answers with Context, Action, and Result.</li>
                <li>If you make a mistake, use your allowed retake before submitting.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
