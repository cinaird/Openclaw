
import { test, expect } from '@playwright/test';

test.describe('Game Mechanics', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for game to initialize
        await page.waitForFunction(() => window.game && window.game.scene.scenes.length > 0);
    });

    test('Player should collide with walls', async ({ page }) => {
        // 1. Get initial player position
        const initialPos = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            return { x: scene.player.x, y: scene.player.y };
        });

        // 2. Locate a wall (We know there are walls in 'school_yard', e.g., the fence/building)
        // For this test, let's try to move UP into a known wall or just move generally and check checks.
        // Easier: Spawn player next to a wall. 
        // Since we rely on default spawn, let's move UP. In 'school_yard', moving UP usually hits the school wall eventually.

        // Simulate holding 'up' key for a significant time
        await page.keyboard.down('W');
        await page.waitForTimeout(1000); // 1 second of movement
        await page.keyboard.up('W');

        // 3. Check position behavior. 
        // Actually, a robust test needs to know EXACTLY where a wall is.
        // Let's use the game state to find a nearby wall.

        const wallCollision = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            const p = scene.player;
            const startY = p.y;

            // Simulate physics update step or check static body overlap manually if we want unit-test style,
            // but for E2E, let's just attempt move.
            return { startY };
        });

        // Move UP
        await page.keyboard.press('W', { delay: 500 });

        const newPos = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            return { x: scene.player.x, y: scene.player.y };
        });

        // We expect position to change if open, but STOP if wall.
        // Without exact map knowledge in test, this is tricky. 
        // ALTERNATIVE: Inject a wall right next to player for the test.

        const injectedWallResult = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            // Create a wall directly to the right of the player
            const wall = scene.wallsGroup.create(scene.player.x + 32, scene.player.y, 'wall');
            wall.body.setSize(32, 32);
            wall.refreshBody(); // Important for static bodies
            return true;
        });

        const startX = newPos.x;

        // Try to move RIGHT into the wall
        await page.keyboard.down('D');
        await page.waitForTimeout(500);
        await page.keyboard.up('D');

        const finalPos = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            return { x: scene.player.x, y: scene.player.y };
        });

        // Player should not have moved approx 32px (speed * time). 
        // Speed is 160. 0.5s = 80px.
        // If wall works, x should be roughly startX (maybe small jitter due to overlap correction).
        // Distance should be < 32 (size of tile/wall separation).

        expect(Math.abs(finalPos.x - startX)).toBeLessThan(16);
    });

    test('Player should teleport when entering portal', async ({ page }) => {
        // Inject a portal at player location for testing
        await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            // Portal targetting 'basement'
            const portal = scene.portalsGroup.create(scene.player.x + 32, scene.player.y, 'portal'); // slightly offset to allow movement into it
            portal.body.setSize(32, 32);
            portal.setData('target', 'basement');
            portal.setData('tx', 5);
            portal.setData('ty', 5);
            // Force overlap callback to standard handlePortal
        });

        // Move into portal
        await page.keyboard.down('D');
        await page.waitForTimeout(500);
        await page.keyboard.up('D');

        // Wait for transition (fade is 500ms out + load + 500ms in)
        await page.waitForTimeout(1500);

        const zoneName = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            return scene.zoneLabel.text;
        });

        expect(zoneName).toContain('BASEMENT');
    });

});
