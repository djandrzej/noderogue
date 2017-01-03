export default class MazeTile {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.roomId = null;
        this.hasWallNorth = true;
        this.hasWallSouth = true;
        this.hasWallEast = true;
        this.hasWallWest = true;
        this.hasDoorNorth = false;
        this.hasDoorSouth = false;
        this.hasDoorEast = false;
        this.hasDoorWest = false;
    }

}
