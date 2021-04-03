export default class Boundary {
  public left: number;
  public top: number;
  public width: number;
  public height: number;
  public right: number;
  public bottom: number;

  constructor(left: number, top: number, width: number, height: number) {
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  set(left: number, top: number, width: number, height: number): void {
    this.left = left;
    this.top = top;
    this.width = width || this.height;
    this.height = height || this.height;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  isWithin(boundary: Boundary): boolean {
    return (
      boundary.left <= this.left &&
      boundary.right >= this.right &&
      boundary.top <= this.top &&
      boundary.bottom >= this.bottom
    );
  }

  isOverlapping(boundary: Boundary): boolean {
    return (
      this.left < boundary.right &&
      boundary.left < this.right &&
      this.top < boundary.bottom &&
      boundary.top < this.bottom
    );
  }
}
