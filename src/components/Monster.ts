import { random } from 'lodash';

export default class Monster {
  position: { x: number; y: number };
  private hp: number;
  private charCode: number;
  private charCodeHit: number;
  private type: string;
  private hit: boolean;
  private isBeingHit: boolean;
  constructor(x: number, y: number) {
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
