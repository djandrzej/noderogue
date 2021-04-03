/* eslint-disable @typescript-eslint/no-magic-numbers */
import React from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import gameloop from 'node-gameloop';

import GameMap from './components/GameMap';
import Player from './components/entities/Player';
import Renderer from './components/Renderer';
import Camera from './components/Camera';
import Maze from './components/Maze';
import { updateContent } from './actions';
import content from './reducers/content';
import Window from './containers/Window';

export function run(): void {
  const screen = blessed.screen({
    smartCSR: true,
    useBCE: true,
    focused: true as never,
    cursor: {
      artificial: true,
      shape: 'line',
      blink: false,
      color: null,
    },
  });

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  screen.cursorReset();
  screen.program.hideCursor();

  const store = createStore(content);

  (function game() {
    console.log('Initializing...');
    const maze = new Maze();
    console.log('Generating maze...');
    maze.generate();
    console.log('Creating player...');
    const player = new Player();
    console.log('Drawing map...');
    const map = new GameMap(maze);
    map.drawMaze();
    console.log('Putting player into the game...');
    map.addPlayer(player);
    console.log('Spawning some monsters...');
    map.addMonsters();
    console.log('Initializing camera...');
    const camera = new Camera(map);
    camera.follow(player);
    console.log('Rendering...');
    const renderer = new Renderer(screen.cols, screen.rows);
    screen.on('resize', () => renderer.updateViewport(screen.cols, screen.rows));
    camera.update(renderer);
    renderer.draw(camera, player);
    renderer.onKey(player, map, screen);
    gameloop.setGameLoop(() => {
      map.moveSlowMonsters(player);
    }, 1000);
    gameloop.setGameLoop(() => {
      map.moveMediumMonsters(player);
    }, 1000 / 2);
    gameloop.setGameLoop(() => {
      map.moveFastMonsters(player);
    }, 1000 / 3);
    gameloop.setGameLoop(() => {
      camera.update(renderer);
      store.dispatch(updateContent(renderer.draw(camera, player)));
    }, 1000 / 100);
  })();

  render(
    <Provider store={store}>
      <Window />
    </Provider>,
    screen,
  );
}