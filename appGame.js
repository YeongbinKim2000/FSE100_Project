/*
 * Authors: Group 8 -> Briggs Richardson, Ethan Ruiz, Yeongbin Kim,
 *                     Aruzhan Kazhigaliyeva
 * File: homeScreen.js
 * Description: The p5.js script for the app selection game
 */

let apps = [];
let NUM_APPS = 4;
let timerValue = 30;
let timer;
let score = 0;
let gameOn = false;
let gameEnded = false;

let click;
let applause;

function preload() {
  soundFormats('mp3');
  click = loadSound('click.mp3');
  applause = loadSound('applause.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(58, 80, 107);            // Draw background of window

  for (var i = 0; i < NUM_APPS; i++) {
    apps.push(new Application(i));   
  }
  for (var i = 0; i < NUM_APPS; i++) {
    apps[i].setArray(apps, NUM_APPS);
  }
  for (var i = 0; i < NUM_APPS; i++) {
    apps[i].generateUniqueXY();
  }
  frameRate(15);
}

function draw() {
  background(58, 80, 107);            // Draw background of window
  noStroke();

  for (var i = 0; i < NUM_APPS; i++) {
    apps[i].display();
    //if (gameOn) {
      //apps[i].decrementSize();
    //}
  }

  fill('white');
  textSize(45);
  textAlign(CENTER);
  title = "App Selection Activity";
  text(title, windowWidth / 2.0, .075*windowHeight);

  // Line to separate title
  stroke('white');
  strokeWeight(4);
  line(0, .10*windowHeight, windowWidth, .10*windowHeight);

  // Draw rect around app selection
  noFill();
  strokeWeight(1);
  rect(0.1*windowWidth, 0.2*windowHeight, 0.8*windowWidth, 0.6*windowHeight);

  noStroke();

  fill('white');
  text("Score: " + score, windowWidth / 2, 19.0 * windowHeight / 20);

  if (timerValue > 0) {
    text("Time: " + timerValue + " Seconds", windowWidth / 2, 0.15*windowHeight);
  }

  if (timerValue == 0) {
    text('TIME OVER', windowWidth / 2, 0.15 * windowHeight);
    gameOn = false;
    fill(50, 80, 107)
    rect(0.1*windowWidth, 0.2*windowHeight, 0.8*windowWidth, 0.6*windowHeight);
    fill('white')
    textAlign(CENTER);
    text("Your score is " + score + "!!!", width / 2, height / 2 );
  }
  
  if (timerValue == 0 && gameEnded == false) {
    applause.play();
    gameEnded = true;
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

  // Display Message for help on restart
  textSize(30);
  restartMessage = "Press ESC to restart";
  text(restartMessage, 7.0 * windowWidth/10 + textWidth(restartMessage)/2.0, 0.15 * windowHeight);

  startMessage = "Click on an app to start";
  text(startMessage, 0.20*windowWidth, 0.15*windowHeight);
}

function timeIt() {
  timer = setInterval(function() {
    if (timerValue > 0) {
      timerValue--;
    }
  }, 1000);
}

function mousePressed() {
  if (dist(mouseX, mouseY, 40, 30) < 30)
      window.open("index.html", "_self");
  if (timerValue > 0) {
    for (var i = 0; i < NUM_APPS; i++) {
      if (dist(mouseX, mouseY, apps[i].x + apps[i].size/2, apps[i].y + apps[i].size/2) < apps[i].size/2) {
          if (gameOn == false) {
            gameOn = true;
            timeIt();
          }
          click.play();
          //applause.play();
          apps[i].changePosition(); 
          ++score;
      }
    }
  }
}

// This function is called when the user types the "ESC" key to reset the activity
function keyPressed() {
  if (keyCode == ESCAPE)
      reset();
}

function reset() {
  score = 0;
  timerValue = 30;
  for (var i = 0; i < NUM_APPS; i++) {
    apps[i].changePosition();
  }
  clearInterval(timer);
  gameOn = false;
  gameEnded = false;
}


// Object for each square on the screen
class Application {
  constructor(givenIndex) {
    this.size = random(90) + 90;    // square is random size between 10-20
    this.color = color(random(255), random(255), random(255));
    this.x = random(0.8 * windowWidth - this.size) + 0.1 * windowWidth;
    this.y = random(0.6 * windowHeight - this.size) + 0.2 * windowHeight;

    this.rate = 0;
    this.LIMIT_TYPE = random(2);
    this.apps;
    this.NUM_APPS;
    this.index = givenIndex;

    this.LIMIT;
    if (this.LIMIT_TYPE == 0)
      this.LIMIT = 3;
    else 
      this.LIMIT = 2;
  
    this.display();
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.size, this.size, 10);
  }

  setArray(givenArr, numApps) {
    this.apps = givenArr;
    this.NUM_APPS = numApps;
  }


  generateUniqueXY() {
    do {
      this.x = random(0.8 * windowWidth - this.size) + 0.1 * windowWidth;
      this.y = random(0.6 * windowHeight - this.size) + 0.2 * windowHeight;
    } while(!this.unique());
  }

  unique() {
    for(var i = 0; i < NUM_APPS; i++) {
      if (i != this.index) {
        if ((this.x > apps[i].x && this.x < apps[i].x + apps[i].size && this.y > apps[i].y &&
          this.y < apps[i].y + apps[i].size) || 
          (dist(this.x, apps[i].y, apps[i].x, apps[i].y) < this.size)) {
            return false;
        }
      }
    }
    return true;
  }

  changePosition() {
    this.size = random(90) + 90;
    this.color = color(random(255), random(255), random(255));
    this.generateUniqueXY();
  }

  decrementSize() {
    if (this.size < 40)
      this.LIMIT = 1;

    ++this.rate;
    if (this.rate == this.LIMIT) {
      this.rate = 0;
      if (this.size > 0) {
        this.size = this.size - 1;
      } else {
        this.size = random(60) + 40;
        this.changePosition();
        
        if (this.LIMIT_TYPE == 0)
          this.LIMIT = 3;
        else
          this.LIMIT = 2;
      }
    }
  }
}




