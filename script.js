const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spider properties
const spider = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  w: 40,
  h: 40,
  dx: 0,
  speed: 5
};

// Array to hold flies
let flies = [];
let spawnInterval = 0;
let score = 0;
let lives = 3;
let gameOver = false;

// Listen for keyboard events
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    spider.dx = -spider.speed;
  } else if (e.key === 'ArrowRight') {
    spider.dx = spider.speed;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    spider.dx = 0;
  }
});

// Spawn a new fly at a random position
function spawnFly() {
  const size = 20;
  const x = Math.random() * (canvas.width - size);
  const speed = 2 + Math.random() * 2;
  flies.push({ x, y: -size, size, speed });
}

// Draw the spider on the canvas
function drawSpider() {
  // Body
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(spider.x + spider.w / 2, spider.y + spider.h / 2, spider.w / 2, spider.h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  const legs = 4;
  for (let i = 0; i < legs; i++) {
    const offsetY = (i - 1.5) * 5;
    // Left legs
    ctx.beginPath();
    ctx.moveTo(spider.x + 5, spider.y + spider.h / 2 + offsetY);
    ctx.lineTo(spider.x - 10, spider.y + offsetY);
    ctx.stroke();
    // Right legs
    ctx.beginPath();
    ctx.moveTo(spider.x + spider.w - 5, spider.y + spider.h / 2 + offsetY);
    ctx.lineTo(spider.x + spider.w + 10, spider.y + offsetY);
    ctx.stroke();
  }
}

// Draw a fly
function drawFly(fly) {
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.ellipse(fly.x + fly.size / 2, fly.y + fly.size / 2, fly.size / 2, fly.size / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Update game state
function update() {
  // Update spider position
  spider.x += spider.dx;
  // Boundaries
  if (spider.x < 0) spider.x = 0;
  if (spider.x + spider.w > canvas.width) spider.x = canvas.width - spider.w;

  // Spawn new flies periodically
  spawnInterval++;
  if (spawnInterval > 60) {
    spawnFly();
    spawnInterval = 0;
  }

  // Update flies and check for collisions
  for (let i = flies.length - 1; i >= 0; i--) {
    const fly = flies[i];
    fly.y += fly.speed;

    // Check collision with spider
    if (
      fly.x < spider.x + spider.w &&
      fly.x + fly.size > spider.x &&
      fly.y < spider.y + spider.h &&
      fly.y + fly.size > spider.y
    ) {
      flies.splice(i, 1);
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      continue;
    }

    // If fly goes off screen
    if (fly.y > canvas.height) {
      flies.splice(i, 1);
      lives--;
      if (lives <= 0) {
        gameOver = true;
      }
    }
  }
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpider();
  flies.forEach(drawFly);
}

// Main game loop
function loop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(loop);
  } else {
    // Game over screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
  }
}

// Start the game
loop();
