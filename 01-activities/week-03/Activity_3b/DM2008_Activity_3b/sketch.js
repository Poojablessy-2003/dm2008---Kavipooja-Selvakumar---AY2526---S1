// DM2008 — Activity 3b
// (One Function Wonder, 15 min)

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background(220);
  for(let i = 0; i < 20; i++){
    
    myShape(100, 200, 50);

  }
  

}
  // TODO 1:
  // Define a function that draws something (a shape or group of shapes).
function myShape(x, y, size, color){
  fill(random(255), random(255), random(255));
  ellipse(x, y, size, size);
}
  // It should take at least one parameter (e.g., position, size, or color).

  // TODO 2:
  // Call your function multiple times with different parameter values.
  
  //myShape(300, 200, 80);

  // TODO 3:
  // (Challenge) Call your function inside a for loop
  // to create a repeating pattern or variation.


// Example starter function:
// function myShape(x, y, s) {
//   ellipse(x, y, s, s);
// }