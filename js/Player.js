import ObjectGraphique from "./ObjectGraphique.js";

export default class Player extends ObjectGraphique {
  constructor(x, y) {
    // Set width = 50, height = 100 to match our Steve div
    super(x, y, 50, 100);
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
  }

  draw(ctx) {
    // Do nothing—Steve is now represented by the HTML element (#steve)
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    // If moving, update angle based on direction.
    if (this.speedX !== 0 || this.speedY !== 0) {
      this.angle = Math.atan2(this.speedY, this.speedX);
    }
  }
}
