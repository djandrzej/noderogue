export default class Tile {
  private roomIds: number[];
  private charCode: number;
  private isPassable: boolean;
  private isDoor: boolean;
  private isClosedDoor: boolean;
  private x: number;
  private y: number;
  constructor(charCode?: number, isPassable?: boolean) {
    this.x = 0;
    this.y = 0;
    this.roomIds = [];
    this.charCode = charCode || 0;
    this.isPassable = isPassable || false;
    this.isDoor = false;
    this.isClosedDoor = false;
  }
}
