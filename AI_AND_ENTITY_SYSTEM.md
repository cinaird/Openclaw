# AI & Entity System Architecture

## 1. Entity Core Concept
All moving objects (Player, NPCs, Monsters) share a common `Entity` base structure.
This ensures uniform handling of movement, collisions, and animations.

### Entity Properties
*   **Position:** Grid coordinates (x, y) + Sub-pixel (worldX, worldY).
*   **Direction:** One of 4 Cardinal directions (`UP`, `DOWN`, `LEFT`, `RIGHT`).
*   **State:** Current behavior mode (e.g., `IDLE`, `PATROL`).
*   **Stats:**
    *   `moveSpeed` (pixels/sec)
    *   `visionRange` (tiles)
    *   `hearingRange` (tiles)

---

## 2. Animation System
We use a standard sprite sheet layout to allow easy asset swapping.

### Cycles (States)
1.  **IDLE:** Looping breathing animation (1-4 frames).
2.  **WALK:** Standard movement (4-8 frames).
3.  **RUN:** Faster movement (often just sped up WALK or separate frames).
4.  **ALERT:** Transition animation when noticing something (! emote or stance change).
5.  **ACTION:** Interaction animation (Opening door, Attacking).
6.  **PASSIVE:** Sleeping, sitting, or "off-duty" state.

### Directional Mapping
Since we use 4 directions, sprite sheets should be organized by row:
*   Row 0: Down (Front)
*   Row 1: Left
*   Row 2: Right
*   Row 3: Up (Back)

---

## 3. Sensory System (The "Brain")
NPCs are not omniscient. They rely on simulated senses.

### 👁️ Sight (Vision)
*   **Type:** 90° Cone (Field of View).
*   **Mechanism:** Raycasting from eye position.
*   **Blocking:** Walls (`W`) and tall objects block rays.
*   **Trigger:** If Player enters the Cone AND Ray is clear -> `VisualContact` event.

### 👂 Hearing (Audio)
*   **Type:** Circular Radius.
*   **Mechanism:** Distance check (Pythagoras).
*   **Blocking:** Does NOT block. Sound travels through walls (but we could dampen it later).
*   **Trigger:** If Player makes noise (Runs/Actions) within Radius -> `AudioContact` event.

---

## 4. AI Behavior (State Machine)
NPCs operate on a Finite State Machine (FSM).

### States
1.  **PATROL (Default):**
    *   Follows a predefined list of waypoints (`path`).
    *   Moves at `walkSpeed`.
    *   If end of path: Loop or Ping-pong back.
2.  **ALERT (Suspicious):**
    *   Triggered by `AudioContact` or peripheral vision.
    *   Stops moving. Plays `?` emote.
    *   Rotates towards source.
    *   If nothing happens for X seconds -> Return to PATROL.
    *   If confirms target -> Switch to CHASE.
3.  **CHASE (Hostile):**
    *   Triggered by `VisualContact`.
    *   Pathfinds directly to Player's last known position.
    *   Moves at `runSpeed`.
    *   If Player vanishes: Go to SEARCH.
4.  **SEARCH (Lost Target):**
    *   Goes to last known position.
    *   Looks around randomly.
    *   If no contact -> Return to PATROL.

---

## 5. Pathfinding
We will use **A* Algorithm** (via `easystarjs` or Phaser plugin).
*   **Grid:** Based on the Tilemap (Walls = Unwalkable).
*   **Dynamic:** Path is recalculated if the target moves significantly (in CHASE mode).

---

## 6. Implementation Plan
1.  **Base Class:** Create `src/entities/Entity.js` (Sprite + Physics).
2.  **NPC Class:** Extend to `src/entities/NPC.js` with FSM logic.
3.  **Sensors:** Implement `VisionCone` and `HearingCircle` logic.
4.  **Integration:** Hook up pathfinding to the Tilemap.
