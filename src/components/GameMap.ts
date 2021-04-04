import { random } from 'lodash';

import Tile from './Tile';
import Monster from './entities/Monster';
import Player from './entities/Player';
import Maze from './Maze';

export default class GameMap {
  public tilesX: number;
  public tilesY: number;
  public border: number;
  public tileWidth: number;
  public maze: Maze;
  public tileHeight: number;
  public wallSize: number;
  public tiles: Tile[][];
  public players: Player[];
  public startingMonsters: number;
  public monsters: Monster[];

  constructor(maze: Maze) {
    this.tilesX = 1000;
    this.tilesY = 1000;
    this.border = 3;
    this.tileWidth = 7;
    this.tileHeight = 3;
    this.wallSize = 1;
    this.tiles = [];
    this.players = [];
    this.startingMonsters = 1000;
    this.monsters = [];
    this.maze = maze;
  }

  initialize(): void {
    for (let x = 0; x < this.tilesX; x += 1) {
      this.tiles[x] = [];
      for (let y = 0; y < this.tilesY; y += 1) {
        this.tiles[x][y] = new Tile();
        this.tiles[x][y].x = x;
        this.tiles[x][y].y = y;
      }
    }
  }

  addPlayer(player: Player): void {
    let randomX;
    let randomY;
    let randomPosition;
    do {
      randomX = random(this.border, this.tilesX - this.border);
      randomY = random(this.border, this.tilesY - this.border);
      randomPosition = this.tiles[randomX][randomY];
    } while (!randomPosition.isPassable);
    player.position.x = randomX;
    player.position.y = randomY;
    randomPosition.roomIds.forEach((roomId) => {
      player.roomsIn.push(roomId);
      player.roomsDiscovered.push(roomId);
    });
    this.players.push(player);
  }

  addMonsters(): void {
    for (let it = 0; it < this.startingMonsters; it += 1) {
      let randomX;
      let randomY;
      let randomPosition;
      do {
        randomX = random(this.border, this.tilesX - this.border);
        randomY = random(this.border, this.tilesY - this.border);
        randomPosition = this.tiles[randomX][randomY];
      } while (!randomPosition.isPassable);
      const monster = new Monster(randomX, randomY);
      this.monsters.push(monster);
    }
  }

