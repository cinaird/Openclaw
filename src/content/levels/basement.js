export const basement = {
    id: "basement",
    name: "The Basement",
    bgColor: "#050505",
    layout: [
        "WWWWWWWWWWWWWWWWWWWW",
        "W==================W",
        "W=U================W",
        "W==================W",
        "W===WWWW====WWWW===W",
        "W===W..........W===W",
        "W===W..........W===W",
        "W===WWWW====WWWW===W",
        "W==================W",
        "WWWWWWWWWWWWWWWWWWWW"
    ],
    interactables: [
        {
            type: "TELEPORT",
            x: 2, y: 2,
            targetLevel: "school_hall",
            targetSpawnX: 18,
            targetSpawnY: 2
        }
    ],
    startPos: { x: 5, y: 5 },
    npcs: [{ type: "rat", x: 10, y: 5 }] 
};
