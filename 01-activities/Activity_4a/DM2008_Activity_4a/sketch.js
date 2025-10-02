// DM2008 – Activity 4a
// Bake a Cookie (30 min)

let cookie;
let showMac = false; 
let showBlu = false;

function setup() {
  createCanvas(400, 400);
  noStroke();

  // Step 3: make one cookie object
  cookie = new Cookie("macademia", 80, width/2, height/2);
  blueberry = new Cookie ("blueberry",100,width/3,height/3);
}

function draw() {
  background(230);
  if (showMac){
    cookie.show();
  } 
  if (showBlu){
    blueberry.show();
  } 

  // Step 4: call the cookie’s show() method
  // cookie.show();
  // blueberry.show()
}

// Step 1: define the Cookie class
class Cookie {
  constructor(flavor, sz, x, y) {
    // set up required properties
    this.flavor = flavor;
    this.sz = sz;
    this.x = x;
    this.y = y;
  }

  // Step 2: display the cookie
  show() {
    if (this.flavor == "macademia") {
      fill(213, 198, 172);
    } 
    if (this.flavor == "blueberry") {
      fill(42,57,83);
    }
  
    ellipse(this.x, this.y, this.sz);
    
    const s = this.sz * 0.1;
    fill("#fff");
    ellipse(this.x - this.sz*0.22, this.y - this.sz*0.15, s);
    ellipse(this.x + this.sz*0.18, this.y - this.sz*0.10, s);
    ellipse(this.x - this.sz*0.05, this.y + this.sz*0.12, s);
    ellipse(this.x + this.sz*0.20, this.y + this.sz*0.18, s);
  }
  
  // Steps 5 & 6: Implement additional methods here
    
}

// Step 5: add movement (keyboard arrows)
function keyPressed() {
 
  if (key == 'M') {
    showMac = true; 
  }
  if (key == 'b') {
    showBlu = true; 
  }
}

// Step 6: add flavor randomizer (mouse click)
// function mousePressed() {}