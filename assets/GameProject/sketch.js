var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var jumpHeight;   
var jumpSpeed;   	
var gravity;       

var mountains;
var clouds;
var trees;
var canyons;
var collectables;
var shields
var platforms;
var onPlatform;
var enemies;

var cameraPosX;
var gameScore;
var shieldScore;
var flagpole;
var lives;

var jumpSound;
var katanaSound;
var levelCompleteSound;
var gameOverSound;
var plummetingSound;
var shieldSound;

// load audio files for the game
function preload()
{
    soundFormats('mp3','wav');
    
    // sound for jumping
    jumpSound = loadSound('assets/Jump.wav');
    jumpSound.setVolume(0.2);
	
	// sound for collectable item
	katanaSound = loadSound('assets/Katana.wav');
    katanaSound.setVolume(0.1);

	// sound for level complete
	levelCompleteSound = loadSound('assets/Level_Complete.mp3');
    levelCompleteSound.setVolume(0.1);

	// sound for game over
	gameOverSound = loadSound('assets/Game_Over.wav');
    gameOverSound.setVolume(0.1);

	// sound for plummeting
	plummetingSound = loadSound('assets/Plummeting.wav');
    plummetingSound.setVolume(0.02);

	// sound for plummeting
	enemySound = loadSound('assets/Enemy.wav');
    enemySound.setVolume(0.1);

	//sound for collecting shield
	shieldSound = loadSound('assets/Shield.wav');
    shieldSound.setVolume(0.3);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	startGame();

}

