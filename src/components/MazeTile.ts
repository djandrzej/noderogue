export default class MazeTile {
  public x: number;
  public y: number;
  public roomId: number = null;
  public hasWallNorth = true;
  public hasWallSouth = true;
  public hasWallEast = true;
  public hasWallWest = true;
  public hasDoorNorth = false;
  public hasDoorSouth = false;
  public hasDoorEast = false;
  public hasDoorWest = false;
  public hasSecretDoorNorth = false;
  public hasSecretDoorSouth = false;
  public hasSecretDoorEast = false;
  public hasSecretDoorWest = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
