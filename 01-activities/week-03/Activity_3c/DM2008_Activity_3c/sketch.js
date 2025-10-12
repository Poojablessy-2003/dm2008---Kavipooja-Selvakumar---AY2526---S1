// DM2008 — Activity 3b
// (Painting App, 50 min)

// 1) Palette + size
const palette = ["#f06449", "#009988", "#3c78d8", "#eeeeee"];
let colorIndex = 0;
let sizeVal = 20;
let eraserMode = false;

// 2) Brush registry (array of functions)
const brushes = [brushCircle, brushSquare, brushStreak, brushCross];
let currentBrush = 0; // 0, 1, or 2,

const BG = 240;

function setup() {
  createCanvas(600, 600);
  background(BG);
  rectMode(CENTER);
}

function draw() {
  if (mouseIsPressed) {
    if (eraserMode) {
      // real eraser: removes pixels regardless of background color
      erase();
      ellipse(mouseX, mouseY, sizeVal);  // round eraser
      noErase();
    } else {
      const col = palette[colorIndex];
      brushes[currentBrush](mouseX, mouseY, col, sizeVal);
    }
  }
}


// 3) Brush functions (students can customize/extend)
function brushCircle(x, y, c, s) {
  noStroke();
  fill(c);
  ellipse(x, y, s);
}

function brushSquare(x, y, c, s) {
  push();
  translate(x, y);
  noStroke();
  fill(c);
  rect(0, 0, s, s);
  pop();
}

function brushStreak(x, y, c, s) {
  stroke(c);
  strokeWeight(max(2, s / 8));
  point(x,y);
}

function brushCross(x, y, c, s) {
  push();              
  stroke(c);            
  strokeWeight(4);      
  
  line(x - s/2, y - s/2, x + s/2, y + s/2);
  line(x - s/2, y + s/2, x + s/2, y - s/2);
  pop();               
}

// 4) Brush UI: select brush, cycle color, change size, clear
function keyPressed() {
  switch (key) {
    case '1':
      currentBrush = 0; // circle
      break;
    case '2':
      currentBrush = 1; // square
      break; 
    case '3':
      currentBrush = 2; // streak
      break;
    case '4':
      currentBrush = 3; // cross
      break;
  }
  console.log('currentBrush =', currentBrush);
  
  if (key == 'C' || key == 'c') {
    colorIndex = (colorIndex + 1) % palette.length; // cycle color
  }
  if (key == '+' || key == '=') {
    sizeVal += 4;
  }
  if (key == '-' || key == '_') {
    sizeVal = max(4, sizeVal - 4);
  } 
  if (key == 'X' || key == 'x'){
    background(BG);
  }     
  

  // TODO: add an 'E' (eraser) mode by painting with background color
  // e.g., if eraserMode, use color(240) instead of palette[colorIndex]
}