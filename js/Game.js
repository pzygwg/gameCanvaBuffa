import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Exit from "./Exit.js";
import Creeper from "./Creeper.js";
import Spawner from "./Spawner.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.inputStates = {
      mouseX: 0,
      mouseY: 0,
      ArrowRight: false,
      ArrowLeft: false,
      ArrowUp: false,
      ArrowDown: false
    };
    this.objects = [];      // Contient les obstacles, la sortie et les spawners
    this.creepers = [];     // Contient les creepers
    this.spawners = [];     // Contient les spawners
    this.level = 1;
  }

  init() {
    // Création de l'objet joueur (logique) en position de départ
    this.player = new Player(30, 30);
    // Création de la sortie (block d'or) en bas à droite (taille 50x50)
    this.exit = new Exit(this.canvas.width - 70, this.canvas.height - 70, 50);
    this.objects.push(this.exit);
    
    // Génération initiale des obstacles et des creepers
    this.spawnObstacles();
    this.spawnCreepers();

    // Mise en place des écouteurs clavier/souris
    initListeners(this.inputStates, this.canvas);

    // Récupération du div Steve pour mise à jour de sa position
    this.steveDiv = document.getElementById("steve");
    this.updateStevePosition();
  }

  /**
   * Calcule la distance du point (px,py) à la droite passant par (x1,y1) et (x2,y2)
   */
  pointLineDistance(px, py, x1, y1, x2, y2) {
    let A = px - x1;
    let B = py - y1;
    let C = x2 - x1;
    let D = y2 - y1;
    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = len_sq !== 0 ? dot / len_sq : -1;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    let dx = px - xx;
    let dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Génère les obstacles en s'assurant qu'ils n'obstruent pas le "couloir" entre départ et sortie.
   */
  spawnObstacles() {
    // On conserve la sortie et on retire les obstacles existants
    this.objects = this.objects.filter(obj => !(obj instanceof Obstacle));
    const numObstacles = this.level + 1;
    // Définition de la zone de départ (80x80 en haut à gauche)
    const startZone = { x: 0, y: 0, w: 80, h: 80 };
    // Pour le couloir, nous définissons la ligne allant de (30,30) à 
    // la position centrale de la sortie.
    const startX = 30, startY = 30;
    const exitCenterX = this.exit.x + this.exit.size / 2;
    const exitCenterY = this.exit.y + this.exit.size / 2;
    const corridorThreshold = 50;  // distance minimale par rapport à la ligne

    for (let i = 0; i < numObstacles; i++) {
      let valid = false;
      let attempts = 0;
      let x, y, w, h;
      while (!valid && attempts < 100) {
        w = 30 + Math.random() * 50;
        h = 30 + Math.random() * 50;
        x = Math.random() * (this.canvas.width - w);
        y = Math.random() * (this.canvas.height - h);
        // Vérification de non chevauchement avec la sortie et la zone de départ
        if (
          !rectsOverlap(x, y, w, h, this.exit.x, this.exit.y, this.exit.size, this.exit.size) &&
          !rectsOverlap(x, y, w, h, startZone.x, startZone.y, startZone.w, startZone.h)
        ) {
          // Vérification du couloir : on calcule la distance du centre de l'obstacle à la droite.
          let obsCenterX = x + w / 2;
          let obsCenterY = y + h / 2;
          let d = this.pointLineDistance(obsCenterX, obsCenterY, startX, startY, exitCenterX, exitCenterY);
          if (d > corridorThreshold) {
            valid = true;
          }
        }
        attempts++;
      }
      if (valid) {
        this.objects.push(new Obstacle(x, y, w, h));
      }
    }
  }

  /**
   * Place les spawners de manière aléatoire et génère les creepers
   */
  spawnCreepers() {
    // Réinitialiser les creepers et spawners existants
    this.creepers = [];
    this.spawners = [];
    this.objects = this.objects.filter(obj => !(obj instanceof Spawner));

    // On place 2 spawners
    for (let i = 0; i < 2; i++) {
      let valid = false;
      let attempts = 0;
      let x, y;
      const startX = 30, startY = 30;
      const exitCenterX = this.exit.x + this.exit.size / 2;
      const exitCenterY = this.exit.y + this.exit.size / 2;
      const corridorThreshold = 80;
      
      while (!valid && attempts < 100) {
        x = Math.random() * (this.canvas.width - 50);  // 50 is spawner size
        y = Math.random() * (this.canvas.height - 50);
        
        // Vérifier la distance par rapport au couloir
        let d = this.pointLineDistance(x + 25, y + 25, startX, startY, exitCenterX, exitCenterY);
        
        // Vérifier qu'il n'y a pas de collision avec d'autres objets
        let hasCollision = false;
        for (let obj of this.objects) {
          if (rectsOverlap(x, y, 50, 50, obj.x, obj.y, obj.w, obj.h)) {
            hasCollision = true;
            break;
          }
        }
        
        if (d > corridorThreshold && !hasCollision) {
          valid = true;
        }
        attempts++;
      }
      
      if (valid) {
        const spawner = new Spawner(x, y);
        this.spawners.push(spawner);
        this.objects.push(spawner);
        
        // Créer un creeper près du spawner
        const offset = 60;  // Distance du spawner
        const angle = Math.random() * Math.PI * 2;  // Angle aléatoire
        const creeperX = x + offset * Math.cos(angle);
        const creeperY = y + offset * Math.sin(angle);
        const baseSpeed = (0.5 + this.level * 0.2) / 2;
        
        this.creepers.push(new Creeper(creeperX, creeperY, baseSpeed));
      }
    }
  }

  start() {
    this.gameLoop();
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  update() {
    // Mise à jour de la vitesse du joueur selon les touches
    this.player.speedX = 0;
    this.player.speedY = 0;
    const moveSpeed = 3;
    if (this.inputStates.ArrowRight) this.player.speedX = moveSpeed;
    if (this.inputStates.ArrowLeft) this.player.speedX = -moveSpeed;
    if (this.inputStates.ArrowUp) this.player.speedY = -moveSpeed;
    if (this.inputStates.ArrowDown) this.player.speedY = moveSpeed;

    this.player.move();
    this.checkBorderCollision();
    this.checkObstaclesCollision();
    this.checkExit();

    // Mise à jour des creepers
    const obstacles = this.objects.filter(obj => obj instanceof Obstacle);
    for (let creeper of this.creepers) {
      creeper.update(this.player, obstacles);
      // Vérification de collision entre le creeper et Steve
      if (rectsOverlap(this.player.x - this.player.w/2, this.player.y - this.player.h/2,
                       this.player.w, this.player.h,
                       creeper.x - creeper.w/2, creeper.y - creeper.h/2,
                       creeper.w, creeper.h)) {
        console.log("Boom! Un creeper a explosé sur Steve !");
        this.resetRound();
        break;
      }
    }

    // Mise à jour du div Steve (position et rotation)
    this.updateStevePosition();

    // Gestion de l'animation de marche
    if (this.player.speedX !== 0 || this.player.speedY !== 0) {
      this.steveDiv.classList.add("walking");
    } else {
      this.steveDiv.classList.remove("walking");
    }

    // Mise à jour du compteur de niveau
    document.getElementById("levelCounter").textContent = "Niveau : " + this.level;
  }

  updateStevePosition() {
    this.steveDiv.style.left = this.player.x + "px";
    this.steveDiv.style.top = this.player.y + "px";
    this.steveDiv.style.transform = `translate(-50%, -50%) rotate(${this.player.angle}rad)`;
  }

  checkBorderCollision() {
    if (this.player.x - this.player.w / 2 < 0) {
      this.player.x = this.player.w / 2;
    }
    if (this.player.x + this.player.w / 2 > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.w / 2;
    }
    if (this.player.y - this.player.h / 2 < 0) {
      this.player.y = this.player.h / 2;
    }
    if (this.player.y + this.player.h / 2 > this.canvas.height) {
      this.player.y = this.canvas.height - this.player.h / 2;
    }
  }

  checkObstaclesCollision() {
    for (let obj of this.objects) {
      if (obj instanceof Obstacle) {
        if (
          rectsOverlap(
            this.player.x - this.player.w / 2,
            this.player.y - this.player.h / 2,
            this.player.w,
            this.player.h,
            obj.x,
            obj.y,
            obj.w,
            obj.h
          )
        ) {
          console.log("Collision avec un obstacle !");
          this.resetRound();
          break;
        }
      }
    }
  }

  checkExit() {
    if (
      rectsOverlap(
        this.player.x - this.player.w / 2,
        this.player.y - this.player.h / 2,
        this.player.w,
        this.player.h,
        this.exit.x,
        this.exit.y,
        this.exit.size,
        this.exit.size
      )
    ) {
      console.log("Niveau terminé !");
      this.nextLevel();
    }
  }

  nextLevel() {
    this.level++;
    console.log("Démarrage du niveau " + this.level);
    // Réinitialiser la position de Steve
    this.player.x = 30;
    this.player.y = 30;
    // Regénérer obstacles et creepers
    this.spawnObstacles();
    this.spawnCreepers();
  }

  draw() {
    // On dessine sur le canvas uniquement les obstacles, la sortie, les spawners et les creepers
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let obj of this.objects) {
      obj.draw(this.ctx);
    }
    for (let creeper of this.creepers) {
      creeper.draw(this.ctx);
    }
  }

  resetRound() {
    console.log("Réinitialisation du round...");
    // Réinitialiser la position de Steve
    this.player.x = 30;
    this.player.y = 30;
    // Regénérer les creepers
    this.spawnCreepers();
  }
}
