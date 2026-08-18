import { calculateRoleMatch, isValidEmail } from "./demo-logic.js";

const STORAGE_KEY = "signal-ats-sanitized-demo-v4";
const ACTIVE_FOUNDER_KEY = "signal-ats-active-founder-v1";
const founders = [
  { id: "maya-ceo", name: "Maya Chen", role: "CEO" },
  { id: "theo-cto", name: "Theo Brooks", role: "CTO" },
  { id: "lena-coo", name: "Lena Ortiz", role: "COO" }
];
const RESPONSE_TARGET_DAYS = 3;
const roles = [
  {
    id: "chief-financial-officer",
    title: "Chief Financial Officer",
    team: "Finance & Operations",
    location: "United States · Remote-friendly",
    type: "Full-time",
    summary: "Own Northstar Labs’ financial strategy and build the operating discipline that helps a small, ambitious fictional company scale with clarity.",
    overview: "Northstar Labs is looking for a hands-on CFO who can move comfortably between long-range strategy and the details of running a rigorous finance function. You will be a close partner to the fictional leadership team, turning business signals into better decisions while building durable systems and controls.",
    responsibilities: [
      "Own the company financial plan, forecasting model, budgeting process, and operating reviews.",
      "Advise the CEO and leadership team on capital allocation, growth tradeoffs, fundraising, and risk.",
      "Build clear reporting for the board and investors, with a concise view of performance and key drivers.",
      "Establish durable accounting, tax, treasury, compliance, and internal-control practices with the right external partners.",
      "Translate product, hiring, and go-to-market decisions into measurable financial outcomes."
    ],
    qualifications: [
      "10+ years across finance, strategic planning, or business operations, including senior leadership experience.",
      "Experience helping a venture-backed or high-growth software company scale through meaningful change.",
      "Strong command of SaaS metrics, financial modeling, fundraising, and board-level communication.",
      "A builder’s mindset: equally willing to design the system, pressure-test the assumptions, and improve the spreadsheet.",
      "High judgment, integrity, and the ability to communicate complex tradeoffs in plain language."
    ],
    niceToHave: [
      "Experience leading finance alongside people operations, legal, or broader company operations.",
      "A track record of improving data quality and connecting finance systems to the operating stack."
    ],
    keywords: ["finance", "financial planning", "fp&a", "accounting", "saas", "fundraising", "board", "operations", "leadership"]
  },
  {
    id: "mts-stack-engineer-intern-cohort",
    title: "MTS Stack Engineer Intern Cohort",
    team: "Engineering",
    location: "San Francisco · Hybrid",
    type: "Internship · Cohort",
    summary: "Join a small engineering cohort and ship fictional product work across Northstar Labs’ frontend, services, and data layer with close mentorship.",
    overview: "The MTS Stack Engineer Intern Cohort is a fictional role for early-career builders who learn through scoped projects with experienced engineers. The scenario demonstrates how Northstar Labs turns ambiguity into useful software.",
    responsibilities: [
      "Build and ship a scoped product feature across the browser, application services, and data layer.",
      "Pair with engineers on technical design, implementation, testing, and thoughtful code review.",
      "Talk through product context and use feedback to improve both the feature and the underlying approach.",
      "Write clear tests and documentation so the work remains easy for the team to understand and extend.",
      "Share a final walkthrough of what you built, what you learned, and what you would improve next."
    ],
    qualifications: [
      "Coursework, independent projects, or equivalent experience building software with JavaScript or TypeScript.",
      "A working understanding of web fundamentals, APIs, data structures, and relational databases.",
      "Curiosity, clear communication, and comfort asking questions when the problem is unfamiliar.",
      "Evidence that you finish things: a class project, open-source contribution, personal app, or other shipped work.",
      "Availability to collaborate from our San Francisco workspace during the cohort’s hybrid working days."
    ],
    niceToHave: [
      "Experience with React, Python, SQL, automated testing, or developer tools.",
      "Interest in product engineering and making complex workflows feel simple."
    ],
    keywords: ["javascript", "typescript", "react", "python", "api", "sql", "full stack", "computer science", "intern"]
    ,competencies: [
      { id: "problem-solving", name: "Structured problem solving", question: "Walk through a technical problem you scoped and solved." },
      { id: "collaboration", name: "Collaborative learning", question: "Tell us about a time feedback changed your approach." },
      { id: "execution", name: "End-to-end execution", question: "Show us something you finished and explain the tradeoffs." }
    ]
  }
];

const canonicalSkillTags = [
  { label: "React", aliases: ["react", "react.js", "reactjs"] },
  { label: "TypeScript", aliases: ["typescript", "ts"] },
  { label: "JavaScript", aliases: ["javascript", "js", "ecmascript"] },
  { label: "Python", aliases: ["python", "py"] },
  { label: "SQL", aliases: ["sql", "postgres", "postgresql", "mysql"] },
  { label: "AWS", aliases: ["aws", "amazon web services"] },
  { label: "API integration", aliases: ["api", "apis", "api integration", "rest", "graphql"] },
  { label: "Design systems", aliases: ["design system", "design systems", "component library"] },
  { label: "B2B SaaS", aliases: ["b2b saas", "saas", "software as a service"] },
  { label: "Customer success", aliases: ["customer success", "account management"] },
  { label: "HubSpot", aliases: ["hubspot"] },
  { label: "Salesforce", aliases: ["salesforce", "sfdc"] },
  { label: "Onboarding", aliases: ["onboarding", "implementation"] },
  { label: "Team management", aliases: ["team management", "people management", "managed team", "manager experience"] },
  { label: "Growth", aliases: ["growth", "growth marketing"] },
  { label: "Experimentation", aliases: ["experimentation", "a/b testing", "ab testing", "experiments"] },
  { label: "Lifecycle", aliases: ["lifecycle", "email marketing", "crm"] },
  { label: "Content", aliases: ["content", "content strategy", "copywriting"] },
  { label: "Healthcare", aliases: ["healthcare", "health care", "hipaa"] },
  { label: "Fintech", aliases: ["fintech", "financial technology"] },
  { label: "Financial planning", aliases: ["financial planning", "fp&a", "forecasting", "budgeting"] },
  { label: "Accounting", aliases: ["accounting", "gaap", "controller"] },
  { label: "Fundraising", aliases: ["fundraising", "capital raising", "investor relations"] }
];

