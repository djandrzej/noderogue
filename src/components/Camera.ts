import Boundary from './Boundary';
import GameMap from './GameMap';
import { Entity, Position } from './entities/Entity';
import Renderer from './Renderer';

export default class Camera {
  public map: GameMap;
  public position: Position;
  public followedObject: Entity;
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

  follow(object: Entity): void {
    this.followedObject = object;
  }

  update(renderer: Renderer): void {
    if (this.followedObject !== null) {
      this.position.x = this.followedObject.position.x - renderer.viewportWidthFactor;
      this.position.y = this.followedObject.position.y - renderer.viewportHeightFactor;
    }
  }
}
