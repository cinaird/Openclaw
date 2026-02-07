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
    // Script: WAIT 2000, WALK_TO 9,8
    await page.waitForTimeout(4000);

    const movedPos = await page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t ? { x: t.x, y: t.y } : null;
    });
    console.log('Teacher Pos after move:', movedPos);
    expect(movedPos.y).toBeLessThan(initialY); // Should have moved UP (smaller Y)

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

    // 5. Verify Teacher is at SAVED position (should be closer to movedPos, definitely NOT initialPos)
    const restoredPos = await page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t ? { x: t.x, y: t.y } : null;
    });
    console.log('Restored Teacher Pos:', restoredPos);

    // If persistence failed, it would reset to initialY (464)
    expect(restoredPos.y).toBeLessThan(initialY - 20); // It moved at least 20px

    // It should be somewhere around where we left it (401) or further along (350), but not back at start
    expect(restoredPos.y).toBeLessThan(450);
});
