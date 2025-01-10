// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var wall;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;
var canvasWidth = 1000;
var canvasHeight = 600;

var chances = 5;
var bounceSound;
var resetSound;
var mouseReleaseSound;
var gameoverSound;
////////////////////////////////////////////////////////////
function preload()
{
    soundFormats('mp3','wav', 'ogg');
    
    //load the sounds 
       bounceSound = loadSound('./assets/bounce.wav');
       bounceSound.setVolume(1);

       resetSound = loadSound('./assets/reset.wav')
       resetSound.setVolume(2);

       mouseReleaseSound = loadSound('./assets/ping.wav');
       mouseReleaseSound.setVolume(1);

       gameoverSound = loadSound('./assets/gameover.wav');
       gameoverSound.setVolume(2); 
    
}

function setup() {

  canvas = createCanvas(canvasWidth, canvasHeight);

  engine = Engine.create();  //create an engine

  setupGround();

  setupPropeller();

  setupWall();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawWall();

  drawTower();

  drawBirds();

  drawSlingshot();

  chanceUpdate();

  gameOver();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  
  if (keyCode == LEFT_ARROW){
    angleSpeed += 0.01; 
    
  }
  else if (keyCode == RIGHT_ARROW){
    angleSpeed -= 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){

  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
    bounceSound.play();
    chances -=1; // reduce the chances for each new ball
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();

    resetSound.play(); //reset sound played
    chances -= 1; //reduce the chances by 1 each time reset is pressed
    
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);  

  mouseReleaseSound.play(); //sound for mouse pressed
    
}


//function that updates chances remaining and displays it
function chanceUpdate(){
  fill(255);
  textSize(30);
  textAlign(screenLeft);
  text("Chances : " + chances, 30, height-40);
  
}

// function that ends the game by stopping the loops and displaying "Game Over" 
function gameOver(){

  if(chances < 1)
    {   
      fill(255);
      textSize(80);
      textAlign(CENTER);
      text("GAME OVER", width/2, height/2)
      gameoverSound.play();
      noLoop();  
    }

}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);

}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
