# Sanitized ATS Interface Build Plan

## Implemented public portfolio demo

- Static careers, recruiter entry, and hiring workspace pages.
- Browser-local fictional application intake and candidate state.
- Pasted résumé text and local TXT, Markdown, and CSV reading; files are never uploaded.
- Search, stage and experience filters, role comparison, live metrics, full profiles, notes, communication events, stage movement, editing, archive/removal, and reset.
- Deterministic matching with visible matched signals, missing signals, experience points, and arithmetic.
- Optional guided tour, predictable presentation mode, persistent privacy labeling, and a limitations dialog.
- Static Vercel routes with no functions, accounts, integrations, environment configuration, or server runtime.
- Dependency-free automated tests for matching and email validation.

## Intentionally outside the demo

- Production identity, permissions, shared databases, encrypted object storage, malware scanning, immutable audit logs, and enforced retention/deletion workflows.
- Real email, calendar, HRIS, cloud-drive, model, analytics, or other external integrations.
- DOCX, PDF, scanned-document, and image résumé extraction.
- Claims about ranking quality, prediction, fairness, or production readiness.

Any production evolution requires a separate security, privacy, legal, compliance, accessibility, and operations review before real applicant data is accepted.
