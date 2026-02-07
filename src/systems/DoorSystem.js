export class DoorSystem {
    constructor(scene) {
        this.scene = scene;
        this.doorsMap = new Map();
    }

    clear() {
        this.doorsMap.clear();
    }

    registerDoor(gridX, gridY, door) {
        const key = `${gridX},${gridY}`;
        door.setData('key', key);
        this.doorsMap.set(key, door);
    }

    setDoorState(gridX, gridY, isOpen) {
        const key = `${gridX},${gridY}`;
        const door = this.doorsMap.get(key);
        if (!door) {
            console.warn(`No door found at ${gridX},${gridY}`);
            return;
        }

        if (isOpen) {
            door.setAlpha(0.3); // Visual: Open
            door.body.checkCollision.none = true; // Physics: Pass through
            door.setData('isOpen', true);
        } else {
            door.setAlpha(1.0); // Visual: Closed
            door.body.checkCollision.none = false; // Physics: Solid
            door.setData('isOpen', false);
        }
    }

    openDoor(gridX, gridY) {
        this.setDoorState(gridX, gridY, true);
    }

    closeDoor(gridX, gridY) {
        this.setDoorState(gridX, gridY, false);
    }

    lockDoor(gridX, gridY) {
        const key = `${gridX},${gridY}`;
        const door = this.doorsMap.get(key);
        if (door) {
            door.setData('isLocked', true);
            // Optional: visual cue for lock?
            // For now just data.
        }
    }

    unlockDoor(gridX, gridY) {
        const key = `${gridX},${gridY}`;
        const door = this.doorsMap.get(key);
        if (door) {
            door.setData('isLocked', false);
        }
    }

    handleDoorCollision(player, door) {
        // Allow player to open the door by walking into it IF it's not locked
        if (!door.getData('isOpen') && !door.getData('isLocked')) {
            const gridX = Math.floor(door.x / this.scene.TILE_SIZE);
            const gridY = Math.floor(door.y / this.scene.TILE_SIZE);
            this.setDoorState(gridX, gridY, true);
        }
    }
}
