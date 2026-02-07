import { LEVELS } from '../content/levels.js';
import { NPC } from '../entities/NPC.js';
import { validateLevel } from '../content/validateLevel.js';
import { TILE_LEGEND, getTileFrame } from '../content/tileLegend.js';
import { GameState } from './GameState.js';

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
        scene.currentLevelData = LEVELS[levelId];
        const levelData = scene.currentLevelData;
        const errors = validateLevel(levelData);
        if (errors.length > 0) {
            console.warn(`Validation errors for level "${levelId}":`, errors);
        }
        scene.isTransitioning = false;

        // Cleanup
        scene.wallsGroup.clear(true, true);
        scene.portalsGroup.clear(true, true);
        scene.doorsGroup.clear(true, true);
        scene.npcSystem.clear();
        scene.currentMapTiles.forEach(t => t.destroy());
        scene.currentMapTiles = [];
        scene.doorSystem.clear();

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

        // Spawn NPCs (Managed by GameState)
        // 1. Iterate over NPCs defined for this level (Potential spawns)
        // 2. Iterate over GLOBAL NPCs that might have moved HERE from elsewhere
        
        // Strategy: We rely on the initial definition to "register" them, 
        // but checking ALL levels for every load is expensive.
        // For now, let's assume NPCs are defined in their "Home Level" in levels.js.
        // If they move, GameState tracks it.
        
        // Note: This logic means if an NPC moves TO a level where they aren't defined in `levels.js`,
        // they won't spawn unless we iterate ALL NPC IDs in GameState.
        // Let's do a mix: Check local definitions, AND check GameState for any visitors.
        
        const localNpcIds = new Set();

        // 1. Check statically defined NPCs for this level
        if (levelData.npcs) {
            levelData.npcs.forEach(npcData => {
                const npcId = npcData.id;
                localNpcIds.add(npcId);
                
                // Initialize state if new (using this level as home)
                const state = GameState.getNpcState(npcId, { 
                    levelId: levelId, 
                    x: npcData.x, 
                    y: npcData.y 
                });

                // Only spawn if they are ACTUALLY here
                if (state.level === levelId) {
                    const px = state.x * scene.TILE_SIZE + 16;
                    const py = state.y * scene.TILE_SIZE + 16;
                    const npc = new NPC(scene, px, py, 'player', npcData);
                    npc.setTint(0xff0000);
                    scene.npcSystem.add(npc);
                }
            });
        }

        // 2. Check for visitors (NPCs from other levels that traveled here)
        Object.keys(GameState.npcs).forEach(npcId => {
            if (!localNpcIds.has(npcId)) {
                const state = GameState.npcs[npcId];
                if (state.level === levelId) {
                    // This visitor is here! But we need their config (texture, script).
                    // We don't have it locally.
                    // Solution: We need a Global NPC Registry or look it up from their source level.
                    // For prototype: We skip visual config or find a way to access it.
                    // Let's assume we can look up the "Base Config" from a global registry later.
                    // For now, let's just log it. Visitor spawning is Phase 2.
                    console.log(`Visitor NPC ${npcId} detected but no template found locally.`);
                }
            }
        });

        // Position Player
        const finalX = (spawnX !== undefined ? spawnX : levelData.startPos.x) * scene.TILE_SIZE + 16;
        const finalY = (spawnY !== undefined ? spawnY : levelData.startPos.y) * scene.TILE_SIZE + 16;
        scene.player.setPosition(finalX, finalY);

        // World Bounds
        scene.physics.world.setBounds(0, 0, layout[0].length * scene.TILE_SIZE, layout.length * scene.TILE_SIZE);
    }
}
