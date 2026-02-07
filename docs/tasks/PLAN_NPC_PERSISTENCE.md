# 📋 Feature Plan: NPC Persistence & Teleportation

**Objective:** Allow NPCs to exist independently of the current level and travel between levels (e.g., chasing the player from the Yard to the Hallway).

**Status:** 🚧 PLANNED

---

## 🏗️ Architecture Design

### 1. The Problem
Currently, NPCs are hardcoded in `level.js` files (e.g., `schoolYard.js`).
*   If the player leaves `schoolYard`, the NPC is destroyed.
*   If the player returns, the NPC resets to start position.
*   The NPC cannot "follow" the player to `schoolHall` because `schoolHall.js` doesn't know about the teacher.

### 2. The Solution
We need a **Global NPC Registry** (Static Data) and a **Game State** (Dynamic Data).

#### A. Static Registry (`src/content/npcs/`)
Defines *who* the NPC is.
```javascript
// src/content/npcs/teacher.js
export const teacher = {
  id: "teacher",
  sprite: "player",
  scripts: {
    "school_yard": [/* logic */],
    "school_hall": [/* logic */]
  }
}
```

#### B. Dynamic State (`GameState.js`)
Tracks *where* the NPC is right now.
```javascript
gameState.npcs = {
  "teacher": { level: "school_hall", x: 10, y: 5 }
}
```

---

## ✅ Implementation Task List

### Phase 1: Data Refactor (Safe)
- [ ] **Create NPC Registry Structure**
    - Create `src/content/npcs/` folder.
    - Create `teacher.js` with definitions for behavior in multiple levels.
    - Create `src/content/npcs.js` index file.
- [ ] **Create GameState Module**
    - Create `src/systems/GameState.js` to hold the active location of all NPCs.
    - Add `initialize()` method to load defaults from Registry.

### Phase 2: Logic Integration
- [ ] **Update LevelLoader**
    - **Remove** the hardcoded `levelData.npcs` loop.
    - **Add** logic to query `GameState`: *"Which NPCs are in this level right now?"*
    - **Spawn** NPCs based on the Registry config + GameState position.
- [ ] **Verify**
    - Test that the Teacher still appears in the School Yard (loaded from Registry/State, not Level file).

### Phase 3: Teleportation Logic
- [ ] **Update PortalSystem**
    - Detect when an NPC overlaps a Portal trigger.
    - **Do NOT** load the new level scene (that's for the player).
    - **Instead:** Update `GameState` (`npc.level = targetLevel`).
    - Destroy the NPC sprite in the current scene (they "left").
- [ ] **Verify**
    - Watch Teacher walk into door -> Disappear.
    - Player walks into door -> Finds Teacher on the other side.

---

## 📝 Notes for Developers
*   **Do not modify** `NPC.js` logic for movement yet. Keep it simple.
*   Ensure `GameState` is imported as a Singleton (const instance).
