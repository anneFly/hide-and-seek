var Player = (function ($, console, window, document, Config, Player) {
	"use strict";

	var BLOCK_SIZE = Config.BLOCK_SIZE,
		START_X = Config.PLAYER_START_X,
		START_Y = Config.PLAYER_START_Y,
		Pl;
	
	Pl = function () {
		this.x = START_X;
		this.y = START_Y;
		this.el = document.createElement('div');
		this.el.className = "player";
		this.el.style.width = BLOCK_SIZE + 'px';
		this.el.style.height = BLOCK_SIZE + 'px';
	};
	
	Pl.prototype = {
        draw: function () {
			this.el.style.top = this.y * BLOCK_SIZE + 'px';
			this.el.style.left = this.x * BLOCK_SIZE + 'px';
		},
        moveUp: function () {
			this.y -= 1;
		},
        moveLeft: function () {
			this.x -= 1;
		},
        moveDown: function () {
			this.y += 1;
		},
        moveRight: function () {
			this.x += 1;
		}
	};
	
	Player.create = function () {
		return new Pl();
    };
	
	return Player;
	
}(jQuery, console, this, this.document, Config, Player || {}));
