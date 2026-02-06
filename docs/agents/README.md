# Agent Roles

Date: 2026-02-04

Back to repo root: `AGENTS.md`.

## Purpose
Define clear responsibilities for three collaboration agents in this project:
1. Reviewer
2. Architect
3. Developer

## Working Model
1. Architect defines target design, boundaries, and migration steps.
2. Developer implements changes in small, testable increments.
3. Reviewer validates risks, regressions, and test coverage before merge.

## Shared Rules
1. Keep changes small and reviewable.
2. Prefer data-driven systems over hardcoded game logic.
3. Update docs when behavior or architecture changes.
4. Require at least one test or validation step for each PR.
5. Treat performance and mobile support as first-class requirements.

## Hand-off Contract
1. Architect provides: scope, constraints, acceptance criteria.
2. Developer provides: implementation notes, tests run, known limitations.
3. Reviewer provides: severity-ranked findings and merge recommendation.
