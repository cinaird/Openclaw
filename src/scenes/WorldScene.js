import { LEVELS } from '../content/levels.js';

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
        this.input.on('pointermove', p => { if(this.joyStick.active) { this.joyStick.x = p.x; this.joyStick.y = p.y; } });
        this.input.on('pointerup', () => { this.joyStick.active = false; });

        // Groups
        this.wallsGroup = this.physics.add.staticGroup();
        this.portalsGroup = this.physics.add.staticGroup();
        this.currentMapTiles = [];

        // Player Init
        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);
        
        // Collisions
        this.physics.add.collider(this.player, this.wallsGroup);
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
        if (!LEVELS[levelId]) { console.error("Level not found:", levelId); return; }
        const levelData = LEVELS[levelId];
        this.isTransitioning = false;

        // Cleanup
        this.wallsGroup.clear(true, true);
        this.portalsGroup.clear(true, true);
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

                let bgKey = 'grass';
                if (['W', 'D', 'S', 'U'].includes(char)) { /* Wall/Door handled below, but needs floor under? */ }
                if (['_', 'D', 'S', 'U'].includes(char)) bgKey = 'floor';
                if (char === '#') bgKey = 'asphalt';
                if (char === '=' || (levelId === 'basement' && char !== 'W')) bgKey = 'concrete';

                let tile = this.add.image(px, py, bgKey);
                this.currentMapTiles.push(tile);

                if (char === 'W') {
                    this.wallsGroup.create(px, py, 'wall');
                } else if (char === 'B') {
                    this.wallsGroup.create(px, py, 'wall').setTint(0xff0000); // Hoop
                } else if (['D', 'S', 'U'].includes(char)) {
                    // Just visual, logic is in interactables now
                    let key = (char === 'D') ? 'door' : 'stairs';
                    this.add.image(px, py, key);
                }
            }
        }

        // Build Interactables (Logic)
        if (levelData.interactables) {
            levelData.interactables.forEach(obj => {
                const px = obj.x * this.TILE_SIZE + 16;
                const py = obj.y * this.TILE_SIZE + 16;
                
                if (obj.type === 'TELEPORT') {
                    // Create invisible trigger
                    let pObj = this.portalsGroup.create(px, py, null);
                    pObj.setVisible(false);
                    pObj.body.setSize(16, 16); // Smaller hitbox
                    pObj.setData('target', obj.targetLevel);
                    pObj.setData('tx', obj.targetSpawnX);
                    pObj.setData('ty', obj.targetSpawnY);
                }
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

    update() {
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
            const l = Math.sqrt(velX*velX + velY*velY);
            this.player.setVelocity((velX/l) * this.SPEED, (velY/l) * this.SPEED);
        }
    }
}