  drawTile(tileX: number, tileY: number): void {
    const mazeTile = this.maze.tiles[tileX][tileY];
    const xFrom = tileX * (this.tileWidth + this.wallSize) + this.border;
    const xTo = tileX * (this.tileWidth + this.wallSize) + this.border + this.tileWidth + this.wallSize;
    const yFrom = tileY * (this.tileHeight + this.wallSize) + this.border;
    const yTo = tileY * (this.tileHeight + this.wallSize) + this.border + this.tileHeight + this.wallSize;
    for (let x = xFrom; x <= xTo; x += 1) {
      for (let y = yFrom; y <= yTo; y += 1) {
        this.tiles[x][y].roomIds.push(mazeTile.roomId);
        if (this.tiles[x][y].charCode !== 1) {
          this.tiles[x][y].charCode = 2;
          this.tiles[x][y].isPassable = true;
        }
      }
    }
    if (mazeTile.hasWallNorth) {
      for (let x = xFrom; x <= xTo; x += 1) {
        this.tiles[x][yFrom].charCode = 1;
        this.tiles[x][yFrom].isPassable = false;
      }
    }
    if (mazeTile.hasWallSouth) {
      for (let x = xFrom; x <= xTo; x += 1) {
        this.tiles[x][yTo].charCode = 1;
        this.tiles[x][yTo].isPassable = false;
      }
    }
    if (mazeTile.hasWallEast) {
      for (let y = yFrom; y <= yTo; y += 1) {
        this.tiles[xTo][y].charCode = 1;
        this.tiles[xTo][y].isPassable = false;
      }
    }
    if (mazeTile.hasWallWest) {
      for (let y = yFrom; y <= yTo; y += 1) {
        this.tiles[xFrom][y].charCode = 1;
        this.tiles[xFrom][y].isPassable = false;
      }
    }
    let doorPosition;
    if (mazeTile.hasDoorNorth) {
      doorPosition = xFrom + Math.round((xTo - xFrom) / 2);
      for (let x = xFrom; x <= xTo; x += 1) {
        if (x === doorPosition) {
          this.tiles[x][yFrom].charCode = 3;
          this.tiles[x][yFrom].isPassable = false;
          this.tiles[x][yFrom].isDoor = true;
          this.tiles[x][yFrom].isClosedDoor = true;
        } else {
          this.tiles[x][yFrom].charCode = 1;
          this.tiles[x][yFrom].isPassable = false;
        }
      }
    }
    if (mazeTile.hasDoorSouth) {
      doorPosition = xFrom + Math.round((xTo - xFrom) / 2);
      for (let x = xFrom; x <= xTo; x += 1) {
        if (x === doorPosition) {
          this.tiles[x][yTo].charCode = 3;
          this.tiles[x][yTo].isPassable = false;
          this.tiles[x][yTo].isDoor = true;
          this.tiles[x][yTo].isClosedDoor = true;
        } else {
          this.tiles[x][yTo].charCode = 1;
          this.tiles[x][yTo].isPassable = false;
        }
      }
    }
    if (mazeTile.hasDoorEast) {
      doorPosition = yFrom + Math.round((yTo - yFrom) / 2);
      for (let y = yFrom; y <= yTo; y += 1) {
        if (y === doorPosition) {
          this.tiles[xTo][y].charCode = 3;
          this.tiles[xTo][y].isPassable = false;
          this.tiles[xTo][y].isDoor = true;
          this.tiles[xTo][y].isClosedDoor = true;
        } else {
          this.tiles[xTo][y].charCode = 1;
          this.tiles[xTo][y].isPassable = false;
        }
      }
    }
    if (mazeTile.hasDoorWest) {
      doorPosition = yFrom + Math.round((yTo - yFrom) / 2);
      for (let y = yFrom; y <= yTo; y += 1) {
        if (y === doorPosition) {
          this.tiles[xFrom][y].charCode = 3;
          this.tiles[xFrom][y].isPassable = false;
          this.tiles[xFrom][y].isDoor = true;
          this.tiles[xFrom][y].isClosedDoor = true;
        } else {
          this.tiles[xFrom][y].charCode = 1;
          this.tiles[xFrom][y].isPassable = false;
        }
      }
    }
    if (mazeTile.hasSecretDoorNorth) {
      doorPosition = xFrom + Math.round((xTo - xFrom) / 2);
      for (let x = xFrom; x <= xTo; x += 1) {
        if (x === doorPosition) {
          this.tiles[x][yFrom].charCode = 4;
          this.tiles[x][yFrom].isPassable = true;
        } else {
          this.tiles[x][yFrom].charCode = 1;
          this.tiles[x][yFrom].isPassable = false;
        }
      }
    }
    if (mazeTile.hasSecretDoorSouth) {
      doorPosition = xFrom + Math.round((xTo - xFrom) / 2);
      for (let x = xFrom; x <= xTo; x += 1) {
        if (x === doorPosition) {
          this.tiles[x][yTo].charCode = 4;
          this.tiles[x][yTo].isPassable = true;
        } else {
          this.tiles[x][yTo].charCode = 1;
          this.tiles[x][yTo].isPassable = false;
        }
      }
    }
    if (mazeTile.hasSecretDoorEast) {
      doorPosition = yFrom + Math.round((yTo - yFrom) / 2);
      for (let y = yFrom; y <= yTo; y += 1) {
        if (y === doorPosition) {
          this.tiles[xTo][y].charCode = 4;
          this.tiles[xTo][y].isPassable = true;
        } else {
          this.tiles[xTo][y].charCode = 1;
          this.tiles[xTo][y].isPassable = false;
        }
      }
    }
    if (mazeTile.hasSecretDoorWest) {
      doorPosition = yFrom + Math.round((yTo - yFrom) / 2);
      for (let y = yFrom; y <= yTo; y += 1) {
        if (y === doorPosition) {
          this.tiles[xFrom][y].charCode = 4;
          this.tiles[xFrom][y].isPassable = true;
        } else {
          this.tiles[xFrom][y].charCode = 1;
          this.tiles[xFrom][y].isPassable = false;
        }
      }
    }
  }

