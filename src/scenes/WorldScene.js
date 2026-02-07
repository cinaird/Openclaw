import { InputController } from '../systems/InputController.js';
import { LevelLoader } from '../systems/LevelLoader.js';
import { DoorSystem } from '../systems/DoorSystem.js';
import { PortalSystem } from '../systems/PortalSystem.js';
import { NpcSystem } from '../systems/NpcSystem.js';

export class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
        this.TILE_SIZE = 32;
        this.SPEED = 160;
    }

    create() {
        // Inputs
        this.inputController = new InputController(this);

        // Groups
        this.wallsGroup = this.physics.add.staticGroup();
        this.portalsGroup = this.physics.add.staticGroup();
        this.doorsGroup = this.physics.add.staticGroup();
        this.currentMapTiles = [];
        this.doorSystem = new DoorSystem(this);
        this.portalSystem = new PortalSystem(this);
        this.npcSystem = new NpcSystem(this);

        // Player Init
        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);

        this.levelLoader = new LevelLoader(this);
        this.doorService = {
            open: (x, y) => this.doorSystem.openDoor(x, y),
            close: (x, y) => this.doorSystem.closeDoor(x, y)
        };

        // Collisions
        this.physics.add.collider(this.player, this.wallsGroup);
        this.physics.add.collider(this.npcSystem.group, this.wallsGroup);
        this.physics.add.collider(this.player, this.npcSystem.group, (player, npc) => {
            if (npc.onContact) npc.onContact(player);
        });
        this.physics.add.collider(this.npcSystem.group, this.doorsGroup); // NPCs collide with closed doors
        this.physics.add.collider(this.player, this.doorsGroup, this.doorSystem.handleDoorCollision, null, this.doorSystem); // Player collides OR interacts

        this.physics.add.overlap(this.player, this.portalsGroup, this.portalSystem.handleOverlap, null, this.portalSystem);
        this.physics.add.overlap(this.npcSystem.group, this.portalsGroup, this.portalSystem.handleNpcOverlap, null, this.portalSystem); // NPCs use portals

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
        this.levelLoader.load(levelId, spawnX, spawnY);
    }

    triggerGameOver() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        console.log("här får du inte vara, ut!");
        this.cameras.main.flash(200, 255, 0, 0);
        this.cameras.main.fade(1000, 0, 0, 0);
        const txt = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "CAUGHT!", {
            fontSize: '64px', color: '#ff0000', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.restart();
        });
    }

    update(time, delta) {
        if (this.isTransitioning) { this.player.setVelocity(0); return; }

        // Vision Check
        this.npcSystem.getChildren().forEach(npc => {
            if (npc.visionPolygon) {
                const playerBounds = this.player.body.getBounds(new Phaser.Geom.Rectangle());
                if (Phaser.Geom.Intersects.RectangleToTriangle(playerBounds, npc.visionPolygon)) {
                    // SAFE ZONE CHECK
                    // Convert player position to grid coordinates
                    // Center point is better than top-left for "standing on"
                    const tx = Math.floor(this.player.x / this.TILE_SIZE);
                    const ty = Math.floor(this.player.y / this.TILE_SIZE);

                    if (this.currentLevelData && this.currentLevelData.layout && this.currentLevelData.layout[ty]) {
                        const char = this.currentLevelData.layout[ty][tx];
                        // '.' (Grass) and '#' (Asphalt) are safe
                        const isSafe = ['.', '#'].includes(char);

                        if (!isSafe) {
                            this.triggerGameOver();
                        }
                    } else {
                        // Fallback if OOB or no data
                        this.triggerGameOver();
                    }
                }
            }
        });

        this.player.body.setVelocity(0);
        const velocity = this.inputController.getVelocity(this.SPEED);
        if (velocity.x !== 0 || velocity.y !== 0) {
            this.player.setVelocity(velocity.x, velocity.y);
        }
    }
}