const demoCandidates = [
  {
    candidate_id: "cand_101",
    name: "Priya Chen",
    email: "priya.chen@example.com",
    phone: "+1-555-0188",
    location: "San Francisco, CA",
    current_title: "VP, Finance & Operations",
    total_years_experience: 14,
    skills: ["Financial planning", "Accounting", "Fundraising", "B2B SaaS", "Team management"],
    industries: ["SaaS", "Fintech"],
    stage: "Shortlist",
    role_id: "chief-financial-officer",
    owner: "Jordan Lee",
    next_action: "Confirm board-partner interview panel",
    due_date: "2026-08-19",
    stage_entered_at: "2026-08-15T16:00:00Z",
    source: "Referral",
    background_tags: ["Former collegiate athlete", "Track & field"],
    exit_reason: "",
    notes: [
      { author: "Maya Chen", role: "CEO", text: "Strong CFO profile with a pragmatic operating style. Please press on how she handled a board disagreement during a difficult planning cycle.", created_at: "2026-08-15T18:20:00Z" },
      { author: "Lena Ortiz", role: "COO", text: "I like the operating range. Ask for a concrete example of rebuilding a finance process while the company was still scaling quickly.", created_at: "2026-08-16T16:10:00Z" }
    ],
    communications: [
      {
        event_id: "evt_101",
        type: "email",
        direction: "inbound",
        subject: "Application for Chief Financial Officer",
        body_preview: "Shared SaaS finance, fundraising, and operating leadership background.",
        owner: "careers@northstar.example",
        event_at: "2026-07-23T15:30:00Z"
      },
      {
        event_id: "evt_102",
        type: "interview",
        direction: "internal",
        subject: "Leadership conversation",
        body_preview: "Advance to CEO and board-partner conversation.",
        owner: "Recruiting",
        event_at: "2026-07-23T18:10:00Z"
      }
    ],
    resume_file_name: "priya-chen-resume.txt",
    resume_text: "PRIYA CHEN\nVP, FINANCE & OPERATIONS\nSan Francisco, CA | priya.chen@example.com\n\n14 years of experience leading financial planning, accounting, SaaS metrics, fundraising, board reporting, and finance teams. Former NCAA track & field student-athlete."
  },
  {
    candidate_id: "cand_102",
    name: "Marcus Rivera",
    email: "marcus.rivera@example.com",
    phone: "+1-555-0142",
    location: "Austin, TX",
    current_title: "Computer Science Student",
    total_years_experience: 2,
    skills: ["TypeScript", "React", "Python", "SQL", "API integration"],
    industries: ["Developer tools", "Education"],
    stage: "Interview",
    role_id: "mts-stack-engineer-intern-cohort",
    owner: "Sam Patel",
    next_action: "Review completed scorecards",
    due_date: "2026-08-18",
    stage_entered_at: "2026-08-13T17:00:00Z",
    source: "Careers site",
    background_tags: ["Student athlete", "NCAA soccer"],
    exit_reason: "",
    retention_status: "Retain until Feb 17, 2027",
    scorecards: [
      { interviewer: "Avery Kim", submitted: true, recommendation: "advance", responses: [
        { competency: "Structured problem solving", rating: 4, evidence: "Explained API retry tradeoffs and connected the choice to observed failure modes." },
        { competency: "Collaborative learning", rating: 4, evidence: "Described revising a data model after peer review and what improved." },
        { competency: "End-to-end execution", rating: 3, evidence: "Shipped a course-planning app with tests; monitoring depth remains an interview follow-up." }
      ]},
      { interviewer: "Noah Williams", submitted: false, recommendation: "hold", responses: [] }
    ],
    decision: { status: "Pending", owner: "Morgan Davis", rationale: "Waiting for the second independent scorecard." },
    assistant: {
      summary: "Marcus describes two completed full-stack projects using TypeScript, React, Python, SQL, APIs, testing, and Git.",
      evidence: ["Résumé: “two full-stack projects”", "Résumé lists TypeScript, React, Python, SQL, REST APIs, testing, and Git"],
      questions: ["What tradeoff did you make while shipping one project?", "How did testing change the way you designed an API?"]
    },
    notes: [
      { author: "Theo Brooks", role: "CTO", text: "The project work is promising. Please ask Marcus to whiteboard the retry strategy and explain where he would simplify it for production.", created_at: "2026-08-14T19:05:00Z" },
      { author: "Maya Chen", role: "CEO", text: "I want to understand how he balances a demanding team schedule with shipping. Look for a specific system or habit, not a general answer.", created_at: "2026-08-15T17:40:00Z" }
    ],
    communications: [
      {
        event_id: "evt_201",
        type: "email",
        direction: "outbound",
        subject: "MTS Stack Engineer Intern Cohort conversation",
        body_preview: "Sent scheduling options for the cohort technical conversation.",
        owner: "Recruiting",
        event_at: "2026-07-23T17:00:00Z"
      }
    ],
    resume_file_name: "marcus-rivera-resume.txt",
    resume_text: "MARCUS RIVERA\nCOMPUTER SCIENCE STUDENT\nAustin, TX | marcus.rivera@example.com\n\n2 years of project experience using TypeScript, React, Python, SQL, REST APIs, testing, and Git. NCAA soccer student-athlete and team captain."
  },
  {
    candidate_id: "cand_103",
    name: "Elena Brooks",
    email: "elena.brooks@example.com",
    phone: "+1-555-0119",
    location: "Brooklyn, NY",
    current_title: "Growth Marketing Lead",
    total_years_experience: 6,
    skills: ["Growth", "Experimentation", "SQL", "Lifecycle", "Content"],
    industries: ["SaaS", "Healthcare"],
    stage: "Review",
    role_id: "mts-stack-engineer-intern-cohort",
    owner: "Sam Patel",
    next_action: "Send application status update",
    due_date: "2026-08-14",
    stage_entered_at: "2026-08-10T17:00:00Z",
    source: "University event",
    exit_reason: "",
    notes: [{ author: "Lena Ortiz", role: "COO", text: "Interesting analytics background, but the role fit is unclear. Ask what is motivating the engineering pivot and which technical work she owned directly.", created_at: "2026-08-12T20:15:00Z" }],
    communications: [],
    resume_file_name: "elena-brooks-resume.txt",
    resume_text: "ELENA BROOKS\nGROWTH MARKETING LEAD\nBrooklyn, NY | elena.brooks@example.com\n\n6 years of experimentation, SQL, lifecycle programs, B2B SaaS, healthcare, and content strategy experience."
  },
  {
    candidate_id: "cand_104", name: "Talia Okafor", email: "talia.okafor@example.com", phone: "+1-555-0166", location: "Oakland, CA",
    current_title: "Software Engineering Student", total_years_experience: 2, skills: ["JavaScript", "React", "SQL", "API integration"], industries: ["Education"],
    stage: "Offer", role_id: "mts-stack-engineer-intern-cohort", owner: "Sam Patel", next_action: "Confirm onboarding handoff", due_date: "2026-08-18", stage_entered_at: "2026-08-16T17:00:00Z", source: "Employee referral", exit_reason: "", retention_status: "Retain until Feb 17, 2027",
    background_tags: ["Club athlete", "Rowing"],
    notes: [{ author: "Theo Brooks", role: "CTO", text: "Strong evidence of finishing. In the final conversation, ask what she would monitor after launch and what she would change with another week.", created_at: "2026-08-15T18:00:00Z" }], communications: [{ event_id: "evt_401", type: "email", direction: "outbound", status: "sent (simulated)", subject: "Welcome to the intern cohort", body_preview: "Offer-stage message reviewed and marked sent for this browser-only demo.", owner: "Sam Patel", event_at: "2026-08-16T18:00:00Z" }],
    scorecards: [
      { interviewer: "Avery Kim", submitted: true, recommendation: "advance", responses: [{ competency: "Structured problem solving", rating: 4, evidence: "Used a clear hypothesis-and-test approach in the project walkthrough." }] },
      { interviewer: "Noah Williams", submitted: true, recommendation: "advance", responses: [{ competency: "Collaborative learning", rating: 4, evidence: "Gave a specific example of incorporating code review feedback." }] }
    ],
    decision: { status: "Advance", owner: "Morgan Davis", rationale: "Both interviewers documented job-related evidence; hiring manager approved the offer." },
    onboarding: { owner: "Jamie Torres", start_date: "2026-09-08", equipment: "Laptop and security key", documents: "Intern agreement and payroll forms", tasks: ["Send welcome guide", "Schedule orientation", "Assign engineering buddy", "Plan first-week project kickoff"] },
    assistant: { summary: "Talia presents project evidence in JavaScript, React, SQL, and API integration.", evidence: ["Résumé lists JavaScript, React, SQL, and API integration"], questions: ["How did you validate the API behavior?"] },
    resume_file_name: "talia-okafor-resume.txt",
    resume_text: "TALIA OKAFOR\nSOFTWARE ENGINEERING STUDENT\nOakland, CA | talia.okafor@example.com\n\nCompleted projects using JavaScript, React, SQL, and API integration. Competitive club rower and novice-team mentor.", created_at: "2026-08-08T17:00:00Z", updated_at: "2026-08-16T18:00:00Z"
  },
  {
    candidate_id: "cand_105", name: "Devon Shah", email: "devon.shah@example.com", phone: "+1-555-0127", location: "Chicago, IL",
    current_title: "Director of Strategic Finance", total_years_experience: 11, skills: ["Financial planning", "Fundraising", "B2B SaaS", "Accounting"], industries: ["SaaS"],
    stage: "Interview", role_id: "chief-financial-officer", owner: "Jordan Lee", next_action: "Probe leadership scale and controls", due_date: "2026-08-21", stage_entered_at: "2026-08-17T16:00:00Z", source: "Executive search", exit_reason: "",
    notes: [{ author: "Maya Chen", role: "CEO", text: "Excellent strategic finance depth. Please test whether Devon is ready to own accounting and controls, not only FP&A and fundraising.", created_at: "2026-08-17T19:30:00Z" }], communications: [],
    resume_file_name: "devon-shah-resume.txt", resume_text: "DEVON SHAH\nDIRECTOR OF STRATEGIC FINANCE\nChicago, IL | devon.shah@example.com\n\n11 years across SaaS financial planning, fundraising, accounting partnership, board materials, and operating reviews."
  },
  {
    candidate_id: "cand_106", name: "Jordan Ellis", email: "jordan.ellis@example.com", phone: "+1-555-0193", location: "Berkeley, CA",
    current_title: "Computer Science & Design Student", total_years_experience: 1, skills: ["TypeScript", "React", "Design systems", "API integration"], industries: ["Consumer software"],
    stage: "Review", role_id: "mts-stack-engineer-intern-cohort", owner: "Sam Patel", next_action: "Review portfolio project", due_date: "2026-08-20", stage_entered_at: "2026-08-17T17:00:00Z", source: "University event", exit_reason: "",
    background_tags: ["Student athlete", "Varsity swimming"],
    notes: [{ author: "Theo Brooks", role: "CTO", text: "The accessibility work stands out. Ask Jordan to walk through one design-system decision and how they measured whether it helped users.", created_at: "2026-08-17T21:10:00Z" }], communications: [],
    resume_file_name: "jordan-ellis-resume.txt", resume_text: "JORDAN ELLIS\nCOMPUTER SCIENCE & DESIGN STUDENT\nBerkeley, CA | jordan.ellis@example.com\n\nBuilt accessible React and TypeScript interfaces, a small design system, and REST API integrations. Varsity swimming student-athlete."
  },
  {
    candidate_id: "cand_107", name: "Nia Wallace", email: "nia.wallace@example.com", phone: "+1-555-0175", location: "Atlanta, GA",
    current_title: "Backend Engineering Intern", total_years_experience: 2, skills: ["Python", "SQL", "API integration", "AWS"], industries: ["Fintech"],
    stage: "Shortlist", role_id: "mts-stack-engineer-intern-cohort", owner: "Sam Patel", next_action: "Schedule technical conversation", due_date: "2026-08-22", stage_entered_at: "2026-08-18T16:00:00Z", source: "Referral", exit_reason: "",
    notes: [{ author: "Lena Ortiz", role: "COO", text: "Strong backend fundamentals and clear ownership. Please ask how she recovered when the internship project slipped behind schedule.", created_at: "2026-08-18T17:15:00Z" }], communications: [],
    resume_file_name: "nia-wallace-resume.txt", resume_text: "NIA WALLACE\nBACKEND ENGINEERING INTERN\nAtlanta, GA | nia.wallace@example.com\n\n2 years of internship and project work with Python, SQL, REST APIs, AWS, testing, and fintech systems."
  },
  {
    candidate_id: "cand_108", name: "Owen Park", email: "owen.park@example.com", phone: "+1-555-0154", location: "Seattle, WA",
    current_title: "Finance & Operations VP", total_years_experience: 15, skills: ["Financial planning", "Accounting", "Team management", "Fundraising"], industries: ["SaaS", "Healthcare"],
    stage: "New", role_id: "chief-financial-officer", owner: "Jordan Lee", next_action: "Complete initial review", due_date: "2026-08-22", stage_entered_at: "2026-08-18T17:00:00Z", source: "Careers site", exit_reason: "",
    background_tags: ["Former professional athlete", "Baseball"],
    notes: [{ author: "Maya Chen", role: "CEO", text: "Broad operator profile. I want to understand why now, and whether Owen can translate experience from a larger organization into our current stage.", created_at: "2026-08-18T18:05:00Z" }], communications: [],
    resume_file_name: "owen-park-resume.txt", resume_text: "OWEN PARK\nFINANCE & OPERATIONS VP\nSeattle, WA | owen.park@example.com\n\n15 years in financial planning, accounting, fundraising, healthcare SaaS, and team management. Former professional baseball player."
  }
];

let selectedCandidateId = null;
let activeMetric = null;
let pendingStageMove = null;
const AUDIT_KEY = "signal-ats-sanitized-audit-v1";

function logAudit(action, candidate, detail) {
  const events = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
  events.unshift({ action, candidate: candidate?.name || "Workspace", detail, actor: "Demo recruiter", at: new Date().toISOString() });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(events.slice(0, 40)));
}

function getCandidates() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoCandidates));
    return [...demoCandidates];
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoCandidates));
    return [...demoCandidates];
  }
}

function saveCandidates(candidates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
}

function getActiveFounder() {
  const founderId = localStorage.getItem(ACTIVE_FOUNDER_KEY) || founders[0].id;
  return founders.find((founder) => founder.id === founderId) || founders[0];
}

