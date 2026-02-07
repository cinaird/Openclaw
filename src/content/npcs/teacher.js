export const teacher = {
    id: "teacher",
    name: "Mr. Teacher",
    texture: "player", // Placeholder until we have specific sprite
    speed: 40,
    startLevel: "school_yard",
    startPos: { x: 8, y: 3 }, // Start INSIDE (Row 3 is floor, Row 2 is wall!)
    scripts: {
        "school_yard": [
            // Phase 1: Go Out
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 8, y: 3 }, // Ensure standing at door
            { type: "WAIT", ms: 500 },
            { type: "OPEN_DOOR", x: 8, y: 4 }, // Unlock & Open
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 8, y: 5 }, // Walk through to outside
            { type: "CLOSE_DOOR", x: 8, y: 4 }, // Close behind

            // Phase 2: Patrol Outside
            { type: "WAIT", ms: 1000 },
            { type: "WALK_TO", x: 5, y: 8 }, // Walk to yard patrol point
            { type: "WAIT", ms: 3000 },      // Look around
            { type: "WALK_TO", x: 15, y: 8 }, // Another point
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 8, y: 5 }, // Return to door (outside)

            // Phase 3: Go In
            { type: "WAIT", ms: 500 },
            { type: "OPEN_DOOR", x: 8, y: 4 }, // Open
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 8, y: 3 }, // Walk through to inside
            { type: "CLOSE_DOOR", x: 8, y: 4 }, // Lock behind

            // Phase 4: Reset
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 8, y: 3 }, // Stay inside near door
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
