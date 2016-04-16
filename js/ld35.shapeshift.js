/*
	Shapeshift theme game made for Ludum Dare 35
	Created by Hakan Staby
*/

// a global object to hold all global variables related to the game.
var shapeshiftGame = {};

shapeshiftGame.savingObject = {};

// store the counting elapsed time.
shapeshiftGame.savingObject.currentElapsedTime = 0;

$(function(){	

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });
	

});

function preload () {

            game.load.image('logo', 'images/phaser.png');

        }

        function create () {

            var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);

        }

