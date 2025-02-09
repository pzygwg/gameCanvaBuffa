import ObjectGraphique from "./ObjectGraphique.js";

export default class Spawner extends ObjectGraphique {
  static texture = null;

  constructor(x, y, size = 50) {
    super(x, y, size, size);
    if (!Spawner.texture) {
      Spawner.texture = new Image();
      Spawner.texture.src = "/assets/spawner.png";
    }
  }

  draw(ctx) {
    ctx.save();
    if (Spawner.texture.complete) {
      ctx.drawImage(Spawner.texture, this.x, this.y, this.w, this.h);
    } else {
      // Cas de fallback si l'image n'est pas encore chargée
      ctx.fillStyle = "darkgray";
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    ctx.restore();
  }
} 