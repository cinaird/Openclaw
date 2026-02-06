
import { test, expect } from '@playwright/test';

test.describe('Visual Assets', () => {

    test.beforeEach(async ({ page }) => {
        // Load directly into the game
        await page.goto('/');
        await page.waitForFunction(() => window.game && window.game.scene.scenes.length > 0);
    });

    test('Door texture should exist and be visible in School Hall', async ({ page }) => {
        // 1. Force load the 'school_hall' level where we know there is a door at (0, 2)
        await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            scene.loadLevel('school_hall');
        });

        // Wait for level load (fades etc usually take 500ms, but direct loadLevel is instant logic-wise, 
        // though safe to wait a tick or check zone label).
        await page.waitForTimeout(500);

        // 2. Check if texture exists in the manager
        const textureExists = await page.evaluate(() => {
            return window.game.textures.exists('door');
        });

        // This is the primary failure condition for the bug
        expect(textureExists, 'Texture "door" should exist in TextureManager').toBe(true);

        // 3. Find the door object at (0, 2) -> pixels (16, 80)
        // TILE_SIZE=32. x=0 => 16. y=2 => 2*32+16 = 80.
        const isVisible = await page.evaluate(() => {
            const scene = window.game.scene.getScene('WorldScene');
            // Find image at approx location with texture 'door'
            const door = scene.children.list.find(obj =>
                obj.type === 'Image' &&
                obj.texture.key === 'door' &&
                Math.abs(obj.x - 16) < 2 &&
                Math.abs(obj.y - 80) < 2
            );
            return door && door.visible;
        });

        expect(isVisible, 'Door object should be found and visible at (0,2)').toBe(true);
    });

});
