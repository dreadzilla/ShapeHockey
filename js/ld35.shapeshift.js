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
var shake = 4;
var bouncesnd;
var win1,win2;
var bgmusic;
var levelText;
var level = 0;
var levels = new Array();
levels[0] = {
	winsize: 200, x: 400, y: 50, xbott: 600, ybott: 250 
};
levels[1] = {
	winsize: 150, x: 350, y: 50, xbott: 500, ybott: 200
};
levels[2] = {
	winsize: 100, x: 300, y: 50, xbott: 400, ybott: 150
};

var instructionString = "Click with the mouse within the screen\nto make the small balls shoot " +
	"towards\nyour mouse pointer. \nKnock the larger object towards the goal.\nEvery click makes you fatter!" +
	"\nOnly one of the shapes can score!\n\nPress the S key to start";

$(function(){	

	startshapeshift();
	
});

function startshapeshift() {
	//game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
	game.state.add('menu', menuState);
	game.state.add('play', playState);
	game.state.start('menu');
}

var playState = {
	preload: function() {

	    game.load.image('ball', 'images/ball2.png');
	    game.load.image('clouds', 'images/bg.jpg');
	    game.load.image('goal2', 'images/bullseye.png');
		game.load.image('star', 'images/star.png');    
		game.load.audio('bounce', 'audio/bounce1.wav');
		game.load.audio('win1', 'audio/won1.wav');
		game.load.audio('win2', 'audio/won2.wav');
		game.load.audio('bgmusic', 'audio/shapeshift.ogg');
		game.load.bitmapFont('shortStack', 'fonts/shortStack.png', 'fonts/shortStack.xml');
	},

	create: function() {
	   
	    game.stage.backgroundColor = '#124184';
	    clouds = game.add.tileSprite(0, 0, 800, 600, 'clouds');
	    // Add physics and gravity.
	    game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.gravity.y = 100;
	    game.physics.p2.restitution = 0.8;

		wingraphics = game.add.sprite(levels[level].x,levels[level].y,'goal2');
	    wingraphics.width = levels[level].winsize;
	    wingraphics.height = levels[level].winsize;

	    // Define our protagonists
	    circle = new Phaser.Circle(0, 0, 25);
	    rectangle = new Phaser.Rectangle(0,0,25,25);
	    winrectangle = new Phaser.Rectangle(0,0,winsize,winsize);
	    point = new Phaser.Rectangle(0,0,2,2);
	    var style = { font: "bold 24px Orbitron", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	    //  Text in the middle of the screen
	    //stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', style);
	    levelText = game.add.text(5, 0, 'Level: ' + (level+1), style);
	    levelText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

	    stateText = game.add.bitmapText(game.world.centerX, game.world.centerY, 
	    	'shortStack', ' ', 48);
	    stateText.anchor.setTo(0.5, 0.25);
	    stateText.align = "center";
	    stateText.visible = false;
	    bouncesnd = game.add.audio('bounce',1);
	    win1 = game.add.audio('win1',1);
	    win2 = game.add.audio('win2',1);
	    bgmusic = game.add.audio('bgmusic',0.5);
	    bgmusic.play('',0,1,true);
	    rkey = game.input.keyboard.addKey(Phaser.Keyboard.S);

	    // add emitter
	    emitter = game.add.emitter(levels[level].x+levels[level].winsize/2, levels[level].y+levels[level].winsize/2,200);
	    emitter.makeParticles('star');

	    // add group of balls
	    var group = game.add.physicsGroup(Phaser.Physics.P2JS);
	    for (var i = 0; i<ballamount; i++) {
	    	balls[i] = group.create(game.world.randomX, game.rnd.between(0, 100), 'ball');
	    	balls[i].body.setCircle(5);
	    }

	    // Display circle
	    graphics = game.add.graphics(0, 0);
	    graphics.lineStyle(1, 0x000000, 1);
	    graphics.beginFill(protagonistcol);
	    graphics.drawCircle(circle.x, circle.y, circle.diameter);
	    
	    game.physics.p2.enable(graphics,false);
	    graphics.body.setCircle(circle.diameter/2);

	    game.input.onDown.add(bounce, this);
	    graphics.body.onEndContact.add(makesound,this);
	},
	update: function() {
	    if (toggle == 1 && gameover == false) {
			if (graphics.y+circle.diameter/2 < levels[level].ybott && graphics.y-circle.diameter/2 > levels[level].y) {
				if (graphics.x+circle.diameter/2 < levels[level].xbott && graphics.x-circle.diameter/2 > levels[level].x) {
					console.log("WIIIIIIIIIIIIIIIIIIIIIN!");
					gamestopped();
					graphics.kill();
					if (level < 2) {
						stateText.text = " \n Success! \nPress the S key\nto continue";
					} else {
						stateText.text = " You won! \n\nPress the S key\nto restart";
					}
					// Show text and bells and whistles
	      			stateText.visible = true;
	      			emitter.explode(5000,500);
	      			win1.play();
	      			win2.play();
	      			var rkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	      			rkey.onDown.addOnce(restart, this);
				}
			}
	    }
	    if (gameover == false && circle.diameter > levels[level].winsize) {
	    	gamestopped();
	    	stateText.text = "You are too fat\nto win! \nPress the S key\nto restart level";
			//stateText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	      	stateText.visible = true;
	      	var rkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	      	level = level -1; //restart counts this one up...
	      	rkey.onDown.addOnce(restart, this);
	    }
	}
};
// bounce is called when clicked
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
	graphics.lineStyle(2, 0x000000, 1);
	graphics.beginFill(0xff0000);
	// Toggle shapes
	if (toggle==0) {
		graphics.drawCircle(circle.x,circle.y,circle.diameter);
		graphics.body.setCircle(circle.diameter/2);
		toggle = 1;
	} else { 
		graphics.drawRect(rectangle.x-rectangle.width/2,rectangle.y-rectangle.height/2,rectangle.width,rectangle.height);
		graphics.body.setRectangle(rectangle.width,rectangle.height,0,0,0);
		toggle = 0;
	}
	graphics.endFill();
}

function makesound() {
	bouncesnd.play();
}

function restart() {
	gameover= false;
	bgmusic.stop();
	game.state.start('play',true,true);
	if (level < 2) {
		level = level+1;
	} else {
		level = 0;
	}
}

function gamestopped() {
	graphics.body.setZeroVelocity();
	gameover= true;
}

// menu screen
var menuState = {
	preload: function() {
		game.load.image('clouds', 'images/bg.jpg');
		game.load.bitmapFont('shortStack', 'fonts/shortStack.png', 'fonts/shortStack.xml');
	},
	create: function() {
		clouds = game.add.tileSprite(0, 0, 800, 600, 'clouds');

		//  Text in the middle of the screen
	    var greetingsText = game.add.bitmapText(game.world.centerX, game.world.centerY - game.world.height/4, 
	    	'shortStack', 'Shape Hockey!', 64);
	    greetingsText.anchor.setTo(0.5, 0.5);
	    greetingsText.visible = true;

	    var instructionsText = game.add.bitmapText(game.world.centerX, game.world.centerY,
	    	'shortStack', instructionString, 24);
	    instructionsText.anchor.setTo(0.5, 0.25);
	    instructionsText.tint = 0x0f0f0f;
	    var rkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	    rkey.onDown.addOnce(this.start, this);
	    
	},
	start: function() {
		game.state.start('play');
	}

};
