// Collision entre deux cercles
export function circleCollide(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return (dx * dx + dy * dy) < ((r1 + r2) * (r1 + r2));
  }

  
  // Collision entre deux rectangles alignés sur les axes
  export function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 > (x2 + w2) || (x1 + w1) < x2) return false;
    if (y1 > (y2 + h2) || (y1 + h1) < y2) return false;
    return true;
  }

  
  // Collision entre un cercle et un rectangle
  export function circRectOverlap(rectX, rectY, rectW, rectH, circleX, circleY, circleR) {
    let closestX = Math.max(rectX, Math.min(circleX, rectX + rectW));

    let closestY = Math.max(rectY, Math.min(circleY, rectY + rectH));
    const dx = circleX - closestX;
    const dy = circleY - closestY;
    return (dx * dx + dy * dy) < (circleR * circleR);
  }