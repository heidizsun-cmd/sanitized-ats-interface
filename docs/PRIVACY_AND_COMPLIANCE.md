# Privacy And Compliance Notes

This product handles applicant personal data. Design and operate it carefully.

## Product Rules

- Keep resumes private.
- Restrict access by role.
- Log candidate views, edits, exports, searches, and stage changes.
- Do not infer protected characteristics.
- Do not use protected-class information in matching or ranking.
- Make AI-generated match explanations evidence-based.
- Support candidate deletion and export.
- Keep AI recommendations separate from final hiring decisions.

## Data To Avoid

Avoid collecting sensitive information unless there is a clear legal or operational reason:

- Age
- Race or ethnicity
- Religion
- Disability
- Marital status
- Family status
- Health information
- Political affiliation

## Production Checklist

- Authentication
- Role-based access
- Encrypted storage
- Audit logs
- Data retention policy
- Candidate deletion/export workflow
- Human review before hiring decisions
- Clear consent language on the application form

## Prototype boundary

The portfolio UI demonstrates permission concepts, synthetic audit events, retention state, export requests, and deletion requests in browser-local storage. These controls are useful for reviewing the operating design, but they do not enforce production authorization or legal workflows. The communication composer never sends email, and the recruiter assistant is deterministic text derived from fictional résumé evidence rather than a connected model.

The onboarding handoff intentionally excludes résumé text, interview notes, scorecards, and other applicant context that is not needed to prepare a start. A production implementation would additionally require counsel-approved retention schedules, verified data-subject requests, immutable audit storage, managed identity, and access reviews.
