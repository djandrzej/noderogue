import Boundary from './Boundary';
import GameMap from './GameMap';

export default class Camera {
  public map: any;
  public position: { x: number; y: number };
  private followedObject: any;
  public mapBoundary: Boundary;

  constructor(map: GameMap) {
    this.map = map;
    this.position = {
      x: 0,
      y: 0,
    };

    this.followedObject = null;
    this.mapBoundary = new Boundary(0, 0, map.tilesX, map.tilesY);
  }

  follow(object: any): void {
    this.followedObject = object;
  }

  update(renderer: any): void {
    if (this.followedObject !== null) {
      this.position.x = this.followedObject.position.x - renderer.viewportWidthFactor;
      this.position.y = this.followedObject.position.y - renderer.viewportHeightFactor;
    }
  }
}
