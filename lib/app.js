import React from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import {updateContent} from './actions';

import content from './reducers/content';

import Window from './containers/Window';

const screen = blessed.screen({
    smartCSR: true,
    useBCE: true,
    focused: true,
    cursor: {
        artificial: true,
        shape: 'line',
        blink: false,
        color: null
    }
});

screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));

screen.cursorReset();
screen.program.hideCursor();

const store = createStore(content);

import GameMap from './components/GameMap';
import Player from './components/Player';
import Renderer from './components/Renderer';
import Camera from './components/Camera';
import Maze from './components/Maze';
import gameloop from 'node-gameloop';

(function game() {
    let player;
    let map;
    let camera;
    let renderer;
    console.log('Initializing...');
    const maze = new Maze();
    console.log('Generating maze...');
    maze.generate();
    console.log('Creating player...');
    player = new Player();
    console.log('Drawing map...');
    map = new GameMap(maze);
    map.drawMaze();
    console.log('Putting player into the game...');
    map.addPlayer(player);
    console.log('Spawning some monsters');
    map.addMonsters();
    console.log('Initializing camera...');
    camera = new Camera(map);
    camera.follow(player);
    console.log('Render...');
    renderer = new Renderer(70, 25);
    camera.update(renderer);
    renderer.draw(camera, player);
    renderer.onKey(player, map, screen);
    const slowSpeed = gameloop.setGameLoop(() => {
        map.moveSlowMonsters(player);
    }, 1000);
    const mediumSpeed = gameloop.setGameLoop(() => {
        map.moveMediumMonsters(player);
    }, 1000 / 2);
    const fastSpeed = gameloop.setGameLoop(() => {
        map.moveFastMonsters(player);
    }, 1000 / 3);
    const id = gameloop.setGameLoop(delta => {
        camera.update(renderer);
        store.dispatch(updateContent(renderer.draw(camera, player)));
    }, 1000 / 100);
}());

render(
    <Provider store={store}>
        <Window />
    </Provider>,
    screen
);
