var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var obstacklesPassed = 0;
var speed = 0;
var groundHight = yScreenSize / 1.5;
var obstacles = [];
var animTime = 7;
var clock = 0;
var breathSpeed = 25;
var playerSize = yScreenSize / 10;
var breathSize = playerSize / 10;
var jumpSpeed = yScreenSize / -40;
var gravity = playerSize / 100;
var stage = 'ingame';
var maxJumps = 2;

function isPosit(x) {
  return (x>=0);
}

function posit(x) {
  if (isPosit(x)) {return(x)};
  return(x*-1);
}

function distance(ob1,ob2) {
  var dx = ob1.x-ob2.x;
  var dy = ob1.y-ob2.y;
  return(sqrt(dx*dx+dy*dy));
}

function collides(ob1,ob2) { // if (collides(this, otherOb)) {}
  var dx = ob2.x-ob1.x;
  var dy = ob2.y-ob1.y;
  return((posit(dx) < (ob1.xSize/2)+(ob2.xSize/2)) && (posit(dy) < (ob1.ySize/2)+(ob2.ySize/2)));
}

function smoothChange(now, goal, iterations) {
  return(now+((goal-now)/iterations));
}

function obstacle(size, y) {
  this.x = xScreenSize + size;
  this.y = y;
  this.xSize = size;
  this.ySize = size;
  this.tick = function(i) {
    this.x -= speed;
    if (collides(this, Player)) {
      // stage = 'death';
      obstacles.splice(i, 1);
      return (1);
    }
    if (this.x < 0 - this.xSize) {
      obstacles.splice(i, 1);
      obstacklesPassed += 1;
      return (1);
    }
    return (1);
  }
  this.render = function () {
    rectMode(CENTER);
    noStroke();
    fill(100);
    rect(this.x,this.y,this.xSize,this.ySize);
  }
}

// object requirements:
// function newObject() {
//   this.x = 0;
//   this.y = 0;
//   this.xSize = 0;
//   this.ySize = 0;
//   this.tick = function() {
//
//   }
//   this.render = function() {
//
//   }
// }

function player() {
  this.x = xScreenSize / 10;
  this.y = groundHight;
  this.xSize = playerSize;
  this.ySize = playerSize;
  this.ySpeed = 0;
  this.ticksSinceGrounHit = animTime;
  this.onGround = true; // only false when jumpng && in air.
  this.jumpsDone = 0;
  this.jumpPressed = false;
  this.tick = function() {
    var goalXSize = playerSize; // temp var's for calculating the new shape of the player.
    var goalYSize = playerSize;
    if (clock % (breathSpeed * 2) < breathSpeed) { // set default to breath animation.
      goalXSize += breathSize;
      goalYSize -= breathSize;
    } else {
      goalXSize -= breathSize;
      goalYSize += breathSize;
    }
    if (this.y >= groundHight - (this.ySize / 2)) { // of on/under ground
      if (this.ySpeed > 1 && !this.onGround) { // true on the tick of landing on the ground. (moving down while toutching the ground.)
        this.ticksSinceGrounHit = 0; // reset
        this.onGround = true;
        this.jumpsDone = 0;
      }
      if (this.ticksSinceGrounHit < animTime*2) {
        goalXSize = playerSize * 2;
        goalYSize = playerSize / 2;
        this.y = groundHight - (this.ySize / 2) + 3;
        this.ySpeed = 0;
      } else {
        this.y = groundHight - (this.ySize / 2) + 1;
        this.ySpeed = 0;
      }
    } else if (this.ySpeed < 0) { // moving up
      goalXSize = playerSize / 2; // flat, vertical
      goalYSize = playerSize * 2;
    }
    if ((keyIsDown(32) || keyIsDown(38) || mouseIsPressed) && (this.jumpsDone < maxJumps) && !this.jumpPressed) { // space or arrow_up
      this.jumpPressed = true;
      this.ySpeed = jumpSpeed; // jumpspeed
      this.onGround = false;
      this.jumpsDone += 1;
    }
    if (!(keyIsDown(32) || keyIsDown(38) || mouseIsPressed)) {
      this.jumpPressed = false;
    }
    this.y += this.ySpeed;  // phisycs
    this.ySpeed += gravity; // gravity
    this.xSize = smoothChange(this.xSize, goalXSize, animTime); // change shape
    this.ySize = smoothChange(this.ySize, goalYSize, animTime);
    this.ticksSinceGrounHit += 1;
  }
  this.render = function() {
    rectMode(CENTER);
    fill(0);
    rect(this.x, this.y, this.xSize, this.ySize + 1);
    fill(0,0,0,0);
    stroke(127);
    strokeWeight(1);
    rect(this.x, this.y, this.xSize, this.ySize);
  }
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  Player = new player();
}

function draw() {
  if (stage == 'ingame') {
    background(255);
    speed = (obstacklesPassed) + 5;
    var i = 0;
    while (i < obstacles.length) {
      i += obstacles[i].tick(i);
    }
    Player.tick();
    for (var i = 0; i < obstacles.length; i++) {
      obstacles[i].render();
    }
    Player.render();
    stroke(0);
    line(0, groundHight, xScreenSize, groundHight);
    // fill(50);
    // noStroke();
    // rectMode(CORNER);
    // rect(0, groundHight, xScreenSize, groundHight);
    if (round(random(0, (100/((obstacklesPassed/40)+1)))) == 0) {
      obstacles[obstacles.length] = new obstacle(playerSize, ((yScreenSize / 1.5) - playerSize/2) - random(0,obstacklesPassed*10));
    }
  } else if (stage == 'gamestart') {
    obstacles = [];
  } else if (stage == 'death') {
    console.log('death');
  }
  clock += 1;
}
