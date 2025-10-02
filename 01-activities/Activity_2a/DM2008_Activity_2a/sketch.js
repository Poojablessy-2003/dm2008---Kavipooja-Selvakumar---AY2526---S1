// DDM2008 — Activity 2a
// (Mode Switch, 20 min)

let x = 0;        // ellipse x-position
let size = 50;    // ellipse size (you can change this in your if/else)
let bgColor;      // background color set by switch(key)

function setup() {
  createCanvas(400,150);
  bgColor = color(220);
}

function draw() {
  background(bgColor);

  // --- Movement (base behaviour) ---
  // The ellipse moves to the right each frame.
  // If you decide to control speed with an if/else below,
  // REMOVE or comment out this next line so you don't "double add" to x.
  //x += 2;

  // Wrap around when it exits the right edge
  if (x > width + size / 2) {
    x = 0;
  }

  // --- Your if/else goes here (choose ONE behaviour rule) ---
  // Examples (uncomment ONE idea, or write your own):
  //
  // 1) Change colour on mouse press
  if (mouseIsPressed) {
    fill(255, 0, 0);
  } else {
    fill(0);
  }
  //
  // 2) Change size on right half
  // if (x > width / 2) {
  //   size = 80;
  // } else {
  //   size = 50;
  // }
  //
  // 3) Change speed using mouse position (THEN comment out x += 2; above)
  if (mouseX > width / 2) {
    x += 10; // faster on right
  } else {
    x += 2; // slower on left
  }
  //
  // Keep it simple: one clear rule that is easy to see on screen.

  // --- Draw the ellipse (after your if/else so changes apply this frame) ---
  // If you didn't set fill() in your rule above, it will be black.
  // fill(0);
  //ellipse(x, height / 2, size);

  // Stretch (optional, if you finish early):
  // - Draw a rect instead of an ellipse when mouseIsPressed.
  rect(x, height / 2, size);
  ellipse(x/4, height / 2, size);
  
}

// --- Mode switching with number keys: 1, 2, 3 ---
function keyPressed() {
  switch (key) {
    case '1':
      bgColor = color(200, 100, 100); // red
      break;
    case '2':
      bgColor = color(100, 200, 100); // green
      break;
    case '3':
      bgColor = color(100, 100, 200); // blue
      break;
    default:
      bgColor = color(220);           // grey
  }
}