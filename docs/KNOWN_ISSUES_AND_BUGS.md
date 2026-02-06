# Known Issues & Bugs

## 🐛 Active Bugs

*(No active bugs currently known)*

---

## ✅ Resolved Issues

### [BUG-001] Black Screen / Level Load Failure on GitHub Pages
**Status:** 🟢 RESOLVED
**Date Resolved:** 2026-02-06
**Resolution:** The GitHub Actions workflow file (`.github/workflows/deploy.yml`) was missing, causing deployments to stop entirely. Restoring the workflow fixed the deployment, and the game now loads correctly.

### [BUG-002] Invisible Door Visuals
**Status:** 🟢 RESOLVED
**Date Resolved:** 2026-02-06
**Resolution:** Logic for rendering visual sprites for 'D' (Door) and 'S' (Stairs) was missing or conflicted with the new `interactables` logic. Code was updated to explicitly render these tiles again.
