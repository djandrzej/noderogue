import {random} from 'lodash';

export default class Room {

    constructor(x, y, w, h) {
        this.x1 = x;
        this.x2 = w + x;
        this.y1 = y;
        this.y2 = y + h;
        this.w = w;
        this.h = h;
        this.layout = [];
    }

    initialize() {
        for (let x = 0; x < this.w; x++) {
            this.layout[x] = [];
            for (let y = 0; y < this.h; y++) {
                if (y == 0 || y == this.h - 1 || x == 0 || x == this.w - 1) {
                    this.layout[x][y] = 1;
                } else {
                    this.layout[x][y] = 2;
                }
            }
        }
    }

    intersectsWith(rooms) {
        for (let i = 0; i < rooms.length; i++) {
            if (this.x1 <= rooms[i].x2 && this.x2 >= rooms[i].x1 && this.y1 <= rooms[i].y2 && this.y2 >= rooms[i].y1) {
                return true;
            }
        }
        return false;
    }

    generateExit(map) {
        switch (random(1, 4)) {
            case (1):
                this.layout[random(1, this.w - 2)][1] = 3;
                break;
            case (2):
                this.layout[this.w - 2][random(1, this.h - 2)] = 3;
                break;
            case (3):
                this.layout[random(1, this.w - 2)][this.h - 2] = 3;
                break;
            case (4):
                this.layout[1][random(1, this.h - 2)] = 3;
                break;
        }
    }

}
