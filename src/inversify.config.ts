import { Container } from 'inversify';
import GameManager from './components/GameManager';

const container = new Container();

container.bind<GameManager>(GameManager).toSelf();

export default container;