function draw()
{
	///////////////////// IMPLEMENT SCROLLING ////////////////////
	
	if(!isPlummeting)
	{
		cameraPosX = gameChar_x - width/2;
	}

	///////////////////// BREAK LOOP WHEN LIVES == 0 ////////////////////
	
	if (lives <= 0) 
	{
        background(0);
        fill(255, 0, 0);
        textSize(50);
        textAlign(CENTER);
        text("GAME OVER", width / 2, height / 2);
		fill(255);
        textSize(20);
		text("Refresh Page to Restart", width / 2, height / 2 + 60);
        noLoop(); // Stops the game from running
        return;
    }

	///////////////////// BREAK LOOP WHEN FLAGPOLE IS REACHED ////////////////////
	
	if (flagpole.isReached) 
	{
        background(0);
        fill(75,183,179);
        textSize(50);
        textAlign(CENTER);
        text("LEVEL COMPLETE", width / 2, height / 2);
		fill(255);
        textSize(20);
		text("Refresh Page to Restart", width / 2, height / 2 + 60);
        noLoop(); // Stops the game from running
        return;
    }
	
	///////////////////// DRAWING SCENERY & ELEMENTS ////////////////////

	// sky
	background(120, 120, 120); 

	// ground
	noStroke();
	fill(0);
	rect(0, floorPos_y, width, height - floorPos_y); 

	// camera scrolling - START
	push();                  
	translate(-cameraPosX, 0);

	// show score on screen
	textSize(18);
	fill(255);
	stroke(0);
	strokeWeight(2);
	text("KATANAS: " + gameScore, cameraPosX + 20, 35);

	// show lives on screen
	fill(255, 120, 15);
	text("LIVES: " + lives, cameraPosX + 150, 35);
	noStroke();

	// show shields score on screen
	textSize(18);
	fill(255);
	stroke(0);
	strokeWeight(2);
	text("SHIELDS: " + shieldScore, cameraPosX + 250, 35);
	noStroke();
	
	// draw canyons
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	
	// draw clouds
	for(var i = 0; i < clouds.length; i++)
	{
		clouds[i].draw();
	}

	// draw mountains
	for(var i = 0; i < mountains.length; i++)
	{
		drawMountains(mountains[i]);
	}

	// draw trees 
	for(var i = 0; i < trees.length; i++)
	{
		drawTrees(trees[i]);
	}

	// draw checkpoint
	drawFlagpole(flagpole);

	// check if checkpoint is reached
	checkFlagpole(flagpole);	

	// draw shields
	for(var i = 0; i < shields.length; i++)
	{
		drawShield(shields[i]);
		checkShield(shields[i]);
	}

	// draw platforms & collectables + check for collectables
	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
		drawCollectable(collectables[i]);
		checkCollectable(collectables[i]);
	}

	// draw enemies + check enemies
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();
		checkEnemy(enemies[i]);
	}

	///////////////////// DRAWING CHARACTER ////////////////////
	
	// jumping-left design
	if(isLeft && isFalling)
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15);		// bandana
		fill(75,183,179);
  		triangle(gameChar_x + 15, gameChar_y - 72, 
				gameChar_x + 15, gameChar_y - 42 , 
				gameChar_x - 15, gameChar_y - 72);		// hat
		
		// BODY
		fill(75,183,179);
		triangle(gameChar_x - 15, gameChar_y - 27, 
				gameChar_x - 23, gameChar_y - 57, 
				gameChar_x + 5, gameChar_y - 27); 		// left arm

		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		// torso

		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 27, 
				gameChar_x + 23, gameChar_y  - 57, 
				gameChar_x - 5, gameChar_y - 27);		// right arm

		// FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 10, 8, 8);  	// left
		ellipse(gameChar_x + 5, gameChar_y - 10, 8, 8); 		// right
	}

	// jumping-right design 
	else if(isRight && isFalling)
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15)		// bandana
		fill(75,183,179)
		triangle(gameChar_x - 15, gameChar_y - 72, 
				gameChar_x - 15, gameChar_y - 42, 
				gameChar_x +15 , gameChar_y - 72);		// hat
		
		// BODY
		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 27, 
				gameChar_x + 23, gameChar_y  - 57, 
				gameChar_x - 5, gameChar_y - 27);		// right arm
	
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		// torso
	
	
		fill(75,183,179);
		triangle(gameChar_x - 15, gameChar_y - 27, 
				gameChar_x - 23, gameChar_y - 57, 
				gameChar_x + 5, gameChar_y - 27); 		// left arm
	
	
		// FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 10, 8, 8);  	// left
		ellipse(gameChar_x + 5, gameChar_y - 10, 8, 8); 		// right
	}

	// walking left design
	else if(isLeft)
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15)		// bandana
		fill(75,183,179);
  		triangle(gameChar_x + 15, gameChar_y - 72, 
				gameChar_x + 15, gameChar_y - 42 , 
				gameChar_x - 15, gameChar_y - 72);		// hat 
		
		// BODY
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		// torso
		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 37, 
				gameChar_x + 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37);		// left arm
		triangle(gameChar_x - 15, gameChar_y - 37, 
				gameChar_x - 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37); 		// right arm
	
		//FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 5, 8, 8);  	// left
		ellipse(gameChar_x + 5, gameChar_y - 5, 8, 8); 		// right
	}

	// walking right design
	else if(isRight)
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15);	// bandana
		fill(75,183,179);
		triangle(gameChar_x - 15, gameChar_y - 72, 
				gameChar_x - 15, gameChar_y - 42, 
				gameChar_x +15 , gameChar_y - 72);		// hat
		
		// BODY
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		// torso
		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 37, 
				gameChar_x + 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37);		// left arm
		triangle(gameChar_x - 15, gameChar_y - 37, 
				gameChar_x - 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37); 		// right arm
	
		//FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 5, 8, 8);  	// left
		ellipse(gameChar_x + 5, gameChar_y - 5, 8, 8); 		// right
	}

	// forward facing jump design
	else if(isFalling || isPlummeting)
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15);		// bandana
		fill(75,183,179);
  		triangle(gameChar_x + 15, gameChar_y - 72, 
				gameChar_x + 15, gameChar_y - 42 , 
				gameChar_x, gameChar_y - 72);		// left side of the hat
		triangle(gameChar_x - 15, gameChar_y - 72, 
				gameChar_x - 15, gameChar_y - 42, 
				gameChar_x, gameChar_y - 72);		// right side of the hat
		// BODY
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		//torso
		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 27, 
				gameChar_x + 23, gameChar_y  - 57, 
				gameChar_x, gameChar_y - 27);		// left arm
		triangle(gameChar_x - 15, gameChar_y - 27, 
				gameChar_x - 23, gameChar_y - 57, 
				gameChar_x, gameChar_y - 27); 		// right arm
	
		//FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 10, 8, 8);  	// left
		ellipse(gameChar_x + 5, gameChar_y - 10, 8, 8); 		// right
	}

	// standing still design
	else
	{
		// HEAD
		fill(222,184,135);
		ellipse(gameChar_x, gameChar_y - 57, 30, 30); 	// face
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 72, 30, 15);		// bandana
		fill(75,183,179);
  		triangle(gameChar_x + 15, gameChar_y - 72, 
				gameChar_x + 15, gameChar_y - 42 , 
				gameChar_x, gameChar_y - 72);		// left side of the hat
		triangle(gameChar_x - 15, gameChar_y - 72, 
				gameChar_x - 15, gameChar_y - 42, 
				gameChar_x, gameChar_y - 72);		// right side of the hat
		
		// BODY
		fill(0);
		rect(gameChar_x - 15, gameChar_y - 37, 30, 20);		// torso
		fill(75,183,179);
		triangle(gameChar_x + 15, gameChar_y - 37, 
				gameChar_x + 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37);		// left arm
		triangle(gameChar_x - 15, gameChar_y - 37, 
				gameChar_x - 15, gameChar_y - 2, 
				gameChar_x, gameChar_y - 37); 		// right arm
	
		//FEET
		fill(0);
		ellipse(gameChar_x - 5, gameChar_y - 5, 8, 8);  	//left
		ellipse(gameChar_x + 5, gameChar_y - 5, 8, 8); 		//right
	}

	// camera scrolling END
	pop(); 

	///////////////////// INTERACTION CODE ////////////////////
	
	// move left
	if(isLeft)
	{	
		gameChar_x -= 3;
	}
	
	// move right
	if(isRight)
	{
		gameChar_x += 3;
	}
	
	// apply gravity after jump
	if(isFalling)
	{
		gameChar_y -= jumpSpeed;
		jumpSpeed -= gravity;
	}  

	// if character jumps over platform - stop the fall
	onPlatform = false;
	for (var i = 0; i < platforms.length; i++) 
	{
		if (platforms[i].checkContact(gameChar_x, gameChar_y)) 
		{
			onPlatform = true;
			gameChar_y = platforms[i].y;
			isFalling = false;
		}
	}

	// character falls when off platform edge
	if (!onPlatform) 
	{
		isFalling = true;
	}

	// prevent plummeting when jumping on the ground
	if (gameChar_y >= floorPos_y && !isPlummeting) 
	{ 
        gameChar_y = floorPos_y;
		jumpSpeed = 0;
		isFalling = false;
    }
}

