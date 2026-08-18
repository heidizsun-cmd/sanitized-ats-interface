import test from "node:test";
import assert from "node:assert/strict";
import { calculateRoleMatch, isValidEmail } from "../demo-logic.js";

const role = { keywords: ["typescript", "react", "sql", "api"] };

test("matching is deterministic and exposes matched and missing signals", () => {
  const candidate = { skills: ["TypeScript", "React"], resume_text: "Built a REST API", total_years_experience: 2 };
  const first = calculateRoleMatch(candidate, role);
  const second = calculateRoleMatch(candidate, role);
  assert.deepEqual(first, second);
  assert.deepEqual(first.matched, ["typescript", "react", "api"]);
  assert.deepEqual(first.missing, ["sql"]);
  assert.equal(first.percent, 64);
  assert.match(first.reason, /3 of 4 role signals/);
});

test("candidate edits change the score", () => {
  const before = calculateRoleMatch({ skills: ["React"], total_years_experience: 1 }, role);
  const after = calculateRoleMatch({ skills: ["React", "TypeScript", "SQL", "API"], total_years_experience: 5 }, role);
  assert.ok(after.percent > before.percent);
  assert.equal(after.percent, 90);
});

test("email validation rejects malformed input", () => {
  assert.equal(isValidEmail("sample@example.com"), true);
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail("a@b"), false);
});
