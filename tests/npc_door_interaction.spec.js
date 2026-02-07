const { test, expect } = require('@playwright/test');

test('NPC should unlock, enter, and lock door', async ({ page }) => {
    // Increase timeout for this test as it involves waiting for NPC scripted movements
    test.setTimeout(60000);

    await page.goto('/');
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    await page.waitForFunction(() => window.game && window.game.scene.getScene('WorldScene') && window.game.scene.getScene('WorldScene').npcSystem);

    // Helpers
    const getTeacher = async () => page.evaluate(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t ? { x: Math.round(t.x), y: Math.round(t.y) } : null;
    });

    const getDoorState = async () => page.evaluate(() => {
        const d = window.game.scene.getScene('WorldScene').doorSystem.doorsMap.get('10,6');
        return d ? { isOpen: d.getData('isOpen'), isLocked: d.getData('isLocked') } : null;
    });

    // 1. Initial State: Teacher should spawn Outside at 10,8 (approx 336, 272)
    const initPos = await getTeacher();
    console.log('Initial Teacher Pos:', initPos);

    // Check approximate position (within tile + offset)
    // 10*32+16=336, 8*32+16=272
    expect(initPos).not.toBeNull();
    expect(Math.abs(initPos.x - 336)).toBeLessThan(16);
    expect(Math.abs(initPos.y - 272)).toBeLessThan(16);

    // 2. Initial Door State: Should be Locked and Closed
    let doorState = await getDoorState();
    console.log('Initial Door State:', doorState);
    expect(doorState.isLocked).toBe(true);
    expect(doorState.isOpen).toBe(false);

    // 3. Wait for UNLOCK & OPEN
    // Script: Wait 1000 -> Walk to 10,7 (wait ~1s) -> Unlock -> Open
    // Total wait ~2-3s
    console.log('Waiting for door to open...');
    await page.waitForFunction(() => {
        const d = window.game.scene.getScene('WorldScene').doorSystem.doorsMap.get('10,6');
        return d && d.getData('isOpen');
    }, null, { timeout: 10000 });

    doorState = await getDoorState();
    console.log('Door state after open:', doorState);
    expect(doorState.isOpen).toBe(true);
    // It should be unlocked to open
    expect(doorState.isLocked).toBe(false);

    // 4. Wait for NPC to Enter (Walk to 10, 5)
    // Inside Y is 5*32+16 = 176
    console.log('Waiting for NPC to enter...');
    await page.waitForFunction(() => {
        const t = window.game.scene.getScene('WorldScene').npcSystem.getChildren().find(n => n.id === 'teacher');
        return t && t.y < 200; // Passed the door (y approx 176)
    }, null, { timeout: 10000 });

    // 5. Wait for CLOSE & LOCK
    // Script: Close -> Lock
    console.log('Waiting for door to close and lock...');
    await page.waitForFunction(() => {
        const d = window.game.scene.getScene('WorldScene').doorSystem.doorsMap.get('10,6');
        return d && !d.getData('isOpen') && d.getData('isLocked');
    }, null, { timeout: 10000 });

    doorState = await getDoorState();
    console.log('Final Door State (Inside):', doorState);
    expect(doorState.isOpen).toBe(false);
    expect(doorState.isLocked).toBe(true);

    // Test Passed!
});