function normalizeNote(note) {
  if (typeof note === "string") return { author: "Demo recruiter", role: "Recruiting", text: note, created_at: "" };
  return note || { author: "Unknown", role: "Team", text: "", created_at: "" };
}

function renderBackgroundTags(candidate) {
  const tags = candidate.background_tags || [];
  if (!tags.length) return "";
  return `<span class="background-tags" aria-label="Self-reported background">${tags.map((tag) => `<span class="background-tag">${escapeHtml(tag)}</span>`).join("")}</span>`;
}

function renderFounderNotes(candidate) {
  const notes = (candidate.notes || []).map(normalizeNote);
  if (!notes.length) return `<p class="detail-empty">No founder notes yet.</p>`;
  return `<div class="founder-notes">${notes.map((note) => `
    <article class="founder-note">
      <div class="founder-note-heading"><span class="founder-avatar" aria-hidden="true">${escapeHtml(note.author.split(/\s+/).map((part) => part[0]).join("").slice(0, 2))}</span><span><strong>${escapeHtml(note.author)}</strong><small>${escapeHtml(note.role)}${note.created_at ? ` · ${escapeHtml(formatDate(note.created_at))}` : ""}</small></span></div>
      <p>${escapeHtml(note.text)}</p>
    </article>
  `).join("")}</div>`;
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function tokens(value) {
  return normalize(value).split(/[^a-z0-9+#.]+/).filter(Boolean);
}

function canonicalizeSkillTag(value) {
  const normalized = normalize(value).trim();
  if (!normalized) return "";
  const canonical = canonicalSkillTags.find((tag) => tag.aliases.includes(normalized));
  if (canonical) return canonical.label;
  return String(value).trim()
    .split(/\s+/)
    .map((part) => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : "")
    .join(" ");
}

function inferCanonicalSkills(text) {
  const normalized = normalize(text);
  return canonicalSkillTags
    .filter((tag) => tag.aliases.some((alias) => textHasAlias(normalized, alias)))
    .map((tag) => tag.label);
}

function textHasAlias(text, alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const boundaryPattern = /^[a-z0-9]+$/i.test(alias)
    ? new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i")
    : new RegExp(escaped, "i");
  return boundaryPattern.test(text);
}

function buildCandidateSkills(manualSkills, resumeText) {
  const typedSkills = String(manualSkills || "")
    .split(",")
    .map(canonicalizeSkillTag)
    .filter(Boolean);
  return [...new Set([...typedSkills, ...inferCanonicalSkills(resumeText)])];
}

function parseResumeProfile(resumeText, fileName = "") {
  const lines = String(resumeText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const text = lines.join("\n");
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || "";
  const yearsMatch = text.match(/(\d{1,2})\+?\s+(?:years|yrs)\b/i);
  const totalYears = yearsMatch ? Number(yearsMatch[1]) : 0;
  const location = findLocation(lines);
  const currentTitle = findCurrentTitle(lines);
  const name = findCandidateName(lines, email, fileName);
  const skills = buildCandidateSkills("", text);

  return {
    name,
    email,
    phone,
    location,
    current_title: currentTitle,
    total_years_experience: totalYears,
    skills
  };
}

function findCandidateName(lines, email, fileName) {
  const likelyLine = lines.find((line) => {
    const lower = normalize(line);
    return line.length <= 60 && !lower.includes("@") && !lower.includes("resume") && /^[a-z ,.'-]+$/i.test(line);
  });
  if (likelyLine) return likelyLine;
  if (email) return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "New Applicant";
}

function findCurrentTitle(lines) {
  const titleKeywords = [
    "engineer",
    "manager",
    "designer",
    "developer",
    "director",
    "lead",
    "analyst",
    "specialist",
    "coordinator",
    "consultant",
    "recruiter",
    "marketer",
    "sales",
    "success",
    "product"
  ];
  return lines.find((line, index) => {
    const lower = normalize(line);
    return index < 8 && line.length <= 80 && titleKeywords.some((keyword) => lower.includes(keyword));
  }) || "Resume applicant";
}

function findLocation(lines) {
  const locationPattern = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)*,\s*(?:[A-Z]{2}|[A-Z][a-z]+)\b/;
  const locationLine = lines.find((line) => locationPattern.test(line));
  return locationLine?.match(locationPattern)?.[0] || "";
}

function candidateText(candidate) {
  return [
    candidate.name,
    candidate.current_title,
    candidate.location,
    candidate.skills?.join(" "),
    candidate.industries?.join(" "),
    candidate.background_tags?.join(" "),
    candidate.resume_text
  ].join(" ");
}

function scoreCandidate(candidate, query, roleId) {
  const queryTokens = tokens(query);
  const role = roles.find((item) => item.id === roleId);
  const roleTokens = role && roleId !== "all" ? role.keywords : [];
  const allTokens = [...queryTokens, ...roleTokens.map(normalize)];
  const text = normalize(candidateText(candidate));
  const matched = allTokens.filter((token) => text.includes(token));
  const uniqueMatches = [...new Set(matched)];
  const base = allTokens.length ? uniqueMatches.length / allTokens.length : 0.48;
  const experienceBoost = Math.min(Number(candidate.total_years_experience || 0) / 20, 0.25);
  return Math.min(0.99, base * 0.74 + experienceBoost + 0.08);
}

function selectedMatch(candidate, roleId) {
  const role = roles.find((item) => item.id === roleId) || roles.find((item) => item.id === candidate.role_id) || roles[0];
  return { role, ...calculateRoleMatch(candidate, role) };
}

function matchReasons(candidate, query, roleId) {
  const role = roles.find((item) => item.id === roleId);
  const text = normalize(candidateText(candidate));
  const reasons = [];
  const matchingSkills = (candidate.skills || []).filter((skill) => text.includes(normalize(skill))).slice(0, 3);

  if (candidate.total_years_experience) {
    reasons.push(`${candidate.total_years_experience} years of relevant experience`);
  }
  if (matchingSkills.length) {
    reasons.push(`Signals: ${matchingSkills.join(", ")}`);
  }
  if (role && roleId !== "all") {
    const hits = role.keywords.filter((keyword) => text.includes(keyword)).slice(0, 3);
    if (hits.length) reasons.push(`Matches ${role.title}: ${hits.join(", ")}`);
  }
  if (query && tokens(query).some((token) => text.includes(token))) {
    reasons.push("Contains terms from the search prompt");
  }
  return reasons.slice(0, 4);
}

function roleKeywordHits(candidate, roleId) {
  const role = roles.find((item) => item.id === roleId);
  if (!role || roleId === "all") return [];
  const text = normalize(candidateText(candidate));
  return role.keywords.filter((keyword) => text.includes(normalize(keyword)));
}

function candidateMatchesRole(candidate, roleId) {
  if (roleId === "all") return true;
  return roleKeywordHits(candidate, roleId).length >= 2;
}

function formatMatchKeyword(keyword) {
  const displayNames = {
    api: "API",
    b2b: "B2B",
    saas: "SaaS",
    sql: "SQL",
    typescript: "TypeScript"
  };
  return displayNames[keyword] || keyword.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderCandidateRoleEvidence(candidate) {
  const roleId = document.querySelector("#role-filter-id")?.value || "all";
  if (roleId === "all") return "";
  const hits = roleKeywordHits(candidate, roleId).slice(0, 4).map(formatMatchKeyword);
  if (!hits.length) return "";
  return `<span class="match-evidence">Matched on ${hits.map(escapeHtml).join(", ")}</span>`;
}

function filteredCandidates() {
  const query = document.querySelector("#candidate-search")?.value || "";
  const stage = document.querySelector("#stage-filter")?.value || "all";
  const minYears = Number(document.querySelector("#years-filter")?.value || 0);
  const roleId = document.querySelector("#role-filter-id")?.value || "all";
  const background = document.querySelector("#background-filter")?.value || "all";

  return getCandidates()
    .filter((candidate) => stage === "all" || candidate.stage === stage)
    .filter((candidate) => Number(candidate.total_years_experience || 0) >= minYears)
    .filter((candidate) => background === "all" || (candidate.background_tags || []).length > 0)
    .filter((candidate) => candidateMatchesRole(candidate, roleId))
    .map((candidate) => ({
      ...candidate,
      match_score: scoreCandidate(candidate, query, roleId),
      match_reasons: matchReasons(candidate, query, roleId)
    }))
    .filter((candidate) => !query || tokens(query).every((token) => normalize(candidateText(candidate)).includes(token)))
    .sort((a, b) => b.match_score - a.match_score);
}

function renderMetrics() {
  const candidates = getCandidates();
  const setText = (id, value) => {
    const node = document.querySelector(id);
    if (node) node.textContent = value;
  };
  setText("#metric-total", candidates.length);
  setText("#metric-shortlist", candidates.filter((item) => item.stage === "Shortlist").length);
  setText("#metric-interview", candidates.filter((item) => item.stage === "Interview").length);
  setText("#metric-open-roles", roles.length);
}

function renderMetricDrilldown(metric) {
  const cards = [...document.querySelectorAll(".metric-card")];
  const card = cards.find((item) => item.dataset.metric === metric);
  const panel = card?.querySelector("[data-metric-inline]");
  if (!card || !panel) return;
  const shouldClose = activeMetric === metric;
  cards.forEach((item) => {
    const inline = item.querySelector("[data-metric-inline]");
    const isActive = item.dataset.metric === metric && !shouldClose;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-expanded", String(isActive));
    if (inline && item !== card) {
      inline.hidden = true;
      inline.innerHTML = "";
    }
  });
  if (shouldClose) {
    activeMetric = null;
    panel.hidden = true;
    panel.innerHTML = "";
    card.classList.remove("active");
    card.setAttribute("aria-expanded", "false");
    return;
  }
  activeMetric = metric;
  panel.hidden = false;
  panel.innerHTML = "";
  document.querySelectorAll(".metric-card").forEach((card) => {
    const isActive = card.dataset.metric === metric;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-expanded", String(isActive));
  });
  if (metric === "roles") {
    panel.innerHTML = `
      <div class="metric-inline-header">Open roles</div>
      <div class="drilldown-list">
        ${roles.map((role) => `
          <button class="drilldown-item" type="button" data-role-filter="${role.id}">
            <strong>${escapeHtml(role.title)}</strong>
            <span>${escapeHtml(role.team)} | ${escapeHtml(role.location)}</span>
            <span>${escapeHtml(role.summary)}</span>
          </button>
        `).join("")}
      </div>
    `;
    return;
  }
  const candidates = getCandidates().filter((candidate) => metric === "total" || candidate.stage === metric);
  const title = metric === "total" ? "Total candidates" : `${metric} candidates`;
  panel.innerHTML = `
    <div class="metric-inline-header">${candidates.length} ${title.toLowerCase()}</div>
    <div class="drilldown-list">
      ${candidates.map((candidate) => `
        <button class="drilldown-item" type="button" data-drilldown-candidate="${candidate.candidate_id}">
          <strong>${escapeHtml(candidate.name)}</strong>
          <span>${escapeHtml(candidate.current_title || "No title")} | ${escapeHtml(candidate.location || "No location")}</span>
          <span>${escapeHtml(candidate.stage || "New")} | ${(candidate.skills || []).slice(0, 3).map(escapeHtml).join(", ")}</span>
        </button>
      `).join("") || `<p class="detail-empty">No candidates in this group yet.</p>`}
    </div>
  `;
}

function refreshMetricDrilldown() {
  if (!activeMetric) return;
  const metric = activeMetric;
  activeMetric = null;
  renderMetricDrilldown(metric);
}

function renderRoleFilter() {
  const roleFilter = document.querySelector("#role-filter");
  if (!roleFilter) return;
  roleFilter.value = "";
  roleFilter.setAttribute("aria-expanded", "false");
}

function roleCandidateCount(roleId) {
  const candidates = getCandidates();
  if (roleId === "all") return candidates.length;
  return candidates.filter((candidate) => candidateMatchesRole(candidate, roleId)).length;
}

function renderDashboardRoleSuggestions(query) {
  const menu = document.querySelector("#dashboard-role-suggestions");
  if (!menu) return;
  const selectedRoleId = document.querySelector("#role-filter-id")?.value || "all";
  const input = document.querySelector("#role-filter");
  const normalizedQuery = normalize(query);
  const matches = roles.filter((role) => {
    const haystack = normalize([role.title, role.team, role.location, role.type, role.summary, role.keywords.join(" ")].join(" "));
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });
  const allRolesSelected = selectedRoleId === "all";
  menu.innerHTML = `
    <button class="suggestion-option" type="button" role="option" data-dashboard-role="all" aria-selected="${allRolesSelected}">
      <span class="role-option-top">
        <strong>All roles</strong>
        <span>${roleCandidateCount("all")} candidates</span>
      </span>
      <span>Search across the whole applicant pool</span>
    </button>
    ${matches.map((role) => `
      <button class="suggestion-option" type="button" role="option" data-dashboard-role="${role.id}" aria-selected="${selectedRoleId === role.id}">
        <span class="role-option-top">
          <strong>${escapeHtml(role.title)}</strong>
          <span>${roleCandidateCount(role.id)} matches</span>
        </span>
        <span class="role-option-meta">
          <span>${escapeHtml(role.team)}</span>
          <span>${escapeHtml(role.location)}</span>
          <span>${escapeHtml(role.type)}</span>
        </span>
      </button>
    `).join("") || `
      <span class="suggestion-option" role="option" aria-disabled="true">
        <strong>No matching roles</strong>
        <span>Search will stay across all roles.</span>
      </span>
    `}
  `;
  menu.hidden = false;
  if (input) input.setAttribute("aria-expanded", "true");
}

function hideDashboardRoleSuggestionsSoon() {
  window.setTimeout(() => {
    const menu = document.querySelector("#dashboard-role-suggestions");
    if (menu) menu.hidden = true;
    document.querySelector("#role-filter")?.setAttribute("aria-expanded", "false");
  }, 120);
}

function selectDashboardRole(roleId) {
  const input = document.querySelector("#role-filter");
  const hidden = document.querySelector("#role-filter-id");
  const menu = document.querySelector("#dashboard-role-suggestions");
  const role = roles.find((item) => item.id === roleId);
  if (hidden) hidden.value = roleId;
  if (input) input.value = role ? role.title : "";
  if (input) input.setAttribute("aria-expanded", "false");
  if (menu) menu.hidden = true;
  selectedCandidateId = null;
  pendingStageMove = null;
  renderCandidates();
  clearCandidateDetail(role ? `Choose a ${role.title} candidate to view their profile, evidence, notes, and pipeline actions.` : "Search or choose a candidate to view match evidence, notes, and pipeline actions.");
}

function clearCandidateDetail(message) {
  const detail = document.querySelector("#candidate-detail");
  const name = document.querySelector("#detail-name");
  const status = document.querySelector("#detail-status");
  if (name) name.textContent = "Select a candidate";
  if (status) {
    status.textContent = "";
    status.hidden = true;
  }
  if (detail) {
    detail.className = "detail-empty";
    detail.textContent = message;
  }
}

function focusDashboardRoleOption(direction = 1) {
  const menu = document.querySelector("#dashboard-role-suggestions");
  if (!menu || menu.hidden) return;
  const options = [...menu.querySelectorAll("[data-dashboard-role]")];
  if (!options.length) return;
  const currentIndex = options.indexOf(document.activeElement);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + options.length) % options.length;
  options[nextIndex].focus();
}

function handleDashboardRoleKeydown(event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    renderDashboardRoleSuggestions(event.currentTarget.value);
    focusDashboardRoleOption(1);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    const menu = document.querySelector("#dashboard-role-suggestions");
    if (menu) menu.hidden = true;
    event.currentTarget.setAttribute("aria-expanded", "false");
  }
}

function handleDashboardRoleMenuKeydown(event) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    focusDashboardRoleOption(event.key === "ArrowDown" ? 1 : -1);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    const menu = document.querySelector("#dashboard-role-suggestions");
    if (menu) menu.hidden = true;
    const input = document.querySelector("#role-filter");
    if (input) {
      input.setAttribute("aria-expanded", "false");
      input.focus();
    }
  }
}

function renderPipelineRoleContext() {
  const context = document.querySelector("#pipeline-role-context");
  if (!context) return;
  const roleId = document.querySelector("#role-filter-id")?.value || "all";
  const role = roles.find((item) => item.id === roleId);
  if (!role || roleId === "all") {
    context.hidden = true;
    context.textContent = "";
    return;
  }
  context.textContent = `Matching for: ${role.title}`;
  context.hidden = false;
}

function renderCandidates() {
  const list = document.querySelector("#candidate-list");
  if (!list) return;
  renderPipelineRoleContext();
  const candidates = filteredCandidates();
  if (!candidates.length) {
    list.innerHTML = `<p class="detail-empty">No candidates match this search yet.</p>`;
    return;
  }
  list.innerHTML = candidates.map((candidate) => `
    <button class="candidate-card ${candidate.candidate_id === selectedCandidateId ? "active" : ""}" type="button" data-candidate-id="${candidate.candidate_id}">
      <span class="card-top">
        <span>
          <h3>${escapeHtml(candidate.name)}</h3>
          <p>${escapeHtml(candidate.current_title || "No title")} | ${escapeHtml(candidate.location || "No location")}</p>
        </span>
        <span class="evidence-count">${roleKeywordHits(candidate, document.querySelector("#role-filter-id")?.value || "all").length || (candidate.skills || []).length} evidence signals</span>
      </span>
      <span class="stage-pill">${escapeHtml(candidate.stage || "New")}</span>
      ${renderBackgroundTags(candidate)}
      <span class="ownership-line"><strong>${escapeHtml(candidate.owner || "Unassigned")}</strong> · ${escapeHtml(candidate.next_action || "Set next action")} · ${escapeHtml(candidate.due_date || "No due date")}</span>
      ${renderCandidateRoleEvidence(candidate)}
      <span class="chips">${(candidate.skills || []).slice(0, 5).map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("")}</span>
    </button>
  `).join("");
}

function renderDetail(candidateId) {
  const detail = document.querySelector("#candidate-detail");
  const name = document.querySelector("#detail-name");
  const status = document.querySelector("#detail-status");
  if (!detail || !name) return;
  const roleId = document.querySelector("#role-filter-id")?.value || "all";
  const query = document.querySelector("#candidate-search")?.value || "";
  const candidate = getCandidates().find((item) => item.candidate_id === candidateId);
  if (!candidate) return;
  if (selectedCandidateId && selectedCandidateId !== candidateId) pendingStageMove = null;
  const reasons = matchReasons(candidate, query, roleId);
  const match = selectedMatch(candidate, roleId);
  const role = roles.find((item) => item.id === candidate.role_id) || roles.find((item) => item.id === roleId);
  const activeFounder = getActiveFounder();
  selectedCandidateId = candidateId;
  name.textContent = candidate.name;
  if (status) {
    status.textContent = candidate.stage || "New";
    status.hidden = false;
  }
  detail.className = "detail-body";
  detail.innerHTML = `
    <section class="profile-resume-bar">
      <div><p class="eyebrow">Candidate file</p><strong>${escapeHtml(candidate.resume_file_name || `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.txt`)}</strong><span>Sanitized résumé · browser-local</span></div>
      <button class="primary-action" type="button" data-action="download-resume">Download résumé</button>
    </section>
    ${renderBackgroundTags(candidate)}
    ${(candidate.background_tags || []).length ? `<p class="background-disclaimer">Self-reported background context. This tag is not included in match scoring and should be validated through job-related evidence.</p>` : ""}
    <dl>
      <dt>Title</dt><dd>${escapeHtml(candidate.current_title || "Not listed")}</dd>
      <dt>Email</dt><dd>${escapeHtml(candidate.email || "Not listed")}</dd>
      <dt>Location</dt><dd>${escapeHtml(candidate.location || "Not listed")}</dd>
      <dt>Experience</dt><dd>${Number(candidate.total_years_experience || 0)} years</dd>
      <dt>Skills</dt><dd>${escapeHtml((candidate.skills || []).join(", ") || "Not listed")}</dd>
      <dt>Owner</dt><dd>${escapeHtml(candidate.owner || "Unassigned")}</dd>
      <dt>Next action</dt><dd>${escapeHtml(candidate.next_action || "Not set")}</dd>
      <dt>Due</dt><dd>${escapeHtml(candidate.due_date || "Not set")}</dd>
      <dt>Retention</dt><dd>${escapeHtml(candidate.retention_status || "Policy not assigned")}</dd>
    </dl>
    <section class="match-breakdown" data-tour-target="matching">
      <div class="section-heading split"><div><p class="eyebrow">Explainable matching</p><h3>${match.percent}% match for ${escapeHtml(match.role.title)}</h3></div><span class="match-percent">${match.percent}%</span></div>
      <p class="section-copy">Deterministic comparison for human review. ${escapeHtml(match.reason)}</p>
      <div class="match-columns"><div><strong>Matched skills and signals</strong><ul class="notes-list">${match.matched.map((item) => `<li>${escapeHtml(formatMatchKeyword(item))}</li>`).join("") || "<li>No role signals found yet.</li>"}</ul></div><div><strong>Missing role signals</strong><ul class="notes-list">${match.missing.map((item) => `<li>${escapeHtml(formatMatchKeyword(item))}</li>`).join("") || "<li>No missing signals.</li>"}</ul></div></div>
      <p class="experience-evidence"><strong>Relevant experience:</strong> ${match.experienceYears} years recorded. ${(reasons || []).map(escapeHtml).join(" · ")}</p>
      <details><summary>How this percentage works</summary><p>Role-signal coverage contributes 80 points. Recorded experience contributes up to 20 points at two points per year. It does not assess people, potential, or hiring quality.</p></details>
    </section>
    ${renderAssistant(candidate)}
    ${renderScorecards(candidate, role)}
    ${renderDecision(candidate)}
    ${renderCommunicationComposer(candidate, role)}
    ${renderOnboarding(candidate)}
    <div data-tour-target="context">
      <div class="section-heading split"><div><p class="eyebrow">Founder context</p><h3>Notes & interview prompts</h3></div><span class="active-author">Adding as ${escapeHtml(activeFounder.name)} · ${escapeHtml(activeFounder.role)}</span></div>
      ${renderFounderNotes(candidate)}
    </div>
    <div data-tour-target="history">
      <h3>Communication timeline</h3>
      <ul class="timeline-list">${renderCommunications(candidate)}</ul>
    </div>
    <label>Add founder note or interview prompt<textarea id="new-note" rows="3" placeholder="Share your opinion, a question to press on, or context for the evaluator"></textarea></label>
    <label>Email or interview update<textarea id="new-communication" rows="3" placeholder="Candidate replied, interview scheduled, follow-up sent"></textarea></label>
    <label>Subject<input id="new-communication-subject" placeholder="Email subject or interview title"></label>
    <div class="detail-actions">
      <button class="ghost-action" type="button" data-action="note">Save note</button>
      <button class="ghost-action" type="button" data-action="inbound-email">Log inbound</button>
      <button class="ghost-action" type="button" data-action="outbound-email">Log outbound</button>
      <button class="ghost-action" type="button" data-action="interview">Log interview</button>
      <button class="ghost-action" type="button" data-action="internal-update">Log internal update</button>
    </div>
    <div class="stage-move-panel" data-tour-target="stage">
      <h3>Move stage</h3>
      <div class="stage-action-row">
        ${renderStageMoveButtons(candidate)}
      </div>
      ${pendingStageMove?.candidateId === candidate.candidate_id ? `<p class="stage-confirmation">Click Confirm ${escapeHtml(pendingStageMove.stage)} to move this candidate.</p>` : ""}
    </div>
    <details class="edit-candidate"><summary>Edit browser-local candidate</summary><div class="scorecard-form"><label>Name<input id="edit-name" value="${escapeHtml(candidate.name)}" required></label><label>Email<input id="edit-email" type="email" value="${escapeHtml(candidate.email || "")}"></label><label>Title<input id="edit-title" value="${escapeHtml(candidate.current_title || "")}"></label><label>Location<input id="edit-location" value="${escapeHtml(candidate.location || "")}"></label><label>Experience years<input id="edit-years" type="number" min="0" value="${Number(candidate.total_years_experience || 0)}"></label><label>Skills (comma separated)<input id="edit-skills" value="${escapeHtml((candidate.skills || []).join(", "))}"></label><label>Résumé text<textarea id="edit-resume" rows="5">${escapeHtml(candidate.resume_text || "")}</textarea></label><button class="primary-action" data-action="save-candidate">Save changes</button></div></details>
    <div class="privacy-controls"><h3>Candidate data controls</h3><p class="section-copy">All actions affect this browser only.</p><div class="detail-actions"><button class="ghost-action" data-action="archive">Archive</button><button class="ghost-action danger" data-action="remove">Remove candidate</button></div></div>
  `;
  renderCandidates();
}

function daysInStage(candidate) {
  const started = new Date(candidate.stage_entered_at || candidate.updated_at || candidate.created_at || Date.now());
  return Math.max(0, Math.floor((Date.now() - started.getTime()) / 86400000));
}

function isOverdue(candidate) {
  return candidate.due_date && new Date(`${candidate.due_date}T23:59:59`) < new Date();
}

function renderOperationsDashboard() {
  const root = document.querySelector("#ops-dashboard");
  if (!root) return;
  const candidates = getCandidates();
  const overdue = candidates.filter(isOverdue);
  const stageCounts = ["New", "Review", "Shortlist", "Interview", "Offer"].map((stage) => `${stage} ${candidates.filter((item) => item.stage === stage).length}`).join(" · ");
  const completed = candidates.flatMap((item) => item.scorecards || []).filter((item) => item.submitted).length;
  const assigned = candidates.flatMap((item) => item.scorecards || []).length;
  const sources = [...new Set(candidates.map((item) => item.source).filter(Boolean))].map((source) => `${source} ${candidates.filter((item) => item.source === source).length}`).join(" · ");
  const offers = candidates.filter((item) => item.stage === "Offer");
  root.innerHTML = `
    <article class="attention-queue"><strong>${overdue.length} follow-up${overdue.length === 1 ? "" : "s"} need attention</strong><span>${overdue.map((item) => `${escapeHtml(item.name)} — ${daysInStage(item)} days in ${escapeHtml(item.stage)}`).join("<br>") || "Nothing overdue today."}</span></article>
    <dl class="analytics-list">
      <div><dt>Candidates by stage</dt><dd>${stageCounts}</dd></div>
      <div><dt>Interview completion</dt><dd>${completed} of ${assigned} assigned scorecards submitted</dd></div>
      <div><dt>Response-time compliance</dt><dd>${candidates.length - overdue.length} of ${candidates.length} within the ${RESPONSE_TARGET_DAYS}-day demo target</dd></div>
      <div><dt>Source distribution</dt><dd>${sources || "No source data"}</dd></div>
      <div><dt>Offer acceptance</dt><dd>${offers.filter((item) => item.onboarding).length} accepted of ${offers.length} offer-stage candidates</dd></div>
      <div><dt>Exit reasons</dt><dd>${candidates.filter((item) => item.exit_reason).map((item) => item.exit_reason).join(" · ") || "No exits in the current scenario"}</dd></div>
    </dl>`;
}

function renderAssistant(candidate) {
  const assistant = candidate.assistant || { summary: `Résumé lists ${(candidate.skills || []).join(", ") || "no structured skills yet"}.`, evidence: (candidate.skills || []).map((skill) => `Résumé contains ${skill}`), questions: ["What job-related example best demonstrates this skill?"] };
  return `<section class="workflow-section assistant-panel"><div class="section-heading split"><div><p class="eyebrow">Recruiter assistant</p><h3>Editable, evidence-linked assistance</h3></div><span class="assist-label">Assistance—not objective truth</span></div><label>Résumé summary<textarea id="assistant-summary" rows="3">${escapeHtml(assistant.summary)}</textarea></label><strong>Supporting evidence</strong><ul class="notes-list">${assistant.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><strong>Suggested questions</strong><ul class="notes-list">${assistant.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><p class="guardrail-copy">Does not infer protected traits, personality, “culture fit,” or potential. Cannot move a candidate or make a decision.</p><button class="ghost-action" data-action="save-assistance">Save edited summary</button></section>`;
}

function renderScorecards(candidate, role) {
  const cards = candidate.scorecards || [];
  const competencies = candidate.role_competencies || role?.competencies || [];
  const submitted = cards.filter((card) => card.submitted);
  const locked = cards.some((card) => !card.submitted);
  return `<section class="workflow-section"><div class="section-heading"><p class="eyebrow">Structured interviews</p><h3>${escapeHtml(role?.title || "Role")} scorecards</h3></div><div class="competency-list">${competencies.map((item) => `<div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.question)}</span></div>`).join("") || "<p>No competencies configured.</p>"}</div><details><summary>Add a role competency and question</summary><div class="scorecard-form"><label>Competency<input id="new-competency" placeholder="e.g. Debugging approach"></label><label>Interview question<input id="new-question" placeholder="Ask for a specific example"></label><button class="ghost-action" data-action="add-competency">Add competency</button></div></details><p class="independence-note">${locked ? "Independent feedback is locked: interviewers cannot see colleagues’ responses until they submit their own." : "All assigned feedback is submitted; the hiring manager can review individual evidence below."}</p>${submitted.map((card) => `<details><summary>${escapeHtml(card.interviewer)} · ${escapeHtml(card.recommendation)}</summary>${card.responses.map((response) => `<div class="score-response"><strong>${escapeHtml(response.competency)} · ${response.rating}/4</strong><p>${escapeHtml(response.evidence)}</p></div>`).join("")}</details>`).join("") || "<p>No scorecards submitted.</p>"}<div class="scorecard-form"><label>Competency<select id="scorecard-competency">${competencies.map((item) => `<option>${escapeHtml(item.name)}</option>`).join("")}</select></label><label>Rating (behavioral evidence scale)<select id="scorecard-rating"><option value="1">1 · insufficient evidence</option><option value="2">2 · partial evidence</option><option value="3" selected>3 · clear evidence</option><option value="4">4 · strong evidence</option></select></label><label>Recommendation<select id="scorecard-recommendation"><option>advance</option><option>hold</option><option>decline</option></select></label><label>Evidence-based note<textarea id="scorecard-evidence" rows="2" placeholder="Describe observed, job-related evidence"></textarea></label><button class="ghost-action" data-action="submit-scorecard">Submit independent scorecard</button></div></section>`;
}

