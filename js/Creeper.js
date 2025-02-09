// js/Creeper.js
import ObjectGraphique from "./ObjectGraphique.js";
import { rectsOverlap } from "./collisions.js";

export default class Creeper extends ObjectGraphique {
  constructor(x, y, speed) {
    // On définit une taille de 40x40 pour le creeper
    super(x, y, 40, 40);
    this.speed = speed;
    this.angle = 0;
    // Chargement de l'image du creeper (statique pour tous)
    if (!Creeper.image) {
      Creeper.image = new Image();
      Creeper.image.src = "/assets/creeper.png";
    }
  }

  /**
   * La méthode update déplace le creeper vers la cible (Steve) tout en évitant les obstacles.
   * @param {Object} target - L'objet cible possédant x et y (position de Steve).
   * @param {Array} obstacles - Tableau des obstacles.
   */
  update(target, obstacles) {
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      // Vecteur directionnel normalisé
      let vx = dx / dist;
      let vy = dy / dist;
      // Prévoir la position après déplacement
      let nextX = this.x + vx * this.speed;
      let nextY = this.y + vy * this.speed;
      let collision = false;
      for (let obs of obstacles) {
        if (rectsOverlap(nextX - this.w/2, nextY - this.h/2, this.w, this.h, obs.x, obs.y, obs.w, obs.h)) {
          collision = true;
          break;
        }
      }
      if (collision) {
        // Si la trajectoire est bloquée, on essaie de tourner de 30° à gauche
        const angleOffset = Math.PI / 6; // 30°
        let cos = Math.cos(angleOffset);
        let sin = Math.sin(angleOffset);
        let vxLeft = vx * cos - vy * sin;
        let vyLeft = vx * sin + vy * cos;
        let nextXLeft = this.x + vxLeft * this.speed;
        let nextYLeft = this.y + vyLeft * this.speed;
        let collisionLeft = false;
        for (let obs of obstacles) {
          if (rectsOverlap(nextXLeft - this.w/2, nextYLeft - this.h/2, this.w, this.h, obs.x, obs.y, obs.w, obs.h)) {
            collisionLeft = true;
            break;
          }
        }
        if (!collisionLeft) {
          vx = vxLeft;
          vy = vyLeft;
        } else {
          let vxRight = vx * cos + vy * sin;
          let vyRight = -vx * sin + vy * cos;
          let nextXRight = this.x + vxRight * this.speed;
          let nextYRight = this.y + vyRight * this.speed;
          let collisionRight = false;
          for (let obs of obstacles) {
            if (rectsOverlap(nextXRight - this.w/2, nextYRight - this.h/2, this.w, this.h, obs.x, obs.y, obs.w, obs.h)) {
              collisionRight = true;
              break;
            }
          }
          if (!collisionRight) {
            vx = vxRight;
            vy = vyRight;
          } else {
            // Si les deux directions sont bloquées, on ne bouge pas.
            vx = 0;
            vy = 0;
          }
        }
      }
      // Mise à jour de la position et de l'angle
      this.x += vx * this.speed;
      this.y += vy * this.speed;
      this.angle = Math.atan2(vy, vx);
    }
  }

  draw(ctx) {
    ctx.save();
    if (Creeper.image && Creeper.image.complete) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(Creeper.image, -this.w/2, -this.h/2, this.w, this.h);
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    }
    ctx.restore();
  }
}
