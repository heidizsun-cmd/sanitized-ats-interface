# Sanitized ATS Interface Build Plan

This roadmap separates the working portfolio prototype from proposed production systems.

## Implemented: Local Workflow Prototype

- Public careers page with three fictional roles and an application form.
- Private recruiter dashboard protected by a local login and HTTP-only session cookie.
- Fresh one-time local credentials when environment credentials are not configured.
- Browser-local candidate records seeded with fictional data.
- Candidate search, filters, explainable match scoring, and role evidence.
- Candidate stages, notes, metrics, and a manual communication timeline.
- Role-specific competency definitions and structured scorecard demonstrations with independent-feedback visibility rules.
- Candidate ownership, next actions, due dates, time-in-stage calculations, and supportive response-target flags.
- Editable communication templates with draft and approval states; sending is simulated and no provider is connected.
- Transparent deterministic résumé/feedback assistance with supporting evidence and explicit human-decision guardrails.
- Minimum-necessary onboarding handoff for accepted fictional candidates.
- Synthetic People Operations analytics, permission concepts, and browser-local audit, retention, export, and deletion-request demonstrations.
- Structured candidate intake from pasted résumé text.
- Local text extraction for TXT, Markdown, DOCX, and text-based PDF files.
- Syntax checks and Python regression tests.

## Next: Production Foundation

- Replace browser storage with a versioned Postgres data model.
- Replace local credentials with managed identity and role-based permissions.
- Add a validated application API with rate limiting and abuse protection.
- Store résumé files in private object storage with malware scanning.
- Replace demonstration permission labels with enforced RBAC and browser-local events with append-only audit storage.
- Implement approved retention policies, identity-verified export, and authorized deletion workflows.
- Add automated tests for browser workflows and accessibility.

## Later: Recruiting Integrations

- Connect a recruiter mailbox through IMAP/SMTP or a provider API.
- Match messages to candidates by email address and thread headers.
- Synchronize résumé intake with a restricted Google Drive folder.
- Add OCR for image-only PDFs.
- Add calendar scheduling, signed email delivery, scorecard assignment notifications, and onboarding-system integrations.

## Exploration: Assisted Search

- Evaluate full-text and vector retrieval against a labeled set of recruiter queries.
- Keep match evidence visible and recruiter-controlled.
- Expose read-only candidate search tools through a private MCP server.
- Add write actions only after permissions, audit logging, and confirmation flows are in place.
