export const TILE_LEGEND = {
    '.': { frame: 0 },
    '_': { frame: 1 },
    'D': { frame: 1 },
    'S': { frame: 1 },
    'U': { frame: 1 },
    '#': { frame: 3 },
    '=': { frame: 2 },
    'W': { frame: 0, wall: true },
    'B': { frame: 0, wall: true, tint: 0xff0000 }
};

export function getTileFrame(levelId, char) {
    const base = TILE_LEGEND[char];
    if (!base) return 0;
    if (levelId === 'basement' && char !== 'W') return 2;
    return base.frame ?? 0;
}
