import container from './inversify.config';
import GameManager from './components/GameManager';

export function run(): void {
  container.get(GameManager).startGame();
}
