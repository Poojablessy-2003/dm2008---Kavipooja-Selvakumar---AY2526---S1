// DDM2008 — Activity 2b
// (Pattern Making, 40 min)

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(250, 174, 174);

  for (let i = 0; i < width; i += 50) {
    let index = i / 50;   
    let s = 20 + (index % 3) * 10; 

    if (mouseIsPressed) {
      fill(255, random(100,200), random(200,255));  
    } else {
      if (index % 2 == 0) {
        fill(193, 0, 215); 
      } else {
        fill(180); 
      }
    }

  
    if (index % 3 == 0) {
      ellipse(i + 25, height / 2, s);
    } else if (index % 3 == 1) {
      rect(i + 10, height / 2 - s/2, s, s);
    } else {
      triangle(i + 25, height / 2 - s/2, i + 5, height / 2 + s/2, i + 45, height / 2 + s/2);
    }
  }
}
