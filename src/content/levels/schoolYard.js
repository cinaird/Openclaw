export const schoolYard = {
    id: "school_yard",
    name: "School Yard",
    bgColor: "#2d2d2d",
    layout: [
        "....................",
        "....................",
        "WWWWWWWWWWWWWWWWWWWW",
        "W__________________W",
        "W_W__W__D___W__W___W",
        "W_W__W______W__W___W",
        "WWWWWWWWW__WWWWWWWWW",
        ".......#____#.......",
        ".......######.......",
        ".......######.......",
        ".......######.......",
        ".......######.......",
        "...B...######...B...",
        ".......######.......",
        "...................."
    ],
    interactables: [
        {
            type: "TELEPORT",
            x: 8, y: 4,
            targetLevel: "school_hall",
            targetSpawnX: 2,
            targetSpawnY: 5,
            hasDoor: true
        },
        // Main Entrance Double Doors
        { x: 9, y: 6, type: "DOOR", hasDoor: true, isLocked: true },
        { x: 10, y: 6, type: "DOOR", hasDoor: true, isLocked: true }
    ],
    startPos: { x: 10, y: 10 },
    npcs: [
        {
            id: "teacher",
            x: 9, y: 14, // Start outside (bottom)
            speed: 50,
            script: [
                { type: "WAIT", ms: 2000 },
                { type: "WALK_TO", x: 9, y: 8 },  // Walk to front of gate
                { type: "WAIT", ms: 500 },
                { type: "OPEN_DOOR", x: 9, y: 6 }, // Open Left Door
                { type: "OPEN_DOOR", x: 10, y: 6 }, // Open Right Door
                { type: "WAIT", ms: 500 },
                { type: "WALK_TO", x: 9, y: 4 }, // Walk inside (past gate)
                { type: "WAIT", ms: 3000 },
                { type: "CLOSE_DOOR", x: 9, y: 6 }, // Close Left
                { type: "CLOSE_DOOR", x: 10, y: 6 }, // Close Right
                { type: "WAIT", ms: 500 },
                { type: "WALK_TO", x: 8, y: 5 }, // Walk to building door
                { type: "OPEN_DOOR", x: 8, y: 4 }, // Open building door
                { type: "WALK_TO", x: 8, y: 4 }, // Enter building
                { type: "WAIT", ms: 5000 }      // Stay there (disappeared into door)
            ]
        }
    ]
};
