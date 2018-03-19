var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var OnstaclesPassed = 1;
var speed = 0;
var groundHight = yScreenSize / 1.5;
var obstacles = [];
var animTime = 7;
var clock = 0;
var breathSpeed = 25;
var playerSize = yScreenSize / 20;
var breathSize = playerSize / 5;
var jumpsSpeed = yScreenSize / -40;
var gravity = playerSize / 50;

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
  return(distance(ob1,ob2)<ob1.size+ob2.size); // returns True if collision.
}

function smoothChange(now, goal, iterations) {
  return(now+((goal-now)/iterations));
}

function obstacle(size) {
  this.x = xScreenSize + size;
  this.y = yScreenSize / 1.5;
  this.tick = function() {
    this.x -= speed;
    if (collides(this, Player)) {

    }
  }
}

// object requirements:
// function newObject() {
//   this.x = 0;
//   this.y = 0;
//   this.size = 0
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
  this.size = playerSize;
  this.xSize = playerSize;
  this.ySize = playerSize;
  this.ySpeed = 0;
  this.ticksSinceGrounHit = animTime;
  this.onGround = true; // only false when jumpng && in air.
  this.tick = function() {
    this.size = this.ySize;
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
      }
      if (this.ticksSinceGrounHit < animTime) {
        this.xSize = playerSize * 1.5;
        this.ySize = playerSize / 1.5;
      }
      if (keyIsDown(32) || keyIsDown(38)) { // space or arrow_up
        this.ySpeed = jumpsSpeed; // jumpspeed
        this.onGround = false;
      } else if (keyIsDown(40)) {
        goalXSize = playerSize * 2; // flat, horizontal
        goalYSize = playerSize / 2;
        this.ySpeed = 0; // reset jump
        this.size = playerSize / 2;
        this.y = groundHight - (this.ySize / 2) + 1;
      } else {
        this.ySpeed = 0; // reset jump
        this.y = groundHight - (this.ySize / 2) + 1;
      }
    } else if (this.ySpeed < 0) { // moving up
      goalXSize = playerSize / 2; // flat, vertical
      goalYSize = playerSize * 2;
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
    rect(this.x, this.y + 1, this.xSize, this.ySize + 1);
    // fill(127);
    // ellipse(this.x, this.y, this.size);
  }
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  Player = new player();
}

function draw() {
  if (stage = 'ingame') {
    background(255);
    speed = OnstaclesPassed * 5;
    for (var i = 0; i < obstacles.length; i++) {
      obstacles.tick();
    }
    Player.tick();
    for (var i = 0; i < obstacles.length; i++) {
      obstacles.render();
    }
    Player.render();
    stroke(0);
    // line(0, groundHight, xScreenSize, groundHight);
    fill(50);
    noStroke();
    rectMode(CORNER);
    rect(0, groundHight, xScreenSize, groundHight);
  } else if (stage = 'gamestart') {
    obstacles = [];
  } else if (stage = 'death') {

  }
  clock ++;
}
