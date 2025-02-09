export default class ObjectGraphique {
    constructor(x, y, w, h, color) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.color = color || "black";
    }
  
    // Dessine une croix de débogage au centre de l'objet
    draw(ctx) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(this.x - 10, this.y);
      ctx.lineTo(this.x + 10, this.y);

      ctx.moveTo(this.x, this.y - 10);
      ctx.lineTo(this.x, this.y + 10);
      ctx.stroke();
      ctx.restore();
    }
  }
  