function renderDecision(candidate) {
  const decision = candidate.decision || { status: "Pending", owner: "Hiring manager", rationale: "Awaiting structured feedback." };
  return `<section class="workflow-section decision-panel"><p class="eyebrow">Human decision</p><h3>${escapeHtml(decision.status)} · owned by ${escapeHtml(decision.owner)}</h3><p>${escapeHtml(decision.rationale)}</p><p class="guardrail-copy">No universal candidate score and no automated advance or rejection.</p></section>`;
}

function renderCommunicationComposer(candidate, role) {
  const templates = { confirmation: "Application confirmation", scheduling: "Interview scheduling", status: "Status update", rejection: "Rejection", offer: "Offer-stage communication" };
  return `<section class="workflow-section"><p class="eyebrow">Candidate communication</p><h3>Review before anything is sent</h3><label>Template<select id="message-template">${Object.entries(templates).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label><label>Editable draft<textarea id="message-draft" rows="4">Hi ${escapeHtml(candidate.name.split(" ")[0])},\n\nHere is an update about the ${escapeHtml(role?.title || "role")} process. A recruiter will review this message before it is marked approved or sent.\n\nBest,\nRecruiting</textarea></label><div class="detail-actions"><button class="ghost-action" data-action="save-draft">Save draft</button><button class="primary-action" data-action="approve-message">Approve & log</button></div><p class="section-copy">This prototype simulates status only; it sends no email.</p></section>`;
}

