/*
 * Authors: Group 8 -> Briggs Richardson, Ethan Ruiz, Yeongbin Kim,
 *                     Aruzhan Kazhigaliyeva
 * File: typing.js
 * Description: The p5.js script for the typing page of the website.
 *              It displays a block of text, with the string paragraph,
 *              and displays it using a custom print function. It then
 *              allows the user to type in the text, showing green letters
 *              for correct input, and red for typos.
 */

let paragraph = "Gave read use way make spot how nor. In daughter goodness an likewise oh consider at procured wandered. Songs words wrong by me hills heard timed. Happy eat may doors songs. Be ignorant so of suitable dissuade weddings together. Least whole timed we is. An smallness deficient discourse do newspaper be an eagerness continued. Mr my ready guest ye after short at."

/* Array of integers corresponding to respective indicies in paragraph.
 * -1: incorrect character input, 0: unattempted, 1: correct character input */
let keyStatus = [];           

/* keyboardStatus stores status of every keyboard key
 * 0: means key is not pressed. 1: pressed */
let keyboardStatus = [];

let currentCharacter = 0;     // current character index being typed
let blockWidth;

let startingTime = -1;
let finalTime = -1;
let numberCorrectKeys = 0;
let wpm = 0;
let accuracy = 0;

let applause;


