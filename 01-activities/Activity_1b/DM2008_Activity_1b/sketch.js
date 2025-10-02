
let x;
let y;
let w;

function setup() {
  createCanvas(800, 800);
  background(240);
}

function draw() {
  
  x = random(width);
  y = random(height);
  w = random(mouseY / 10 + 10);

  
  stroke(random(255), random(255), random(255));
  strokeWeight(random(0.5, 2));
  noFill();

  rect(x, y, w, w);
}

function mouseDragged() {
  
  noStroke();
  fill(random(255), random(255), random(255));
  rect(mouseX, mouseY, 10, 10);
}

function keyPressed() {
  
  saveCanvas("activity1b-image", "jpg");
}
