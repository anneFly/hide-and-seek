var Player = (function ($, console, window, document, Player) {
	"use strict";
	
	var BLOCK_SIZE = 20,
		START_X = 12 * BLOCK_SIZE,
		START_Y = 12 * BLOCK_SIZE,
		Light, Pl;
	
	
	Light = function () {
		this.x = START_X;
		this.y = START_Y;
		this.el = document.createElement('div');
		this.el.className = "light";
	};
	
	Light.prototype.draw = function (x, y) {
		this.el.style.top =  y + BLOCK_SIZE / 2 + 'px';
		this.el.style.left =  x + BLOCK_SIZE / 2 + 'px';
	};
	
	Pl = function () {
		this.x = START_X;
		this.y = START_Y;
		this.el = document.createElement('div');
		this.el.className = "player";
		this.light = new Light();
	};
	
	Pl.prototype = {
        draw: function () {
			this.el.style.top = this.y + 'px';
			this.el.style.left = this.x + 'px';
			
			this.light.draw(this.x, this.y);
		},
        moveUp: function () {
			this.y -= BLOCK_SIZE;
		},
        moveLeft: function () {
			this.x -= BLOCK_SIZE;
		},
        moveDown: function () {
			this.y += BLOCK_SIZE;
		},
        moveRight: function () {
			this.x += BLOCK_SIZE;
		}
	};
	
	Player.create = function () {
		return new Pl();
    };
	
	return Player;
	
}(jQuery, console, this, this.document, Player || {}));
