export class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setSize(24, 24); // Lite mindre hitbox än 32x32
        this.body.setOffset(4, 8);

        // Config
        this.id = config.id || 'unknown_npc';
        this.walkSpeed = config.speed || 60;
        this.script = config.script || []; // Listan med kommandon
        this.scriptIndex = 0;
        this.waitTimer = 0;
        this.isBusy = false; // Om den utför ett kommando just nu
        
        // State
        this.targetX = null;
        this.targetY = null;
        this.lastDirection = 'DOWN'; 
        this.visionPolygon = null; // För kollisionskoll

        // Vision Graphics
        this.visionGraphics = scene.add.graphics();
        this.visionGraphics.setDepth(5); // Render below player/walls but above floor
    }

    update(time, delta) {
        if (this.isBusy) {
            this.executeCurrentCommand(delta);
        } else {
            this.nextCommand();
        }
        
        this.drawVisionCone();
    }

    drawVisionCone() {
        this.visionGraphics.clear();
        
        const range = 100;
        const angleWidth = 45;
        const startX = this.x;
        const startY = this.y;
        
        let rotation = 0;
        if (this.lastDirection === 'DOWN') rotation = 90;
        else if (this.lastDirection === 'LEFT') rotation = 180;
        else if (this.lastDirection === 'UP') rotation = 270;
        else if (this.lastDirection === 'RIGHT') rotation = 0;
        
        const rad = Phaser.Math.DegToRad(rotation);
        const halfAngle = Phaser.Math.DegToRad(angleWidth / 2);

        // Skapa geometri för kollision (En triangel är enklast approximation av konen för nu)
        // Punkt 1: Ögat
        // Punkt 2: Vänster kant
        // Punkt 3: Höger kant
        const p1 = new Phaser.Geom.Point(startX, startY);
        const p2 = new Phaser.Geom.Point(
            startX + Math.cos(rad - halfAngle) * range,
            startY + Math.sin(rad - halfAngle) * range
        );
        const p3 = new Phaser.Geom.Point(
            startX + Math.cos(rad + halfAngle) * range,
            startY + Math.sin(rad + halfAngle) * range
        );

        this.visionPolygon = new Phaser.Geom.Triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

        this.visionGraphics.fillStyle(0xffff00, 0.3);
        this.visionGraphics.fillTriangleShape(this.visionPolygon);
    }

    nextCommand() {
        if (this.script.length === 0) return;

        const cmd = this.script[this.scriptIndex];
        this.scriptIndex = (this.scriptIndex + 1) % this.script.length; // Loopa scriptet

        this.startCommand(cmd);
    }

    startCommand(cmd) {
        this.isBusy = true;
        this.currentCmd = cmd;

        if (cmd.type === 'WALK_TO') {
            // Konvertera grid (10, 5) till pixlar (336, 176)
            this.targetX = cmd.x * 32 + 16;
            this.targetY = cmd.y * 32 + 16;
            
            // Sätt fart mot målet
            this.scene.physics.moveTo(this, this.targetX, this.targetY, this.walkSpeed);
            
            // Räkna ut riktning
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.lastDirection = dx > 0 ? 'RIGHT' : 'LEFT';
            } else {
                this.lastDirection = dy > 0 ? 'DOWN' : 'UP';
            }
        } 
        else if (cmd.type === 'WAIT') {
            this.waitTimer = cmd.ms;
            this.body.setVelocity(0, 0);
        }
    }

    executeCurrentCommand(delta) {
        const cmd = this.currentCmd;

        if (cmd.type === 'WALK_TO') {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);
            
            // Är vi framme? (Inom 4 pixlar)
            if (dist < 4) {
                this.body.reset(this.targetX, this.targetY); // Snappa exakt position
                this.isBusy = false;
            }
        } 
        else if (cmd.type === 'WAIT') {
            this.waitTimer -= delta;
            if (this.waitTimer <= 0) {
                this.isBusy = false;
            }
        }
    }
}
