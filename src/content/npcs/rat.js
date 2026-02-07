export const rat = {
    id: "rat",
    sprite: "player",
    speed: 40,
    tint: 0x996633,
    spawns: {
        basement: { x: 10, y: 5 }
    },
    scripts: {
        basement: [
            { type: "WAIT", ms: 1200 },
            { type: "WALK_TO", x: 12, y: 5 },
            { type: "WAIT", ms: 800 },
            { type: "WALK_TO", x: 10, y: 5 }
        ]
    },
    defaultScript: [
        { type: "WAIT", ms: 1500 }
    ]
};