function renderOnboarding(candidate) {
  if (!candidate.onboarding && candidate.stage !== "Offer") return "";
  const handoff = candidate.onboarding;
  if (!handoff) return `<section class="workflow-section onboarding-panel"><p class="eyebrow">Recruiting → onboarding</p><h3>Create a minimum-necessary handoff</h3><p>Only start logistics move forward. Interview notes and résumé data stay out.</p><button class="primary-action" data-action="create-handoff">Create onboarding handoff</button></section>`;
  return `<section class="workflow-section onboarding-panel"><p class="eyebrow">Onboarding handoff</p><h3>${escapeHtml(handoff.owner)} owns the ${escapeHtml(handoff.start_date)} start</h3><dl><dt>Equipment</dt><dd>${escapeHtml(handoff.equipment)}</dd><dt>Required documents</dt><dd>${escapeHtml(handoff.documents)}</dd></dl><ol class="checklist">${handoff.tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("")}</ol><p class="guardrail-copy">Excluded: résumé, interview notes, scorecards, and unnecessary applicant information.</p></section>`;
}

function renderStageMoveButtons(candidate) {
  const currentStage = candidate.stage || "New";
  const pendingStage = pendingStageMove?.candidateId === candidate.candidate_id ? pendingStageMove.stage : "";
  return ["New", "Review", "Shortlist", "Interview", "Offer", "Archived"].map((stage) => `
    <button class="stage-action-button ${stage === currentStage ? "current" : ""} ${stage === pendingStage ? "confirming" : ""}" type="button" data-stage-target="${stage}" ${stage === currentStage ? "aria-current=\"true\"" : ""}>
      ${stage === pendingStage ? `Confirm ${escapeHtml(stage)}` : escapeHtml(stage)}
    </button>
  `).join("");
}

