////////////////////////////////////////////////////////////////
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic: true, angle: angle});
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  angle += angleSpeed;
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  fill("yellow");
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupWall(){
  wall = Bodies.rectangle(450, 300, 15, 150, {isStatic: true, angle: angle});
  World.add(engine.world, [wall]);
}

function drawWall(){
  push();
  
  fill("orange");
  drawVertices(wall.vertices);
  pop();
}


/////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
//updates and draws the Birds
function drawBirds(){
  push();
  
  fill('blue');
  for(var i = 0; i < birds.length; i++)
  {
    drawVertices(birds[i].vertices);
    if(isOffScreen(birds[i]))
    {
      removeFromWorld(birds[i])
      birds.splice(i, 1);
      i -= 1;
    }
  }
  
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){  
  for(var i = 0; i < 3; i++)
  {
    for(var j = 0; j < 6; j++)
      {
        colors.push(color(0, random(25,255), 0));
        var box = Bodies.rectangle(700 + i * 75, 540 - j * 75, 80, 80);
        World.add(engine.world,[box]);
        boxes.push(box);
        
      }
  }

}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
    for(var i = 0; i < boxes.length; i++)
    {
      fill(colors[i]);
      drawVertices(boxes[i].vertices);
    }
  pop();
  
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){

    slingshotBird = Bodies.circle(200, 170, 20, {friction: 0, restitution: 0.95 });
    Body.setMass(slingshotBird, slingshotBird.mass*10);
    
    slingshotConstraint = Constraint.create({
         pointA : {x:200, y: 170},
         bodyB : slingshotBird,
         stiffness: 0.01,
         length:30,
         damping: 0.0001
        })
        
    World.add(engine.world, [slingshotBird, slingshotConstraint]); 
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  fill("purple");
  drawVertices(slingshotBird.vertices);
  drawConstraint(slingshotConstraint);

  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
