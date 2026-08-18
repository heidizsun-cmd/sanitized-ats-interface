# Candidate Data Model

```json
{
  "candidate_id": "cand_123",
  "name": "Avery Johnson",
  "email": "avery@example.com",
  "phone": "+1-555-0100",
  "location": "San Francisco, CA",
  "linkedin_url": "https://linkedin.com/in/example",
  "portfolio_url": "https://example.com",
  "current_title": "Senior Product Manager",
  "total_years_experience": 8,
  "skills": ["Product strategy", "B2B SaaS", "SQL", "Experimentation"],
  "industries": ["SaaS", "Fintech"],
  "companies": [
    {
      "name": "ExampleCo",
      "title": "Senior Product Manager",
      "start_date": "2021-03",
      "end_date": "2025-05",
      "summary": "Led growth and onboarding product work."
    }
  ],
  "education": [
    {
      "school": "University of California, Berkeley",
      "degree": "B.A.",
      "field": "Economics"
    }
  ],
  "certifications": [],
  "stage": "New",
  "role_id": "mts-stack-engineer-intern-cohort",
  "owner": "Recruiter user ID",
  "next_action": "Review application",
  "due_date": "2026-08-20",
  "stage_entered_at": "2026-08-17T00:00:00Z",
  "source": "Careers site",
  "retention_status": "Retain until policy date",
  "notes": [],
  "tags": [],
  "source_file_name": "fictional-resume.txt",
  "resume_text": "Full extracted resume text",
  "parser_confidence": 0.91,
  "created_at": "2026-07-23T00:00:00Z",
  "updated_at": "2026-07-23T00:00:00Z"
}
```

## Structured decision records

Scorecards store the assigned interviewer, submission state, explicit advance/hold/decline recommendation, competency-level rating, and job-related evidence. Other interviewers’ content remains unavailable until the assigned interviewer submits. A separate human decision record stores the decision owner and rationale; it is never calculated from a universal candidate score.

## Onboarding handoff

The handoff contains only an owner, start date, equipment needs, required employment documents, orientation tasks, and first-week checklist. It does not copy résumé text, interview notes, or scorecards.

## Audit and communications

Communication events add a `status` of `draft`, `approved`, or `sent (simulated)`. Production audit events should record actor, action, target, timestamp, and relevant change metadata in append-only storage. The portfolio recreation keeps synthetic examples in browser-local storage only.

## Communication Event

```json
{
  "event_id": "evt_123",
  "candidate_id": "cand_123",
  "type": "email",
  "direction": "inbound",
  "subject": "Application for Founding Product Engineer",
  "body_preview": "I am excited to apply...",
  "owner": "Recruiting",
  "event_at": "2026-07-23T16:00:00Z"
}
```

## Canonical Tags

Skills and parsed resume keywords should be normalized to one shared vocabulary before saving. For example:

- `js` and `javascript` become `JavaScript`
- `ts` becomes `TypeScript`
- `saas` becomes `B2B SaaS`
- `postgres` becomes `SQL`
- `managed team` becomes `Team management`

This keeps search, filters, and candidate chips consistent whether a tag came from manual intake, email parsing, or resume parsing.
