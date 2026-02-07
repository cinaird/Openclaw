export const teacher = {
    id: "teacher",
    name: "Mr. Teacher",
    sprite: "player",
    speed: 50,
    tint: 0xff0000,
    spawns: {
        school_yard: { x: 10, y: 8 },
        school_hall: { x: 3, y: 4 }
    },
    scripts: {
        "school_yard": [
            // Start Outside
            { type: "WAIT", ms: 1000 },
            // Walk to Main Door
            { type: "WALK_TO", x: 10, y: 7 },
            // Unlock & Open
            { type: "UNLOCK_DOOR", x: 10, y: 6 },
            { type: "OPEN_DOOR", x: 10, y: 6 },
            { type: "WAIT", ms: 500 },
            // Enter
            { type: "WALK_TO", x: 10, y: 5 },
            // Close & Lock Behind
            { type: "CLOSE_DOOR", x: 10, y: 6 },
            { type: "LOCK_DOOR", x: 10, y: 6 },
            // Wait Inside
            { type: "WAIT", ms: 2000 },
            // Walk Aside
            { type: "WALK_TO", x: 14, y: 5 },
            { type: "WAIT", ms: 1000 },
            // Walk Back
            { type: "WALK_TO", x: 10, y: 5 },
            // Unlock & Open to Exit
            { type: "UNLOCK_DOOR", x: 10, y: 6 },
            { type: "OPEN_DOOR", x: 10, y: 6 },
            { type: "WAIT", ms: 500 },
            // Exit
            { type: "WALK_TO", x: 10, y: 7 },
            // Close & Lock Behind
            { type: "CLOSE_DOOR", x: 10, y: 6 },
            { type: "LOCK_DOOR", x: 10, y: 6 },
            // Loop
            { type: "LOOP" }
        ],
        // Fallback
        "school_hall": [
            { type: "WALK_TO", x: 2, y: 2 },
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 8, y: 2 },
            { type: "LOOP" }
        ]
    }
};
