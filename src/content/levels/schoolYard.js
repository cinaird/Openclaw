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
            hasDoor: true,
            isLocked: true // Start locked
        }
    ],
    startPos: { x: 10, y: 10 }
};
