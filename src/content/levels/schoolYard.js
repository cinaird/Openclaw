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
            x: 8, y: 4, // Was 'D' before
            targetLevel: "school_hall",
            targetSpawnX: 2, 
            targetSpawnY: 5 
        }
    ],
    startPos: { x: 10, y: 10 },
    npcs: [
        {
            id: "yard_guard",
            x: 5, y: 8,
            speed: 50,
            script: [
                { type: "WALK_TO", x: 15, y: 8 },
                { type: "WAIT", ms: 1000 },
                { type: "WALK_TO", x: 5, y: 8 },
                { type: "WAIT", ms: 1000 }
            ]
        }
    ]
};
