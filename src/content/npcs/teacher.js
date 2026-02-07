export const teacher = {
    id: "teacher",
    sprite: "player",
    speed: 50,
    tint: 0xff0000,
    spawns: {
        school_yard: { x: 9, y: 14 },
        school_hall: { x: 4, y: 5 }
    },
    scripts: {
        school_yard: [
            { type: "WAIT", ms: 2000 },
            { type: "WALK_TO", x: 9, y: 8 },
            { type: "WAIT", ms: 500 },
            { type: "OPEN_DOOR", x: 9, y: 6 },
            { type: "OPEN_DOOR", x: 10, y: 6 },
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 9, y: 4 },
            { type: "WAIT", ms: 3000 },
            { type: "CLOSE_DOOR", x: 9, y: 6 },
            { type: "CLOSE_DOOR", x: 10, y: 6 },
            { type: "WAIT", ms: 500 },
            { type: "WALK_TO", x: 8, y: 5 },
            { type: "OPEN_DOOR", x: 8, y: 4 },
            { type: "WALK_TO", x: 8, y: 4 },
            { type: "WAIT", ms: 5000 }
        ],
        school_hall: [
            { type: "WAIT", ms: 1000 },
            { type: "WALK_TO", x: 6, y: 5 },
            { type: "WAIT", ms: 1200 },
            { type: "WALK_TO", x: 12, y: 5 },
            { type: "WAIT", ms: 1000 },
            { type: "WALK_TO", x: 6, y: 5 }
        ]
    },
    defaultScript: [
        { type: "WAIT", ms: 1000 }
    ]
};
