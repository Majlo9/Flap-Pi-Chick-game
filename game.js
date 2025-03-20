// Definice canvasu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Nastavení velikosti canvasu
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Proměnné pro hru
const chickenRadius = 20; // Velikost kuřete
let chickenX = 150; // Počáteční pozice kuřete
let chickenY = canvas.height / 2; // Počáteční výška kuřete
let velocityY = 0; // Rychlost pohybu kuřete
const gravity = 0.6; // Gravitace
const jumpStrength = -12; // Síla skoku
let isJumping = false;

// Trubky
const pipeWidth = 60;
const pipeGap = 250; // Větší mezera mezi trubkami
let pipes = [];
let score = 0;
let isGameOver = false;

// Obrázky pro pozadí
let birdImage = new Image();
let treeImage = new Image();
let houseImage = new Image();

birdImage.src = 'bird.png'; // obrázek ptáka
treeImage.src = 'tree.png'; // obrázek stromu
houseImage.src = 'house.png'; // obrázek domu

// Funkce pro generování trubek
function createPipe() {
  const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap)); // Výška horní trubky
  pipes.push({ x: canvas.width, y: pipeHeight });
}

// Funkce pro vykreslení trubek
function drawPipes() {
  ctx.fillStyle = "#228B22"; // Zelené trubky
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y); // Horní trubka
    ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap)); // Spodní trubka
  });
}

// Funkce pro aktualizaci pohybu trubek
function updatePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= 2; // Rychlost pohybu trubek
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1); // Odstraní trubku, pokud je mimo obrazovku
      score++; // Zvýšíme skóre, když trubka zmizí
    }
  });
}

// Funkce pro vykreslení kuřete
function drawChicken() {
  ctx.fillStyle = "#800080"; // Fialové kuře
  ctx.beginPath();
  ctx.arc(chickenX, chickenY, chickenRadius, 0, Math.PI * 2); // Kuře jako kruh
  ctx.fill();
  ctx.fillStyle = "#FFFF00"; // Žluté π uprostřed
  ctx.beginPath();
  ctx.arc(chickenX, chickenY, chickenRadius / 2, 0, Math.PI * 2); // π uvnitř kuřete
  ctx.fill();
}

// Funkce pro vykreslení pozadí s ptáky, stromy a domy
function drawBackground() {
  // Vykreslíme pozadí (nebe)
  ctx.fillStyle = "#87CEEB"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vykreslení ptáků (jednoduchý pohyb v pozadí)
  for (let i = 0; i < 5; i++) {
    const birdX = Math.random() * canvas.width;
    const birdY = Math.random() * (canvas.height / 2); // Ptáci budou v horní polovině
    ctx.drawImage(birdImage, birdX, birdY, 30, 30); // Velikost ptáka 30x30px
  }

  // Vykreslení stromů
  for (let i = 0; i < 3; i++) {
    const treeX = i * 300 + Math.random() * 100; // Náhodná pozice stromů
    const treeY = canvas.height - 100; // Stromy budou u země
    ctx.drawImage(treeImage, treeX, treeY, 50, 100); // Velikost stromu 50x100px
  }

  // Vykreslení domů
  for (let i = 0; i < 2; i++) {
    const houseX = i * 500 + Math.random() * 100; // Náhodná pozice domů
    const houseY = canvas.height - 150; // Domy budou u země
    ctx.drawImage(houseImage, houseX, houseY, 100, 100); // Velikost domu 100x100px
  }
}

// Funkce pro skok
function jump() {
  if (isJumping === false) {
    velocityY = jumpStrength;
    isJumping = true;
  }
}

// Funkce pro aktualizaci pohybu kuřete
function updateChicken() {
  velocityY += gravity; // Aplikujeme gravitaci
  chickenY += velocityY; // Posuneme kuře

  if (chickenY + chickenRadius > canvas.height) {
    chickenY = canvas.height - chickenRadius; // Pokud kuře spadne na zem
    velocityY = 0;
    isJumping = false; // Kuře se nepoškodí při dopadu na zem
  }

  if (chickenY - chickenRadius < 0) {
    chickenY = chickenRadius; // Kuře nemůže letět mimo obrazovku nahoru
  }
}

// Funkce pro zjištění kolize
function checkCollisions() {
  pipes.forEach(pipe => {
    if (chickenX + chickenRadius > pipe.x && chickenX - chickenRadius < pipe.x + pipeWidth) {
      if (chickenY - chickenRadius < pipe.y || chickenY + chickenRadius > pipe.y + pipeGap) {
        isGameOver = true; // Kolize s trubkou
      }
    }
  });
}

// Funkce pro vykreslení skóre
function drawScore() {
  ctx.fillStyle = "#000000";
  ctx.font = "30px Arial";
  ctx.fillText("Skóre: " + score, 20, 40);
}

// Hlavní funkce pro vykreslení celé hry
function draw() {
  if (isGameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "40px Arial";
    ctx.fillText("Konec hry!", canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Skóre: " + score, canvas.width / 2 - 60, canvas.height / 2 + 50);
    return;
  }

  drawBackground(); // Vykreslíme pozadí s objekty
  drawPipes(); // Vykreslíme trubky
  drawChicken(); // Vykreslíme kuře
  drawScore(); // Vykreslíme skóre
}

// Funkce pro aktualizaci hry
function update() {
  if (isGameOver) return;

  updateChicken(); // Aktualizujeme pohyb kuřete
  updatePipes(); // Aktualizujeme pohyb trubek
  checkCollisions(); // Zkontrolujeme kolize
  draw(); // Vykreslíme celou hru
}

// Spuštění hry
setInterval(() => {
  if (!isGameOver) {
    if (Math.random() < 0.02) createPipe(); // Generování nových trubek
    update();
  }
}, 1000 / 60); // 60 FPS

// Ovládání skoků
document.addEventListener('keydown', (e) => {
  if (e.key === " " || e.key === "ArrowUp") {
    jump();
  }
});
