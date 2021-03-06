import log from '../../utils/log';
import chalk from 'chalk';
import GameMap from '../GameMap';
import { Entity } from './Entity';

export default class Player extends Entity {
  public roomsIn: number[];
  public roomsDiscovered: number[];
  private direction: string;
  private char: string;
  private hp: number;
  private charColorCode: number;
  private hit: boolean;
  constructor() {
    super();
    this.position = {
      x: 0,
      y: 0,
    };
    this.roomsIn = [];
    this.roomsDiscovered = [];
    this.direction = 'up';
    this.char = 'X';
    this.hp = 10;
    this.hit = false;
    this.charColorCode = 160;
  }

  getHit(): void {
    if (!this.hit) {
      this.hp -= 1;
      this.hit = true;
      setTimeout(() => {
        this.hit = false;
      }, 200);
    }
  }

  getChar(): string {
    switch (this.direction) {
      case 'up':
        this.char = '↑';
        break;
      case 'down':
        this.char = '↓';
        break;
      case 'left':
        this.char = '←';
        break;
      case 'right':
        this.char = '→';
        break;
      default:
        log(`Error occurred. Player is facing unknown direction: ${this.direction}`);
        return 'X';
    }
    if (this.charColorCode === 166) {
      this.charColorCode = 160;
    }
    return this.hit ? chalk.redBright(this.char) : chalk.green(this.char);
  }

  moveForward(map: GameMap): void {
    let isMonsterHere = false;
    switch (this.direction) {
      case 'up':
        isMonsterHere =
          map.monsters.filter((val) => val.position.x === this.position.x && val.position.y === this.position.y - 1)
            .length > 0;
        if (map.tiles[this.position.x][this.position.y - 1].isPassable && !isMonsterHere) {
          this.position.y -= 1;
        }
        break;
      case 'down':
        isMonsterHere =
          map.monsters.filter((val) => val.position.x === this.position.x && val.position.y === this.position.x + 1)
            .length > 0;
        if (map.tiles[this.position.x][this.position.y + 1].isPassable && !isMonsterHere) {
          this.position.y += 1;
        }
        break;
      case 'left':
        isMonsterHere =
          map.monsters.filter((val) => val.position.x === this.position.x - 1 && val.position.y === this.position.y)
            .length > 0;
        if (map.tiles[this.position.x - 1][this.position.y].isPassable && !isMonsterHere) {
          this.position.x -= 1;
        }
        break;
      case 'right':
        isMonsterHere =
          map.monsters.filter((val) => val.position.x === this.position.x + 1 && val.position.y === this.position.y)
            .length > 0;
        if (map.tiles[this.position.x + 1][this.position.y].isPassable && !isMonsterHere) {
          this.position.x += 1;
        }
        break;
    }
    const { roomIds } = map.tiles[this.position.x][this.position.y];
    this.roomsIn = roomIds;
    for (let i = 0, len = roomIds.length; i < len; i++) {
      const roomId = roomIds[i];
      if (this.roomsDiscovered.indexOf(roomId) === -1) {
        this.roomsDiscovered.push(roomId);
      }
    }
  }

  turnLeft(): void {
    switch (this.direction) {
      case 'up':
        this.direction = 'left';
        break;
      case 'down':
        this.direction = 'right';
        break;
      case 'left':
        this.direction = 'down';
        break;
      case 'right':
        this.direction = 'up';
        break;
    }
  }

  turnRight(): void {
    switch (this.direction) {
      case 'up':
        this.direction = 'right';
        break;
      case 'down':
        this.direction = 'left';
        break;
      case 'left':
        this.direction = 'up';
        break;
      case 'right':
        this.direction = 'down';
        break;
    }
  }

  turnAround(): void {
    switch (this.direction) {
      case 'up':
        this.direction = 'down';
        break;
      case 'down':
        this.direction = 'up';
        break;
      case 'left':
        this.direction = 'right';
        break;
      case 'right':
        this.direction = 'left';
        break;
    }
  }

  handleInput(key: { name: string }, map: GameMap): void {
    log(`Player input: ${JSON.stringify(key)}`);
    if (key?.name) {
      switch (key.name) {
        case 'up':
          this.moveForward(map);
          break;
        case 'down':
          this.turnAround();
          break;
        case 'left':
          this.turnLeft();
          break;
        case 'right':
          this.turnRight();
          break;
        case 'space':
          this.action(map);
          break;
      }
    }
  }

  action(map: GameMap): void {
    let tile;

    switch (this.direction) {
      case 'up':
        tile = map.tiles[this.position.x][this.position.y - 1];
        break;
      case 'down':
        tile = map.tiles[this.position.x][this.position.y + 1];
        break;
      case 'left':
        tile = map.tiles[this.position.x - 1][this.position.y];
        break;
      case 'right':
        tile = map.tiles[this.position.x + 1][this.position.y];
        break;
    }

    const isMonsterHere = map.monsters.filter((val) => val.position.x === tile.x && val.position.y === tile.y);
    if (isMonsterHere.length > 0) {
      for (let i = 0, len = map.monsters.length; i < len; i++) {
        const monster = map.monsters[i];
        if (monster.position.x === tile.x && monster.position.y === tile.y) {
          monster.hp -= 1;
          monster.getHit();
          if (monster.hp <= 0) {
            map.monsters.splice(i, 1);
          }
          break;
        }
      }
    } else if (tile.isDoor) {
      if (tile.isClosedDoor) {
        tile.charCode = 5;
        tile.isPassable = true;
        tile.isClosedDoor = false;
      } else {
        tile.charCode = 3;
        tile.isPassable = false;
        tile.isClosedDoor = true;
      }
    }
  }
}
