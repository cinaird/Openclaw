export class NpcSystem {
    constructor(scene) {
        this.scene = scene;
        this.group = scene.add.group({ runChildUpdate: true });
    }

    clear() {
        this.group.clear(true, true);
    }

    add(npc) {
        this.group.add(npc);
    }

    getChildren() {
        return this.group.getChildren();
    }
}
