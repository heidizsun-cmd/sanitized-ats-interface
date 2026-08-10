# Sanitized ATS Interface Build Plan

This roadmap separates the working portfolio prototype from proposed production systems.

## Implemented: Local Workflow Prototype

- Public careers page with three fictional roles and an application form.
- Private recruiter dashboard protected by a local login and HTTP-only session cookie.
- Fresh one-time local credentials when environment credentials are not configured.
- Browser-local candidate records seeded with fictional data.
- Candidate search, filters, explainable match scoring, and role evidence.
- Candidate stages, notes, metrics, and a manual communication timeline.
- Structured candidate intake from pasted résumé text.
- Local text extraction for TXT, Markdown, DOCX, and text-based PDF files.
- Syntax checks and Python regression tests.

## Next: Production Foundation

- Replace browser storage with a versioned Postgres data model.
- Replace local credentials with managed identity and role-based permissions.
- Add a validated application API with rate limiting and abuse protection.
- Store résumé files in private object storage with malware scanning.
- Add audit events, retention policies, consent records, export, and deletion workflows.
- Add automated tests for browser workflows and accessibility.

## Later: Recruiting Integrations

- Connect a recruiter mailbox through IMAP/SMTP or a provider API.
- Match messages to candidates by email address and thread headers.
- Synchronize résumé intake with a restricted Google Drive folder.
- Add OCR for image-only PDFs.
- Add scorecards, interviewer permissions, and scheduling integrations.

## Exploration: Assisted Search

- Evaluate full-text and vector retrieval against a labeled set of recruiter queries.
- Keep match evidence visible and recruiter-controlled.
- Expose read-only candidate search tools through a private MCP server.
- Add write actions only after permissions, audit logging, and confirmation flows are in place.
