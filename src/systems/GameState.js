import { validateNpcRegistry } from '../content/validateNpcRegistry.js';
import { validateGameState } from '../content/validateGameState.js';

export class GameState {
    constructor(registry, levels) {
        this.registry = registry;
        this.levels = levels;
        this.npcs = {};
        this._initialized = false;
    }

    initialize() {
        if (this._initialized) return;

        const registryErrors = validateNpcRegistry(this.registry, this.levels);
        if (registryErrors.length > 0) {
            console.warn('NPC registry validation errors:', registryErrors);
        }

        if (Object.keys(this.npcs).length === 0) {
            this.npcs = this.buildDefaultsFromRegistry();
        }

        const stateErrors = validateGameState({ npcs: this.npcs }, this.registry, this.levels);
        if (stateErrors.length > 0) {
            console.warn('GameState validation errors:', stateErrors);
        }

        this._initialized = true;
    }

    buildDefaultsFromRegistry() {
        const defaults = {};
        Object.values(this.registry).forEach(npc => {
            const spawnLevel = npc.spawns ? Object.keys(npc.spawns)[0] : null;
            const spawn = spawnLevel ? npc.spawns[spawnLevel] : { x: 0, y: 0 };
            defaults[npc.id] = {
                level: spawnLevel,
                x: spawn.x,
                y: spawn.y,
                scriptId: spawnLevel,
                scriptIndex: 0,
                waitTimer: 0,
                lastDirection: 'DOWN',
                isBusy: false,
                isInterrupted: false,
                interruptionTimer: 0,
                currentCmd: null,
                targetX: null,
                targetY: null
            };
        });
        return defaults;
    }

    getNpcState(id) {
        return this.npcs[id];
    }

    setNpcState(id, state) {
        this.npcs[id] = state;
    }

    transferNpcToLevel(id, targetLevel, targetX, targetY) {
        const state = this.npcs[id];
        if (!state) return;
        const registryEntry = this.registry[id];

        // Priority 1: Specific spawn defined in NPC registry for this level
        if (registryEntry?.spawns?.[targetLevel]) {
            targetX = registryEntry.spawns[targetLevel].x;
            targetY = registryEntry.spawns[targetLevel].y;
        }
        // Priority 2: Portal target coordinates (if valid)
        else if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
            // Priority 3: Default (0,0)
            targetX = 0;
            targetY = 0;
        }

        state.level = targetLevel;
        state.x = targetX;
        state.y = targetY;
        state.scriptId = targetLevel;
        state.scriptIndex = 0;
        state.waitTimer = 0;
        state.isBusy = false;
        state.isInterrupted = false;
        state.interruptionTimer = 0;
        state.currentCmd = null;
        state.targetX = null;
        state.targetY = null;
    }
}
