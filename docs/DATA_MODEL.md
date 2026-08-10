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
  "notes": [],
  "tags": [],
  "resume_drive_file_id": "google_drive_file_id",
  "resume_text": "Full extracted resume text",
  "parser_confidence": 0.91,
  "created_at": "2026-07-23T00:00:00Z",
  "updated_at": "2026-07-23T00:00:00Z"
}
```

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
