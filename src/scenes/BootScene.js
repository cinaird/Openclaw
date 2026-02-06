export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.spritesheet('tileset', 'assets/tiles/tileset.png', { frameWidth: 32, frameHeight: 32 });

        // --- PROCEDURAL TEXTURES (Pixel Art Style) ---
        let g = this.make.graphics({ x: 0, y: 0, add: false });

        // Player
        g.fillStyle(0x3366ff, 1); g.fillRect(4, 8, 24, 16); // Shirt
        g.fillStyle(0xffccaa, 1); g.fillRect(8, 0, 16, 10); // Head
        g.fillStyle(0x222222, 1); g.fillRect(6, 22, 20, 10); // Pants
        g.generateTexture('player', 32, 32);

        // Door (Brown)
        g.clear();
        g.fillStyle(0x8B4513, 1);
        g.fillRect(0, 0, 32, 32);
        g.generateTexture('door', 32, 32);

        // Locked Door (Dark Iron/Steel)
        g.clear();
        g.fillStyle(0x444444, 1);
        g.fillRect(0, 0, 32, 32);
        g.lineStyle(2, 0x000000, 1);
        g.strokeRect(0, 0, 32, 32);
        g.fillStyle(0x000000, 1);
        g.fillRect(24, 14, 4, 4); // Keyhole-ish
        g.generateTexture('locked_door', 32, 32);

        // Floor/ground/objects tiles are now loaded from assets/tiles/tileset.png

        // UI Font (Optional placeholder if needed)
    }

    create() {
        this.scene.start('WorldScene');
    }
}