// set up enviroment and variables to start/restart game
function startGame()
{
	// game variables
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	jumpHeight = 15;   
	jumpSpeed = 0;   	
	gravity = 0.5;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	gameScore = 0;
	shieldScore = 0;

	// create canyons
	canyons = 
	[
				{x_pos: -5000, y_pos: floorPos_y, width: 100},
				{x_pos: -5150, y_pos: floorPos_y, width: 100},
				{x_pos: -5300, y_pos: floorPos_y, width: 100},

				{x_pos: -4300, y_pos: floorPos_y, width: 100},
				{x_pos: -2450, y_pos: floorPos_y, width: 100},
				{x_pos: -1690, y_pos: floorPos_y, width: 100},

				{x_pos: -200, y_pos: floorPos_y, width: 100},
				{x_pos: -350, y_pos: floorPos_y, width: 100},
				{x_pos: -500, y_pos: floorPos_y, width: 100},
				
				{x_pos: 250, y_pos: floorPos_y, width: 100},
				{x_pos: 1100, y_pos: floorPos_y, width: 100},

				{x_pos: 2150, y_pos: floorPos_y, width: 100},
				{x_pos: 2300, y_pos: floorPos_y, width: 100},
				{x_pos: 2450, y_pos: floorPos_y, width: 100},
				
				{x_pos: 2850, y_pos: floorPos_y, width: 100},
				{x_pos: 3850, y_pos: floorPos_y, width: 100},

				{x_pos: 5000, y_pos: floorPos_y, width: 100},
				{x_pos: 5150, y_pos: floorPos_y, width: 100},
				{x_pos: 5300, y_pos: floorPos_y, width: 100},
	];

	// declare & populate mountains array
	mountains = [];
	var x = -5500;
	for(var i = 0; i < 10; i++)
	{			
		mountains.push(createMountains(x));
		x += 1500;
	}

	// declare & populate cloud array
	clouds = [];
	var x = -6000;
	for(var i = 0; i < 40; i++) 
	{			
		clouds.push(new Clouds(x, 0.3));
		x += 500;
	}

	// declare & populate trees array
	trees = [];
	var x = -6160;
	for(var i = 0; i < 40; i++) 
	{		
		trees.push(createTrees(x));
		x += 580;
	}

	// declare & populate shields array
	var x = - 3000;
	shields = [];
	for(var i = 0; i < 6; i++)
	{
		c = createShield(x);
		shields.push(c);
		x += 1500;
	}

	// declare & populate collectables + platform + enemies array
	var x = - 4500;
	platforms = [];
	collectables = [];
	enemies = [];
	for(var i = 0; i < 11; i++)
	{
		collectables.push(createCollectables(x));
		platforms.push(createPlatforms(x, floorPos_y - 225, 150));
		enemies.push(new Enemy(x + 20));
		x += 900;
	}

	// declare checkpoint object
	flagpole = {x_posL: -5500, x_posR: 5500, y_pos: 576 * 3/4, isReached: false};
}

