// Global Level Data
// Legend:
// . = Grass
// # = Asphalt
// W = Wall (Brick)
// _ = Floor (School)
// = = Floor (Basement/Concrete)
// D = Door (Teleport)
// S = Stairs Down
// U = Stairs Up

const LEVELS = {
    "school_yard": {
        name: "School Yard",
        bgColor: "#2d2d2d", // Daylight
        layout: [
            "....................",
            "....................",
            "WWWWWWWWWWWWWWWWWWWW",
            "W__________________W",
            "W_W__W__D___W__W___W", // D = Door in
            "W_W__W______W__W___W",
            "WWWWWWWWWWWWWWWWWWWW",
            ".......#____#.......",
            ".......######.......",
            ".......######.......",
            ".......######.......",
            ".......######.......",
            "...B...######...B...",
            ".......######.......",
            "....................",
        ],
        // Definiera triggers (x,y är grid-koordinater, 0-index)
        // Om spelaren går på blocket vid x=8, y=4 (D) -> Teleportera
        portals: [
            { x: 8, y: 4, targetLevel: "school_hall", targetX: 2, targetY: 5 }
        ],
        startPos: { x: 10, y: 10 },
        npcs: []
    },

    "school_hall": {
        name: "Main Hallway",
        bgColor: "#1a1a1a", // Dimmer
        layout: [
            "WWWWWWWWWWWWWWWWWWWW",
            "W__________________W",
            "D__________________S", // D = Exit to yard, S = Stairs down
            "W__________________W",
            "W__WWWW__WWWW__WW__W",
            "W__W_____W_____W___W",
            "W__W_____W_____W___W",
            "W__WWWW__WWWW__WW__W",
            "W__________________W",
            "WWWWWWWWWWWWWWWWWWWW"
        ],
        portals: [
            { x: 0, y: 2, targetLevel: "school_yard", targetX: 8, targetY: 5 }, // Go out
            { x: 19, y: 2, targetLevel: "basement", targetX: 2, targetY: 2 }   // Go down
        ],
        startPos: { x: 2, y: 2 },
        npcs: [] // Här kan vi lägga "Bully" eller "Teacher" sen
    },

    "basement": {
        name: "The Basement",
        bgColor: "#050505", // Pitch black / creepy
        layout: [
            "WWWWWWWWWWWWWWWWWWWW",
            "W==================W",
            "W=U================W", // U = Stairs Up
            "W==================W",
            "W===WWWW====WWWW===W",
            "W===W..........W===W", // Lite mossa/gräs (.) i källaren? Creepy.
            "W===W..........W===W",
            "W===WWWW====WWWW===W",
            "W==================W",
            "WWWWWWWWWWWWWWWWWWWW"
        ],
        portals: [
            { x: 2, y: 2, targetLevel: "school_hall", targetX: 18, targetY: 2 }
        ],
        startPos: { x: 5, y: 5 },
        npcs: [{ type: "rat", x: 10, y: 5 }] 
    }
};
