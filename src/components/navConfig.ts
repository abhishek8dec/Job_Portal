export interface DropdownOption {
  eyebrow: string;
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavItemConfig {
  id: string;
  label: string;
  href?: string;
  dropdown?: DropdownOption[];
}

/**
 * Job.Com Navigation Bar Configuration
 *
 * User-friendly, jargon-free navigation for candidates and employers.
 */
export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "product",
    label: "PRODUCT",
    dropdown: [
      {
        eyebrow: "EASY VIDEO INTERVIEWS",
        title: "ONLINE APPLICANT VIDEO ROOMS",
        description: "Candidates answer short questions on their own time. No phone tag or scheduling friction.",
        href: "/",
      },
      {
        eyebrow: "EMPLOYER REVIEW DESK",
        title: "CANDIDATE REVIEW & SHORTLISTING",
        description: "Watch short video answers, compare candidate scores, and invite top picks in minutes.",
        href: "/recruiter",
      },
      {
        eyebrow: "OBJECTIVE SCORING",
        title: "AUTOMATED SKILLS & COMMUNICATION SCORING",
        description: "Clear, consistent scoring on job knowledge, clear communication, and problem-solving.",
        href: "/recruiter",
      },
      {
        eyebrow: "FREE CANDIDATE TOOLS",
        title: "FREE AI RESUME BUILDER",
        description: "100% Free AI resume maker with professional templates and optional 1-on-1 expert coaching.",
        href: "/candidate/resume-builder",
        badge: "FREE",
      },
      {
        eyebrow: "CANDIDATE TRACKER",
        title: "APPLICATION PROGRESS TRACKER",
        description: "Applicants can check where they stand at every step from application to final offer.",
        href: "/candidate/dashboard",
      },
    ],
  },
  {
    id: "why",
    label: "WHY JOB.COM",
    dropdown: [
      {
        eyebrow: "FAIR FOR EVERYONE",
        title: "EQUAL ANSWER TIMERS",
        description: "Every applicant gets the exact same clear time limit to answer each question.",
        href: "/specs#deadlines",
      },
      {
        eyebrow: "RELAXED RECORDING",
        title: "1 FREE RETAKE PER QUESTION",
        description: "Made a slip of the tongue? Candidates get a free retake so they can show their true potential.",
        href: "/specs#retakes",
      },
      {
        eyebrow: "ONE QUESTION AT A TIME",
        title: "CLEAR STEP-BY-STEP QUESTIONS",
        description: "Questions appear one by one so candidates stay focused without feeling rushed or overwhelmed.",
        href: "/specs#sequential",
      },
      {
        eyebrow: "NO APPS NEEDED",
        title: "WORKS ON ANY PHONE OR COMPUTER",
        description: "Everything runs right in your web browser. No software to download or configure.",
        href: "/specs#uploads",
      },
    ],
  },
  {
    id: "industry",
    label: "BY INDUSTRY",
    dropdown: [
      {
        eyebrow: "ENGINEERING & TECH",
        title: "SOFTWARE & TECHNICAL ROLES",
        description: "Evaluate practical problem solving, technical clarity, and core fundamentals.",
        href: "/?dept=Engineering",
      },
      {
        eyebrow: "BUSINESS & OPERATIONS",
        title: "OPERATIONS, SALES & MANAGEMENT",
        description: "Assess customer communication, teamwork, organization, and project execution.",
        href: "/?dept=Product",
      },
      {
        eyebrow: "HIGH-VOLUME HIRING",
        title: "FAST CAMPUS & BULK SCREENING",
        description: "Review hundreds of applicants quickly without hiring fatigue or scheduling backlogs.",
        href: "/?dept=Infrastructure",
      },
    ],
  },
  {
    id: "pricing",
    label: "PRICING",
    href: "/#pricing",
  },
  {
    id: "demo-hub",
    label: "DEMO HUB",
    href: "/#demo",
    dropdown: [
      {
        eyebrow: "CANDIDATE VIEW",
        title: "TRY AN ANSWER (CANDIDATE EXPERIENCE)",
        description: "Test the 30-second video recording screen with camera test, timer, and microphone check.",
        href: "/interview/demo-candidate-1",
      },
      {
        eyebrow: "EMPLOYER VIEW",
        title: "SAMPLE CANDIDATE REVIEW (ELENA ROSTOVA)",
        description: "Watch a sample recorded interview, see automated scores, and test 1-click hiring decisions.",
        href: "/recruiter",
      },
      {
        eyebrow: "APPLICATION TRACKER",
        title: "CANDIDATE DASHBOARD PREVIEW",
        description: "See the candidate's view: applied status, video submission confirmation, and next steps.",
        href: "/candidate/dashboard?email=alex.mercer@example.com",
      },
      {
        eyebrow: "SECURITY & FAIRNESS",
        title: "FAIR HIRING GUARANTEE",
        description: "Learn how we protect privacy, ensure equal timers, and eliminate bias in hiring.",
        href: "/specs#deadlines",
      },
    ],
  },
  {
    id: "resources",
    label: "RESOURCES",
    dropdown: [
      {
        eyebrow: "OUR PHILOSOPHY",
        title: "SEEING THE PERSON BEHIND THE RESUME",
        description: "Why short video answers give candidates a fairer chance than a flat paper resume.",
        href: "/specs",
      },
      {
        eyebrow: "PLATFORM DETAILS",
        title: "HOW IT WORKS & SPECIFICATIONS",
        description: "A clear overview of how video recording, scoring, and data privacy work together.",
        href: "/specs",
      },
      {
        eyebrow: "CUSTOMER SUPPORT",
        title: "CONTACT OUR TEAM",
        description: "Friendly help for candidates needing assistance or employers setting up hiring pipelines.",
        href: "/#contact",
      },
    ],
  },
];