// assign keys to character movement
function keyPressed()
{
	// impede movement when: plummeting, dead, level complete
	if(!isPlummeting && !flagpole.isReached && lives > 0) 
	{				
		// move left command
		if(key == 'a')
		{
			isLeft = true;
		}
		// move right command
		if(key == 'd')
		{	
			isRight = true;
		}

		// jump command & double jump restriction
		if((keyCode == 32 && gameChar_y == floorPos_y) || 
		   (key == 'w' && gameChar_y == floorPos_y))
		{	
			isFalling = true;
			jumpSpeed = jumpHeight;
			jumpSound.play();
		}
	}	
}

// stop movement when keys are released
function keyReleased()
{
	// stop moving left
	if(key == 'a')
	{				
		isLeft = false;
	}
	// stop moving right
	if(key == 'd')
	{			
		isRight = false;
	}

}

// Constructor Function - animated clouds
function Clouds(x, direction)
{
	this.x_pos = x;
	this.y_pos = random(50, 120);
	this.height = 100;
	this.width = 300;

	this.range = random(60, 100);
	this.currentY = 120;
	this.inc = direction;

	// animates clouds by updatin y_pos
	this.update_yPos = function()
	{
		this.currentY += this.inc;
		if (this.currentY > this.y_pos + this.range || this.currentY < this.y_pos)
		{
			this.inc *= -1;
		}
	}

	// draws clouds onto the canvas
	this.draw = function()
	{
		fill(200,200,200,100);
		ellipse(this.x_pos, this.currentY, this.width, this.height);
		ellipse(this.x_pos + 40, this.currentY + 30, this.width, this.height);
		ellipse(this.x_pos - 40, this.currentY + 30, this.width, this.height);	

		this.update_yPos();
	}
}

// Factory Pattern - create mountain objects
function createMountains(x)
{
	var m = 
	{
		x_pos: x, 
		y_pos: floorPos_y,
		width: 500,
		height: 350,
	};
	return m;
	
}

// draw mountains using mountain objects
function drawMountains(a_mountains)
{
	// big mountain (right)
	fill(242,88,23); 	// dark orange
	triangle(a_mountains.x_pos + a_mountains.width / 2, a_mountains.y_pos,
			a_mountains.x_pos - a_mountains.width / 4, a_mountains.y_pos,
			a_mountains.x_pos + a_mountains.width / 7, a_mountains.y_pos - a_mountains.height);
	// small mountain (left)
	fill(255,131,40); 	// light orange
	triangle(a_mountains.x_pos, a_mountains.y_pos,
			a_mountains.x_pos - a_mountains.width / 2, a_mountains.y_pos,
			a_mountains.x_pos - a_mountains.width / 4, a_mountains.y_pos - height / 2);
}

// Factory Pattern - create tree objects
function createTrees(x)
{
	var t = 
	{
		x_pos: x,
		y_pos: floorPos_y - 144,
		alpha: 20
	};
	return t;
}

// draw trees using mountain objects
function drawTrees(a_trees)
{
	fill(160,82,45);
	rect(a_trees.x_pos - 12, a_trees.y_pos + 68, 24, 76);
	fill(255,215,90);
	rect(a_trees.x_pos - 9, a_trees.y_pos - 54, 20, 23, a_trees.alpha);
	rect(a_trees.x_pos - 14, a_trees.y_pos - 40, 30, 25, a_trees.alpha);
	rect(a_trees.x_pos - 24, a_trees.y_pos - 20, 50, 25, a_trees.alpha);
	rect(a_trees.x_pos - 34, a_trees.y_pos, 70, 25, a_trees.alpha);
	rect(a_trees.x_pos - 44, a_trees.y_pos + 23, 90, 25, a_trees.alpha);
	rect(a_trees.x_pos - 54, a_trees.y_pos + 47, 110, 25, a_trees.alpha);
}

