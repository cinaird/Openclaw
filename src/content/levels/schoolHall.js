export const schoolHall = {
    id: "school_hall",
    name: "Main Hallway",
    bgColor: "#1a1a1a",
    layout: [
        "WWWWWWWWWWWWWWWWWWWW",
        "W__________________W",
        "D__________________S",
        "W__________________W",
        "W__WWWW__WWWW__WW__W",
        "W__W_____W_____W___W",
        "W__W_____W_____W___W",
        "W__WWWW__WWWW__WW__W",
        "W__________________W",
        "WWWWWWWWWWWWWWWWWWWW"
    ],
    interactables: [
        {
            type: "TELEPORT",
            x: 0, y: 2,
            targetLevel: "school_yard",
            targetSpawnX: 8,
            targetSpawnY: 5
        },
        {
            type: "TELEPORT",
            x: 19, y: 2,
            targetLevel: "basement",
            targetSpawnX: 2,
            targetSpawnY: 3
        }
    ],
    startPos: { x: 2, y: 2 }
};
