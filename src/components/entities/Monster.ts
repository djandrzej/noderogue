import { random } from 'lodash';
import { Entity } from './Entity';

export default class Monster extends Entity {
  public hp: number;
  public charCode: number;
  public charCodeHit: number;
  public type: string;
  public hit: boolean;
  public isBeingHit: boolean;
  constructor(x: number, y: number) {
    super();
    this.position = {
      x: x || 0,
      y: y || 0,
    };
    this.hp = 3;
    this.charCode = 6;
    this.charCodeHit = 7;
    this.type = 'slow';
    this.hit = false;

    const randomNumber = random(1, 10);
    if (randomNumber > 7) {
      this.type = 'medium';
      this.hp = 4;
      if (randomNumber > 9) {
        this.type = 'fast';
        this.hp = 5;
      }
    }
  }

  getChar(): number {
    return this.hit ? this.charCodeHit : this.charCode;
  }

  getHit(): void {
    this.hit = true;
    if (!this.isBeingHit) {
      this.isBeingHit = true;
      setTimeout(() => {
        this.isBeingHit = false;
        this.hit = false;
      }, 100);
    }
  }
}