// Factory Pattern - create shield objects
function createShield(x)
{
	var s = 
	{
	x_pos: x, 
	y_pos: floorPos_y - 40,
	isFound: false
	};
	return s;
}

// draw shield using mountain objects
function drawShield(a_shields)
{
	if(!a_shields.isFound)
	{
		noStroke();
		fill(255,215,90);
		circle(a_shields.x_pos, a_shields.y_pos, 55);
		fill(242,88,23);
		circle(a_shields.x_pos, a_shields.y_pos + 5, 30);
		beginShape();
		vertex(a_shields.x_pos - 15, a_shields.y_pos + 4);
		vertex(a_shields.x_pos - 15, a_shields.y_pos - 10);
		vertex(a_shields.x_pos, a_shields.y_pos - 20);
		vertex(a_shields.x_pos + 15, a_shields.y_pos - 10);
		vertex(a_shields.x_pos + 15, a_shields.y_pos + 4);
		endShape();
	}
}

// character collects shield
function checkShield(a_shields)	
{
	if (!a_shields.isFound) 
	{ 
		if (dist(gameChar_x, gameChar_y, a_shields.x_pos, floorPos_y) < 30
			&& gameChar_y == floorPos_y) 
		{ 
			if(shieldScore < 2)
			{
				a_shields.isFound = true;
				shieldScore += 1; 
				shieldSound.play();

			}
			// if player collected 3 shields add 1 life and reset shields to 0
			else
			{
				a_shields.isFound = true;
				shieldScore = 0;
				lives += 1;
				shieldSound.play();
			}
		}
	}
}

// Factory Pattern - create collectable
function createCollectables(x)
{
	var c = 
	{
	x_pos: x, 
	y_pos: floorPos_y - 350,
	root : x + 30,
	isFound: false
	}	
	return c;
}

// draw collectable using mountain objects
function drawCollectable(a_collectable)
{
	if(!a_collectable.isFound)
	{
		noStroke();
		fill(255); 	// blade
		triangle(a_collectable.x_pos + 60, a_collectable.y_pos + 55, 
				 a_collectable.x_pos + 47, a_collectable.y_pos + 79,
				 a_collectable.x_pos + 19, a_collectable.y_pos + 87);

		push();		// handle
		stroke(0);	
		strokeWeight(6);
		line(a_collectable.x_pos + 20, a_collectable.y_pos + 80, 
			 a_collectable.x_pos + 27, a_collectable.y_pos + 91);
		line(a_collectable.x_pos + 11, a_collectable.y_pos + 93, 
			 a_collectable.x_pos + 22, a_collectable.y_pos + 86);
		pop();
	}
}

// character collects collectable
function checkCollectable(a_collectable)
{
	if (!a_collectable.isFound) 
	{ 
		if (dist(gameChar_x, gameChar_y, a_collectable.root, a_collectable.y_pos) < 130) 
		{ 
			a_collectable.isFound = true;
			gameScore += 1; 
			katanaSound.play();
		}
	}
}

// draw canyon
function drawCanyon(a_canyon)
{
	// canyon
	fill(75,183,179);
	rect(a_canyon.x_pos, a_canyon.y_pos, a_canyon.width, 300);
	
	// bubble animation
	for (var i = 0; i < 20 ; i++)
	{
		if(i%3 == 0)
		{
			var ran_x = random(30, 70);
			var ran_y = random(30, 270);
			var ran_w = random(10, 25);
			stroke(95,158,160);
			strokeWeight(1);
			fill(255);
			ellipse(a_canyon.x_pos + ran_x, a_canyon.y_pos + ran_y, ran_w);
			noStroke();
		}
	}
}

// character plummets over canyon
function checkCanyon(a_canyon) 
{
	if(gameChar_x > a_canyon.x_pos && 
	   gameChar_x < a_canyon.x_pos + a_canyon.width - 5 && 
	   gameChar_y >= a_canyon.y_pos)
	{
		isPlummeting = true;
	}
	if(isPlummeting)
	{
		gameChar_y += 1;
		plummetingSound.play();
	}
	// game restarts after falling down the canyon if any lives remain
	if(gameChar_y > height + 50 && lives > 0)
	{
		lives -= 1;
		if(lives > 0)
		{
			startGame();
		}

	}
}

