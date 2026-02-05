# Project Review And Architecture Plan

Date: 2026-02-04

## Purpose
Document current findings and a practical plan to make the game codebase easier to scale, safer to change, and friendlier for multiple contributors working in parallel.

## Current Findings
1. Game logic is centralized in `index.html` in one large inline script.
2. Rendering, input, physics, transitions, and level loading are tightly coupled.
3. Tile meaning and behavior are hardcoded in game loop logic (magic chars).
4. Portal lookup is done repeatedly per tile (`find`) during map build.
5. Level content has no runtime schema validation.
6. README is vision-first, but lacks team workflow and contribution standards.

## Main Risks
1. High merge-conflict rate when multiple developers edit the same file.
2. Regressions become more likely as features are added.
3. Debugging cost increases because responsibilities are not isolated.
4. Content mistakes (bad coordinates, unknown symbols) fail late at runtime.

## Target Architecture
Suggested folder structure:

```txt
src/
  main.js
  scenes/
    BootScene.js
    WorldScene.js
    UIScene.js
  systems/
    InputSystem.js
    MovementSystem.js
    TransitionSystem.js
    InteractionSystem.js
  entities/
    Player.js
    NPC.js
  content/
    levels/
      school_yard.js
      school_hall.js
      basement.js
    tiles/
      legend.js
  utils/
    validators/
      validateLevelData.js
```

Design principles:
1. Keep engine code separate from content data.
2. Keep scene orchestration separate from gameplay systems.
3. Treat map symbols as data via a shared tile legend.
4. Validate content on load to fail early and clearly.

## Team Best Practices
1. Add ESLint + Prettier for consistent style.
2. Add lightweight tests (at minimum level schema + portal integrity).
3. Use branch strategy: feature branches + PR review before merge.
4. Use Conventional Commits for clean history.
5. Add PR template and CODEOWNERS for review ownership.
6. Add `CONTRIBUTING.md` with setup, coding rules, and how to add a level/NPC.

## Phased Implementation Plan
### Phase 1: Stabilize (low risk)
1. Move JS from `index.html` into `src/` modules.
2. Keep gameplay behavior identical.
3. Add lint/format tooling and CI checks.
4. Update README with setup and contribution flow.

### Phase 2: Modularize (medium risk)
1. Introduce scene split (Boot, World, UI).
2. Extract systems (input, movement, transitions).
3. Introduce tile legend mapping.
4. Add level data validation at startup.

### Phase 3: Scale Features (higher value)
1. Add NPC framework and interactions.
2. Add inventory and item/state systems.
3. Add save/load and mission progression.
4. Prepare content pipeline for larger world expansion.

## Definition Of Done For Architecture Baseline
1. No core gameplay logic left inline in `index.html`.
2. New level can be added without touching engine internals.
3. Validator catches invalid level data before gameplay starts.
4. At least one automated check runs in CI for each PR.