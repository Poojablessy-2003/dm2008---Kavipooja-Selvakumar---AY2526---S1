// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)

/* ----------------- Globals ----------------- */
let bird;
let score = 0;
let pipes = [];
let gameState = 'PLAY';
let birdImg;
let spawnCounter = 0;      // simple timer
const SPAWN_RATE = 90;     // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
const PIPE_GAP = 120;      // gap height (try 100–160)
const PIPE_W = 60;

// clouds
let clouds = [];
const CLOUD_SPAWN = 150; // spawn every ~2.5s
let cloudCounter = 0;

// --- Day/Night mode ---
let mode = 'MORNING';       // 'MORNING' or 'NIGHT'
let stars = [];
const STAR_COUNT = 120;

// optional: slightly different cloud color by mode
function isNight() { return mode === 'NIGHT'; }

/* ----------------- Setup & Draw ----------------- */
function preload(){
  birdImg = loadImage("bat.png"); // ensure bat.png is in project folder
}

function setup() {
  createCanvas(480, 640);
  
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
    x: random(width),
    y: random(height * 0.7),      // stars mostly upper 70%
    r: random(1, 3),
    twinkle: random(0.5, 1.0)     // slight brightness variation
    });
  }
  
  noStroke();
  bird = new Bird(120, height / 2);
  // Start with one pipe so there’s something to see
  pipes.push(new Pipe(width + 40));
}

function draw(){
  drawBackground();

  // --- PLAY state: update world ---
  if (gameState === 'PLAY') {
    handleInput();     // flap only via keyPressed() in this sketch
    bird.update();

    // Clouds (update only in PLAY)
    cloudCounter++;
    if (cloudCounter >= CLOUD_SPAWN) {
      clouds.push(new Cloud(width + 60, random(50, 250)));
      cloudCounter = 0;
    }
    for (let i = clouds.length - 1; i >= 0; i--) {
      clouds[i].update();
      if (clouds[i].offscreen()) clouds.splice(i, 1);
    }

    // Pipes (update only in PLAY)
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    // Update pipes (no drawing here)
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.update();

      // Collision check -> trigger game over (freeze)
      if (p.hits(bird)) {
        triggerGameOver();
        return; // stop further updates this frame so the freeze is visible
      }

      // Scoring: when bird passes pipe (center)
      if (!p.passed && (p.x + p.w) < bird.pos.x) {
        score++;
        p.passed = true; // so it only counts once
      }

      if (p.offscreen()) {
        pipes.splice(i, 1);
      }
    }
  }

  // --- DRAW (runs in both states). We draw after updates so the frame of impact is visible ---
  // Draw clouds
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].show();
  }
  // Draw pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }
  // Draw bird last (on top)
  bird.show();

  // Score HUD
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);

  // --- GAME OVER overlay ---
  if (gameState === 'GAME_OVER') {
    // Dim the scene
    fill(0, 0, 0, 120);
    rect(0, 0, width, height);

    // UI text
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text('Game Over', width / 2, height / 2 - 20);

    textSize(16);
    text('Press SPACE or ↑ to restart', width / 2, height / 2 + 14);
  }
}

/* ----------------- Input ----------------- */
function handleInput() {
  // Intentionally empty for continuous input; we use keyPressed() for single flaps.
  // Optionally, you could make mousePressed() call bird.flap() as well.
}

function keyPressed() {
  
  // Mode toggle works in any state
  if (key === 'm' || key === 'M') {
  mode = 'MORNING';
  return; // don't treat as flap/restart
  }
  if (key === 'n' || key === 'N') {
  mode = 'NIGHT';
  return;
  }
  
if (gameState === 'PLAY') {
    if (key === ' '  keyCode === 32  keyCode === UP_ARROW) {
      bird.flap();
    }
  } else if (gameState === 'GAME_OVER') {
    if (key === ' '  keyCode === 32  keyCode === UP_ARROW) {
      resetGame();          // full reset
      gameState = 'PLAY';   // back to playing
    }
  }
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 16;              // for collision + draw
    this.gravity = 0.45;      // constant downward force
    this.flapStrength = -8.0; // negative = upward
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // instant upward kick
    this.vel.y = this.flapStrength;
  }

  update() {
    // gravity
    this.applyForce(this.gravity);

    // integrate
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // keep inside canvas vertically (simple constraints)
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      // treat touching the ground as game over
      if (gameState === 'PLAY') {
        triggerGameOver();
      }
    }
  }

  show() {
    imageMode(CENTER);
    if (birdImg) {
      image(birdImg, this.pos.x, this.pos.y, this.r * 8.5, this.r * 8.5);
    } else {
      // fallback: draw simple circle if image missing
      fill(255, 200, 0);
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.top = random(50, height - PIPE_GAP - 50);
    this.bottom = this.top + PIPE_GAP;
    this.passed = false; // for scoring
    this.speed = PIPE_SPEED;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(46,111,64);
    rect(this.x, 0, this.w, this.top);                   // top pipe
    rect(this.x, this.bottom, this.w, height - this.bottom); // bottom pipe
  }

  offscreen() {
    return (this.x + this.w < 0);
  }

  // circle-rect collision (simple)
  hits(bird) {
    const withinX = (bird.pos.x + bird.r > this.x) && (bird.pos.x - bird.r < this.x + this.w);
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(20, 40);    // base size
    this.speed = random(0.5, 1.5); // slow drift
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(255, 255, 255, 200); // white with some transparency
    noStroke();
    // draw 3 overlapping circles for a fluffy cloud
    ellipse(this.x, this.y, this.r * 2);
    ellipse(this.x + this.r * 0.8, this.y + 5, this.r * 1.5);
    ellipse(this.x - this.r * 0.8, this.y + 5, this.r * 1.5);
  }

  offscreen() {
    return this.x < -this.r * 2;
  }
}

function drawBackground() {
  if (mode === 'MORNING') {
    // gradient sky (light at horizon, deeper blue above)
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = lerp(160, 100, t);
      const g = lerp(215, 170, t);
      const b = lerp(240, 210, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }
    noStroke();
    // sun
    fill(255, 215, 100, 230);
    ellipse(width - 80, 80, 90, 90);
  } else {
    // NIGHT: deep blue → near black gradient
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = lerp(15, 0, t);
      const g = lerp(25, 5, t);
      const b = lerp(45, 15, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }
    noStroke();
    // stars (tiny twinkle)
    for (const s of stars) {
      const a = 200 + 55 * sin(frameCount * 0.02 * s.twinkle);
      fill(255, 255, 255, a);
      ellipse(s.x, s.y, s.r, s.r);
    }
    // moon
    fill(240, 240, 255, 230);
    ellipse(80, 90, 70, 70);
    // crescent cut-out
    fill(0, 0, 0, 0);
  }
}