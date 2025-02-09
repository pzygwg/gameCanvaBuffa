import ObjectGraphique from "./ObjectGraphique.js";

export default class Obstacle extends ObjectGraphique {
  // Static properties for our texture and pattern.
  static texture = null;
  static pattern = null;

  constructor(x, y, w, h) {
    // We don't need to pass a color anymore.
    super(x, y, w, h);
    if (!Obstacle.texture) {
      Obstacle.texture = new Image();
      Obstacle.texture.src = "/assets/lava.gif";
      // (We don't create the pattern here because we need a canvas context)
    }
  }

  draw(ctx) {
    ctx.save();
    // When the texture is loaded, create a pattern (only once)
    if (Obstacle.texture.complete && !Obstacle.pattern) {
      Obstacle.pattern = ctx.createPattern(Obstacle.texture, "repeat");
    }
    // Use the pattern if available, else fall back to a solid color
    ctx.fillStyle = Obstacle.pattern || "red";  // Changed fallback color to red for lava
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }
}
