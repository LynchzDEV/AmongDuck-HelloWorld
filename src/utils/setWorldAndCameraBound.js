export function setWorldBoundsAndCamera(mapHeight, mapWidth, camera) {
    //setting world bounds
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    //set collision L, R, T, B
    this.physics.world.setBoundsCollision(true, true, true, true);

    //setting camera
    camera = this.cameras.main;
    camera.setBounds(0, 0, mapWidth, mapHeight);

    return camera; //return camera for other scene to use
}