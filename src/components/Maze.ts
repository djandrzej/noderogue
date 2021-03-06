import { isObject, random } from 'lodash';
import MazeTile from './MazeTile';

export interface MazeOptions {
  width?: number;
  height?: number;
  maxRoomSize?: number;
}

export default class Maze {
  public width: number;
  public height: number;
  public maxRoomSize: number;
  public tiles: MazeTile[][];
  constructor(opts: MazeOptions = {}) {
    const defaultOptions = {
      width: 60,
      height: 60,
      maxRoomSize: 6,
    };
    const options = {
      ...defaultOptions,
      ...opts,
    };

    this.width = options.width;
    this.height = options.height;
    this.maxRoomSize = options.maxRoomSize;
    this.tiles = [];

    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.tiles[x][y] = new MazeTile(x, y);
      }
    }
  }

  generate(): void {
    const connections = {
      idxA: new Set<number>(),
      idxB: new Set<number>(),
    };

    function areConnected(idxA: number, idxB: number): boolean {
      if (!isObject(connections.idxA) || !isObject(connections.idxB)) {
        return false;
      }
      return connections.idxA.has(idxB) && connections.idxB.has(idxA);
    }

    function connect(idxA: number, idxB: number): void {
      if (typeof connections.idxA !== 'object') {
        connections.idxA = new Set();
      }
      if (typeof connections.idxB !== 'object') {
        connections.idxB = new Set();
      }
      if (!connections.idxA.has(idxB)) {
        connections.idxA.add(idxB);
      }
      if (!connections.idxB.has(idxA)) {
        connections.idxB.add(idxA);
      }
    }

    const sets = new Map();
    let x;
    let y;
    const edges = [];
    let setId = 0;

    for (x = 0; x < this.width; x++) {
      for (y = 0; y < this.height; y++) {
        sets.set(setId, new Set().add(this.tiles[x][y]));
        setId++;
        if (!(y + 1 >= this.height)) {
          edges.push([{ x: x, y: y }, { x: x, y: y + 1 }, 'v']);
        }
        if (!(x + 1 >= this.width)) {
          edges.push([{ x: x, y: y }, { x: x + 1, y: y }, 'h']);
        }
      }
    }

    edges.sort(() => 0.5 - Math.random());

    let firstTileSet;
    let secondTileSet;
    let firstTileSetIndex;
    let secondTileSetIndex;
    let currentEdge;
    let firstTile;
    let secondTile;
    let orientation;
    let currentSet;

    for (let i = 0, len1 = edges.length; i < len1; i++) {
      currentEdge = edges[i];
      firstTile = this.tiles[currentEdge[0].x][currentEdge[0].y];
      secondTile = this.tiles[currentEdge[1].x][currentEdge[1].y];
      orientation = currentEdge[2];
      // eslint-disable-next-line no-loop-func
      sets.forEach((value, key) => {
        currentSet = value;
        if (currentSet.has(firstTile)) {
          firstTileSet = currentSet;
          firstTileSetIndex = key;
        }
        if (currentSet.has(secondTile)) {
          secondTileSet = currentSet;
          secondTileSetIndex = key;
        }
      });

      if (firstTileSet.has(firstTile) && firstTileSet.has(secondTile)) {
        // tiles are in the same set
      } else if (firstTileSet.size + secondTileSet.size > this.maxRoomSize) {
        if (areConnected(firstTileSetIndex, secondTileSetIndex)) {
          if (random(1, 100) > 95) {
            if (orientation === 'h') {
              firstTile.hasSecretDoorEast = true;
              secondTile.hasSecretDoorWest = true;
            } else if (orientation === 'v') {
              firstTile.hasSecretDoorSouth = true;
              secondTile.hasSecretDoorNorth = true;
            }
          }
        } else {
          connect(firstTileSetIndex, secondTileSetIndex);
          if (orientation === 'h') {
            firstTile.hasDoorEast = true;
            secondTile.hasDoorWest = true;
          } else if (orientation === 'v') {
            firstTile.hasDoorSouth = true;
            secondTile.hasDoorNorth = true;
          }
        }
      } else {
        secondTileSet.delete(secondTile);
        firstTileSet.add(secondTile);
        if (orientation === 'h') {
          firstTile.hasWallEast = false;
          secondTile.hasWallWest = false;
        } else if (orientation === 'v') {
          firstTile.hasWallSouth = false;
          secondTile.hasWallNorth = false;
        }
        sets.set(firstTileSetIndex, new Set([...firstTileSet, ...secondTileSet]));
        sets.delete(secondTileSetIndex);
      }
    }
    sets.forEach((set, idx) => {
      set.forEach((tile) => {
        tile.roomId = idx;
      });
    });
  }
}
