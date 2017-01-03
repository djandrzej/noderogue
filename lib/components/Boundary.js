export default class Boundary {

    constructor(left, top, width, height) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    set(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width || this.height;
        this.height = height || this.height;
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    isWithin(boundary) {
        return (
            boundary.left <= this.left &&
            boundary.right >= this.right &&
            boundary.top <= this.top &&
            boundary.bottom >= this.bottom
        );
    }

    isOverlapping(boundary) {
        return (
            this.left < boundary.right &&
            boundary.left < this.right &&
            this.top < boundary.bottom &&
            boundary.top < this.bottom
        );
    }

}