function renderCommunications(candidate) {
  const communications = [...(candidate.communications || [])].sort((a, b) => new Date(b.event_at) - new Date(a.event_at));
  if (!communications.length) {
    return "<li>No communication logged yet.</li>";
  }
  return communications.map((event) => `
    <li>
      <span class="timeline-meta">${escapeHtml(event.status || event.type)} | ${escapeHtml(event.direction)} | ${formatDate(event.event_at)}</span>
      <strong>${escapeHtml(event.subject || "Untitled")}</strong>
      <span>${escapeHtml(event.body_preview || "")}</span>
    </li>
  `).join("");
}

function handleCandidateSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const resumeText = String(data.get("resume") || "").trim();
  const file = data.get("file");
  const status = document.querySelector("#resume-parse-status");
  if (!resumeText) {
    if (status) {
      status.textContent = "Paste fictional résumé text or choose a supported TXT, Markdown, or CSV file.";
      status.classList.add("error");
    }
    return;
  }
  const parsed = parseResumeProfile(resumeText, file?.name || "");
  const candidate = {
    candidate_id: `cand_${Date.now()}`,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    location: parsed.location,
    current_title: parsed.current_title,
    total_years_experience: parsed.total_years_experience,
    skills: parsed.skills,
    industries: [],
    stage: "New",
    owner: "Recruiting queue",
    next_action: "Review application",
    due_date: new Date(Date.now() + RESPONSE_TARGET_DAYS * 86400000).toISOString().slice(0, 10),
    stage_entered_at: new Date().toISOString(),
    source: "Resume intake",
    retention_status: "Demo retention policy pending",
    notes: ["Profile generated from resume intake."],
    communications: [],
    resume_text: resumeText,
    source_file_name: file?.name || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const candidates = getCandidates();
  candidates.unshift(candidate);
  saveCandidates(candidates);
  logAudit("candidate created", candidate, "Added through browser-local résumé intake");
  form.reset();
  selectedCandidateId = candidate.candidate_id;
  renderMetrics();
  renderCandidates();
  renderDetail(candidate.candidate_id);
  if (status) {
    status.textContent = `Added ${parsed.name}.`;
    status.classList.remove("error");
  }
}

async function handleResumeFile(event) {
  const file = event.target.files?.[0];
  const textarea = event.target.form?.querySelector("textarea[name='resume']");
  const status = document.querySelector("#resume-parse-status");
  if (!file || !textarea) return;
  const isTextLike = /\.(txt|md|markdown|csv)$/i.test(file.name) || file.type.startsWith("text/");
  if (!isTextLike) {
    textarea.value = "";
    if (status) {
      status.textContent = "This browser-local demo supports TXT, Markdown, and CSV. For DOCX, PDF, image, or other files, copy the text and paste it here; the file was not uploaded.";
      status.classList.add("error");
    }
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    textarea.value = String(reader.result || "");
    if (status) {
      status.textContent = `Loaded ${file.name}. Ready to add candidate.`;
      status.classList.remove("error");
    }
  });
  reader.readAsText(file);
}

