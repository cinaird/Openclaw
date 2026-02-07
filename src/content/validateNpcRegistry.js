function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function validateCoord(levelId, label, x, y, layout, errors) {
    if (!isNumber(x) || !isNumber(y)) {
        errors.push(`[npc:${label}] has non-numeric coords: (${x},${y}).`);
        return;
    }
    if (!layout || !Array.isArray(layout) || layout.length === 0) return;
    if (y < 0 || y >= layout.length || x < 0 || x >= layout[0].length) {
        errors.push(`[npc:${label}] out of bounds for "${levelId}": (${x},${y}).`);
    }
}

function hasDoorAt(interactables, x, y) {
    if (!Array.isArray(interactables)) return false;
    return interactables.some(i => i && i.hasDoor && i.x === x && i.y === y);
}

function validateSpawn(levelId, npcId, spawn, levelData, errors) {
    if (!spawn || typeof spawn !== 'object') {
        errors.push(`[npc:${npcId}] spawn for "${levelId}" is not an object.`);
        return;
    }
    if (!isNumber(spawn.x) || !isNumber(spawn.y)) {
        errors.push(`[npc:${npcId}] spawn for "${levelId}" has invalid coords.`);
        return;
    }
    validateCoord(levelId, `${npcId} spawn`, spawn.x, spawn.y, levelData?.layout, errors);
}

function validateScriptCommands(npcId, levelId, script, levelData, errors) {
    if (!Array.isArray(script)) return;
    script.forEach((cmd, idx) => {
        if (!cmd || typeof cmd !== 'object') return;
        if (cmd.type === 'WALK_TO') {
            validateCoord(levelId, `${npcId} script ${idx}`, cmd.x, cmd.y, levelData?.layout, errors);
        }
        if (cmd.type === 'OPEN_DOOR' || cmd.type === 'CLOSE_DOOR') {
            validateCoord(levelId, `${npcId} script ${idx}`, cmd.x, cmd.y, levelData?.layout, errors);
            if (!hasDoorAt(levelData?.interactables, cmd.x, cmd.y)) {
                errors.push(
                    `[npc:${npcId}] script ${idx} references missing door at (${cmd.x},${cmd.y}) in "${levelId}".`
                );
            }
        }
    });
}

function validateScripts(npcId, scripts, levelIds, levels, errors) {
    if (!scripts || typeof scripts !== 'object') return;
    Object.entries(scripts).forEach(([levelId, script]) => {
        if (levelIds && !levelIds.has(levelId)) {
            errors.push(`[npc:${npcId}] script references missing level "${levelId}".`);
        }
        if (!Array.isArray(script)) {
            errors.push(`[npc:${npcId}] script for "${levelId}" must be an array.`);
            return;
        }
        validateScriptCommands(npcId, levelId, script, levels?.[levelId], errors);
    });
}

export function validateNpcRegistry(registry, levels) {
    const errors = [];
    if (!registry || typeof registry !== 'object') {
        return ['NPC registry is not an object.'];
    }

    const levelIds = levels ? new Set(Object.keys(levels)) : null;

    Object.values(registry).forEach(npc => {
        if (!npc || typeof npc !== 'object') {
            errors.push(`NPC entry is not an object.`);
            return;
        }
        if (!npc.id) errors.push(`[npc] missing id.`);
        if (!npc.sprite) errors.push(`[npc:${npc.id}] missing sprite.`);
        if (!npc.spawns || typeof npc.spawns !== 'object') {
            errors.push(`[npc:${npc.id}] missing spawns.`);
        } else {
            Object.entries(npc.spawns).forEach(([levelId, spawn]) => {
                if (levelIds && !levelIds.has(levelId)) {
                    errors.push(`[npc:${npc.id}] spawn references missing level "${levelId}".`);
                }
                validateSpawn(levelId, npc.id, spawn, levels?.[levelId], errors);
            });
        }

        validateScripts(npc.id, npc.scripts, levelIds, levels, errors);
        if (npc.defaultScript && !Array.isArray(npc.defaultScript)) {
            errors.push(`[npc:${npc.id}] defaultScript must be an array.`);
        }
        if (npc.speed !== undefined && !isNumber(npc.speed)) {
            errors.push(`[npc:${npc.id}] speed must be a number.`);
        }
    });

    return errors;
}
