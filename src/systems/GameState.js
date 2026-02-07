// Global Game State to persist data between levels
// This acts as the "save file" in memory.

export const GameState = {
    // Map of NPC ID -> { level: string, x: number, y: number, scriptIndex: number }
    npcs: {},

    // Helper to get or initialize an NPC state
    getNpcState(npcId, defaultData) {
        if (!this.npcs[npcId]) {
            this.npcs[npcId] = {
                level: defaultData.levelId, // Where they start initially
                x: defaultData.x,
                y: defaultData.y,
                scriptIndex: 0
            };
        }
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
