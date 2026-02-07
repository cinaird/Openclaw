import { LEVELS } from '../content/levels.js';
import { validateLevel } from '../content/validateLevel.js';
import { TILE_LEGEND, getTileFrame } from '../content/tileLegend.js';

export class LevelLoader {
    constructor(scene) {
        this.scene = scene;
    }

    load(levelId, spawnX, spawnY) {
        const scene = this.scene;
        console.log(`Attempting to load level: "${levelId}"`);
        if (!LEVELS[levelId]) {
            console.error(`Level not found in registry: "${levelId}". Available levels:`, Object.keys(LEVELS));
            scene.add.text(10, 50, `ERROR: Level "${levelId}" not found!`, { fill: '#f00' })
                .setScrollFactor(0)
                .setDepth(200);
            return;
        }
        const levelData = LEVELS[levelId];
        const errors = validateLevel(levelData);
        if (errors.length > 0) {
            console.warn(`Validation errors for level "${levelId}":`, errors);
        }
        scene.isTransitioning = false;

        // Cleanup
        scene.wallsGroup.clear(true, true);
        scene.portalsGroup.clear(true, true);
        scene.doorsGroup.clear(true, true);
        scene.npcSystem.clear({ persist: true });
        scene.currentMapTiles.forEach(t => t.destroy());
        scene.currentMapTiles = [];
        scene.doorSystem.clear();
        scene.currentLevelData = levelData;

        // Environment
        scene.cameras.main.setBackgroundColor(levelData.bgColor);
        scene.zoneLabel.setText("ZONE: " + levelData.name.toUpperCase());

        // Build Map (Visuals)
        const layout = levelData.layout;
        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                const char = layout[y][x];
                const px = x * scene.TILE_SIZE + 16;
                const py = y * scene.TILE_SIZE + 16;

                const tileInfo = TILE_LEGEND[char];
                const frame = getTileFrame(levelId, char);

                // Draw background tile
                let tile = scene.add.image(px, py, 'tileset', frame);
                scene.currentMapTiles.push(tile);

                if (tileInfo?.wall) {
                    // Frame 4 is wall
                    let w = scene.wallsGroup.create(px, py, 'tileset', 4);
                    if (tileInfo.tint) w.setTint(tileInfo.tint);
                } else if (char === 'B') {
                    // Backwards-compatible path if B not defined (should not happen)
                    let w = scene.wallsGroup.create(px, py, 'tileset', 4);
                    w.setTint(0xff0000);
                } else if (char === 'S' || char === 'U') {
                    scene.add.image(px, py, 'stairs');
                }
                // 'D' is handled by interactables now, but we add a visual fallback if no interactable exists
            }
        }

        // Build Interactables
        if (levelData.interactables) {
            levelData.interactables.forEach(obj => {
                const px = obj.x * scene.TILE_SIZE + 16;
                const py = obj.y * scene.TILE_SIZE + 16;

                if (obj.type === 'TELEPORT') {
                    // This is the trigger (invisible)
                    let pObj = scene.portalsGroup.create(px, py, null);
                    pObj.setVisible(false);
                    pObj.body.setSize(16, 16);
                    pObj.setData('target', obj.targetLevel);
                    pObj.setData('tx', obj.targetSpawnX);
                    pObj.setData('ty', obj.targetSpawnY);
                }

                // If this is a DOOR (that can open/close)
                // We create a physical door object here
                if (obj.hasDoor) {
                    const texture = obj.isLocked ? 'locked_door' : 'door';
                    let door = scene.doorsGroup.create(px, py, texture);
                    door.setImmovable(true);
                    door.setData('isOpen', false);
                    door.setData('isLocked', !!obj.isLocked);
                    scene.doorSystem.registerDoor(obj.x, obj.y, door);
                }
            });
        }

        // Spawn NPCs from registry + game state
        scene.npcSystem.spawnForLevel(levelId);

        // Position Player
        const finalX = (spawnX !== undefined ? spawnX : levelData.startPos.x) * scene.TILE_SIZE + 16;
        const finalY = (spawnY !== undefined ? spawnY : levelData.startPos.y) * scene.TILE_SIZE + 16;
        scene.player.setPosition(finalX, finalY);

        // World Bounds
        scene.physics.world.setBounds(0, 0, layout[0].length * scene.TILE_SIZE, layout.length * scene.TILE_SIZE);
    }
}
