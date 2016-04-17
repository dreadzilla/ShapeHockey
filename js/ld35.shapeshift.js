/*
	Shapeshift theme game made for Ludum Dare 35
	Created by Hakan Staby
*/

// a global object to hold all global variables related to the game.
var game;
var circle;
var rectangle;
var ball;
var balls = [];
var graphics;
var toggle;
var ballamount = 5;

$(function(){	

	startshapeshift();
	
});

function startshapeshift() {
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
}

function preload() {

    game.load.image('ball', 'images/ball.png');
    game.load.image('clouds', 'images/bg.jpg');

}

function create() {
    //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    //logo.anchor.setTo(0.5, 0.5);
    game.stage.backgroundColor = '#124184';
    clouds = game.add.tileSprite(0, 0, 800, 600, 'clouds');

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 200;
    game.physics.p2.restitution = 0.8;

    ball = game.add.sprite(200,200,'ball');
    game.physics.p2.enable(ball, false);
    ball.body.setCircle(5);
    ball.body.angularForce = 25;

    // add group
    var group = game.add.physicsGroup(Phaser.Physics.P2JS);
    for (var i = 0; i<ballamount; i++) {
    	balls[i] = group.create(game.world.randomX, game.rnd.between(0, 100), 'ball');
    	balls[i].body.setCircle(5);
    }

    // Draw a circle
    circle = new Phaser.Circle(0, 0, 50);
    rectangle = new Phaser.Rectangle(0,0,25,25);

    // Display circle
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0x000000, 1);
    graphics.beginFill(0x000000);
    graphics.drawCircle(circle.x, circle.y, circle.diameter);
    
    game.physics.p2.enable(graphics,true);
    graphics.body.setCircle(25);

    game.input.onDown.add(bounce, this);
    console.log("Hej");

}

function bounce() {

	ball.body.velocity.x = game.input.x - ball.x;
	ball.body.velocity.y = game.input.y - ball.y;
	if (ball.body.velocity.x < 0) {
		ball.body.angularVelocity  = -5;
	} else {
		ball.body.angularVelocity  = 5;
	}
	for (var i = 0; i<ballamount; i++) {
    	balls[i].body.velocity.x = game.input.x - balls[i].x;
    	balls[i].body.velocity.y = game.input.y - balls[i].y;
    }
	

	circle.diameter = circle.diameter + 1;
	rectangle.width = rectangle.width + 1;
	rectangle.height = rectangle.height + 1;

	graphics.clear();
	graphics.beginFill(0x000000);
	if (toggle==0) {
		graphics.drawCircle(circle.x,circle.y,circle.diameter);
		graphics.body.setCircle(circle.diameter/2);
		toggle = 1;
	} else {
		graphics.drawRect(rectangle.x,rectangle.y,rectangle.width,rectangle.height);
		graphics.body.setRectangle(rectangle.x,rectangle.y,rectangle.width/2,rectangle.height/2,0);
		toggle = 0;
	}

	console.log("x:" + game.input.x + " y:" + game.input.y);
	console.log("b_x:" + ball.x + " y:" + ball.y);
	console.log("toggle:" + toggle);
	graphics.endFill();
	
}

function update() {
	    //  only move when you click
    if (game.input.mousePointer.isDown)
    {
        //  400 is the speed it will move towards the mouse
        //game.physics.arcade.moveToPointer(sprite, 400);
       //console.log("isDown");
  
    }
    //graphics.beginFill(0xFF3300);
    //graphics.endFill();
    /*else
    {
        sprite.body.velocity.setTo(0, 0);
    }*/
}

