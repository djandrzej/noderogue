import blessed from 'blessed';
import {uniq} from 'lodash';
import chalk from 'chalk';
import crayon from 'chalk256';
import log from '../utils/log';

for (let i = 0; i < 256; i++) {
    crayon(i).log(`THE COLOR: ${i}`);
}

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

const background = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
        bg: 'black'
    }
});

const box = blessed.box({
    top: 1,
    left: 1,
    width: '100%-1',
    height: '100%-1',
    style: {
        bg: 'black'
    }
});

const coords = blessed.text({
    top: 1,
    left: 1,
    style: {
        fg: 'black',
        bg: 'white'
    }
});

const messageBox = blessed.text({
    right: 1,
    bottom: 1,
    style: {
        fg: 'black',
        bg: 'white'
    }
});

screen.cursorReset();
screen.program.hideCursor();

screen.append(background);
screen.render();

screen.append(box);
screen.append(coords);
screen.append(messageBox);

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    console.log('Exiting...');
    return process.exit(0);
});

export default class Renderer {

    constructor() {
        this.frame = 0;
        this.viewportWidth = box.width - 1;
        this.viewportHeight = box.height - 1;
        this.viewportWidthFactor = Math.floor(this.viewportWidth / 2);
        this.viewportHeightFactor = Math.floor(this.viewportHeight / 2);
    }

    onKey(player, map, camera, renderer) {
        screen.key(['up', 'down', 'right', 'left', 'space'], (ch, key) => {
            player.handleInput(key, map);
            messageBox.setContent(`You pressed ${key.name}`);
        });
    }

    draw(cam, player) {
        const pcords = {
            x: 0,
            y: 0
        };
        const camera = cam;
        let buffer = '';
        const players = camera.map.players;
        const monsters = camera.map.monsters;
        const playerAt = [];
        const monsterAt = [];
        try {
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
            const wall = crayon.red('#');
            const wallDiscovered = crayon[235]('#');
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
                            case (0):
                                tile = ' ';
                                break;
                            case (1):
                                if (tileVisible) {
                                    tile = wall;
                                } else if (tileDiscovered) {
                                    tile = wallDiscovered;
                                } else {
                                    tile = ' ';
                                }
                                break;
                            case (2):
                                if (tileVisible) {
                                    tile = crayon.brown('.');
                                } else if (tileDiscovered) {
                                    // tile = ' ';
                                    tile = crayon[235]('.');
                                } else {
                                    tile = ' ';
                                }
                                break;
                            case (3):
                                if (tileVisible) {
                                    tile = crayon.brown('D');
                                } else if (tileDiscovered) {
                                    tile = crayon[236]('D');
                                } else {
                                    tile = ' ';
                                }
                                break;
                            case (4):
                                if (tileVisible || tileDiscovered) {
                                    tile = '4';
                                } else {
                                    tile = ' ';
                                }
                                break;
                            case (5):
                                if (tileVisible) {
                                    tile = crayon.brown('\\');
                                } else if (tileDiscovered) {
                                    tile = crayon.darkgray('\\');
                                } else {
                                    tile = ' ';
                                }
                                break;
                            case (6):
                                tile = '6';
                                break;
                            case (7):
                                tile = '7';
                                break;
                            default:
                                tile = '.';
                                break;
                        }
                    }
                    if (monsterAt[currentX] && monsterAt[currentX][currentY] && tileVisible) {
                        tile = crayon.green(monsterAt[currentX][currentY].getChar());
                    }
                    if (playerAt[currentX] && playerAt[currentX][currentY]) {
                        pcords.x = currentX;
                        pcords.y = currentY;
                        tile = playerAt[currentX][currentY].getChar();
                    }
                    buffer += tile;
                }
                buffer += '\n';
            }
            coords.setContent(
                `HP:${player.hp} x:${pcords.x} y:${pcords.y} Current room: ${
                    uniq(camera.map.tiles[pcords.x][pcords.y].roomIds).toString()
                    }`);
            box.setContent(buffer);
            screen.render();
        } catch (e) {
            log('ERROR!!!', true);
            log(e.message, true);
            log(e.stack, true);
        }
    }

}
