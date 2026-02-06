# 🐞 Debug Tasklist: NPC Door Interaction

**Context:** We are building a "Stranger Things" style top-down stealth game in Phaser 3.
**Current Feature:** An NPC (Teacher) should walk to a locked door, open it for 3 seconds, and then close it. The player should be able to sneak in while it's open.

**Current Status:** The code is implemented but the mechanic is reported as **not working** in the live environment.

---

## 📂 Relevant Files
*   `src/scenes/WorldScene.js`: Manages `doorsGroup`, `doorsMap`, and `setDoorState()`.
*   `src/entities/NPC.js`: Handles `OPEN_DOOR` and `CLOSE_DOOR` script commands.
*   `src/content/levels/schoolYard.js`: Defines the level data, the door at `(8,4)`, and the NPC script.

## 🛠️ Implementation Details
1.  **Door Objects:** Created in `WorldScene` based on `interactables` with `hasDoor: true`. Stored in `this.doorsMap` with key `"x,y"`.
2.  **State Change:** `setDoorState(x, y, isOpen)` sets alpha to 0.3 (open) or 1.0 (closed) and toggles `body.checkCollision.none`.
3.  **NPC Script:**
    ```javascript
    { type: "WALK_TO", x: 8, y: 5 }, // Stand in front
    { type: "OPEN_DOOR", x: 8, y: 4 }, // Trigger door at 8,4
    { type: "WAIT", ms: 3000 },
    { type: "CLOSE_DOOR", x: 8, y: 4 }
    ```

## 🔍 Debugging Tasks (For the Next Dev/AI)

### 1. Verify Door Registration
*   **Hypothesis:** The door might not be correctly added to `doorsMap` or the key format (`"x,y"`) doesn't match what the NPC requests.
*   **Action:** Add logging in `WorldScene.create()` inside the interactables loop to see exactly what keys are stored.

### 2. Verify NPC Command Execution
*   **Hypothesis:** The NPC might be getting stuck on `WALK_TO` (never reaching exact pixels) or skipping the `OPEN_DOOR` command.
*   **Action:** Console log inside `NPC.js` -> `startCommand` to see if `OPEN_DOOR` triggers.

### 3. Coordinate Mismatch
*   **Hypothesis:** Grid coordinates (0-indexed) vs World coordinates (pixels) might be misaligned.
*   **Action:** Check if `cmd.x` in the script matches the `obj.x` in the interactables list exactly.

### 4. Physics Conflict
*   **Hypothesis:** Even if the door "opens" (visual alpha changes), the physics body might not update correctly, or the `portalsGroup` trigger (overlap) might be obstructed by the `doorsGroup` body (collider).
*   **Action:** Ensure `body.checkCollision.none = true` actually allows overlap events to fire on the underlying portal trigger.

### 5. Visuals
*   **Hypothesis:** Maybe it IS working, but the visual feedback (alpha change) is too subtle or broken.
*   **Action:** Try `door.setVisible(false)` instead of alpha to be sure.

---
*Good luck! The architecture is solid, it's likely a logic/coordinate bug.*
