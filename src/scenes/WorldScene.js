import { LEVELS } from '../content/levels.js';
import { NPC } from '../entities/NPC.js';

export class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
        this.TILE_SIZE = 32;
        this.SPEED = 160;
        this.joyStick = { active: false, x: 0, y: 0, originX: 0, originY: 0 };
    }

    create() {
        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Mobile Touch
        this.input.on('pointerdown', p => { this.joyStick.active = true; this.joyStick.originX = p.x; this.joyStick.originY = p.y; this.joyStick.x = p.x; this.joyStick.y = p.y; });
        this.input.on('pointermove', p => { if (this.joyStick.active) { this.joyStick.x = p.x; this.joyStick.y = p.y; } });
        this.input.on('pointerup', () => { this.joyStick.active = false; });

        // Groups
        this.wallsGroup = this.physics.add.staticGroup();
        this.portalsGroup = this.physics.add.staticGroup();
        this.npcGroup = this.add.group({ runChildUpdate: true });
        this.currentMapTiles = [];

        // Player Init
        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);

        // Collisions
        this.physics.add.collider(this.player, this.wallsGroup);
        this.physics.add.collider(this.npcGroup, this.wallsGroup); // NPCs stop at walls
        this.physics.add.collider(this.player, this.npcGroup);     // Player bumps into NPCs
        this.physics.add.overlap(this.player, this.portalsGroup, this.handlePortal, null, this);

        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(2);

        // UI Overlay
        this.zoneLabel = this.add.text(10, 10, 'LOADING...', {
            fontFamily: 'Courier New', fontSize: '16px', fill: '#0f0', backgroundColor: '#000'
        }).setScrollFactor(0).setDepth(100);

        // Load Initial Level
        this.loadLevel('school_yard');
    }

    loadLevel(levelId, spawnX, spawnY) {
        console.log(`Attempting to load level: "${levelId}"`);
        if (!LEVELS[levelId]) {
            console.error(`Level not found in registry: "${levelId}". Available levels:`, Object.keys(LEVELS));
            this.add.text(10, 50, `ERROR: Level "${levelId}" not found!`, { fill: '#f00' }).setScrollFactor(0).setDepth(200);
            return;
        }
        const levelData = LEVELS[levelId];
        this.isTransitioning = false;

        // Cleanup
        this.wallsGroup.clear(true, true);
        this.portalsGroup.clear(true, true);
        this.npcGroup.clear(true, true); // Kill old NPCs
        this.currentMapTiles.forEach(t => t.destroy());
        this.currentMapTiles = [];

        // Environment
        this.cameras.main.setBackgroundColor(levelData.bgColor);
        this.zoneLabel.setText("ZONE: " + levelData.name.toUpperCase());

        // Build Map (Visuals)
        const layout = levelData.layout;
        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                const char = layout[y][x];
                const px = x * this.TILE_SIZE + 16;
                const py = y * this.TILE_SIZE + 16;

                // Determine Background Frame (0: grass, 1: floor, 2: concrete, 3: asphalt)
                let frame = 0; // Default grass
                if (levelId === 'basement') frame = 2; // Default concrete for basement

                if (['_', 'D', 'S', 'U'].includes(char)) frame = 1;
                if (char === '#') frame = 3;
                if (char === '=' || (levelId === 'basement' && char !== 'W')) frame = 2;

                // Draw background tile
                let tile = this.add.image(px, py, 'tileset', frame);
                this.currentMapTiles.push(tile);

                // Handle Walls & Objects
                if (char === 'W') {
                    // Frame 4 is wall
                    this.wallsGroup.create(px, py, 'tileset', 4);
                } else if (char === 'B') {
                    // Frame 4 is wall, tinted red for hoop
                    let w = this.wallsGroup.create(px, py, 'tileset', 4);
                    w.setTint(0xff0000);
                } else if (['D', 'S', 'U'].includes(char)) {
                    let key = (char === 'D') ? 'door' : 'stairs'; // 'door' is generated in BootScene
                    // Note: 'stairs' texture might still be missing, but door is fixed.
                    this.add.image(px, py, key);
                }
            }
        }

        // Build Interactables
        if (levelData.interactables) {
            levelData.interactables.forEach(obj => {
                const px = obj.x * this.TILE_SIZE + 16;
                const py = obj.y * this.TILE_SIZE + 16;

                if (obj.type === 'TELEPORT') {
                    let pObj = this.portalsGroup.create(px, py, null);
                    pObj.setVisible(false);
                    pObj.body.setSize(16, 16);
                    pObj.setData('target', obj.targetLevel);
                    pObj.setData('tx', obj.targetSpawnX);
                    pObj.setData('ty', obj.targetSpawnY);
                }
            });
        }

        // Spawn NPCs
        if (levelData.npcs) {
            levelData.npcs.forEach(npcData => {
                // Konvertera grid-pos till pixel-pos
                const px = npcData.x * this.TILE_SIZE + 16;
                const py = npcData.y * this.TILE_SIZE + 16;

                // Texture: Vi använder 'player' fast röd-tintad just nu tills vi har 'guard.png'
                const npc = new NPC(this, px, py, 'player', npcData);
                npc.setTint(0xff0000); // Röd = Fiende/NPC
                this.npcGroup.add(npc);
            });
        }

        // Position Player
        const finalX = (spawnX !== undefined ? spawnX : levelData.startPos.x) * this.TILE_SIZE + 16;
        const finalY = (spawnY !== undefined ? spawnY : levelData.startPos.y) * this.TILE_SIZE + 16;
        this.player.setPosition(finalX, finalY);

        // World Bounds
        this.physics.world.setBounds(0, 0, layout[0].length * this.TILE_SIZE, layout.length * this.TILE_SIZE);
    }

    handlePortal(player, portal) {
        if (this.isTransitioning) return;

        const targetLevel = portal.getData('target');
        const targetX = portal.getData('tx');
        const targetY = portal.getData('ty');

        if (targetLevel) {
            this.isTransitioning = true;
            this.cameras.main.fade(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.loadLevel(targetLevel, targetX, targetY);
                this.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    update(time, delta) {
        if (this.isTransitioning) { this.player.setVelocity(0); return; }

        this.player.body.setVelocity(0);
        let velX = 0, velY = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) velX = -1;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) velX = 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) velY = -1;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) velY = 1;

        if (this.joyStick.active) {
            const dx = this.joyStick.x - this.joyStick.originX;
            const dy = this.joyStick.y - this.joyStick.originY;
            if (Math.abs(dx) > 10) velX = Math.sign(dx);
            if (Math.abs(dy) > 10) velY = Math.sign(dy);
        }

        if (velX !== 0 || velY !== 0) {
            const l = Math.sqrt(velX * velX + velY * velY);
            this.player.setVelocity((velX / l) * this.SPEED, (velY / l) * this.SPEED);
        }
    }
}
