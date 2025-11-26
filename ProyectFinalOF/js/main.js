const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const restartButton = document.getElementById('restartButton');
const historyList = document.getElementById('historyList');
const gameOverOverlay = document.getElementById('gameOver'); // opcional en HTML

// Si faltan elementos en el DOM, evitamos errores.
function safeEl(el, fallback = null) { return el ? el : fallback; }

if (!canvas || !ctx) {
  console.error('Canvas no encontrado (id="gameCanvas").');
}

// Ajuste del canvas al tamaño del contenedor y recalcular tamaños dependientes
let groundY = 0;
function resetSizes() {
  // calcular ground y tamaños relativos según canvas
  groundY = canvas.height - Math.max(40, Math.floor(canvas.height * 0.12));
  let dinoW = Math.floor(Math.max(60, canvas.width * 0.12));
  let dinoH = dinoW; // cuadrado/rounded
  let dinoX = Math.floor(Math.max(30, canvas.width * 0.06));
  let dinoY = groundY - dinoH;
 
  let obstacleW = Math.floor(dinoW * 0.6);
  let obstacleH = Math.floor(dinoW * 0.6);
  let obstacleY = groundY; // pegado al suelo
  let obstacleX = canvas.width + 50;
}

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(600, Math.floor(rect.width));
  canvas.height = Math.max(300, Math.floor(rect.height));
  resetSizes();
}
fitCanvas();
window.addEventListener('resize', () => { fitCanvas(); draw(); });

// Variables del juego
let dinoX = 50;
let dinoY = 220;
let dinoW = 80;
let dinoH = 80;
let dinoYVelocity = 0;
let gravity = 1.2;
let isJumping = false;

let obstacleX = canvas.width + 50;
let obstacleY = 250;
let obstacleW = 50;
let obstacleH = 50;
let obstacleSpeed = 5;

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = true;
let lastTimestamp = 0;

const SCORE_TO_WIN = 200; // umbral simple para considerar "ganar"
let gameHistory = JSON.parse(localStorage.getItem('dd_gameHistory') || '[]');

// helpers DOM safe
function setText(el, text) { if (el) el.textContent = text; }

// Actualiza DOM y canvas texto
function updateUI() {
  setText(scoreDisplay, `Puntaje: ${score}`);
  setText(livesDisplay, `Vidas: ${lives}`);
}

// Dibujo en canvas
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // fondo/suelo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // suelo (línea)
  ctx.strokeStyle = '#cfcfcf';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 2);
  ctx.lineTo(canvas.width, groundY + 2);
  ctx.stroke();

  // Nube / forma azul (abajo-izquierda)
  drawCloud(ctx, Math.floor(canvas.width * 0.08), groundY - Math.floor(canvas.height * 0.22), Math.floor(canvas.width * 0.16));

  // dinosaurio (forma cuadrada con esquinas redondeadas, ojos y "brazos")
  drawRoundedDino(ctx, dinoX, dinoY, dinoW, dinoH);

  // obstáculo (forma irregular verde similar a la imagen con manchas)
  drawBlobObstacle(ctx, obstacleX, obstacleY, obstacleW, obstacleH);

  // texto del puntaje dentro del canvas
  ctx.fillStyle = '#333';
  ctx.font = '20px Poppins';
  ctx.textAlign = 'right';
  ctx.fillText(`Puntaje: ${score}`, canvas.width - 12, 28);
  ctx.textAlign = 'left';
  ctx.fillText(`Vidas: ${lives}`, 12, 28);

  // overlay game over
  if (!gameRunning) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '32px Verdana';
    ctx.fillText(gameOverOverlay && gameOverOverlay.dataset.result ? gameOverOverlay.dataset.result : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '18px Verdana';
    ctx.fillText('Presiona ESPACIO o Reiniciar', canvas.width / 2, canvas.height / 2 + 24);
  }
}

