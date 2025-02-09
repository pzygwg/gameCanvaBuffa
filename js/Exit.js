import ObjectGraphique from "./ObjectGraphique.js";

export default class Exit extends ObjectGraphique {
  constructor(x, y, size) {
    super(x, y, size, size);
    this.size = size;
    if (!Exit.goldBlockImage) {
      Exit.goldBlockImage = new Image();
      Exit.goldBlockImage.src = "/assets/gold.png";
    }
  }

  draw(ctx) {
    ctx.save();
    if (Exit.goldBlockImage.complete) {
      ctx.drawImage(Exit.goldBlockImage, this.x, this.y, this.size, this.size);
    } else {
      // Si l'image n'est pas encore chargée, dessinez un carré doré par défaut
      ctx.fillStyle = "gold";
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    ctx.restore();
  }
}
