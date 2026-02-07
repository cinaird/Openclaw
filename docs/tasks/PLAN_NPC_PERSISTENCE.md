# Feature Plan: NPC Persistence & Cross-Level Presence

**Objective:** Allow NPCs to exist independently of the current level and travel between levels (e.g., chasing the player from the Yard to the Hallway).

**Status:** PLANNED

---

## Architecture Design

### 1. The Problem
Currently, NPCs are hardcoded in `level.js` files (e.g., `schoolYard.js`).
- If the player leaves `schoolYard`, the NPC is destroyed.
- If the player returns, the NPC resets to start position.
- The NPC cannot follow the player to `schoolHall` because `schoolHall.js` doesn't know about the teacher.

### 2. The Solution
We need a **Global NPC Registry** (Static Data) and a **Game State** (Dynamic Data).

#### A. Static Registry (`src/content/npcs/`)
Defines who the NPC is and their per-level scripts.
```javascript
// src/content/npcs/teacher.js
export const teacher = {
  id: "teacher",
  sprite: "player",
  scripts: {
    "school_yard": [/* logic */],
    "school_hall": [/* logic */]
  },
  defaultScript: [/* fallback */]
};
```

#### B. Dynamic State (`GameState.js`)
Tracks where the NPC is, and enough runtime state to avoid reset.
```javascript
gameState.npcs = {
  "teacher": {
    level: "school_hall",
    x: 10,
    y: 5,
    scriptId: "school_hall",
    scriptIndex: 3,
    waitTimer: 1200,
    lastDirection: "LEFT",
    isBusy: true
  }
};
```

---

## Implementation Task List

### Phase 1: Data Refactor + Validation (Safe)
- [ ] **Create NPC Registry Structure**
  - Create `src/content/npcs/` folder.
  - Create `teacher.js` with definitions for behavior in multiple levels.
  - Create `src/content/npcs.js` index file.
- [ ] **Create GameState Module**
  - Create `src/systems/GameState.js` to hold the active state of all NPCs.
  - Add `initialize()` method to load defaults from Registry if no saved state exists.
- [ ] **Add Validation**
  - `validateNpcRegistry.js` (id, sprite, scripts/defaultScript).
  - `validateGameState.js` (id exists, level exists, coords in bounds).

### Phase 2: Logic Integration
- [ ] **Update NpcSystem (preferred)**
  - Move NPC spawn logic into `NpcSystem` using Registry + GameState.
  - Keep `LevelLoader` free of NPC creation.
- [ ] **Update LevelLoader**
  - Remove the hardcoded `levelData.npcs` loop (registry-driven now).
- [ ] **Verify**
  - Teacher still appears in School Yard (loaded from Registry/State, not level file).
  - Script resumes from stored `scriptIndex` and `waitTimer` when reloaded.

### Phase 3: Cross-Level Transfer
- [ ] **Update PortalSystem**
  - Detect when an NPC overlaps a portal trigger.
  - Do **not** load the new level scene (player-only).
  - Update `GameState` (`npc.level = targetLevel`, store position).
  - Destroy the NPC sprite in the current scene (they "left").
- [ ] **Verify**
  - Teacher walks into door -> disappears.
  - Player walks into door -> teacher is present on the other side.

### Phase 4: Persistence (Optional)
- [ ] Save/Load `GameState` to local storage or file.
- [ ] Validate `GameState` on load and fallback to defaults if invalid.

---

## Acceptance Criteria
- NPCs do not reset their position or script state after level transitions.
- NPCs can transition between levels without forcing scene reload.
- Invalid registry or state data is caught early with clear errors.

---

## Notes for Developers
- Do not modify `NPC.js` movement logic yet; keep behavior stable.
- Prefer injecting `GameState` into systems rather than using a global singleton.