function handleDetailClick(event) {
  const stageButton = event.target.closest("[data-stage-target]");
  const actionButton = event.target.closest("[data-action]");
  const action = actionButton?.dataset.action;
  if (!stageButton && !action) return;
  if (!selectedCandidateId) return;
  const candidates = getCandidates();
  const candidate = candidates.find((item) => item.candidate_id === selectedCandidateId);
  if (!candidate) return;
  if (stageButton) {
    const nextStage = stageButton.dataset.stageTarget;
    if (!nextStage || nextStage === candidate.stage) return;
    const alreadyPending = pendingStageMove?.candidateId === candidate.candidate_id && pendingStageMove.stage === nextStage;
    if (!alreadyPending) {
      pendingStageMove = { candidateId: candidate.candidate_id, stage: nextStage };
      renderDetail(candidate.candidate_id);
      return;
    }
    const previousStage = candidate.stage;
    candidate.stage = nextStage;
    candidate.stage_entered_at = new Date().toISOString();
    logAudit("stage changed", candidate, `${previousStage} → ${nextStage}`);
    pendingStageMove = null;
  }
  if (action === "note") {
    const note = document.querySelector("#new-note")?.value.trim();
    const founder = getActiveFounder();
    if (note) candidate.notes = [{ author: founder.name, role: founder.role, text: note, created_at: new Date().toISOString() }, ...(candidate.notes || [])];
    if (note) logAudit("founder note added", candidate, `${founder.name} · ${founder.role}`);
    pendingStageMove = null;
  }
  if (action === "download-resume") {
    const blob = new Blob([candidate.resume_text || "Résumé text is not available."], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = candidate.resume_file_name || `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
    logAudit("résumé downloaded", candidate, "Sanitized browser-local file");
  }
  if (action === "save-assistance") {
    candidate.assistant ||= { evidence: [], questions: [] };
    candidate.assistant.summary = document.querySelector("#assistant-summary")?.value.trim() || candidate.assistant.summary;
    logAudit("assistance edited", candidate, "Recruiter edited and saved deterministic assistance");
  }
  if (action === "submit-scorecard") {
    const evidence = document.querySelector("#scorecard-evidence")?.value.trim();
    const recommendation = document.querySelector("#scorecard-recommendation")?.value || "hold";
    if (evidence) {
      candidate.scorecards = [...(candidate.scorecards || []).filter((card) => card.interviewer !== "Demo interviewer"), { interviewer: "Demo interviewer", submitted: true, recommendation, responses: [{ competency: document.querySelector("#scorecard-competency")?.value || "Assigned competency", rating: Number(document.querySelector("#scorecard-rating")?.value || 3), evidence }] }];
      logAudit("scorecard submitted", candidate, `${recommendation} recommendation with job-related evidence`);
    }
  }
  if (action === "add-competency") {
    const competency = document.querySelector("#new-competency")?.value.trim();
    const question = document.querySelector("#new-question")?.value.trim();
    const role = roles.find((item) => item.id === candidate.role_id);
    if (competency && question) {
      candidate.role_competencies = [...(candidate.role_competencies || role?.competencies || []), { id: `competency-${Date.now()}`, name: competency, question }];
      logAudit("role competency added", candidate, competency);
    }
  }
  if (["save-draft", "approve-message"].includes(action)) {
    const body = document.querySelector("#message-draft")?.value.trim();
    if (body) {
      const approved = action === "approve-message";
      candidate.communications = [{ event_id: `evt_${Date.now()}`, type: "email", direction: "outbound", status: approved ? "approved" : "draft", subject: document.querySelector("#message-template")?.selectedOptions?.[0]?.textContent || "Candidate update", body_preview: body, owner: candidate.owner || "Recruiting", event_at: new Date().toISOString() }, ...(candidate.communications || [])];
      logAudit(approved ? "communication approved" : "draft saved", candidate, "No email sent; browser-local status only");
    }
  }
  if (action === "create-handoff") {
    candidate.onboarding = { owner: "People Operations", start_date: "2026-09-08", equipment: "Confirm laptop needs", documents: "Employment agreement and payroll forms", tasks: ["Confirm start date", "Order equipment", "Schedule orientation", "Assign first-week owner"] };
    logAudit("onboarding handoff created", candidate, "Minimum-necessary start logistics only");
  }
  if (action === "export") logAudit("candidate export requested", candidate, "Prototype audit event; no file leaves the browser");
  if (action === "delete-request") {
    candidate.retention_status = "Deletion requested — admin review required";
    logAudit("deletion requested", candidate, "Record retained pending authorized review");
  }
  if (action === "save-candidate") {
    const email = document.querySelector("#edit-email")?.value.trim() || "";
    if (email && !isValidEmail(email)) {
      window.alert("Enter a valid fictional email address or leave it blank.");
      return;
    }
    candidate.name = document.querySelector("#edit-name")?.value.trim() || candidate.name;
    candidate.email = email;
    candidate.current_title = document.querySelector("#edit-title")?.value.trim();
    candidate.location = document.querySelector("#edit-location")?.value.trim();
    candidate.total_years_experience = Number(document.querySelector("#edit-years")?.value || 0);
    candidate.skills = buildCandidateSkills(document.querySelector("#edit-skills")?.value, document.querySelector("#edit-resume")?.value);
    candidate.resume_text = document.querySelector("#edit-resume")?.value.trim();
    logAudit("candidate edited", candidate, "Browser-local profile updated");
  }
  if (action === "archive") {
    candidate.stage = "Archived";
    candidate.stage_entered_at = new Date().toISOString();
    logAudit("candidate archived", candidate, "Browser-local record moved to Archived");
  }
  if (action === "remove") {
    if (!window.confirm(`Remove fictional candidate ${candidate.name} from this browser?`)) return;
    saveCandidates(candidates.filter((item) => item.candidate_id !== candidate.candidate_id));
    logAudit("candidate removed", candidate, "Browser-local record removed");
    selectedCandidateId = null;
    renderMetrics(); renderCandidates(); renderOperationsDashboard(); clearCandidateDetail("Candidate removed. Choose another profile or reset the demo.");
    return;
  }
  if (["inbound-email", "outbound-email", "interview", "internal-update"].includes(action)) {
    const body = document.querySelector("#new-communication")?.value.trim();
    const subject = document.querySelector("#new-communication-subject")?.value.trim();
    if (body || subject) {
      const isInterview = action === "interview";
      const isInternal = action === "internal-update";
      candidate.communications = [
        {
          event_id: `evt_${Date.now()}`,
          type: isInterview ? "interview" : isInternal ? "internal-update" : "email",
          direction: action === "inbound-email" ? "inbound" : action === "outbound-email" ? "outbound" : "internal",
          subject: subject || (isInterview ? "Interview update" : isInternal ? "Internal update" : "Candidate email"),
          body_preview: body || "No details added.",
          owner: "Recruiting",
          event_at: new Date().toISOString()
        },
        ...(candidate.communications || [])
      ];
    }
    pendingStageMove = null;
  }
  candidate.updated_at = new Date().toISOString();
  saveCandidates(candidates);
  renderMetrics();
  renderOperationsDashboard();
  refreshMetricDrilldown();
  renderDetail(candidate.candidate_id);
}

function renderCareers() {
  const roleList = document.querySelector("#role-list");
  const applicationRole = document.querySelector("#application-role");
  const roleSuggestions = document.querySelector("#role-suggestions");
  if (roleList) {
    roleList.innerHTML = roles.map((role) => `
      <article class="role-card">
        <button class="role-card-main" type="button" data-role-details="${role.id}" aria-label="View job description for ${escapeHtml(role.title)}">
          <span>
            <h3>${escapeHtml(role.title)}</h3>
            <span class="role-meta"><span>${escapeHtml(role.team)}</span><span>${escapeHtml(role.location)}</span><span>${escapeHtml(role.type)}</span></span>
          </span>
          <span class="role-summary">${escapeHtml(role.summary)}</span>
          <span class="role-card-cta">View job description <span aria-hidden="true">→</span></span>
        </button>
        <a class="primary-action" href="#application-form" data-role-id="${role.id}">Apply</a>
      </article>
    `).join("");
  }
  if (applicationRole && !applicationRole.value) {
    applicationRole.value = "";
  }
}

function renderRoleDialog(roleId) {
  const role = roles.find((item) => item.id === roleId);
  const dialog = document.querySelector("#role-dialog");
  const title = document.querySelector("#role-dialog-title");
  const meta = document.querySelector("#role-dialog-meta");
  const content = document.querySelector("#role-dialog-content");
  const apply = document.querySelector("#role-dialog-apply");
  if (!role || !dialog || !title || !meta || !content || !apply) return;

  title.textContent = role.title;
  meta.innerHTML = [role.team, role.location, role.type].map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  content.innerHTML = `
    <section>
      <h3>About the role</h3>
      <p>${escapeHtml(role.overview)}</p>
    </section>
    <section>
      <h3>What you’ll own</h3>
      <ul>${role.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <section>
      <h3>What we’re looking for</h3>
      <ul>${role.qualifications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <section>
      <h3>Helpful, not required</h3>
      <ul>${role.niceToHave.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
  apply.dataset.roleId = role.id;
  dialog.showModal();
}

function renderRoleSuggestions(query) {
  const menu = document.querySelector("#role-suggestions");
  if (!menu) return;
  const input = document.querySelector("#application-role");
  const selectedRoleTitle = normalize(input?.value || "");
  const normalizedQuery = normalize(query);
  const matches = roles.filter((role) => {
    const haystack = normalize([role.title, role.team, role.location, role.type, role.summary, role.keywords.join(" ")].join(" "));
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });
  menu.innerHTML = matches.map((role) => `
    <button class="suggestion-option" type="button" role="option" data-suggest-role="${role.id}" aria-selected="${selectedRoleTitle === normalize(role.title)}">
      <span class="role-option-top">
        <strong>${escapeHtml(role.title)}</strong>
        <span>${escapeHtml(role.type)}</span>
      </span>
      <span class="role-option-meta">
        <span>${escapeHtml(role.team)}</span>
        <span>${escapeHtml(role.location)}</span>
      </span>
    </button>
  `).join("") || `<span class="suggestion-option" role="option" aria-disabled="true"><strong>No matching roles</strong><span>You can still type your own.</span></span>`;
  menu.hidden = false;
  if (input) input.setAttribute("aria-expanded", "true");
}

function hideRoleSuggestionsSoon() {
  window.setTimeout(() => {
    const menu = document.querySelector("#role-suggestions");
    if (menu) menu.hidden = true;
    document.querySelector("#application-role")?.setAttribute("aria-expanded", "false");
  }, 120);
}

function selectSuggestedRole(roleId) {
  const role = roles.find((item) => item.id === roleId);
  const input = document.querySelector("#application-role");
  const menu = document.querySelector("#role-suggestions");
  if (input && role) input.value = role.title;
  if (input) input.setAttribute("aria-expanded", "false");
  if (menu) menu.hidden = true;
}

function focusRoleSuggestionOption(direction = 1) {
  const menu = document.querySelector("#role-suggestions");
  if (!menu || menu.hidden) return;
  const options = [...menu.querySelectorAll("[data-suggest-role]")];
  if (!options.length) return;
  const currentIndex = options.indexOf(document.activeElement);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + options.length) % options.length;
  options[nextIndex].focus();
}

function handleRoleSuggestionKeydown(event) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    renderRoleSuggestions(event.currentTarget.value);
    focusRoleSuggestionOption(1);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    const menu = document.querySelector("#role-suggestions");
    if (menu) menu.hidden = true;
    event.currentTarget.setAttribute("aria-expanded", "false");
  }
}

function handleRoleSuggestionMenuKeydown(event) {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    focusRoleSuggestionOption(event.key === "ArrowDown" ? 1 : -1);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    const menu = document.querySelector("#role-suggestions");
    if (menu) menu.hidden = true;
    const input = document.querySelector("#application-role");
    if (input) {
      input.setAttribute("aria-expanded", "false");
      input.focus();
    }
  }
}

function handleApplicationSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const status = document.querySelector("#application-status");
  if (!String(data.get("name") || "").trim() || !String(data.get("email") || "").trim()) {
    if (status) { status.textContent = "Add a fictional name and email address to continue."; status.classList.add("error"); }
    return;
  }
  if (!isValidEmail(data.get("email"))) {
    if (status) { status.textContent = "Enter a valid fictional email address, such as sample@example.com."; status.classList.add("error"); }
    return;
  }
  const desiredRole = String(data.get("role") || "").trim();
  const role = roles.find((item) => normalize(item.title) === normalize(desiredRole));
  const resumeText = data.get("resume") || "";
  const skills = buildCandidateSkills(data.get("skills"), resumeText);
  const candidate = {
    candidate_id: `cand_${Date.now()}`,
    name: data.get("name"),
    email: String(data.get("email")).trim(),
    phone: "",
    location: data.get("location"),
    current_title: data.get("current_role") || "Applicant",
    total_years_experience: 0,
    skills,
    industries: [],
    stage: "New",
    role_id: role?.id || "",
    owner: "Recruiting queue",
    next_action: "Review application",
    due_date: new Date(Date.now() + RESPONSE_TARGET_DAYS * 86400000).toISOString().slice(0, 10),
    stage_entered_at: new Date().toISOString(),
    source: "Careers site",
    retention_status: "Demo retention policy pending",
    browser_local: true,
    notes: [`Interested in ${role?.title || desiredRole || "an open role"}. Portfolio: ${data.get("portfolio") || "Not provided"}`],
    communications: [
      {
        event_id: `evt_${Date.now()}`,
        type: "email",
        direction: "inbound",
        subject: `Application for ${role?.title || desiredRole || "an open role"}`,
        body_preview: data.get("resume") || "Application submitted through the careers page.",
        owner: "careers page",
        event_at: new Date().toISOString()
      }
    ],
    resume_text: resumeText,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const candidates = getCandidates();
  candidates.unshift(candidate);
  saveCandidates(candidates);
  form.reset();
  if (status) { status.textContent = "Success — your fictional application was added to this browser. Open the recruiter demo to review it."; status.classList.remove("error"); }
}

function loadSampleApplication() {
  const form = document.querySelector("#application-form");
  if (!form) return;
  form.elements.name.value = "Rowan Ellis";
  form.elements.email.value = "rowan.ellis@example.com";
  form.elements.role.value = roles[1].title;
  form.elements.current_role.value = "Software Engineering Student";
  form.elements.location.value = "San Francisco, CA";
  form.elements.portfolio.value = "https://example.com/rowan-portfolio";
  form.elements.skills.value = "TypeScript, React, SQL, API integration";
  form.elements.resume.value = "Software engineering student with 2 years of project experience. Built and tested full-stack projects with TypeScript, React, SQL, REST APIs, and collaborative code review.";
  document.querySelector("#application-status").textContent = "Sample fictional application loaded. Review it, then submit.";
  form.elements.name.focus();
}

function handleApplicationFile(event) {
  const file = event.target.files?.[0];
  const status = document.querySelector("#application-file-status");
  const textarea = event.target.form?.elements.resume;
  if (!file || !textarea) return;
  if (!/\.(txt|md|markdown|csv)$/i.test(file.name) && !file.type.startsWith("text/")) {
    status.textContent = "Unsupported file. Paste the text or choose TXT, Markdown, or CSV; nothing was uploaded.";
    status.classList.add("error");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    textarea.value = String(reader.result || "");
    status.textContent = `Loaded ${file.name} locally. The file was not uploaded.`;
    status.classList.remove("error");
  });
  reader.addEventListener("error", () => { status.textContent = "This file could not be read. Try pasting its text instead."; status.classList.add("error"); });
  reader.readAsText(file);
}