  drawMaze(): void {
    const { maze } = this;

    this.tilesX = maze.width * (this.tileWidth + this.wallSize) + 2 * this.border;
    this.tilesY = maze.height * (this.tileHeight + this.wallSize) + 2 * this.border;

    this.initialize();

    for (let x = 0; x < maze.width; x += 1) {
      for (let y = 0; y < maze.height; y += 1) {
        this.drawTile(x, y);
      }
    }
  }

  moveMonster(monsterIdx: number, player: Player): void {
    let tile;
    const monster = this.monsters[monsterIdx];
    let monsterDirection;
    let isMonsterHere;
    if (player.position.x > monster.position.x) {
      if (player.position.y > monster.position.y) {
        monsterDirection = 'se';
      } else if (player.position.y < monster.position.y) {
        monsterDirection = 'ne';
      } else {
        monsterDirection = 'e';
      }
    } else if (player.position.x < monster.position.x) {
      if (player.position.y > monster.position.y) {
        monsterDirection = 'sw';
      } else if (player.position.y < monster.position.y) {
        monsterDirection = 'nw';
      } else {
        monsterDirection = 'w';
      }
    } else if (player.position.y > monster.position.y) {
      monsterDirection = 's';
    } else if (player.position.y < monster.position.y) {
      monsterDirection = 'n';
    } else {
      // monster here!
    }

    let tileX = monster.position.x;
    let tileY = monster.position.y;

    switch (monsterDirection) {
      case 'n':
        tileY -= 1;
        break;
      case 's':
        tileY += 1;
        break;
      case 'e':
        tileX += 1;
        break;
      case 'w':
        tileX -= 1;
        break;
      case 'ne':
        tileX += 1;
        tileY -= 1;
        break;
      case 'se':
        tileX += 1;
        tileY += 1;
        break;
      case 'nw':
        tileX -= 1;
        tileY -= 1;
        break;
      case 'sw':
        tileX -= 1;
        tileY += 1;
        break;
    }

    if (player.position.x === tileX && player.position.y === tileY) {
      player.getHit();
    } else {
      isMonsterHere = this.monsters.filter((val) => val.position.x === tileX && val.position.y === tileY).length > 0;
      if (this.tiles[tileX][tileY].isPassable && !isMonsterHere) {
        monster.position.x = tileX;
        monster.position.y = tileY;
      } else {
        do {
          tileX = monster.position.x;
          tileY = monster.position.y;

          switch (random(1, 8)) {
            case 1:
              tileY -= 1;
              break;
            case 2:
              tileY += 1;
              break;
            case 3:
              tileX += 1;
              break;
            case 4:
              tileX -= 1;
              break;
            case 5:
              tileX += 1;
              tileY -= 1;
              break;
            case 6:
              tileX += 1;
              tileY -= 1;
              break;
            case 7:
              tileX -= 1;
              tileY -= 1;
              break;
            case 8:
              tileX -= 1;
              tileY += 1;
              break;
          }
          tile = this.tiles[tileX][tileY];
        } while (!tile.isPassable);
        if (player.position.x === tileX && player.position.y === tileY) {
          player.getHit();
        } else {
          isMonsterHere =
            this.monsters.filter((val) => val.position.x === tileX && val.position.y === tileY).length > 0;
          if (!isMonsterHere) {
            monster.position.x = tileX;
            monster.position.y = tileY;
          }
        }
      }
    }
  }

  moveSlowMonsters(player: Player): void {
    for (let i = 0, len = this.monsters.length; i < len; i += 1) {
      const monster = this.monsters[i];
      if (monster.type === 'slow') {
        this.moveMonster(i, player);
      }
    }
  }

  moveMediumMonsters(player: Player): void {
    for (let i = 0, len = this.monsters.length; i < len; i += 1) {
      const monster = this.monsters[i];
      if (monster.type === 'medium') {
        this.moveMonster(i, player);
      }
    }
  }

  moveFastMonsters(player: Player): void {
    for (let i = 0, len = this.monsters.length; i < len; i += 1) {
      const monster = this.monsters[i];
      if (monster.type === 'fast') {
        this.moveMonster(i, player);
      }
    }
  }
}
