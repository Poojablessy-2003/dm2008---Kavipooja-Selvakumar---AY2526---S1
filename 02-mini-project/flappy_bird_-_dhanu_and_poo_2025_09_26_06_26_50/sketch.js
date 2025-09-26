// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold + Start Button)

/* ----------------- Globals ----------------- */
let bird;
let score = 0;
let best = 0;
let pipes = [];
let gameState = 'START';   // START → PLAY → GAME_OVER
let birdImg;               // current sprite (day or night)
let birdImgDay, birdImgNight;
let spawnCounter = 0;      // simple timer
const SPAWN_RATE = 90;     // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
let PIPE_GAP = 120;        // gap height (try 100–160)
const PIPE_W = 60;
let isPaused = false;
const TOGGLE_W = 260;
const TOGGLE_H = 80;
let toggleX, toggleY;

// clouds
let clouds = [];
const CLOUD_SPAWN = 150; // spawn every ~2.5s
let cloudCounter = 0;

// Start button (in-canvas)
const BTN_W = 180;
const BTN_H = 48;
let btnX, btnY;

/* ---- Day/Night mode ---- */
let mode;       // 'MORNING' or 'NIGHT'
let stars = [];
const STAR_COUNT = 120;
function isNight() { return mode === 'NIGHT'; }

/* ----------------- Setup & Draw ----------------- */
function preload(){
  birdImgDay   = loadImage("bird.png");
  birdImgNight = loadImage("bat.png");
  birdImg = birdImgDay; // start in MORNING
}

function setup() {
  createCanvas(480, 640);          
  noStroke();
  best = getItem('best') || 0; 
  if (random() < 0.5) {
    mode = 'MORNING';
    birdImg = birdImgDay;
  } else {
    mode = 'NIGHT';
    birdImg = birdImgNight;
  }

  btnX = width/2 - BTN_W/2;
  btnY = height/2 + 40;

  toggleX = width/2 - TOGGLE_W/2;
  toggleY = btnY - 60;

  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width + 40));

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.7),
      r: random(1, 3),
      twinkle: random(0.5, 1.0)
    });
  }
}

function draw(){
  background(130, 200, 229);
  drawBackground();

  // -------- PAUSE LAYER --------
  if (isPaused && gameState === 'PLAY') {
    for (let c of clouds) c.show();
    for (let p of pipes) p.show();
    bird.show();

    fill(0,0,0,120); rect(0,0,width,height);
    fill(255); textAlign(CENTER,CENTER); textSize(26);
    text('Paused (P to resume)', width/2, height/2);

    textSize(14);
    fill(255, 230, 120);
    text('Tip: You can press P anytime to pause/resume', width/2, height/2 + 32);
    return;
  }
  // -----------------------------

  if (gameState === 'START') {
    drawStartScreen();
  }

  if (gameState === 'PLAY') {
    handleInput();
    bird.update();

    cloudCounter++;
    if (cloudCounter >= CLOUD_SPAWN) {
      clouds.push(new Cloud(width + 60, random(50, 250)));
      cloudCounter = 0;
    }
    for (let i = clouds.length - 1; i >= 0; i--) {
      clouds[i].update();
      if (clouds[i].offscreen()) clouds.splice(i, 1);
    }

    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.update();

      if (p.hits(bird)) {
        triggerGameOver();
        return;
      }

      if (!p.passed && (p.x + p.w) < bird.pos.x) {
        score++;
        p.passed = true;
      }

      if (p.offscreen()) pipes.splice(i, 1);
    }
  }

  for (let i = 0; i < clouds.length; i++) clouds[i].show();
  for (let i = 0; i < pipes.length; i++) pipes[i].show();
  bird.show();
  
  if (gameState === 'PLAY') {
    fill(255);
    textSize(20);
    textAlign(CENTER, TOP);
    text('Score: ' + score, width / 2, 10);
    
    textSize(12);
    textAlign(RIGHT, TOP);
    fill(255, 255, 255, 180);
    text('P = Pause/Resume', width - 10, 10);
  }

  if (gameState === 'GAME_OVER') {
    drawGameOverScreen();
  }
}