// Dibujadores auxiliares
function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawRoundedDino(ctx, x, y, w, h) {
  // cuerpo
  ctx.fillStyle = '#1aa35a';
  drawRoundedRect(ctx, x, y, w, h, Math.floor(w * 0.18));

  // brazos (rectángulos redondeados)
  ctx.fillStyle = '#138a4a';
  const armW = Math.floor(w * 0.22);
  const armH = Math.floor(h * 0.4);
  drawRoundedRect(ctx, x - Math.floor(armW * 0.35), y + Math.floor(h * 0.28), armW, armH, 8);
  drawRoundedRect(ctx, x + w - Math.floor(armW * 0.65), y + Math.floor(h * 0.28), armW, armH, 8);

  // ojo
  const eyeX = x + Math.floor(w * 0.72);
  const eyeY = y + Math.floor(h * 0.18);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(eyeX, eyeY, Math.floor(w * 0.12), 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(eyeX + Math.floor(w * 0.02), eyeY, Math.floor(w * 0.05), 0, Math.PI * 2); ctx.fill();
}

function drawBlobObstacle(ctx, x, y, w, h) {
  // una forma en L con esquinas redondeadas
  ctx.fillStyle = '#c6f03a';
  ctx.beginPath();
  const r = Math.min(w, h) * 0.35;
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + Math.floor(h * 0.45));
  ctx.lineTo(x + Math.floor(w * 0.45), y + Math.floor(h * 0.45));
  ctx.lineTo(x + Math.floor(w * 0.45), y + h - r);
  ctx.quadraticCurveTo(x + Math.floor(w * 0.45), y + h, x + Math.floor(w * 0.45) - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();

  
}

function drawCloud(ctx, cx, cy, size) {
  ctx.fillStyle = '#bfeaf6';
  ctx.beginPath();
  const s = size;
  ctx.arc(cx, cy, s * 0.28, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(cx + s * 0.28, cy - s * 0.18, s * 0.28, Math.PI * 1, Math.PI * 1.85);
  ctx.arc(cx + s * 0.6, cy, s * 0.25, Math.PI * 1.5, Math.PI * 0.5);
  ctx.arc(cx + s * 0.28, cy + s * 0.18, s * 0.22, Math.PI * 0.2, Math.PI * 1.2);
  ctx.closePath();
  ctx.fill();
}

// Lógica de colisión AABB
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(ax + aw < bx || ax > bx + bw || ay + ah < by || ay > by + bh);
}

// Salto
function jump() {
  if (!isJumping && gameRunning) {
    dinoYVelocity = -Math.max(14, Math.floor(dinoH * 0.28));
    isJumping = true;
  } else if (!gameRunning) {
    // si no corre, espaciador reinicia
    restartGame();
  }
}

// Fin de juego
function endGame(resultLabel = 'Perdido') {
  gameRunning = false;
  // colocar texto en overlay DOM si existe
  if (gameOverOverlay) {
    gameOverOverlay.classList.remove('hidden');
    gameOverOverlay.textContent = resultLabel === 'Ganado' ? '¡GANASTE!' : 'GAME OVER';
    gameOverOverlay.dataset.result = resultLabel === 'Ganado' ? '¡GANASTE!' : 'GAME OVER';
  }
  // Guardar en historial
  const entry = {
    result: resultLabel,
    score,
    level,
    date: new Date().toLocaleString()
  };
  gameHistory.unshift(entry);
  if (gameHistory.length > 30) gameHistory.pop();
  localStorage.setItem('dd_gameHistory', JSON.stringify(gameHistory));
  renderHistory();
  updateUI();
  draw(); // dibujar estado final
  // mostrar botón restart si existe
  if (restartButton) restartButton.style.display = 'inline-block';
}

// Reiniciar
function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  obstacleSpeed = 5;
  resetSizes();
  dinoYVelocity = 0;
  isJumping = false;
  obstacleX = canvas.width + 50;
  gameRunning = true;
  lastTimestamp = 0;
  if (gameOverOverlay) {
    gameOverOverlay.classList.add('hidden');
    delete gameOverOverlay.dataset.result;
  }
  if (restartButton) restartButton.style.display = 'none';
  updateUI();
  requestAnimationFrame(loop);
}

