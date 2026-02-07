export const teacher = {
    id: "teacher",
    name: "Mr. Teacher",
    texture: "player", // Placeholder until we have sprite
    speed: 40,
    startLevel: "school_yard",
    startPos: { x: 5, y: 8 },
    scripts: {
        "school_yard": [
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 8, y: 5 }, // Gå till dörren
            { type: "WAIT", ms: 500 },
            { type: "OPEN_DOOR", x: 8, y: 4 }, // Öppna
            { type: "WAIT", ms: 3000 },
            // Här ska han egentligen gå IN (genom dörren)
            // Men om han går till (8,4) triggar han teleporten
            { type: "WALK_TO", x: 8, y: 4 } 
        ],
        "school_hall": [
            { type: "WAIT", ms: 1000 }, // Vänta lite vid dörren (insidan)
            { type: "WALK_TO", x: 8, y: 2 }, // Gå inåt
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 2, y: 2 }, // Gå till vänster
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 8, y: 2 },
            { type: "LOOP" } // Patrullera hallen
        ]
    }
};
