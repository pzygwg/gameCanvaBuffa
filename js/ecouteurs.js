export function initListeners(inputStates, canvas) {
    window.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight") inputStates.ArrowRight = true;
      if (e.key === "ArrowLeft") inputStates.ArrowLeft = true;
      if (e.key === "ArrowUp") inputStates.ArrowUp = true;
      if (e.key === "ArrowDown") inputStates.ArrowDown = true;
    });
  
    window.addEventListener('keyup', (e) => {
      if (e.key === "ArrowRight") inputStates.ArrowRight = false;
      if (e.key === "ArrowLeft") inputStates.ArrowLeft = false;
      if (e.key === "ArrowUp") inputStates.ArrowUp = false;
      if (e.key === "ArrowDown") inputStates.ArrowDown = false;
    });
  
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      inputStates.mouseX = e.clientX - rect.left;
      inputStates.mouseY = e.clientY - rect.top;
    });
  }
  