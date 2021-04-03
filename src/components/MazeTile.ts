export default class MazeTile {
  x;
  y;
  roomId = null;
  hasWallNorth = true;
  hasWallSouth = true;
  hasWallEast = true;
  hasWallWest = true;
  hasDoorNorth = false;
  hasDoorSouth = false;
  hasDoorEast = false;
  hasDoorWest = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
