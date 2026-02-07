import { NPC } from '../entities/NPC.js';

function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

export class NpcSystem {
    constructor(scene, registry, gameState) {
        this.scene = scene;
        this.registry = registry;
        this.gameState = gameState;
        this.group = scene.add.group({ runChildUpdate: true });
    }

    clear({ persist = true } = {}) {
        if (persist) {
            this.syncAllToState();
        }
        this.group.clear(true, true);
    }

    add(npc) {
        this.group.add(npc);
    }

    getChildren() {
        return this.group.getChildren();
    }

    syncAllToState() {
        this.getChildren().forEach(npc => {
            const state = npc.exportState(this.scene.TILE_SIZE);
            if (state && state.id) {
                this.gameState.setNpcState(state.id, state);
            }
        });
    }

    spawnForLevel(levelId) {
        const npcs = this.gameState.npcs;
        Object.entries(npcs).forEach(([npcId, state]) => {
            if (!state || state.level !== levelId) return;
            const registryEntry = this.registry[npcId];
            if (!registryEntry) return;

            state.scriptId = levelId;
            const script = this.resolveScript(registryEntry, levelId);
            const spawn = this.getSpawnForState(registryEntry, state, levelId);
            const clampedIndex = script.length > 0 ? (state.scriptIndex ?? 0) % script.length : 0;
            const config = {
                id: npcId,
                speed: registryEntry.speed,
                script,
                scriptId: levelId,
                scriptIndex: clampedIndex,
                waitTimer: state.waitTimer ?? 0,
                lastDirection: state.lastDirection ?? 'DOWN',
                isBusy: state.isBusy ?? false,
                isInterrupted: state.isInterrupted ?? false,
                interruptionTimer: state.interruptionTimer ?? 0,
                currentCmd: state.isBusy ? (state.currentCmd ?? null) : null,
                targetX: state.isBusy ? (state.targetX ?? null) : null,
                targetY: state.isBusy ? (state.targetY ?? null) : null
            };

            const px = spawn.x * this.scene.TILE_SIZE + this.scene.TILE_SIZE / 2;
            const py = spawn.y * this.scene.TILE_SIZE + this.scene.TILE_SIZE / 2;
            const npc = new NPC(this.scene, px, py, registryEntry.sprite, config);
            if (registryEntry.tint !== undefined) {
                npc.setTint(registryEntry.tint);
            }
            this.add(npc);
        });
    }

    resolveScript(registryEntry, levelId) {
        if (registryEntry.scripts && registryEntry.scripts[levelId]) {
            return registryEntry.scripts[levelId];
        }
        return registryEntry.defaultScript || [];
    }

    getSpawnForState(registryEntry, state, levelId) {
        if (isNumber(state.x) && isNumber(state.y)) {
            return { x: state.x, y: state.y };
        }
        if (registryEntry.spawns && registryEntry.spawns[levelId]) {
            const spawn = registryEntry.spawns[levelId];
            state.x = spawn.x;
            state.y = spawn.y;
            return spawn;
        }
        state.x = 0;
        state.y = 0;
        return { x: 0, y: 0 };
    }
}
