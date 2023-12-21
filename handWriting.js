/*
 * Authors: Group 8 -> Briggs Richardson, Ethan Ruiz, Yeongbin Kim,
 *                     Aruzhan Kazhigaliyeva
 * File: homeScreen.js
 * Description: The p5.js script for the hand writing activity game
 */


let originalNumBackgroundPixels = 0;
let originalNumLetterPixels = 0;
let newNumBackgroundPixels = 0;
let newNumLetterPixels = 0;
let accuracy = -1;
let firstTouch = false;

let letter = 'a';

let applause;

function preload() {
  soundFormats('mp3');
  applause = loadSound('applause.mp3');
}

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  background(58, 80, 107);            // Draw background of window

 // Display time and accuracy
  text("Accuracy: ", windowWidth / 2.0 - 0.5*textWidth("Accuracy: "), .18*windowHeight);


  // Line to separate title
  stroke('white');
  strokeWeight(1);
  line(0, .10*windowHeight, windowWidth, .10*windowHeight);

  // Square around text
  noFill();
  stroke('white');
  strokeWeight(3);
  rect(0.25*windowWidth, 0.3*windowHeight, 0.5*windowWidth, 0.6*windowHeight);

// Draw rect around time and accuracy
  rect(0.5*windowWidth - 2*textWidth("Accuracy"), 0.120*windowHeight, 4*textWidth("Accuracy"), 0.10*windowHeight);

  // Letter inside square
  noStroke();
  fill('white');
  let fontSize = 0.5*windowWidth;
  textSize(fontSize);
  while ((textAscent() + textDescent()) * 0.5 > 0.3*windowHeight) {
    textSize(fontSize--);
  }
  textAlign(CENTER);
  fill(color(221,221,221));
  text(letter, 0.50*windowWidth, 0.8*windowHeight);
  


  textAlign(LEFT);

}

function draw() {  
  //background(58, 80, 107);            // Draw background of window
  fill(58,80,107);
  noStroke();
  rect(0,0, windowWidth, 0.3*windowHeight);
  rect(0, 0.9*windowWidth, windowWidth, 0.1*windowHeight);
  
  // Title
  fill('white');
  textSize(40);
  text("Handwriting Exercise", windowWidth / 2.0 - 0.5*textWidth("Handwriting Exercise"), .075*windowHeight);
  
    // Draw arrow
  beginShape();
  vertex(15, 30);
  vertex(40, 10);
  vertex(40, 20);
  vertex(60, 20); 
  vertex(60, 40);
  vertex(40, 40);
  vertex(40, 50);
  endShape(CLOSE);
  
  // Display begin and restart instructions
  textSize(25);
  text("Start writing to begin!", windowWidth / 5.25 - 0.5*textWidth("Start writing to begin!"), .18*windowHeight);
  text("Press enter when finished!", windowWidth / 5.25 - 0.5*textWidth("Press enter when finished!"), .25*windowHeight);
  text("Press ESC to restart", windowWidth / 1.25 - 0.5*textWidth("Press ESC to restart"), .18*windowHeight);
  
  // Line to separate title
  stroke('white');
  strokeWeight(1);
  line(0, .10*windowHeight, windowWidth, .10*windowHeight);

  // Square around text
  noFill();
  stroke('white');
  strokeWeight(3);
  rect(0.25*windowWidth, 0.3*windowHeight, 0.5*windowWidth, 0.6*windowHeight);

// Draw rect around time and accuracy
  rect(0.5*windowWidth - 2*textWidth("Accuracy"), 0.120*windowHeight, 4*textWidth("Accuracy"), 0.10*windowHeight);

   // Display time and accuracy
  textSize(30);
  noStroke();
  fill('white');
  if (accuracy == -1) {
    text("Accuracy: ", windowWidth / 2.0 - 0.5*textWidth("Accuracy: "), .18*windowHeight);
  } else {
    text("Accuracy: " + accuracy + "%", windowWidth / 2.0 - 0.5*textWidth("Accuracy: "), .18*windowHeight);
  }
  
}

