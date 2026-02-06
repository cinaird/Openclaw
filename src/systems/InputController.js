export class InputController {
    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.joyStick = { active: false, x: 0, y: 0, originX: 0, originY: 0 };
        scene.input.on('pointerdown', p => {
            this.joyStick.active = true;
            this.joyStick.originX = p.x;
            this.joyStick.originY = p.y;
            this.joyStick.x = p.x;
            this.joyStick.y = p.y;
        });
        scene.input.on('pointermove', p => {
            if (this.joyStick.active) {
                this.joyStick.x = p.x;
                this.joyStick.y = p.y;
            }
        });
        scene.input.on('pointerup', () => {
            this.joyStick.active = false;
        });
    }

    getDirection() {
        let velX = 0;
        let velY = 0;

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

        return { x: velX, y: velY };
    }

    getVelocity(speed) {
        const dir = this.getDirection();
        if (dir.x === 0 && dir.y === 0) return { x: 0, y: 0 };
        const l = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        return { x: (dir.x / l) * speed, y: (dir.y / l) * speed };
    }
}