function preload() {
  soundFormats('mp3');
  applause = loadSound('applause.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(58, 80, 107);            // Draw background of window
  blockWidth = 0.70*windowWidth;

  // Set all keyStatuses to 0 - user hasn't typed yet.
  for (let i = 0; i < paragraph.length; i++) {
    keyStatus.push(0);    
  }

  for (let i = 0; i < 32; i++) {
    keyboardStatus[i] = 0;
  }

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

  // Draw rect around keyboard
  noFill();
  stroke('white');
  strokeWeight(4);
  rect(0.22*windowWidth, 0.62*windowHeight, 0.56*windowWidth, 0.35*windowHeight);
  
  // Draw rect around text
  rect(0.22*windowWidth, 0.25*windowHeight, 0.56*windowWidth, 0.35*windowHeight);

  // Draw rect around wpm and accuracy
  rect(0.5*windowWidth - 2*textWidth("Accuracy"), 0.120*windowHeight, 4*textWidth("Accuracy"), 0.10*windowHeight);
 

  // Line to separate title
  line(0, .10*windowHeight, windowWidth, .10*windowHeight);

  stroke('black');
  strokeWeight(1);

  fill('white');
  textSize(45);
  // Title
  text("Typing Exercise", windowWidth / 2.0 - 0.5*textWidth("Typing Exercise"), .075*windowHeight);

  fill(255);
  noStroke();
  displayText();                      // Display text to type
  drawKeyboard();
  computeAndDisplayAccuracy();
  computeAndDisplayWPM();

  frameRate(3);
}

function draw() {
  // Clear past written accuracy and wpm
  noStroke();
  fill(color(58, 80, 107));
  rect(0.5*windowWidth - 2*textWidth("Accuracy"), 0.120*windowHeight, 4*textWidth("Accuracy") - .02*textWidth("Accuracy"), 0.10*windowHeight);
  computeAndDisplayAccuracy();
  computeAndDisplayWPM();

  textSize(25);
  if (currentCharacter == 0) {
    text("Start typing to begin!", 0.20*windowWidth - textWidth("Start typing to begin!") / 2.0, 0.15*windowHeight);
  } else {
    fill(color(58, 80, 107));
    noStroke();
    rect(0.20*windowWidth - textWidth("Start typing to begin!") / 2.0,  0.12*windowHeight, textWidth("Start typing to begin..."), 0.10*windowHeight);
  }

  fill('white')
  stroke(1);
  text("Press ESC to restart", 0.80*windowWidth - textWidth("Press ESC to restart") / 2.0, 0.15*windowHeight);
}

// If user clicks arrow, then send them back to homescreen
function mousePressed() {
  if (dist(mouseX, mouseY, 40, 30) < 30)
    window.open("index.html", "_self");
}

// This function is called when the user types in a key. We will, if valid,
// set the corresponding key value in keyStatus so displayText can be updated
function keyTyped() {
  if (currentCharacter < paragraph.length && (key >= 'a'  && key <= 'z') || (key >= 'A' && key <= 'Z') || key == ' '
       || key == '.' || key == '!' || key == '?' || key == "'") { 

    setKeyboardKeyOn(key);
    isCorrect = (key == paragraph[currentCharacter]);

    if (currentCharacter == 0) {
      startingTime = millis();    
    }

    if (isCorrect) {
      if (keyStatus[currentCharacter] == 0) {
        numberCorrectKeys++;
        keyStatus[currentCharacter] = 1;
      } 
      ++currentCharacter;
    }
    else {
      keyStatus[currentCharacter] = -1;
    }


    displayText();
    drawKeyboard();
  }
  if (finalTime == -1 && currentCharacter == paragraph.length) {
    finalTime = millis();
    popupResult();
    applause.play();
  }
}

function keyReleased() {
    setKeyboardKeyOff(key);
    drawKeyboard();
}

function setKeyboardKeyOn(letter) {
  if (letter == 'q' || letter == 'Q')
    keyboardStatus[1] = 1;
}

function setKeyboardKeyOff(letter) {
  if (letter == 'q' || letter == 'Q')
    keyboardStatus[1] = 0;


}

// This function is called when the user types the "ESC" key to reset the text
function keyPressed() {
  if (keyCode == ESCAPE)
      resetText();
}

// Resets the text to the start
function resetText() {
  // Reset text 
  noStroke();
  fill(color(58, 80, 107));
  rect(0.22*windowWidth, 0.25*windowHeight, 0.56*windowWidth, 0.35*windowHeight);
  currentCharacter = 0;
  for (let i = 0; i < keyStatus.length; i++) {
    keyStatus[i] = 0;
  }
  startingTime = -1;
  finalTime = -1;
  numberCorrectKeys = 0;
  displayText();
}

// Computes the width of the next word starting at charIndex in paragraph
function nextWordWidth(charIndex) {
  let totalWidth = 0;
  while (charIndex < paragraph.length && paragraph[charIndex] != " ") {
    totalWidth += textWidth(paragraph[charIndex]);
    ++charIndex;
  }    
  return totalWidth;
}

// Custom text display function. Uses the keyStatus array to determine
// color of each character in the string: paragraph
function displayText() {
  // Clear text area
  fill(58, 80, 107);            // Draw background of window
  noStroke();
  // Draw rect around text
  rect(0.24*windowWidth, 0.27*windowHeight, 0.50*windowWidth, 0.32*windowHeight);

  textSize(30);

  fill(255);
  let index = 0;     // current index of paragraph to be printed 
  let yPos = 0.30*windowHeight;    // Starting y-coordinate of text to be printed
  let xPos = 0.30*windowWidth;    // Starting x-coordinate of text to be printed
  let wordWidth = 0;
  let totalWidthSum = 0;
  let nextWidth = 0;

  // Loop contents print the paragraph text to the screen (with color validation)
  while (index < paragraph.length) {
    if ((index - 1) == -1 || paragraph[index-1] == " " ) {
      nextWidth = nextWordWidth(index);
      if (xPos + nextWidth > blockWidth) {
        xPos = 0.30*windowWidth;
        yPos += 35;
      }
    }

    if (index == currentCharacter) {
      fill('white');
      rect(xPos, yPos, textWidth(paragraph[index]), 5);
    }

    // Set proper color based on typing status
    if (keyStatus[index] == 0)
      fill('white');
    else if (keyStatus[index] == 1)
      fill('green');
    else 
      fill('red');

    // Draw character to screen
    text(paragraph[index], xPos, yPos);

    // if typo on a space, show a red rectangle
    if (keyStatus[index] == -1 && paragraph[index] == " ") {
       rect(xPos + 1, yPos - textAscent(paragraph[index]), textWidth(paragraph[index]) - 2, 20);
    }

    // update xPos and index
    xPos += textWidth(paragraph[index]);
    ++index;
  }
}


function computeAndDisplayWPM() {
  fill('white');
  textSize(25);
  if (startingTime == -1) {
    text("WPM:", windowWidth / 2.0 - textWidth("WPM: ...") / 2.0, 0.16*windowHeight);
    return;
  }

  let currentTime = millis() - startingTime;

  if (finalTime == -1)
    wpm = (numberCorrectKeys / 5.0) / (currentTime / (1000*60));
  else 
    wpm = (numberCorrectKeys / 5.0) / ((finalTime - startingTime) / (1000*60));

  wpm = round(wpm);

  text("WPM: " + wpm, windowWidth / 2.0 - textWidth("WPM: ...") / 2.0, 0.16*windowHeight);
}


function computeAndDisplayAccuracy() {
  fill('white');
  textSize(25);
  if (currentCharacter == 0) {
    text("Accuracy:", windowWidth / 2.0 - textWidth("Accuracy: ...") / 2.0, 0.2*windowHeight);
    return;
  }

  accuracy = (numberCorrectKeys / currentCharacter) * 100.0;
  accuracy = round(accuracy, 3);

  text("Accuracy: " + accuracy + "%", windowWidth / 2.0 - textWidth("Accuracy: ...") / 2.0, 0.2*windowHeight);
}

function popupResult() {
     fill(50, 80, 107);
     rect(0.22*windowWidth, 0.25*windowHeight, 0.56*windowWidth, 0.35*windowHeight);
     fill('white');
     textAlign(CENTER);
     textSize(35);
     text("Final WPM : " + wpm, windowWidth / 2, (windowHeight / 2 - 50));
     text("Final Accuracy : " + accuracy + "%", windowWidth / 2, (windowHeight / 2 - 20));
     textAlign(LEFT);
}

function drawKeyboard() {
  noStroke();
  fill(255);
  let topRowHeight = (6.6/10.0)*windowHeight;
  let middleRowHeight = (7.3/10)*windowHeight;
  let bottomRowHeight = (8.0/10)*windowHeight;
  let spacebarHeight = (8.7/10)*windowHeight;
  let standardKeyHeight = (0.6/10)*windowHeight;
  let standardKeyWidth = (0.4/10)*windowWidth;
  let startingX = 0.25*windowWidth;
  let xIncrement = 0.045 * windowWidth;
  // Top Row
  let x = startingX;

  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[1] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // q
  x += xIncrement;
  if (keyboardStatus[2] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // w
  x += xIncrement;
  if (keyboardStatus[3] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // e
  x += xIncrement;
  if (keyboardStatus[4] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // r 
  x += xIncrement;
  if (keyboardStatus[5] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // t
  x += xIncrement;
  if (keyboardStatus[6] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // y 
  x += xIncrement;
  if (keyboardStatus[7] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // u
  x += xIncrement;
  if (keyboardStatus[8] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // i 
  x += xIncrement;
  if (keyboardStatus[9] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // o
  x += xIncrement;
  if (keyboardStatus[10] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, topRowHeight, standardKeyWidth, standardKeyHeight); // p
  // Middle row
  x = startingX - 0.2*standardKeyWidth;
  rect(x, middleRowHeight, 1.50*standardKeyWidth, standardKeyHeight);
  x += 1.60*standardKeyWidth;
  if (keyboardStatus[12] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[13] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[14] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[15] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[16] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[17] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[18] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[19] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[20] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[21] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, middleRowHeight, standardKeyWidth, standardKeyHeight);
  // Last row
  x = startingX - 0.3*standardKeyWidth;
  rect(x, bottomRowHeight, 1.70*standardKeyWidth, standardKeyHeight);
  x += 1.80*standardKeyWidth;
  if (keyboardStatus[23] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[24] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[25] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[26] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[27] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[28] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  if (keyboardStatus[29] == 1)
    fill('yellow');
  else 
    fill('white');
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  fill('white');
  x += xIncrement;
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  x += xIncrement;
  rect(x, bottomRowHeight, standardKeyWidth, standardKeyHeight);
  // Space Bar
  x = startingX + .32*10*standardKeyWidth;
  rect(x, spacebarHeight, 350, 40);
  // Display Letters
  textSize(20);
  fill(0);
  // First Row
  x = startingX + 0.3*standardKeyWidth;
  text('Esc', x-.15*standardKeyWidth, topRowHeight + 0.035*windowHeight);
  x += xIncrement + .05 * standardKeyWidth;
  text('Q', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('W', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('E', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('R', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('T', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('Y', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('U', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('I', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('O', x, topRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('P', x, topRowHeight + 0.035*windowHeight);
  // Second Row
  x = startingX + 0.20*standardKeyWidth;
  text('Caps', x - .1*standardKeyWidth, middleRowHeight + 0.035*windowHeight);
  x += 1.20*standardKeyWidth + .008*windowWidth;
  text('A', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('S', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('D', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('F', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('G', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('H', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('J', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('K', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('L', x, middleRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('"', x, middleRowHeight + 0.035*windowHeight);
  //Third Row
  x = startingX + 0.3*standardKeyWidth;
  text('Shift', x-.1*standardKeyWidth, bottomRowHeight+ 0.035*windowHeight);
  x += 1.40*standardKeyWidth + 0.008*windowWidth;
  text('Z', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('X', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('C', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('V', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('B', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('N', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('M', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text(',', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('.', x, bottomRowHeight + 0.035*windowHeight);
  x += xIncrement;
  text('?', x, bottomRowHeight + 0.035*windowHeight);
  // Space Bar
  fill('black');
  x = startingX + .58*10*standardKeyWidth;
  text('Space', x, spacebarHeight + 0.035*windowHeight);
}


function setKeyboardKeyOn(letter) {
  // Top row
  if (letter == 'q' || letter == 'Q')
    keyboardStatus[1] = 1;
  if (letter == 'w' || letter == 'W')
    keyboardStatus[2] = 1;
  if (letter == 'e' || letter == 'E')
    keyboardStatus[3] = 1;
  if (letter == 'r' || letter == 'R')
    keyboardStatus[4] = 1;
  if (letter == 't' || letter == 'T')
    keyboardStatus[5] = 1;
  if (letter == 'y' || letter == 'Y')
    keyboardStatus[6] = 1;
  if (letter == 'u' || letter == 'U')
    keyboardStatus[7] = 1;
  if (letter == 'i' || letter == 'I')
    keyboardStatus[8] = 1;
  if (letter == 'o' || letter == 'O')
    keyboardStatus[9] = 1;
  if (letter == 'p' || letter == 'P')
    keyboardStatus[10] = 1;

  // Middle row
  if (letter == 'a' || letter == 'A')
    keyboardStatus[12] = 1;
  if (letter == 's' || letter == 'S')
    keyboardStatus[13] = 1;
  if (letter == 'd' || letter == 'D')
    keyboardStatus[14] = 1;
  if (letter == 'f' || letter == 'F')
    keyboardStatus[15] = 1;
  if (letter == 'g' || letter == 'G')
    keyboardStatus[16] = 1;
  if (letter == 'h' || letter == 'H')
    keyboardStatus[17] = 1;
  if (letter == 'j' || letter == 'J')
    keyboardStatus[18] = 1;
  if (letter == 'k' || letter == 'K')
    keyboardStatus[19] = 1;
  if (letter == 'l' || letter == 'L')
    keyboardStatus[20] = 1;

  // Bottom row
  if (letter == 'z' || letter == 'Z')
    keyboardStatus[23] = 1;
  if (letter == 'x' || letter == 'X')
    keyboardStatus[24] = 1;
  if (letter == 'c' || letter == 'C')
    keyboardStatus[25] = 1;
  if (letter == 'v' || letter == 'V')
    keyboardStatus[26] = 1;
  if (letter == 'b' || letter == 'B')
    keyboardStatus[27] = 1;
  if (letter == 'n' || letter == 'N')
    keyboardStatus[28] = 1;
  if (letter == 'm' || letter == 'M')
    keyboardStatus[29] = 1;

  
}

function setKeyboardKeyOff(letter) {
  // Top row
  if (letter == 'q' || letter == 'Q')
    keyboardStatus[1] = 0;
  if (letter == 'w' || letter == 'W')
    keyboardStatus[2] = 0;
  if (letter == 'e' || letter == 'E')
    keyboardStatus[3] = 0;
  if (letter == 'r' || letter == 'R')
    keyboardStatus[4] = 0;
  if (letter == 't' || letter == 'T')
    keyboardStatus[5] = 0;
  if (letter == 'y' || letter == 'Y')
    keyboardStatus[6] = 0;
  if (letter == 'u' || letter == 'U')
    keyboardStatus[7] = 0;
  if (letter == 'i' || letter == 'I')
    keyboardStatus[8] = 0;
  if (letter == 'o' || letter == 'O')
    keyboardStatus[9] = 0;
  if (letter == 'p' || letter == 'P')
    keyboardStatus[10] = 0;

  // Middle row
  if (letter == 'a' || letter == 'A')
    keyboardStatus[12] = 0;
  if (letter == 's' || letter == 'S')
    keyboardStatus[13] = 0;
  if (letter == 'd' || letter == 'D')
    keyboardStatus[14] = 0;
  if (letter == 'f' || letter == 'F')
    keyboardStatus[15] = 0;
  if (letter == 'g' || letter == 'G')
    keyboardStatus[16] = 0;
  if (letter == 'h' || letter == 'H')
    keyboardStatus[17] = 0;
  if (letter == 'j' || letter == 'J')
    keyboardStatus[18] = 0;
  if (letter == 'k' || letter == 'K')
    keyboardStatus[19] = 0;
  if (letter == 'l' || letter == 'L')
    keyboardStatus[20] = 0;

  // Bottom row
  if (letter == 'z' || letter == 'Z')
    keyboardStatus[23] = 0;
  if (letter == 'x' || letter == 'X')
    keyboardStatus[24] = 0;
  if (letter == 'c' || letter == 'C')
    keyboardStatus[25] = 0;
  if (letter == 'v' || letter == 'V')
    keyboardStatus[26] = 0;
  if (letter == 'b' || letter == 'B')
    keyboardStatus[27] = 0;
  if (letter == 'n' || letter == 'N')
    keyboardStatus[28] = 0;
  if (letter == 'm' || letter == 'M')
    keyboardStatus[29] = 0;
}


