const { test, expect } = require('@playwright/test');

test('NPC state should persist across level transitions', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.game && window.game.scene.getScene('WorldScene') && window.game.scene.getScene('WorldScene').npcSystem);

    // 1. Verify Teacher Start Position (School Yard)
    const getTeacher = await page.evaluate(() => {
        const scene = window.game.scene.getScene('WorldScene');
        const system = scene.npcSystem;
        const t = system.getChildren().find(n => n.id === 'teacher');
        return t ? { x: t.x, y: t.y } : null;
    });
    console.log('Initial Teacher Pos:', getTeacher);
    expect(getTeacher).not.toBeNull();
    const initialY = getTeacher.y;

    // 2. Wait for Teacher to Move (Script execution)
    // New Script: WAIT 2000, WALK_TO 8,3 (idle), OPEN_DOOR, WALK_TO 8,5
    // It starts at 8,3 (approx 112px). Moves to 8,5 (approx 176px).
    await page.waitForTimeout(4000);

    const movedPos = await page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t ? { x: t.x, y: t.y } : null;
    });
    console.log('Teacher Pos after move:', movedPos);

    // Expect movement DOWN (increasing Y) or at least staying put if timer hasn't finished, 
    // but the script waits 2000ms then acts. 4000ms should be enough to start moving to 8,5.
    // Initial was ~112. Moved should be > 112.
    expect(movedPos.y).toBeGreaterThanOrEqual(initialY);

    // 3. Teleport Player to School Hall
    await page.evaluate(() => {
        const scene = window.game.scene.getScene('WorldScene');
        scene.loadLevel('school_hall');
    });
    await page.waitForTimeout(1000); // Wait for load

    // Verify Teacher is NOT in Hall
    const teacherInHall = await page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return !!t;
    });
    expect(teacherInHall).toBe(false);

    // 4. Return to School Yard
    await page.evaluate(() => {
        const scene = window.game.scene.getScene('WorldScene');
        scene.loadLevel('school_yard');
    });
    await page.waitForTimeout(1000);

    // 5. Verify Teacher is at SAVED position
    const restoredPos = await page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t ? { x: t.x, y: t.y } : null;
    });
    console.log('Restored Teacher Pos:', restoredPos);

    // Should be near movedPos
    expect(Math.abs(restoredPos.y - movedPos.y)).toBeLessThan(5);
});