const LIMITATIONS_HTML = `<p>Everything shown—including people, roles, contact details, and companies—is fictional. Data is stored only in the current browser, and the demo must not be used with real applicant information.</p><p>This portfolio demonstration has no production authentication, shared storage, malware scanning, durable audit logs, retention or deletion enforcement, role-based access, email delivery, or legal/compliance approval.</p><p>Résumé files are never uploaded. Supported text files are read locally and only extracted text is used in browser-local candidate records.</p>`;

function initLimitations() {
  document.querySelectorAll("[data-limitations-content]").forEach((node) => { node.innerHTML = LIMITATIONS_HTML; });
  document.querySelectorAll("[data-open-limitations]").forEach((button) => button.addEventListener("click", () => document.querySelector("#limitations-dialog")?.showModal()));
  document.querySelectorAll("[data-close-limitations]").forEach((button) => button.addEventListener("click", () => button.closest("dialog")?.close()));
}

const tourSteps = [
  ["Careers and intake", "Start on the fictional careers page, open a complete role, and submit the sample application."],
  ["Candidate search", "Search and filter by stage, experience, or role. Every result is fictional or created in this browser."],
  ["Explainable matching", "Open Priya Chen and choose the CFO role to see matched signals, missing signals, experience, and the exact formula."],
  ["Profile context", "The profile keeps job-related evidence, ownership, next action, and résumé context together."],
  ["Notes and history", "Add a note or log inbound, outbound, interview, and internal activity. Nothing sends email."],
  ["Stage movement", "Move a candidate with a deliberate two-click confirmation."],
  ["Reset", "Reset restores the original synthetic dataset. Presentation mode also loads a predictable scenario."]
];
let tourIndex = 0;
function showTourStep(index) {
  const dialog = document.querySelector("#tour-dialog");
  if (!dialog) return;
  tourIndex = Math.max(0, Math.min(tourSteps.length - 1, index));
  document.querySelector("#tour-progress").textContent = `${tourIndex + 1}/${tourSteps.length}`;
  document.querySelector("#tour-title").textContent = tourSteps[tourIndex][0];
  document.querySelector("#tour-copy").textContent = tourSteps[tourIndex][1];
  document.querySelector("[data-tour-prev]").disabled = tourIndex === 0;
  document.querySelector("[data-tour-next]").textContent = tourIndex === tourSteps.length - 1 ? "Finish" : "Next";
  if (!dialog.open) dialog.showModal();
}

function resetDemoState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoCandidates));
  localStorage.removeItem(AUDIT_KEY);
  selectedCandidateId = null; pendingStageMove = null; activeMetric = null;
  renderMetrics(); renderCandidates(); renderOperationsDashboard();
  clearCandidateDetail("Search or choose a candidate to view match evidence, notes, and pipeline actions.");
}

function enterPresentationMode() {
  resetDemoState();
  document.body.classList.add("presentation-mode");
  selectDashboardRole("chief-financial-officer");
  renderDetail("cand_101");
  document.querySelector("#candidate-detail")?.scrollIntoView({ block: "start" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function initAts() {
  const founderSelect = document.querySelector("#active-founder");
  if (founderSelect) {
    founderSelect.innerHTML = founders.map((founder) => `<option value="${founder.id}">${escapeHtml(founder.name)} · ${escapeHtml(founder.role)}</option>`).join("");
    founderSelect.value = getActiveFounder().id;
    founderSelect.addEventListener("change", () => {
      localStorage.setItem(ACTIVE_FOUNDER_KEY, founderSelect.value);
      if (selectedCandidateId) renderDetail(selectedCandidateId);
    });
  }
  renderRoleFilter();
  renderMetrics();
  renderCandidates();
  renderOperationsDashboard();
  document.querySelector("#candidate-form")?.addEventListener("submit", handleCandidateSubmit);
  document.querySelector("input[name='file']")?.addEventListener("change", handleResumeFile);
  document.querySelector("#candidate-list")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-candidate-id]");
    if (card) renderDetail(card.dataset.candidateId);
  });
  document.querySelector("#candidate-detail")?.addEventListener("click", handleDetailClick);
  document.querySelector(".metrics-grid")?.addEventListener("click", (event) => {
    const candidateButton = event.target.closest("[data-drilldown-candidate]");
    if (candidateButton) {
      event.stopPropagation();
      renderDetail(candidateButton.dataset.drilldownCandidate);
      return;
    }
    const roleButton = event.target.closest("[data-role-filter]");
    if (roleButton) {
      event.stopPropagation();
      selectDashboardRole(roleButton.dataset.roleFilter);
      return;
    }
    const card = event.target.closest("[data-metric]");
    if (!card) return;
    renderMetricDrilldown(card.dataset.metric);
  });
  document.querySelector(".metrics-grid")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-metric]");
    if (!card) return;
    event.preventDefault();
    renderMetricDrilldown(card.dataset.metric);
  });
  ["#candidate-search", "#stage-filter", "#years-filter", "#background-filter"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("input", renderCandidates);
  });
  document.querySelector("#role-filter")?.addEventListener("focus", (event) => {
    renderDashboardRoleSuggestions(event.target.value);
  });
  document.querySelector("#role-filter")?.addEventListener("click", (event) => {
    renderDashboardRoleSuggestions(event.target.value);
  });
  document.querySelector("#role-filter")?.addEventListener("input", (event) => {
    const hidden = document.querySelector("#role-filter-id");
    if (hidden) hidden.value = "all";
    renderDashboardRoleSuggestions(event.target.value);
    renderCandidates();
  });
  document.querySelector("#role-filter")?.addEventListener("keydown", handleDashboardRoleKeydown);
  document.querySelector("#role-filter")?.addEventListener("blur", hideDashboardRoleSuggestionsSoon);
  document.querySelector("#dashboard-role-suggestions")?.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  document.querySelector("#dashboard-role-suggestions")?.addEventListener("keydown", handleDashboardRoleMenuKeydown);
  document.querySelector("#dashboard-role-suggestions")?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-dashboard-role]");
    if (option) selectDashboardRole(option.dataset.dashboardRole);
  });
  document.querySelector("#search-button")?.addEventListener("click", renderCandidates);
  document.querySelector("#reset-data")?.addEventListener("click", () => {
    if (window.confirm("Reset all browser-local changes and restore the original synthetic dataset?")) resetDemoState();
  });
  document.querySelector("#presentation-mode")?.addEventListener("click", enterPresentationMode);
  document.querySelector("[data-start-tour]")?.addEventListener("click", () => showTourStep(0));
  document.querySelector("[data-tour-skip]")?.addEventListener("click", () => document.querySelector("#tour-dialog")?.close());
  document.querySelector("[data-tour-prev]")?.addEventListener("click", () => showTourStep(tourIndex - 1));
  document.querySelector("[data-tour-next]")?.addEventListener("click", () => tourIndex === tourSteps.length - 1 ? document.querySelector("#tour-dialog")?.close() : showTourStep(tourIndex + 1));
  document.querySelector("#show-audit")?.addEventListener("click", () => {
    const dialog = document.querySelector("#audit-dialog");
    const list = document.querySelector("#audit-list");
    const events = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    if (list) list.innerHTML = `<ul class="timeline-list">${events.map((item) => `<li><span class="timeline-meta">${escapeHtml(item.action)} · ${formatDate(item.at)}</span><strong>${escapeHtml(item.candidate)}</strong><span>${escapeHtml(item.detail)} · ${escapeHtml(item.actor)}</span></li>`).join("") || "<li>No demo events yet. Open a candidate and take an action.</li>"}</ul>`;
    dialog?.showModal();
  });
  document.querySelector("[data-close-audit]")?.addEventListener("click", () => document.querySelector("#audit-dialog")?.close());
}

function initCareers() {
  renderCareers();
  document.querySelector("#application-form")?.addEventListener("submit", handleApplicationSubmit);
  document.querySelector("#load-sample-application")?.addEventListener("click", loadSampleApplication);
  document.querySelector("input[name='application_file']")?.addEventListener("change", handleApplicationFile);
  document.querySelector("#application-role")?.addEventListener("focus", (event) => {
    renderRoleSuggestions(event.target.value);
  });
  document.querySelector("#application-role")?.addEventListener("click", (event) => {
    renderRoleSuggestions(event.target.value);
  });
  document.querySelector("#application-role")?.addEventListener("input", (event) => {
    renderRoleSuggestions(event.target.value);
  });
  document.querySelector("#application-role")?.addEventListener("keydown", handleRoleSuggestionKeydown);
  document.querySelector("#application-role")?.addEventListener("blur", hideRoleSuggestionsSoon);
  document.querySelector("#role-suggestions")?.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  document.querySelector("#role-suggestions")?.addEventListener("keydown", handleRoleSuggestionMenuKeydown);
  document.querySelector("#role-suggestions")?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-suggest-role]");
    if (option) selectSuggestedRole(option.dataset.suggestRole);
  });
  document.querySelector("#role-list")?.addEventListener("click", (event) => {
    const detailsButton = event.target.closest("[data-role-details]");
    if (detailsButton) {
      renderRoleDialog(detailsButton.dataset.roleDetails);
      return;
    }
    const link = event.target.closest("[data-role-id]");
    if (!link) return;
    selectSuggestedRole(link.dataset.roleId);
  });
  document.querySelector("#role-dialog")?.addEventListener("click", (event) => {
    const dialog = event.currentTarget;
    if (event.target === dialog || event.target.closest("[data-close-role-dialog]")) {
      dialog.close();
      return;
    }
    const applyLink = event.target.closest("[data-role-id]");
    if (applyLink) {
      selectSuggestedRole(applyLink.dataset.roleId);
      dialog.close();
    }
  });
}

if (document.body.dataset.page === "ats") initAts();
if (document.body.dataset.page === "careers") initCareers();
initLimitations();
