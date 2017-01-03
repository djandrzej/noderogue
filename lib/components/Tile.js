export default class Tile {

    constructor(charCode, isPassable) {
        this.x = 0;
        this.y = 0;
        this.roomIds = [];
        this.charCode = charCode || 0;
        this.isPassable = isPassable || false;
        this.isDoor = false;
        this.isClosedDoor = false;
    }

}
