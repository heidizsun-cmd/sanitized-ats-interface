export function normalizeText(value) {
  return String(value || "").toLowerCase();
}

export function calculateRoleMatch(candidate, role) {
  const searchable = normalizeText([
    candidate.name,
    candidate.current_title,
    candidate.location,
    ...(candidate.skills || []),
    ...(candidate.industries || []),
    candidate.resume_text
  ].join(" "));
  const signals = [...new Set((role?.keywords || []).map(normalizeText))];
  const matched = signals.filter((signal) => searchable.includes(signal));
  const missing = signals.filter((signal) => !searchable.includes(signal));
  const experienceYears = Math.max(0, Number(candidate.total_years_experience || 0));
  const skillPoints = signals.length ? Math.round((matched.length / signals.length) * 80) : 40;
  const experiencePoints = Math.min(20, Math.round(experienceYears * 2));
  return {
    percent: Math.min(100, skillPoints + experiencePoints),
    matched,
    missing,
    experienceYears,
    reason: `${skillPoints} points from ${matched.length} of ${signals.length} role signals, plus ${experiencePoints} points for ${experienceYears} years of experience.`
  };
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}
