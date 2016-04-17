/*
	Shapeshift theme game made for Ludum Dare 35
	Created by Hakan Staby
*/

// a global object to hold all global variables related to the game.
var game;
var circle;
var rectangle;
var balls = [];
var graphics;
var toggle;
var ballamount = 5;
var winrectangle;
var winsize = 100;
var wingraphics;
var protagonistcol = 0xff0000;
var winloc = {
	x: 300,
	y: 50,
	xbott: 300+winsize,
	ybott: 50+winsize
}
var stateText;
var gameover = false;
var point;
var emitter;
var pointgr;
var shake = 4;
var bouncesnd;
var win1,win2;
var bgmusic;


$(function(){	

	startshapeshift();
	
});

function startshapeshift() {
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
}

function preload() {

    game.load.image('ball', 'images/ball.png');
    game.load.image('clouds', 'images/bg.jpg');
    game.load.image('goal1', 'images/goal1.png');
    game.load.image('goal2', 'images/goal2.png');
	game.load.image('star', 'images/star.png');    
	game.load.audio('bounce', 'audio/bounce1.wav');
	game.load.audio('win1', 'audio/won1.wav');
	game.load.audio('win2', 'audio/won2.wav');
	game.load.audio('bgmusic', 'audio/shapeshift.ogg');
}

function create() {
   
    game.stage.backgroundColor = '#124184';
    clouds = game.add.tileSprite(0, 0, 800, 600, 'clouds');
    // Add physics and gravity.
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 100;
    game.physics.p2.restitution = 0.8;

    // Define our protagonists
    circle = new Phaser.Circle(0, 0, 25);
    rectangle = new Phaser.Rectangle(-12.5,-12.5,25,25);
    winrectangle = new Phaser.Rectangle(0,0,winsize,winsize);
    point = new Phaser.Rectangle(0,0,2,2);
    var style = { font: "bold 84px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    //  Text in the middle of the screen
    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', style);
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
    bouncesnd = game.add.audio('bounce',1);
    win1 = game.add.audio('win1',1);
    win2 = game.add.audio('win2',1);
    bgmusic = game.add.audio('bgmusic',0.5);
    bgmusic.play('',0,0.5,true);

    //Display winrectangle
    //wingraphics = game.add.graphics(winloc.x,winloc.y);
    wingraphics = game.add.sprite(winloc.x,winloc.y,'goal2');
    //wingraphics.lineStyle(1, 0x000000, 1);
    //wingraphics.beginFill(0x00ff00);
    //wingraphics.drawRect(winrectangle.x,winrectangle.y,winrectangle.width,winrectangle.height);
    // add emitter
    pointgr = game.add.graphics(0,0);
    pointgr.drawRect(point.x,point.y,point.width,point.height)
    emitter = game.add.emitter(winloc.x+winsize/2, winloc.y+winsize/2,200);
    emitter.makeParticles('star');

    // add group of balls
    var group = game.add.physicsGroup(Phaser.Physics.P2JS);
    for (var i = 0; i<ballamount; i++) {
    	balls[i] = group.create(game.world.randomX, game.rnd.between(0, 100), 'ball');
    	balls[i].body.setCircle(5);
    }

    // Display circle
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, protagonistcol, 1);
    graphics.beginFill(protagonistcol);
    graphics.drawCircle(circle.x, circle.y, circle.diameter);
    
    game.physics.p2.enable(graphics,true);
    graphics.body.setCircle(circle.diameter/2);

    game.input.onDown.add(bounce, this);
    graphics.body.onEndContact.add(makesound,this);
    console.log("allo");
}

function bounce() {

	if (gameover==true) {
		return;
	}

	for (var i = 0; i<ballamount; i++) {
    	balls[i].body.velocity.x = game.input.x - balls[i].x;
    	balls[i].body.velocity.y = game.input.y - balls[i].y;
    }

	circle.diameter = circle.diameter + 1;
	rectangle.width = rectangle.width + 1;
	rectangle.height = rectangle.height + 1;

	graphics.clear();
	graphics.beginFill(0xff0000);
	if (toggle==0) {
		//graphics.moveTo(circle.x,circle.y);
		graphics.drawCircle(circle.x,circle.y,circle.diameter);
		graphics.body.setCircle(circle.diameter/2);
		toggle = 1;
	} else {
		//graphics.moveTo(graphics.x-circle.diameter/2, graphics.y-circle.diameter);
		graphics.x = graphics.x-circle.diameter/2;
		graphics.y = graphics.y-circle.diameter/2;
		graphics.drawRect(rectangle.x,rectangle.y,rectangle.width,rectangle.height);
		graphics.body.setRectangle(rectangle.width,rectangle.height,rectangle.width/2,rectangle.height/2,0);
		toggle = 0;
	}
	//emitter.explode(5000,500);

	console.log("x:" + game.input.x + " y:" + game.input.y);
	console.log("rectx:" + rectangle.x + " y:" + rectangle.y);
	console.log("prox: " + graphics.x + " y: " + graphics.y);
	console.log("toggle:" + toggle);
	graphics.endFill();
	//win1.play();
    //win2.play();
}

function makesound() {
	bouncesnd.play();
}

function update() {
	    //  only move when you click
    if (game.input.mousePointer.isDown)
    {
        //  400 is the speed it will move towards the mouse
        //game.physics.arcade.moveToPointer(sprite, 400);
       //console.log("isDown");
  
    }
    if (game.input.mousePointer.rightButton.isDown){
    	console.log("rightbutton");
    }
    if (toggle == 1 && gameover == false) {
		if (graphics.y+circle.diameter/2 < winloc.ybott && graphics.y-circle.diameter/2 > winloc.y) {
			if (graphics.x+circle.diameter/2 < winloc.xbott && graphics.x-circle.diameter/2 > winloc.x) {
				console.log("WIIIIIIIIIIIIIIIIIIIIIN!");
				gamestopped();
				graphics.kill();
				stateText.text = " You won! \n Click to restart";
				stateText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      			stateText.visible = true;
      			emitter.explode(5000,500);
      			win1.play();
      			win2.play();
			}
			//console.log("Within bounds: " + graphics.y + "<" + winloc.ybott + ">" + winloc.y);
		}
    	//console.log("Within bounds: " + graphics.y + "<" + winloc.ybott + ">" + winloc.y);
    }
    if (gameover == false && circle.diameter > winsize) {
    	gamestopped();
    	stateText.text = " You are too fat\n to win! \n Click to restart";
		stateText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      	stateText.visible = true;
    }
}

function gamestopped() {
	graphics.body.setZeroVelocity();
	gameover= true;
}

