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
    }

    update(time, delta) {
        if (this.isBusy) {
            this.executeCurrentCommand(delta);
        } else {
            this.nextCommand();
        }
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
