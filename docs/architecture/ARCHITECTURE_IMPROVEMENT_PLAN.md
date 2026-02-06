# Architecture Improvement Plan

Date: 2026-02-06

## Goals
- Reduce the “god-class” role of `WorldScene` by extracting systems.
- Make content data explicit and validate it early.
- Establish stable module boundaries for future features (NPCs, inventory, quests, save/load).

## Phased Plan (Task List)

1. Baseline system structure
- Create `src/systems/` directory.
- Add empty system files:
  - `src/systems/InputController.js`
  - `src/systems/LevelLoader.js`
  - `src/systems/PortalSystem.js`
  - `src/systems/DoorSystem.js`
  - `src/systems/NpcSystem.js`
- Add `src/systems/WorldContext.js` to centralize references (scene, physics, registries).

2. Extract input handling
- Move keyboard + touch input logic from `src/scenes/WorldScene.js` into `InputController`.
- `WorldScene` instantiates `InputController` and reads a velocity vector each update.
- Acceptance: movement matches current behavior for keyboard and touch.

3. Extract level loading
- Move map build + entity spawn logic into `LevelLoader`.
- `WorldScene.loadLevel` becomes a thin wrapper.
- Acceptance: initial load and portal transitions work identically.

4. Extract door logic
- Move `doorsMap` and `setDoorState` to `DoorSystem`.
- Expose `doorService.open(x,y)` / `doorService.close(x,y)` in context.
- Update NPC scripts to use `doorService`.
- Acceptance: doors open/close and collisions behave the same.

5. Extract portal logic
- Move transition and teleport handling into `PortalSystem`.
- `WorldScene` wires overlap to the system.
- Acceptance: transitions still fade and teleport correctly.

6. Extract NPC management
- Move NPC spawn + update logic into `NpcSystem`.
- Acceptance: NPC scripts and vision detection still function.

7. Add content validation
- Add `src/content/schema.js` and `src/content/validateLevel.js`.
- Run validation on load (warnings first, then errors once stable).
- Acceptance: invalid symbols, bad coords, and missing references are detected.

8. Add tile legend / registry
- Add `src/content/tileLegend.js` to map tile chars to frames/behavior.
- Replace hardcoded tile rules in `LevelLoader`.
- Acceptance: visuals and collisions remain identical.

9. Cleanup and documentation
- Update `README.md` with new systems overview.
- Optional: add a short architecture note in `docs/`.
- Acceptance: no dead code left in `WorldScene` for moved responsibilities.

## Definition of Done (per phase)
- Each phase is a small commit with no gameplay regressions.
- Changes are testable by running the game and verifying movement, collisions, NPCs, and transitions.
- Updated docs for any structural changes.
