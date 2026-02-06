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
            hasDoor: true // NYTT: Skapar en fysisk dörr här
        }
    ],
    startPos: { x: 10, y: 10 },
    npcs: [
        {
            id: "teacher",
            x: 5, y: 8,
            speed: 40, // Långsam lärare
            script: [
                { type: "WAIT", ms: 2000 },
                { type: "WALK_TO", x: 8, y: 5 }, // Gå fram till dörren
                { type: "WAIT", ms: 500 },
                { type: "OPEN_DOOR", x: 8, y: 4 }, // Öppna!
                { type: "WAIT", ms: 3000 },       // Håll öppen i 3 sek
                { type: "CLOSE_DOOR", x: 8, y: 4 }, // Stäng!
                { type: "WAIT", ms: 500 },
                { type: "WALK_TO", x: 5, y: 8 },  // Gå tillbaka
                { type: "WAIT", ms: 2000 }
            ]
        }
    ]
};
