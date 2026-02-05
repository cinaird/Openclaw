export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('tileset', 'assets/tiles/tileset.png');

        // --- PROCEDURAL TEXTURES (Pixel Art Style) ---
        let g = this.make.graphics({x:0, y:0, add: false});

        // Player
        g.fillStyle(0x3366ff, 1); g.fillRect(4, 8, 24, 16); // Shirt
        g.fillStyle(0xffccaa, 1); g.fillRect(8, 0, 16, 10); // Head
        g.fillStyle(0x222222, 1); g.fillRect(6, 22, 20, 10); // Pants
        g.generateTexture('player', 32, 32);

        // Floor/ground/objects tiles are now loaded from assets/tiles/tileset.png

        // UI Font (Optional placeholder if needed)
    }

    create() {
        this.scene.start('WorldScene');
    }
}
