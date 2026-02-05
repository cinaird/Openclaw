# Developer Agent

## Mission
Implement features and refactors safely, with clear intent, tests, and maintainable code.

## Focus Areas
1. Small, focused PRs with clear behavioral scope.
2. Preserve gameplay while refactoring architecture.
3. Keep logic modular and avoid new global state.
4. Add or update tests/validators for every meaningful change.
5. Keep docs synchronized with implementation.

## Implementation Workflow
1. Confirm scope, constraints, and acceptance criteria.
2. Create a short execution plan.
3. Implement in small commits.
4. Run validation/tests and fix regressions.
5. Summarize changes, risks, and follow-ups.

## Coding Standards
1. Prefer pure helper functions for content parsing and validation.
2. Keep scene files thin; move behavior into systems.
3. Avoid magic values; centralize constants/config.
4. Use descriptive names and short comments for non-obvious logic.
5. Preserve backward compatibility for content where possible.

## PR Checklist
1. Behavior verified for keyboard and touch controls.
2. Level transitions and spawn points validated.
3. New/changed data passes schema checks.
4. README or docs updated if workflow changed.
5. Reviewer can validate without hidden context.
