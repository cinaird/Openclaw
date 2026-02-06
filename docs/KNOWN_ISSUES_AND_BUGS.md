# Known Issues & Bugs

## 🐛 Active Bugs

### [BUG-001] Black Screen / Level Load Failure on GitHub Pages
**Status:** 🔴 OPEN
**Priority:** High
**Date Reported:** 2026-02-06

#### Description
The game runs correctly in local development environments but displays a black screen when deployed to GitHub Pages. The game logic appears to fail during the initialization or level loading phase.

#### Symptoms
*   Canvas renders black.
*   "Level not found" or similar errors suspected in browser console.
*   Debug logs added (`main.js`, `WorldScene.js`) do not visibly resolve the issue.

#### Hypotheses
1.  **Case Sensitivity:** GitHub Pages (Linux) is case-sensitive. Imports like `schoolYard.js` must match the file on disk exactly. Windows/macOS are often forgiving.
2.  **Module Resolution:** ES Modules behavior on GitHub Pages might differ regarding relative paths.
3.  **Race Condition:** `LEVELS` object might be empty/undefined when `WorldScene` tries to access it due to import order.

#### Attempted Fixes / Actions
*   [2026-02-06] Verified `.js` extensions in imports.
*   [2026-02-06] Added `console.log` debugging to `main.js` and `WorldScene.js` (Commit `d869874`).
*   [2026-02-05] Refactored monolithic `index.html` to `src/` modules (triggered the issue).

#### Next Steps
*   Check browser console on the live site for exact error message.
*   Verify filename casing on the remote repo (`git ls-tree -r HEAD`).
*   Test explicit synchronous loading or bundling (Webpack/Vite) if native modules continue to fail.

### [BUG-002] Invisible Door Visuals
**Status:** 🔴 OPEN
**Priority:** Medium
**Date Reported:** 2026-02-06

#### Description
The visual representation of doors ('D') and possibly stairs ('S', 'U') does not appear in the game world, although the teleportation functionality (physics trigger) works correctly. The user expects to see the brown door graphic generated in `BootScene`.

#### Symptoms
*   The tile where a door should be looks like a regular floor tile.
*   Walking onto the tile triggers the teleport (so the logical object exists).

#### Hypotheses
1.  **Rendering Order:** The floor tile might be drawing *over* the door sprite if depth sorting is unstable (though insertion order usually dictates z-index in Phaser).
2.  **Texture Generation:** The 'door' texture might be failing to generate or is transparent.
3.  **Asset Loading:** If `tileset.png` is active (from the new assets system), it might be overriding the generated graphics logic, or the code expects a tileset frame instead of a generated texture key.

#### Attempted Fixes / Actions
*   [2026-02-06] Re-added logic to `WorldScene.js` to draw `this.add.image(px, py, 'door')` when 'D' is found.

#### Next Steps
*   Check `BootScene.js` to ensure `door` texture is generated correctly.
*   Try explicit `.setDepth(5)` on the door visual to force it above the floor.

---

## ✅ Resolved Issues
*(None yet)*
