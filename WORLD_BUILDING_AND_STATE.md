# World Building & State Management Architecture

## 1. Core Philosophy
*   **Separation of Data & Logic:** Level files describe *what* is where. The Engine decides *how* it behaves.
*   **Persistence:** The world feels alive. Leaving a room doesn't reset it (unless intended).
*   **Scalability:** Adding a new level should be as simple as creating a JSON/JS file, without touching engine code.

---

## 2. Tile System & Dimensions
*   **Base Tile Size:** 32x32 pixels.
*   **Scaling:** The game view is zoomed (e.g., 2x or 3x) to give a chunky pixel-art look on modern screens.
*   **Grid Logic:** All movement and collision logic operates on the 32px grid coordinate system (x, y), even if sprites have sub-pixel smooth movement visually.

---

## 3. Level Data Structure
A Level is defined by two layers: The **Visual Grid** (ASCII) and the **Metadata** (Objects).

### The Visual Grid (Layout)
Defines static terrain.
*   `.` = Ground (Grass/Floor)
*   `#` = Wall (Collision)
*   `~` = Water
*   `=` = Road/Path

### The Metadata (Interactables)
Instead of magic tiles (e.g., "Step on 'D' to teleport"), we map coordinates to logical objects. This allows us to have decorative doors vs functional doors.

```javascript
// Example Level Data
{
  id: "school_f1_hall",
  layout: [
    "################",
    "#..............#",
    "#...D......S...#", // D=Door graphic, S=Stairs graphic
    "################"
  ],
  // Functional Overlay
  interactables: [
    { x: 4, y: 2, type: "TELEPORT", targetLevel: "classroom_101", targetSpawn: "main_door" }, // The Door
    { x: 11, y: 2, type: "TELEPORT", targetLevel: "basement", targetSpawn: "stairs_up" },     // The Stairs
    { x: 2, y: 2, type: "SIGN", text: "Class 1B - Mathematics" } // A sign on the wall
  ],
  // NPC Spawns (Initial State)
  npcs: [
    { id: "hall_monitor", type: "guard", x: 8, y: 2, patrolRoute: [...] }
  ]
}
```

---

## 4. State Persistence (The "World State")
To ensure NPCs don't reset when the player leaves and returns, we maintain a `GlobalGameState`.

### Session Storage Strategy
1.  **Active Level:** The level currently loaded in Phaser memory.
2.  **Dormant Levels:** When leaving a level, we serialize its dynamic state to the `GlobalGameState` object.
    *   *Saved Data:* NPC positions, Door states (Open/Closed), Picked up items.
3.  **Restoring:** When entering a level, we check `GlobalGameState`:
    *   *If exists:* Load NPCs and objects from the saved state.
    *   *If new:* Load from the initial `level.js` template.

### Time & Simulation
*   **Strategy:** "Time Freeze".
*   When the player leaves a room, that room pauses.
*   NPCs freeze in place.
*   *Future Upgrade:* "Off-screen simulation" (calculating where a guard *would* be based on time elapsed). For now, Freeze is sufficient.

---

## 5. NPC State Definition
Every NPC needs a definition of its starting conditions to support the Save/Load system.

```javascript
{
  instanceId: "guard_01", // Unique ID for saving state
  type: "security_guard", // Refers to a template (stats, sprite)
  startPos: { x: 10, y: 5 },
  facing: "DOWN",
  state: "PATROL", // Initial behavior
  inventory: ["key_card_blue"] // Items they might drop
}
```
