// DM2008 – Activity 5a
// Colliding Circles (30 min)

let balls = [];

function setup() {
  createCanvas(400, 400);

  // Step 1: create two Ball objects at random positions
  balls.push(new Ball(random(width), random(height)));
  balls.push(new Ball(random(width), random(height)));
}

function draw() {
  background(230);

  // Step 2: update and display each ball
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.move();
    b.show();
  }

  // Step 3: check collisions between the two balls
  if (balls[0].checkCollision(balls[1])) {
    // Reverse their velocities as a simple "bounce"
    balls[0].vel.mult(-1);
    balls[1].vel.mult(-1);

    // Extra feedback: change color temporarily
    fill(255, 100, 100);
    ellipse(balls[0].pos.x, balls[0].pos.y, balls[0].r * 2);
    ellipse(balls[1].pos.x, balls[1].pos.y, balls[1].r * 2);
  }
}

class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = 30;
    this.vel = createVector(random(-2, 2), random(-2, 2));
  }

  move() {
    this.pos.add(this.vel);

    // Bounce off left/right edges
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
    }

    // Bounce off top/bottom edges
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
    }
  }

  show() {
    fill(100, 180, 220);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  // Step 4: Add a method to checkCollision(other)
  checkCollision(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    return d < this.r + other.r; // overlap when distance < sum of radii
  }
}
