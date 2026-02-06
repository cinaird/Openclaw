export function createWorldContext(scene) {
    return {
        scene,
        add: scene.add,
        cameras: scene.cameras,
        physics: scene.physics,
        input: scene.input
    };
}
