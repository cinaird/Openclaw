import { NPC_REGISTRY } from '../content/npcs.js';

// Global Game State to persist data between levels
export const GameState = {
    // Map of NPC ID -> { level: string, x: number, y: number, scriptIndex: number }
    npcs: {},

    // Initialize all global NPCs from registry
    initialize() {
        Object.values(NPC_REGISTRY).forEach(npcData => {
            this.npcs[npcData.id] = {
                level: npcData.startLevel,
                x: npcData.startPos.x,
                y: npcData.startPos.y,
                scriptIndex: 0
            };
        });
        console.log("GameState initialized with NPCs:", Object.keys(this.npcs));
    },

    // Get current state for an NPC
    getNpcState(npcId) {
        return this.npcs[npcId];
    },

    // Update an NPC's location (teleport)
    updateNpcLocation(npcId, levelId, x, y) {
        if (this.npcs[npcId]) {
            this.npcs[npcId].level = levelId;
            this.npcs[npcId].x = x;
            this.npcs[npcId].y = y;
            console.log(`GameState: Moved NPC ${npcId} to ${levelId} (${x},${y})`);
        }
    },
    
    // Check if an NPC belongs in the current level
    isNpcInLevel(npcId, currentLevelId) {
        return this.npcs[npcId] && this.npcs[npcId].level === currentLevelId;
    }
};
