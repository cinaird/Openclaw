export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // --- PROCEDURAL TEXTURES (Pixel Art Style) ---
        let g = this.make.graphics({x:0, y:0, add: false});

        // Player
        g.fillStyle(0x3366ff, 1); g.fillRect(4, 8, 24, 16); // Shirt
        g.fillStyle(0xffccaa, 1); g.fillRect(8, 0, 16, 10); // Head
        g.fillStyle(0x222222, 1); g.fillRect(6, 22, 20, 10); // Pants
        g.generateTexture('player', 32, 32);

        // Wall
        g.clear(); g.fillStyle(0xa1887f, 1); g.fillRect(0,0,32,32);
        g.fillStyle(0x5d4037, 1); g.fillRect(0,0,30,14); g.fillRect(2,16,30,14);
        g.generateTexture('wall', 32, 32);

        // Floor (School)
        g.clear(); g.fillStyle(0xdcedc8, 1); g.fillRect(0,0,32,32);
        g.fillStyle(0xaed581, 0.5); g.fillRect(0,0,16,16); g.fillRect(16,16,16,16);
        g.generateTexture('floor', 32, 32);

        // Floor (Basement)
        g.clear(); g.fillStyle(0x424242, 1); g.fillRect(0,0,32,32);
        g.fillStyle(0x212121, 0.5); g.fillRect(0,0,32,2); g.fillRect(0,16,32,2);
        g.generateTexture('concrete', 32, 32);

        // Grass
        g.clear(); g.fillStyle(0x2e7d32, 1); g.fillRect(0,0,32,32);
        g.generateTexture('grass', 32, 32);

        // Asphalt
        g.clear(); g.fillStyle(0x555555, 1); g.fillRect(0,0,32,32);
        g.generateTexture('asphalt', 32, 32);

        // Door
        g.clear(); g.fillStyle(0x5d4037, 1); g.fillRect(2,2,28,30);
        g.fillStyle(0xffd700, 1); g.fillCircle(24, 16, 2); // Knob
        g.generateTexture('door', 32, 32);

        // Stairs
        g.clear(); g.fillStyle(0x757575, 1); g.fillRect(0,0,32,32);
        g.fillStyle(0x000000, 0.5); 
        for(let i=0; i<32; i+=4) g.fillRect(0, i, 32, 2);
        g.generateTexture('stairs', 32, 32);

        // UI Font (Optional placeholder if needed)
    }

    create() {
        this.scene.start('WorldScene');
    }
}
