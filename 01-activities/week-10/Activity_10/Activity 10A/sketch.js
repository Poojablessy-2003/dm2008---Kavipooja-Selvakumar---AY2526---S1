let colorBtn, sizeSlider, shapeSelect;
let shapeColor;

let bgLayer;
let t = 0;
const NUM_BLOBS = 7;
const SPEED = 0.005;

let rotationAngle = 0;

let isPulsing = false;
const PULSE_AMPLITUDE = 20;
const PULSE_SPEED = 0.05;


let veilAlpha = 20; 
let brighterBtn, dimmerBtn;

function setup() {
  createCanvas(640, 400);
  noStroke();
  textFont("Helvetica, Arial, sans-serif");


  bgLayer = createGraphics(width, height);
  bgLayer.noStroke();
  bgLayer.colorMode(HSB, 360, 100, 100, 100);

  colorMode(HSB, 360, 100, 100, 100);
  shapeColor = color(random(360), 60, 100);


  colorBtn = createButton("Change Color");
  colorBtn.position(16, 16);
  colorBtn.mousePressed(randomShapeColor);

  createP("Size").position(0, 50).style("margin", "4px 0 0 16px");
  sizeSlider = createSlider(20, 220, 100, 1);
  sizeSlider.position(15, 70);


  createP("Shape").position(0, 100).style("margin", "8px 0 0 16px");
  shapeSelect = createSelect();
  shapeSelect.position(16, 130);
  shapeSelect.option("ellipse");
  shapeSelect.option("square");
  shapeSelect.option("triangle");


  brighterBtn = createButton("Brighter BG");
  brighterBtn.position(16, 170);
  brighterBtn.mousePressed(() => veilAlpha = max(0, veilAlpha - 5));

  dimmerBtn = createButton("Dimmer BG");
  dimmerBtn.position(120, 170);
  dimmerBtn.mousePressed(() => veilAlpha = min(60, veilAlpha + 5));
}

function randomShapeColor() {
  shapeColor = color(random(360), 60, 100);
}

function draw() {
  drawMovingBlendBackground();

  push();
  blendMode(BLEND);
  translate(width * 0.65, height * 0.5);
  rotate(rotationAngle);


  const base = sizeSlider.value();


  const pulseOffset = isPulsing ? sin(frameCount * PULSE_SPEED) * PULSE_AMPLITUDE : 0;
  const s = base + pulseOffset;

  stroke(0, 0, 20, 40);
  strokeWeight(2);
  fill(shapeColor);

  const choice = shapeSelect.value();
  if (choice === "ellipse") {
    ellipse(0, 0, s * 1.25, s * 0.85);
  } else if (choice === "square") {
    rectMode(CENTER);
    rect(0, 0, s, s);
  } else if (choice === "triangle") {
    triangle(-s * 0.6, s * 0.5, 0, -s * 0.6, s * 0.6, s * 0.5);
  }
  pop();

  t += SPEED;
}

function mouseDragged() {
  rotationAngle += 0.05;
  isPulsing = true;
}

function mouseReleased() {
  isPulsing = false;
}

function drawMovingBlendBackground() {
  bgLayer.clear();
  bgLayer.blendMode(ADD);

  for (let i = 0; i < NUM_BLOBS; i++) {
    const x = noise(t + i * 0.31) * width;
    const y = noise(t + i * 0.31 + 100) * height;
    const r = map(noise(t + i * 0.47 + 200), 0, 1, 180, 460);
    const h = (frameCount * 0.4 + i * 55) % 360;

    bgLayer.fill(h, 35, 90, 7);
    bgLayer.ellipse(x, y, r, r);
    bgLayer.fill(h, 40, 95, 10);
    bgLayer.ellipse(x, y, r * 0.6, r * 0.6);
    bgLayer.fill(h, 45, 100, 13);
    bgLayer.ellipse(x, y, r * 0.35, r * 0.35);
  }

  noTint();
  image(bgLayer, 0, 0);

  push();
  noStroke();
  fill(0, 0, 100, veilAlpha); 
  rect(0, 0, width, height);
  pop();
}
