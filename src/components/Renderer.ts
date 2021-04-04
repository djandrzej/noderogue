import chalk from 'chalk';
import Player from './entities/Player';
import Camera from './Camera';

export default class Renderer {
  private frame: number;
  public viewportWidth: number;
  public viewportHeight: number;
  public viewportWidthFactor: number;
  public viewportHeightFactor: number;
  constructor(boxWidth: number, boxHeight: number) {
    this.frame = 0;
    this.updateViewport(boxWidth, boxHeight);
  }

  updateViewport(boxWidth: number, boxHeight: number): void {
    this.viewportWidth = boxWidth;
    this.viewportHeight = boxHeight;
    this.viewportWidthFactor = Math.floor(this.viewportWidth / 2);
    this.viewportHeightFactor = Math.floor(this.viewportHeight / 2);
  }

  draw(camera: Camera, player: Player): string {
    const pcords = {
      x: 0,
      y: 0,
    };
    let buffer = '';
    const { players } = camera.map;
    const { monsters } = camera.map;
    const playerAt = [];
    const monsterAt = [];
    for (const i in players) {
      if (players.hasOwnProperty(i)) {
        const currentPosition = players[i].position;
        playerAt[currentPosition.x] = [];
        playerAt[currentPosition.x][currentPosition.y] = players[i];
      }
    }
    for (const j in monsters) {
      if (monsters.hasOwnProperty(j)) {
        const monsterPosition = monsters[j].position;
        if (!monsterAt[monsterPosition.x]) {
          monsterAt[monsterPosition.x] = [];
        }
        monsterAt[monsterPosition.x][monsterPosition.y] = monsters[j];
      }
    }
    const wall = chalk.redBright('#');
    const wallDiscovered = chalk.gray('#');
    let currentX;
    let currentY;
    for (let y = 0; y < this.viewportHeight; y++) {
      for (let x = 0; x < this.viewportWidth; x++) {
        let tileDiscovered = false;
        let tileVisible = false;
        currentX = x + camera.position.x;
        currentY = y + camera.position.y;

        let tile;
        if (
          currentY <= camera.mapBoundary.top ||
          currentY >= camera.mapBoundary.bottom ||
          currentX >= camera.mapBoundary.right ||
          currentX <= camera.mapBoundary.left
        ) {
          tile = ' ';
        } else {
          const currentTile = camera.map.tiles[currentX][currentY];
          for (let i2 = 0, len = currentTile.roomIds.length; i2 < len; i2++) {
            const roomId = currentTile.roomIds[i2];
            if (player.roomsIn.indexOf(roomId) !== -1) {
              tileVisible = true;
            }
            if (player.roomsDiscovered.indexOf(roomId) !== -1) {
              tileDiscovered = true;
            }
          }
          switch (currentTile.charCode) {
            case 0:
              tile = chalk(' ');
              break;
            case 1:
              if (tileVisible) {
                tile = wall;
              } else if (tileDiscovered) {
                tile = wallDiscovered;
              } else {
                tile = chalk(' ');
              }
              break;
            case 2:
              if (tileVisible) {
                tile = chalk.redBright('.');
              } else if (tileDiscovered) {
                tile = chalk.gray('.');
              } else {
                tile = ' ';
              }
              break;
            case 3:
              if (tileVisible) {
                tile = chalk.yellowBright('+');
              } else if (tileDiscovered) {
                tile = chalk.gray('+');
              } else {
                tile = ' ';
              }
              break;
            case 4:
              if (tileVisible) {
                tile = chalk.red('#');
              } else if (tileDiscovered) {
                tile = chalk.gray('#');
              } else {
                tile = ' ';
              }
              break;
            case 5:
              if (tileVisible) {
                tile = chalk.yellowBright('\\');
              } else if (tileDiscovered) {
                tile = chalk.gray('\\');
              } else {
                tile = ' ';
              }
              break;
            case 6:
              tile = '6';
              break;
            case 7:
              tile = '7';
              break;
            default:
              tile = '.';
              break;
          }
        }
        if (monsterAt[currentX]?.[currentY] && tileVisible) {
          tile = chalk.green(monsterAt[currentX][currentY].getChar());
        }
        if (playerAt[currentX]?.[currentY]) {
          pcords.x = currentX;
          pcords.y = currentY;
          tile = playerAt[currentX][currentY].getChar();
        }
        buffer += tile;
      }
      buffer += '\n';
    }
    return buffer;
  }
}
