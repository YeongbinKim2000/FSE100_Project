/*
 * Authors: Group 8 -> Briggs Richardson, Ethan Ruiz, Yeongbin Kim,
 *                     Aruzhan Kazhigaliyeva
 * File: homeScreen.js
 * Description: The p5.js script for the homescreen of the website.
 *              It displays the title of the website, 3 clickable 
 *              circles for navigation to the three FMS activities,
 *              and an about button.
 *             
 *              Also, experimental: Floating circles in the background
 *              for looks
 */

// X-coordinates of typing, selecting apps, and handwriting elements
let typingX;
let appX;
let handwritingX;
let circleHeight;

let floatingBubbles = [];
let numBubbles = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);          
  typingX = (2/12)*windowWidth;
  appX = (6/12)*windowWidth;
  handwritingX = (10/12)*windowWidth;
  circleHeight = (1/2)*windowHeight;

  // Add 30 bubbles to the floatingBubbles array
  for (let i = 0; i < numBubbles; i++) {
    floatingBubbles.push(new Bubble());
  }
}

function draw() {
    background(58, 80, 107);            // Draw background of window

    // Draw bubbles
    noStroke();
    fill(58, 94, 107);
    for (let i = 0; i < floatingBubbles.length; i++) {
        floatingBubbles[i].display();
        floatingBubbles[i].update();
    }

    // Draw rest of home screen
    drawFirstLayer();
}

// Draws the homescreen title, activity circles, and about rectangle
function drawFirstLayer() {
  stroke(1);
  strokeWeight(4); 

  fill(28, 37, 65);                             // Color for shapes on screen 

  // Shapes on screen
  circle (typingX, circleHeight, 325);
  circle (appX, circleHeight, 325);
  circle (handwritingX, circleHeight, 325);
  rect (0, 40, windowWidth, 150);                     // Rectangle underneath title

  // Text on screen
  fill(255);                                    // Set text color to white
  textAlign(CENTER);
  textSize(10);

  textSize(60);
  text('Fine Motor Skill Practice', windowWidth/2, windowHeight/7.5);
  
  textSize(40);
  text('Typing', typingX, circleHeight);
  text('Handwriting', handwritingX, circleHeight);
  text('App Selection', appX, circleHeight);

  textSize(32);
  text('Select as many apps as possible', windowWidth/2, windowHeight/1.35);
  text('before the time runs out!', windowWidth/2, windowHeight/1.28);
  text('Type the paragraph as', windowWidth/6, windowHeight/1.35);
  text('quickly as you can!', windowWidth/6, windowHeight/1.28);
  text('Match the handwriting as', windowWidth/1.2, windowHeight/1.35);
  text('closely as you can!', windowWidth/1.2, windowHeight/1.28);
}

// Let the user navigate the website by pressing the big activity circles
function mousePressed() {
  if (dist(mouseX, mouseY, typingX, circleHeight) < 125)
      window.open("typingPage.html", "_self");
  else if (dist(mouseX, mouseY, appX, circleHeight) < 125)
      window.open("appSelectionPage.html", "_self")
  else if (dist(mouseX, mouseY, handwritingX, circleHeight) < 125)
      window.open("handWritingPage.html", "_self");
}

// Class Bubble -> circles to float in background
class Bubble {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.xVel = random(-1, 1);
    this.yVel = random(-1, 1);
    this.diameter = random(80, 140);
  }

  display() {
    circle(this.x, this.y, this.diameter);
  }

  update() {
    this.x += this.xVel;
    this.y += this.yVel;
    // If circles hit a wall, have it change its direction 180 degrees
    if (this.x < 0 || this.x > windowWidth)
      this.xVel = this.xVel * -1;
    if (this.y < 0 || this.y > windowHeight)
      this.yVel = this.yVel * -1;
  }
}