function mouseDragged() {
  strokeWeight(30);
  stroke(color(255, 165, 0));
  if (firstTouch == false) {
    firstTouch = true;
    countOriginalPixels();
  }
  if (mouseX > 0.24*windowWidth && mouseX < 0.74*windowWidth &&
      mouseY > 0.31*windowHeight && mouseY < 0.89*windowHeight) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
  return false;
}

function mousePressed() {
  if (dist(mouseX, mouseY, 40, 30) < 30)
      window.open("index.html", "_self");
}

function keyPressed() {
  if (keyCode == ENTER) {
    computeAccuracy();
  }
  if (keyCode == ESCAPE) {
    if (letter == 'a')
      letter = 'b';
    else if (letter == 'b')
      letter = 'c';
    else if (letter == 'c')
      letter = 'd';
    else if (letter == 'd')
      letter = 'e';
    else if (letter == 'e')
      letter = 'f';
    else if (letter == 'f')
      letter = 'g';
    else if (letter == 'g')
      letter = 'h';
    else if (letter == 'h')
      letter = 'i';
    else if (letter == 'i')
      letter = 'j';
    else if (letter == 'j')
      letter = 'k';
    else if (letter == 'k')
      letter = 'l';
    else if (letter == 'l')
      letter = 'm';
    else if (letter == 'm')
      letter = 'n';
    else if (letter == 'n')
      letter = 'o';
    else if (letter == 'o')
      letter = 'p';
    else if (letter == 'p')
      letter = 'q';
    else if (letter == 'q')
      letter = 'r';
    else if (letter == 'r')
      letter = 's';
    else if (letter == 's')
      letter = 't';
    else if (letter == 't')
      letter = 'u';
    else if (letter == 'u')
      letter = 'v';
    else if (letter == 'v')
      letter = 'w';
    else if (letter == 'w')
      letter = 'x';
    else if (letter == 'x')
      letter = 'y';
    else if (letter == 'y')
      letter = 'z';
    else if (letter == 'z')
      letter = 'a';
    
    
    resetExercise();
  }
}

function computeAccuracy() {
  loadPixels();
  let d = pixelDensity();
  let fullHeight = 4 * (width * d) * (height * d);
  
 
  for (let i = 0; i < fullHeight; i += 4) {
    if (pixels[i] == 221 && pixels[i+1] == 221 && pixels[i+2] == 221) {
      ++newNumLetterPixels;
    }
    if (pixels[i] == 58 && pixels[i+1] == 80 && pixels[i+2] == 107) {
      ++newNumBackgroundPixels;
    }
    
  }
  accuracy = round(((originalNumLetterPixels - newNumLetterPixels) / originalNumLetterPixels) * 100);
  accuracy -= round(((originalNumBackgroundPixels - newNumBackgroundPixels) / originalNumBackgroundPixels) * 100);
  
  if (accuracy < 0)
    accuracy = 0;
  
  if (accuracy > 80)
    applause.play();
  
 
  newNumBackgroundPixels = 0;
  newNumLetterPixels = 0;
}

function resetExercise() {
  originalNumBackgroundPixels = 0;
  originalNumLetterPixels = 0;
  newNumBackgroundPixels = 0;
  newNumLetterPixels = 0;
  accuracy = -1;
  firstTouch = false;
  setup();
}

function countOriginalPixels() {
  loadPixels();
  let d = pixelDensity();
  let fullHeight = 4 * (width * d) * (height * d);
  
  for (let i = 0; i + 6 < fullHeight; i += 4) {
    if (pixels[i] == 221 && pixels[i+1] == 221 && pixels[i+2] == 221) {
      ++originalNumLetterPixels;
    }
    if (pixels[i] == 58 && pixels[i+1] == 80 && pixels[i+2] == 107) {
      ++originalNumBackgroundPixels;
    }   
  }
}




