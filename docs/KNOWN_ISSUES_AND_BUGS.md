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

## ✅ Resolved Issues

### [BUG-002] Invisible Door Visuals
**Status:** 🟢 RESOLVED
**Resolution:** Procedural texture for 'door' was missing in `BootScene.js`. Added `g.generateTexture('door', ...)` and verified with Playwright tests.

### [BUG-003] Green Checkerboard / Missing Tileset
**Status:** 🟢 RESOLVED
**Resolution:** The game was looking for string-based texture keys (e.g., 'grass', 'floor') which weren't defined. Refactored `WorldScene.js` to use `tileset.png` frames (0-4) and loaded it as a spritesheet in `BootScene.js`.

### [BUG-004] Title, Favicon & Asset Updates Not Reflecting
**Status:** 🟢 RESOLVED
**Resolution:** The browser was caching `index.html` and scripts aggressively. Resolved by:
1. Updating `index.html` with the new title ("5 nights at scool") and a Data URI favicon (🐻).
2. Restarting the local `http-server` to clear server-side hanging/cache.
3. Performing a hard refresh (`Ctrl + F5`) in the browser.

