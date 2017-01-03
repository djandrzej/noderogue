import GameMap from './GameMap';
import Player from './Player';
import Renderer from './Renderer';
import Camera from './Camera';
import Maze from './Maze';
import gameloop from 'node-gameloop';

export default (function game() {
    let player;
    let map;
    let camera;
    let renderer;
    return {
        start: function initializeMap() {
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
            renderer = new Renderer();
            camera.update(renderer);
            renderer.draw(camera, player);
            renderer.onKey(player, map, camera, renderer);
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
                renderer.draw(camera, player);
            }, 1000 / 100);
        }
    };
}());
