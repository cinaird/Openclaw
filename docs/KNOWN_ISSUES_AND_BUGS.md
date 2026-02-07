# Known Issues & Bugs

## 🐛 Active Bugs

### [BUG-003] Teacher NPC Missing / Not Acting
**Status:** 🔴 OPEN
**Priority:** High
**Date Reported:** 2026-02-07

#### Description
The "Teacher" NPC, supposed to patrol in/out of the locked door at the School Yard, is completely invisible or inactive. The intended behavior is a loop of opening the door, walking out, patrolling, walking in, and closing it.

#### Symptoms
*   No red NPC sprite visible near the door (8,4).
*   Door remains closed/locked indefinitely.
*   No interaction events triggered.

#### Hypotheses
1.  **Spawn Failure:** Even after moving spawn from y=2 to y=3, the NPC might be stuck or failing to spawn due to `LevelLoader` registry lookup issues.
2.  **Script Stall:** The first command is `WAIT 2000`. If the script engine crashed or stalled, nothing happens.
3.  **Z-Index/Visibility:** The NPC might be spawning *under* the floor tiles or invisible.
4.  **Physics Lock:** `setImmovable(true)` might be preventing `moveTo` physics from working? (NPCs shouldn't be immovable, but worth checking).

#### Attempted Fixes
*   [2026-02-07] Moved start position from (8,2) [Wall] to (8,3) [Floor]. (Commit `185e17a`). Did not resolve visibility.

#### Next Steps for Debugging
*   Add `console.log` in `NPC.js` constructor: "NPC Spawned: [ID] at [x,y]".
*   Check browser console for "Level not found" errors or script crashes.
*   Temporarily move spawn point to `(10, 10)` (middle of yard) to confirm he exists at all.

---

## ✅ Resolved Issues

### [BUG-001] Black Screen / Level Load Failure on GitHub Pages
**Status:** 🟢 RESOLVED
**Date Resolved:** 2026-02-06
**Resolution:** The GitHub Actions workflow file (`.github/workflows/deploy.yml`) was missing. Restored.

### [BUG-002] Invisible Door Visuals
**Status:** 🟢 RESOLVED
**Date Resolved:** 2026-02-06
**Resolution:** Logic for rendering visual sprites for 'D' (Door) was missing. Code updated to explicitly render these tiles.