// flagpole indicates end of level 1
function drawFlagpole(flag)
{
	// Right side flag
	// pole
	fill(0); 
	rect(flag.x_posR - 5, flag.y_pos - 150, 10, 150); 
	// flag
	fill(255); 
	triangle(flag.x_posR, flag.y_pos - 150, 
		flag.x_posR + 30, flag.y_pos - 135, 
		flag.x_posR, flag.y_pos - 120); 

	// Left side flag
	// pole
	fill(0); 
	rect(flag.x_posL - 5, flag.y_pos - 150, 10, 150); 
	// flag
	fill(255); 
	triangle(flag.x_posL, flag.y_pos - 150, 
		flag.x_posL + 30, flag.y_pos - 135, 
		flag.x_posL, flag.y_pos - 120); 
}

// end game when character reaches flagpole
function checkFlagpole(flag)
{
	if(gameChar_x < flag.x_posL || gameChar_x > flag.x_posR)
	{
		flag.isReached = true;
		levelCompleteSound.play();
	}
}

// Factory Pattern - create platform objects
function createPlatforms(x, y, length) 
{
	var p = 
	{
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(0);
			rect(this.x, this.y, this.length, 25);
		},
		checkContact: function(gc_x, gc_y)
		{
			if((gc_x >= this.x && gc_x <= this.x + this.length) && gc_y <= this.y)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	return p;
}

// Constructor Function - create enemies
function Enemy(x)
{
	this.x = x;
	this.y = floorPos_y - 225;
	this.range = 100;

	this.currentX = x;
	this.inc = 1;

	this.update_xPos = function()
	{
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range)
		{
			this.inc = -1;
		}
		else if(this.currentX == this.x)
		{
			this.inc = 1;
		}
	}

	this.draw = function()
	{
		this.update_xPos();
		// draw character design for walking left
		if(this.inc == -1)
		{
			// HEAD
			fill(222,184,135);
			ellipse(this.currentX, this.y - 57, 30, 30); 	// face
			fill(0);
			rect(this.currentX - 15, this.y - 72, 30, 15)		// bandana
			fill(255,215,90);
			triangle(this.currentX + 15, this.y - 72, 
					this.currentX + 15, this.y - 42 , 
					this.currentX - 15, this.y - 72);		// hat 
			
			// BODY
			fill(0);
			rect(this.currentX - 15, this.y - 37, 30, 20);		// torso
			fill(255,215,90);
			triangle(this.currentX + 15, this.y - 37, 
					this.currentX + 15, this.y - 2, 
					this.currentX, this.y - 37);		// left arm
			triangle(this.currentX - 15, this.y - 37, 
					this.currentX - 15, this.y - 2, 
					this.currentX, this.y - 37); 		// right arm
		
			//FEET
			fill(0);
			ellipse(this.currentX - 5, this.y - 5, 8, 8);  	// left
			ellipse(this.currentX + 5, this.y - 5, 8, 8); 		// right
		}
		
		// draw character design for walking right
		else if(this.inc == 1)
		{
			// HEAD
			fill(222,184,135);
			ellipse(this.currentX, this.y - 57, 30, 30); 	// face
			fill(0);
			rect(this.currentX - 15, this.y - 72, 30, 15);		// bandana
			fill(255,215,90);
			triangle(this.currentX - 15, this.y - 72, 
					this.currentX - 15, this.y - 42, 
					this.currentX +15 , this.y - 72);		// hat
			
			// BODY
			fill(0);
			rect(this.currentX - 15, this.y - 37, 30, 20);		// torso
			fill(255,215,90);
			triangle(this.currentX + 15, this.y - 37, 
					this.currentX + 15, this.y - 2, 
					this.currentX, this.y - 37);		// left arm
			triangle(this.currentX - 15, this.y - 37, 
					this.currentX - 15, this.y - 2, 
					this.currentX, this.y - 37); 		// right arm
		
			//FEET
			fill(0);
			ellipse(this.currentX - 5, this.y - 5, 8, 8);  	// left
			ellipse(this.currentX + 5, this.y - 5, 8, 8); 		// right
		}
	}
}

// end game when character touches enemy
function checkEnemy(a_enemies)
{
	if(dist(gameChar_x, gameChar_y, a_enemies.currentX, a_enemies.y) < 30
		&& lives > 0 
		&& gameChar_y < 230
		&& !isFalling)
	{
		enemySound.play();
		lives -= 1;
		startGame();
	}
}