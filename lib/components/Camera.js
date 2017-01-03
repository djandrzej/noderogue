import Boundary from './Boundary';

export default class Camera {

    constructor(map) {
        this.map = map;
        this.position = {
            x: 0,
            y: 0
        };

        this.followedObject = null;
        this.mapBoundary = new Boundary(
            0,
            0,
            map.tilesX,
            map.tilesY
        );
    }

    follow(object) {
        this.followedObject = object;
    }

    update(renderer) {
        if (this.followedObject !== null) {
            this.position.x = this.followedObject.position.x - renderer.viewportWidthFactor;
            this.position.y = this.followedObject.position.y - renderer.viewportHeightFactor;
        }
    }

}
