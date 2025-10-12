// DM2008 — Activity 3a
// (Array Sampler, 25 min)

// 1. Create an array of colors (or other values)
//    You can make more than one array if you'd like
let palette = ["#f06449", "#009988", "#3c78d8", "#ffeb3b"];

// 2. A variable to track the current index
let currentIndex = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
    background(220);

  // Even spacing based on how many items are in the array
  const spacing = width / (palette.length + 1);

  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]); // Set the fill before drawing

    const x = (i + 1) * spacing; // X position
    const y = height / 2;        // Y position

    if (i % 2 === 0) {
      // Even index → draw ellipse
      ellipse(x, y, 60);
    } else {
      // Odd index → draw rectangle
      rectMode(CENTER); // So it aligns like ellipse
      rect(x, y, 60, 60);
    }
  }


}

// 4. Change the index when a key is pressed
// function mousePressed() {
//   // Advance to the next item
//   currentIndex++;
//   // Reset to 0 when we reach the end
//   if (currentIndex >= palette.length) {
//     currentIndex = 0;
//   }
  
//   // Log in the console to check
//   console.log("Current index:", currentIndex, "→", palette[currentIndex]);
// }

function keyPressed() {
  if (key == 'a' || key == 'A') {
    // Add a new random color to the end
    palette.push(color(random(255), random(255), random(255)));
  }
  if (key == 'r' || key == 'R' ) {
    // Remove the last color (if any)
    if (palette.length > 0) {
      palette.splice(palette.length - 1, 1);
    }
  }
  
   // Log in the console to check
  console.log("Current index:", currentIndex, "→", palette[currentIndex]);

}

/* 
TODOs for students:
1. Replace colors with your own data (positions, text, sizes, etc).
2. Try mousePressed() instead of keyPressed().
3. Use push() to add new items, or splice() to remove them, then check how the sketch adapts.
4. Try looping through an array to visualize all the items within it instead of accessing one item at a time.
*/