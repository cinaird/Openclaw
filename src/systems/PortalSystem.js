export class PortalSystem {
    constructor(scene) {
        this.scene = scene;
    }

    handleOverlap(player, portal) {
        if (this.scene.isTransitioning) return;

        const targetLevel = portal.getData('target');
        const targetX = portal.getData('tx');
        const targetY = portal.getData('ty');

        if (targetLevel) {
            this.scene.isTransitioning = true;
            this.scene.cameras.main.fade(500, 0, 0, 0);
            this.scene.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.loadLevel(targetLevel, targetX, targetY);
                this.scene.cameras.main.fadeIn(500, 0, 0, 0);
            });
        }
    }

    handleNpcOverlap(npc, portal) {
        const targetLevel = portal.getData('target');
        const targetX = portal.getData('tx');
        const targetY = portal.getData('ty');
        if (!targetLevel || !npc?.id) return;

        this.scene.gameState.transferNpcToLevel(npc.id, targetLevel, targetX, targetY);
        this.scene.npcSystem.group.remove(npc, true, true);
    }
}