// Guardar y render historial en DOM
function renderHistory() {
  // Always persist JSON in localStorage
  try {
    localStorage.setItem('dd_gameHistory', JSON.stringify(gameHistory));
  } catch (e) {
    console.warn('No se pudo guardar historial en localStorage', e);
  }

  // Ocultar la lista detallada (no se muestra en pantalla)
  if (historyList) historyList.style.display = 'none';

  // Calcular estadísticas rápidas
  const total = gameHistory.length;
  const wins = gameHistory.filter(h => h.result === 'Ganado').length;
  const losses = gameHistory.filter(h => h.result === 'Perdido').length;

  // Mostrar resumen en el contenedor (crear si no existe)
  let summary = document.getElementById('summaryStats');
  const inner = document.querySelector('.contenedor .inner');
  if (!summary) {
    summary = document.createElement('div');
    summary.id = 'summaryStats';
    summary.style.width = '100%';
    summary.style.padding = '8px 12px';
    summary.style.boxSizing = 'border-box';
    summary.style.textAlign = 'left';
    summary.style.fontSize = '14px';
    summary.style.color = '#222';
    summary.style.background = 'transparent';
    // insert after restart button if possible
    if (restartButton && restartButton.parentNode) restartButton.parentNode.insertBefore(summary, restartButton.nextSibling);
    else if (inner) inner.appendChild(summary);
  }

  if (summary) {
    summary.innerHTML = `Partidas: <strong>${total}</strong> — Ganadas: <strong>${wins}</strong> — Perdidas: <strong>${losses}</strong>`;
  }

  // Ajustar altura del contenedor gradualmente según la cantidad de partidas
  if (inner) {
    const base = 340; // base min-height definida en CSS
    const extra = Math.min(400, total * 10); // cada partida suma 10px hasta un tope
    inner.style.minHeight = (base + extra) + 'px';
  }
}
renderHistory();
updateUI();

// Lógica del juego por frame
function update(delta) {
  if (!gameRunning) return;

  // física dino
  dinoY += dinoYVelocity;
  dinoYVelocity += gravity;
  if (dinoY > groundY - dinoH) { dinoY = groundY - dinoH; dinoYVelocity = 0; isJumping = false; }

  // mover obstáculo
  obstacleX -= obstacleSpeed;
  if (obstacleX < -obstacleW) {
    obstacleX = canvas.width + 50 + Math.random() * 200;
    score++;
    // subir nivel cada 50 puntos
    if (score % 50 === 0) {
      level++;
      obstacleSpeed += 1;
    }
  }

  // colisión
  if (isColliding(dinoX, dinoY, dinoW, dinoH, obstacleX, obstacleY, obstacleW, obstacleH)) {
    // penalizar vida y reset obstáculo
    lives--;
    obstacleX = canvas.width + 50 + Math.random() * 200;
    // si no quedan vidas -> game over
    if (lives <= 0) {
      endGame('Perdido');
      return;
    }
  }

  // condición de "ganar" simple (umbral)
  if (score > 0 && score >= SCORE_TO_WIN) {
    endGame('Ganado');
    return;
  }

  updateUI();
}

// Loop principal
function loop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 16.67; // aproximar a frames
  lastTimestamp = timestamp;

  for (let i = 0; i < Math.max(1, Math.floor(delta)); i++) update(delta);
  draw();

  if (gameRunning) requestAnimationFrame(loop);
}

// eventos
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); jump(); }
});

if (restartButton) restartButton.addEventListener('click', restartGame);

// iniciar
requestAnimationFrame(loop);
