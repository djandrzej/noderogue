export default class Tile {
  public roomIds: number[] = [];
  public charCode: number;
  public isPassable: boolean;
  public isDoor = false;
  public isClosedDoor = false;
  public x = 0;
  public y = 0;
  constructor(charCode?: number, isPassable?: boolean) {
    this.charCode = charCode || 0;
    this.isPassable = isPassable || false;
  }
}
