const ALLOWED_CHARS = new Set(['.', 'W', '_', 'D', 'S', 'U', '#', '=', 'B']);

function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

function validateLayout(levelId, layout, errors) {
    if (!Array.isArray(layout) || layout.length === 0) {
        errors.push(`[${levelId}] layout must be a non-empty array of strings.`);
        return;
    }
    const width = layout[0].length;
    layout.forEach((row, y) => {
        if (typeof row !== 'string') {
            errors.push(`[${levelId}] layout row ${y} is not a string.`);
            return;
        }
        if (row.length !== width) {
            errors.push(`[${levelId}] layout row ${y} length ${row.length} != ${width}.`);
        }
        for (let x = 0; x < row.length; x++) {
            const ch = row[x];
            if (!ALLOWED_CHARS.has(ch)) {
                errors.push(`[${levelId}] layout has unknown char '${ch}' at (${x},${y}).`);
            }
        }
    });
}

function validateCoord(levelId, label, x, y, layout, errors) {
    if (!isNumber(x) || !isNumber(y)) {
        errors.push(`[${levelId}] ${label} has non-numeric coords: (${x},${y}).`);
        return;
    }
    if (y < 0 || y >= layout.length || x < 0 || x >= layout[0].length) {
        errors.push(`[${levelId}] ${label} out of bounds: (${x},${y}).`);
    }
}

function validateInteractables(levelId, interactables, layout, errors) {
    if (!interactables) return;
    if (!Array.isArray(interactables)) {
        errors.push(`[${levelId}] interactables must be an array.`);
        return;
    }
    interactables.forEach((obj, idx) => {
        if (!obj || typeof obj !== 'object') {
            errors.push(`[${levelId}] interactable ${idx} is not an object.`);
            return;
        }
        validateCoord(levelId, `interactable ${idx}`, obj.x, obj.y, layout, errors);
        if (obj.type === 'TELEPORT') {
            if (!obj.targetLevel) {
                errors.push(`[${levelId}] teleport ${idx} missing targetLevel.`);
            }
            if (!isNumber(obj.targetSpawnX) || !isNumber(obj.targetSpawnY)) {
                errors.push(`[${levelId}] teleport ${idx} missing target spawn coords.`);
            }
        }
    });
}

export function validateLevel(levelData) {
    const errors = [];
    if (!levelData || typeof levelData !== 'object') {
        return ['Level data is not an object.'];
    }

    const levelId = levelData.id || 'unknown_level';
    if (!levelData.id) errors.push(`[${levelId}] missing id.`);
    if (!levelData.name) errors.push(`[${levelId}] missing name.`);
    if (!levelData.bgColor) errors.push(`[${levelId}] missing bgColor.`);

    validateLayout(levelId, levelData.layout, errors);
    if (Array.isArray(levelData.layout)) {
        validateCoord(levelId, 'startPos', levelData.startPos?.x, levelData.startPos?.y, levelData.layout, errors);
        validateInteractables(levelId, levelData.interactables, levelData.layout, errors);
    }

    return errors;
}
