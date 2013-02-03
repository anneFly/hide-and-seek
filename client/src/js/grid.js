var Grid = (function ($, console, window, document, Config, Player, Grid) {
	"use strict";

	var BLOCK_SIZE = Config.BLOCK_SIZE,
		Field, Gr,
		mouseX = 0, mouseY = 0;

	Field = function (i, j) {
		this.x = i;
		this.y = j;
		this.content = 'X';
		this.dark = true;
	};

	Gr = function (x, y) {
		this.sizeX = x;
		this.sizeY = y;
		this.pixelSizeX = this.sizeX * Config.BLOCK_SIZE;
		this.pixelSizeY = this.sizeY * Config.BLOCK_SIZE;
		this.field = [];
		this.$el = $('<div class="grid">');
		this.player = Player.create();
		this.opponent = Player.create();
	};
	
	Gr.prototype = {
		checkCollision: function (x, y) {
			var xpos = x,
				ypos = y,
				d = new $.Deferred();
			
			if ((xpos < 0) || (ypos < 0) || (xpos >= this.sizeX) || (ypos >= this.sizeY)) {
				d.reject();
				return d.promise();
			}
				
			if ((this.field[xpos][ypos].content === 'B')) {
				d.reject();
			} else {
				d.resolve();
			}
			return d.promise();
		},
		checkGoal: function (x, y) {
			var xpos = x,
				ypos = y,
				d = new $.Deferred();

			if ((this.field[xpos][ypos].content === 'G')) {
				d.resolve();
			} else {
				d.reject();
			}
			return d.promise();
		},
		updateView: function () {
			var x = mouseX - this.$el.get(0).offsetLeft + $(window).scrollLeft() - this.player.x * BLOCK_SIZE,
				y = mouseY - this.$el.get(0).offsetTop + $(window).scrollTop() - this.player.y * BLOCK_SIZE,
				rad = Math.atan2(y, x),
				deg = rad * (180 / Math.PI);

			this.drawCanvasFields(this.ctx, rad);
		},
		bindEvents: function () {
			var self = this,
				checkGoalDeferred = function () {
					$.when(self.checkGoal(self.player.x, self.player.y)).then(
						function () {
							alert('You win!!');
						},
						function () {
							return;
						}
					);
				};

			this.$el.on('mousemove', function (e) {
				mouseX = e.clientX;
				mouseY = e.clientY;
				var x = mouseX - this.offsetLeft + $(window).scrollLeft() - self.player.x * BLOCK_SIZE,
					y = mouseY - this.offsetTop + $(window).scrollTop() - self.player.y * BLOCK_SIZE,
					rad = Math.atan2(y, x);

				self.drawCanvasFields(self.ctx, rad);
			});

			$(document).on('keydown', function (e) {
				if ((e.which === 38) || (e.which === 87)) {
					self.player.moveUp();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.updateView();
							checkGoalDeferred();
						},
						function () {
							self.player.moveDown();
						}
					);
					return;
				}
				if ((e.which === 37) || (e.which === 65)) {
					self.player.moveLeft();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.updateView();
							checkGoalDeferred();
						},
						function () {
							self.player.moveRight();
						}
					);
					return;
				}
				if ((e.which === 40) || (e.which ===  83)) {
					self.player.moveDown();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.updateView();
							checkGoalDeferred();
						},
						function () {
							self.player.moveUp();
						}
					);
					return;
				}
				if ((e.which === 39) || (e.which === 68)) {
					self.player.moveRight();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.updateView();
							checkGoalDeferred();
						},
						function () {
							self.player.moveLeft();
						}
					);
					return;
				}
			});
		},
		drawCanvasFields: function (ctx, rad) {
			var i, j, self = this, settings, block, borderX, borderY;
			ctx.clearRect(0, 0, 1000, 1000);

			borderX = self.sizeX - ((66*self.sizeX/100) | 0);
			borderY = self.sizeY - ((66*self.sizeY/100) | 0);
			
			for (i = 0; i<self.sizeX; i+=1) {
				if ((i > (self.player.x - borderX)) && (i < (self.player.x + borderX))) {
					for (j = 0; j<self.sizeY; j+=1) {
						if ((j > (self.player.y - borderY)) && (j < (self.player.y + borderY))) {
							if (self.field[i][j].content === 'B') {
								self.ctx.fillStyle = '#222222';
							} else if (self.field[i][j].content === 'G') {
								self.ctx.fillStyle = '#ffff00';
							} else if (self.field[i][j].content === 'X') {
								self.ctx.fillStyle='#f5f5f5';
							}
							self.ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
						} else {
							ctx.fillStyle = '#555555';
							ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
						}
					}	
				} else {
					for (j = 0; j<self.sizeY; j+=1) {
						ctx.fillStyle = '#555555';
						ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
					}
				}
			}
			
			ctx.save();
			settings = {
				size: 's'
			};
			block = (settings.size === 's') ? (self.pixelSizeX/3 | 0) : (settings.size === 'm') ? (self.pixelSizeX/3.5 | 0) : (settings.size === 'l') ? (self.pixelSizeX/4 | 0) : (self.pixelSizeX/2.2 | 0);
			  
			ctx.translate((self.player.x * BLOCK_SIZE) + BLOCK_SIZE/2, (self.player.y * BLOCK_SIZE)  + BLOCK_SIZE/2);
				
			ctx.rotate(rad);

			ctx.translate(-self.player.x * BLOCK_SIZE, -self.player.y * BLOCK_SIZE);
			ctx.translate((self.player.x - self.sizeX/2) * BLOCK_SIZE, (self.player.y - self.sizeY/2) * BLOCK_SIZE);

			ctx.fillStyle = "#555555";
			ctx.fillRect(0, 0, (self.pixelSizeX/2 + 1), self.pixelSizeY);
			ctx.fillRect(self.pixelSizeX - block, 0, block, self.pixelSizeY);
			ctx.beginPath();
			ctx.moveTo(self.pixelSizeX, 0);
			ctx.lineTo(self.pixelSizeX/2,self.pixelSizeY/2);
			ctx.lineTo(self.pixelSizeX/2,0);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(self.pixelSizeX, self.pixelSizeY);
			ctx.lineTo(self.pixelSizeX/2,self.pixelSizeY);
			ctx.lineTo(self.pixelSizeX/2,self.pixelSizeY/2);
			ctx.fill();
			
			ctx.restore();
			

		},
		drawCanvas: function () {
			var self = this, $canvas, canvas, i, j;
			
			$canvas = $('<canvas width="' + self.sizeX * BLOCK_SIZE + 'px" height="' + self.sizeY * BLOCK_SIZE + 'px">');
			canvas = $canvas.get(0);
			self.$el.append(canvas).append(self.player.el);
			self.player.draw();
			$('body').append(self.$el);
			self.ctx = canvas.getContext("2d");
			
			self.drawCanvasFields(self.ctx, 0);
		},
		init: function () {
			var i, j, self = this;
			for (i = 0; i<self.sizeX; i+=1) {
				self.field[i] = [];
				for (j = 0; j<self.sizeY; j+=1) {
					self.field[i][j] = new Field(i, j);
				}
			}
			this.bindEvents();
		}
	};

	Grid.create = function (x, y) {
		var g = new Gr(x, y);
		g.init();
		return g;
	};

	return Grid;

}(jQuery, console, this, this.document, Config, Player, Grid || {}));