/* ----------------- Start Screen ----------------- */
function drawStartScreen() {
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(42);
  text('Flappy Bird', width/2, height/2 - 80);

  const hovering = isMouseOver(btnX, btnY, BTN_W, BTN_H);
  fill(hovering ? color(255, 230) : color(255, 210));
  stroke(0, 50);
  strokeWeight(2);
  rect(btnX, btnY, BTN_W, BTN_H, 10);

  noStroke();
  fill(20);
  textSize(18);
  text('Start Game', width/2, btnY + BTN_H/2);

  fill(255);
  textSize(12);
  textAlign(CENTER, TOP);
  text("Tip: Press P anytime to Pause/Resume", width/2, btnY + BTN_H + 24);
}

/* ----------------- Input ----------------- */
function handleInput() {}

function keyPressed() {
  if (key === 'm' || key === 'M') { mode = 'MORNING'; birdImg = birdImgDay;   return; }
  if (key === 'n' || key === 'N') { mode = 'NIGHT';   birdImg = birdImgNight; return; }

  if (key === 'p' || key === 'P') { isPaused = !isPaused; return; }

  const spaceOrUp = (key === ' ' || keyCode === 32 || keyCode === UP_ARROW);

  if (gameState === 'START') {
    if (spaceOrUp) startGame();
  } else if (gameState === 'PLAY') {
    if (spaceOrUp) bird.flap();
  } else if (gameState === 'GAME_OVER') {
    if (spaceOrUp) {
      resetGame();
      gameState = 'PLAY';
    }
  }
}

function mousePressed() {
  if (gameState === 'START' && isMouseOver(btnX, btnY, BTN_W, BTN_H)) {
    startGame();
  } else if (gameState === 'GAME_OVER') {
    const cardW = 320, cardH = 220;
    const cx = width/2 - cardW/2;
    const cy = height/2 - cardH/2;
    const btnW = BTN_W, btnH = BTN_H;
    const btnCx = width/2 - btnW/2;
    const btnCy = cy + cardH - btnH - 20;

    if (isMouseOver(btnCx, btnCy, btnW, btnH)) {
      resetGame();
      gameState = 'PLAY';
    }
  }
}

/* ----------------- Helpers ----------------- */
function isMouseOver(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function startGame() {
  resetGame();
  gameState = 'PLAY';
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 16;
    this.gravity = 0.45;
    this.flapStrength = -8.0;
  }

  applyForce(fy) { this.acc.y += fy; }
  flap() { this.vel.y = this.flapStrength; }

  update() {
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.y < this.r) { this.pos.y = this.r; this.vel.y = 0; }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      if (gameState === 'PLAY') triggerGameOver();
    }
  }

  show() {
    imageMode(CENTER);
    if (birdImg) {
      if (mode === 'MORNING') {
        image(birdImg, this.pos.x, this.pos.y, this.r * 5.5, this.r * 5.5);
      } else {
        image(birdImg, this.pos.x, this.pos.y, this.r * 8.5, this.r * 8.5);
      }
    } else {
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
    this.passed = false;
    this.speed = PIPE_SPEED;
  }

  update() { this.x -= this.speed; }
  
  show() {
    const night = (typeof mode !== 'undefined' && mode === 'NIGHT');

    const body     = night ? color(150, 95, 45)  : color(95, 200, 70);
    const shade    = night ? color(120, 75, 35)  : color(65, 170, 50);
    const hi1      = night ? color(205,155,105)  : color(190,255,160);
    const hi2      = night ? color(230,185,135,180) : color(230,255,190,180);
    const outline  = night ? color(70,50,40)     : color(70,80,60);

    const lipH = 14, lipPad = 4, r = 6, shadeW = 8;

    noStroke(); fill(body);
    rect(this.x, 0, this.w, this.top, r);
    fill(shade);
    rect(this.x + this.w - shadeW - 2, 0, shadeW, this.top, r);
    fill(hi1); rect(this.x + 6, 0, 4, this.top);
    fill(hi2); rect(this.x + 12, 0, 3, this.top);
    fill(body); rect(this.x - lipPad, this.top - lipH, this.w + lipPad * 2, lipH, r);

    noFill(); stroke(outline); strokeWeight(3);
    rect(this.x, 0, this.w, this.top, r);
    rect(this.x - lipPad, this.top - lipH, this.w + lipPad * 2, lipH, r);

    const hBot = height - this.bottom;
    noStroke(); fill(body);
    rect(this.x, this.bottom, this.w, hBot, r);
    fill(shade);
    rect(this.x + this.w - shadeW - 2, this.bottom, shadeW, hBot, r);
    fill(hi1); rect(this.x + 6, this.bottom, 4, hBot);
    fill(hi2); rect(this.x + 12, this.bottom, 3, hBot);
    fill(body); rect(this.x - lipPad, this.bottom, this.w + lipPad * 2, lipH, r);

    noFill(); stroke(outline); strokeWeight(3);
    rect(this.x, this.bottom, this.w, hBot, r);
    rect(this.x - lipPad, this.bottom, this.w + lipPad * 2, lipH, r);
  }

  offscreen() { return (this.x + this.w < 0); }

  hits(bird) {
    const withinX  = (bird.pos.x + bird.r > this.x) && (bird.pos.x - bird.r < this.x + this.w);
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(20, 40);
    this.speed = random(0.5, 1.5);
  }

  update() { this.x -= this.speed; }

  show() {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
    ellipse(this.x + this.r * 0.8, this.y + 5, this.r * 1.5);
    ellipse(this.x - this.r * 0.8, this.y + 5, this.r * 1.5);
  }

  offscreen() { return this.x < -this.r * 2; }
}

