# Signal ATS — Sanitized Portfolio Demo

Signal ATS is a public, static portfolio demonstration of fictional applicant and recruiter workflows for Northstar Labs, a fictional company. It is designed for a three-to-five-minute live walkthrough and runs entirely in the visitor's browser.

Every included person, role, company, message, email address, phone number, and activity is synthetic. Do not enter real applicant or résumé information.

## Live demo purpose

The demo shows how a clear applicant experience connects to recruiter search, explainable role matching, profile context, notes, communication history, and pipeline movement. It is a product demonstration—not a production ATS and not secure authentication.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npx serve . -l 4174
```

Then open:

- Careers: `http://localhost:4174/careers.html`
- Recruiter entry: `http://localhost:4174/admin.html`
- Recruiter workspace: `http://localhost:4174/index.html`

Run verification:

```sh
npm test
npm run check
```

No install step, environment file, API key, database, account, or server-side application is required.

## Deploy to Vercel

Import the repository as a new Vercel project and use these exact settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | `.` |
| Build Command | Leave empty |
| Output Directory | Leave empty |
| Install Command | Leave empty |
| Node.js Version | 20.x or newer (tests only; runtime is static) |
| Environment Variables | None |

`vercel.json` supplies clean routes for `/`, `/careers`, `/admin`, and `/dashboard`, plus conservative browser headers. Vercel serves the HTML, CSS, JavaScript, and SVG files directly on the Hobby plan.

## Architecture

| Layer | Implementation |
| --- | --- |
| Pages | Static semantic HTML for careers, recruiter entry, and workspace |
| Interface | Responsive CSS and dependency-free vanilla JavaScript |
| State | Versioned browser `localStorage`, seeded from synthetic records |
| Résumé demo | Pasted text or browser-side TXT, Markdown, and CSV reading |
| Matching | Deterministic role-signal coverage plus a visible experience component |
| Hosting | Static Vercel deployment; no functions or server runtime |
| Tests | Node's built-in test runner for matching and validation logic |

No file is uploaded. The browser reads supported text files locally and stores only the resulting candidate text in that browser. DOCX, PDF, images, and other formats are intentionally unsupported because reliable extraction was not added without introducing a larger client dependency; visitors receive a paste-text fallback.

## Feature walkthrough

1. Open Careers, review a complete fictional job description, and select **Load sample application**.
2. Submit it and open the recruiter workspace; the new applicant appears immediately from shared browser-local storage.
3. Search and filter candidates by text, stage, experience, or role.
4. Open a profile to inspect matched skills, missing role signals, relevant experience, and the exact percentage calculation.
5. Edit candidate context, add notes, log inbound/outbound/interview/internal events, and move the stage.
6. Archive or remove a browser-local candidate, or reset the original synthetic dataset.

The optional guided tour covers the primary path and can be skipped or restarted. Metric cards are keyboard-operable and open live drilldowns.

## Presentation mode

Choose **Presentation mode** in the recruiter workspace. It restores a predictable synthetic starting state, selects the CFO scenario and strongest candidate, and hides secondary explanatory sections while retaining the privacy banner. A suggested live flow is: matching evidence → profile notes/history → stage movement → reset.

## Matching method

Matching is deterministic and explainable, not AI. For the selected or assigned role:

- role-signal coverage contributes up to 80 points;
- recorded experience contributes up to 20 points, at two points per year;
- matched and missing signals and the arithmetic are displayed;
- editing candidate information or changing the selected role recalculates the score immediately.

The percentage is an inspectable demo comparison, not a prediction, hiring recommendation, measure of candidate quality, or claim of fairness.

## Privacy and production limitations

All data remains in the current browser. There are no trackers, analytics, API calls, email or Drive integrations, credentials, or external storage.

This demo lacks production authentication, shared storage, malware scanning, immutable audit logs, retention/deletion enforcement, verified data-subject workflows, role-based access, and legal/compliance approval. Browser-local audit and deletion controls illustrate product concepts; they do not enforce them. The demo must not be used with real applicant data and is not production-ready.

## Repository guide

- `careers.html` — fictional roles and application intake
- `admin.html` — public recruiter-demo entry and boundary notice
- `index.html` — recruiter workspace
- `app.js` — browser state and interface behavior
- `demo-logic.js` — deterministic matching and validation logic
- `styles.css` — responsive visual system
- `tests/` — automated logic tests
- `vercel.json` — static routes and response headers
- `docs/PRIVACY_AND_COMPLIANCE.md` — production boundary checklist

The previous Python login and résumé service, environment prompts, and server tests were removed because they created broken Vercel-only paths and are outside this public static demo's architecture.
