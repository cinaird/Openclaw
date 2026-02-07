function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function validateNpcState(npcId, state, registry, levels, errors) {
    if (!state || typeof state !== 'object') {
        errors.push(`[state:${npcId}] state is not an object.`);
        return;
    }
    if (!registry[npcId]) {
        errors.push(`[state:${npcId}] unknown npc id.`);
        return;
    }
    if (!state.level || !levels[state.level]) {
        errors.push(`[state:${npcId}] missing or invalid level "${state.level}".`);
    }
    if (!isNumber(state.x) || !isNumber(state.y)) {
        errors.push(`[state:${npcId}] invalid coords.`);
    } else if (state.level && levels[state.level]?.layout) {
        const layout = levels[state.level].layout;
        if (state.y < 0 || state.y >= layout.length || state.x < 0 || state.x >= layout[0].length) {
            errors.push(`[state:${npcId}] coords out of bounds for level "${state.level}".`);
        }
    }
    if (state.scriptIndex !== undefined && !isNumber(state.scriptIndex)) {
        errors.push(`[state:${npcId}] scriptIndex must be a number.`);
    }
    if (state.waitTimer !== undefined && !isNumber(state.waitTimer)) {
        errors.push(`[state:${npcId}] waitTimer must be a number.`);
    }
    if (state.interruptionTimer !== undefined && !isNumber(state.interruptionTimer)) {
        errors.push(`[state:${npcId}] interruptionTimer must be a number.`);
    }
}

export function validateGameState(gameState, registry, levels) {
    const errors = [];
    if (!gameState || typeof gameState !== 'object') {
        return ['GameState is not an object.'];
    }
    if (!gameState.npcs || typeof gameState.npcs !== 'object') {
        errors.push('GameState.npcs is missing or not an object.');
        return errors;
    }
    Object.entries(gameState.npcs).forEach(([npcId, state]) => {
        validateNpcState(npcId, state, registry, levels, errors);
    });
    return errors;
}