/* ----------------- Game State Helpers ----------------- */
function triggerGameOver() {
  gameState = 'GAME_OVER';
  bird.vel.set(0, 0);
  bird.acc.set(0, 0);
  for (const p of pipes) p.speed = 0;
  for (const c of clouds) c.speed = 0;

  if (score > best) {
    best = score;
    storeItem('best', best);
  }
}

function resetGame() {
  bird = new Bird(120, height / 2);
  pipes = [];
  spawnCounter = 0;
  clouds = [];
  cloudCounter = 0;
  score = 0;
  pipes.push(new Pipe(width + 40));
}

function drawGameOverScreen() {
  fill(0, 0, 0, 140);
  rect(0, 0, width, height);

  const cardW = 320, cardH = 220;
  const cx = width/2 - cardW/2;
  const cy = height/2 - cardH/2;

  noStroke();
  fill(255, 255, 255, 235);
  rect(cx, cy, cardW, cardH, 16);

  fill(30);
  textAlign(CENTER, TOP);
  textSize(28);
  text('Game Over', width/2, cy + 16);

  textSize(18);
  textAlign(LEFT, TOP);
  const leftX = cx + 24;
  let y = cy + 72;
  text(`Score: ${score}`, leftX, y);
  y += 28;
  text(`Best:  ${best}`, leftX, y);
  y += 20;

  if (score === best && score > 0) {
    textAlign(RIGHT, TOP);
    fill(20, 160, 80);
    text('New best!', cx + cardW - 24, cy + 72);
    fill(30);
  }

  const btnW = BTN_W, btnH = BTN_H;
  const btnCx = width/2 - btnW/2;
  const btnCy = cy + cardH - btnH - 20;
  
  const hovering = isMouseOver(btnCx, btnCy, btnW, btnH);
  fill(hovering ? color(255, 230) : color(255, 210));
  stroke(0, 50);
  strokeWeight(2);
  rect(btnCx, btnCy, btnW, btnH, 10);

  noStroke();
  fill(20);
  textAlign(CENTER, CENTER);
  textSize(18);
  text('Restart', width/2, btnCy + btnH/2);

  textSize(12);
  fill(60);
  textAlign(CENTER, TOP);
  text('Press SPACE or ↑ to restart', width/2, btnCy + btnH + 10);
}

/* ----------------- Background ----------------- */
function drawBackground() {
  if (mode === 'MORNING') {
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = lerp(160, 100, t);
      const g = lerp(215, 170, t);
      const b = lerp(240, 210, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }
    noStroke();
    fill(255, 215, 100, 230);
    ellipse(width - 80, 80, 90, 90);
  } else {
    for (let y = 0; y < height; y++) {
      const t = y / height;
      const r = lerp(15, 0, t);
      const g = lerp(25, 5, t);
      const b = lerp(45, 15, t);
      stroke(r, g, b);
      line(0, y, width, y);
    }
    noStroke();
    for (const s of stars) {
      const a = 200 + 55 * sin(frameCount * 0.02 * s.twinkle);
      fill(255, 255, 255, a);
      ellipse(s.x, s.y, s.r, s.r);
    }
    fill(240, 240, 255, 230);
    ellipse(80, 90, 70, 70);
  }
}
