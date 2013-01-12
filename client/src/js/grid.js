var Grid = (function ($, console, window, document, Grid, Player) {
	"use strict";

	var BLOCK_SIZE = 20,
		START_X = 12 * BLOCK_SIZE,
		START_Y = 12 * BLOCK_SIZE,
		Field, Gr,
		mouseX = 0, mouseY = 0;

	Field = function (i, j) {
		this.x = i;
		this.y = j;
		this.content = 'X';
		this.dark = true;
	};

	Gr = function (x, y) {
		this.x = x;
		this.y = y;
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
			
			if ((xpos < 0) || (ypos < 0) || (xpos >= this.x) || (ypos >= this.y)) {
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
				rad = Math.atan2(y, x);

			this.player.light.el.style['-webkit-transform'] = 'rotate(' + rad + 'rad)';
			this.player.light.el.style['-moz-transform'] = 'rotate(' + rad + 'rad)';
			this.player.light.el.style['-ms-transform'] = 'rotate(' + rad + 'rad)';
			this.player.light.el.style.transform = 'rotate(' + rad + 'rad)';
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

				self.player.light.el.style['-webkit-transform'] = 'rotate(' + rad + 'rad)';
				self.player.light.el.style['-moz-transform'] = 'rotate(' + rad + 'rad)';
				self.player.light.el.style['-ms-transform'] = 'rotate(' + rad + 'rad)';
				self.player.light.el.style.transform = 'rotate(' + rad + 'rad)';
			});

			$(document).on('keydown', function (e) {
				if ((e.which === 38) || (e.which === 87)) {
					self.player.moveUp();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.updateView();
							self.drawCanvasFields(self.ctx);
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
							self.drawCanvasFields(self.ctx);
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
							self.drawCanvasFields(self.ctx);
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
							self.drawCanvasFields(self.ctx);
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
		drawCanvasFields: function (ctx) {
			var i, j, self = this;
			for (i = 0; i<self.x; i+=1) {
				if ((i > (self.player.x - 6)) && (i < (self.player.x + 6))) {
					for (j = 0; j<self.y; j+=1) {
						if ((j > (self.player.y - 6)) && (j < (self.player.y + 6))) {
							self.field[i][j].dark = false;
						} else {
							self.field[i][j].dark = true;
						}
						if (self.field[i][j].dark === true) {
							ctx.fillStyle = '#555555';
							ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                       } else {
							if (self.field[i][j].content === 'B') {
								ctx.fillStyle = '#222222';
							} else if (self.field[i][j].content === 'G') {
								ctx.fillStyle = '#ffff00';
							} else if (self.field[i][j].content === 'X') {
								ctx.fillStyle='#f5f5f5';
							}
							ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        }
					}
				} else {
					for (j = 0; j<self.y; j+=1) {
						self.field[i][j].dark = true;

						ctx.fillStyle = '#555555';
						ctx.fillRect(i*BLOCK_SIZE, j*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
					}
				}
			}
		},
		drawCanvas: function () {
			var self = this, ctx, $canvas, canvas;
			
			$canvas = $('<canvas width="' + self.x * BLOCK_SIZE + 'px" height="' + self.y * BLOCK_SIZE + 'px">');
			canvas = $canvas.get(0);
			self.$el.append(canvas).append(self.player.el).append(self.player.light.el);
			self.player.draw();
			$('body').append(self.$el);
			self.ctx = canvas.getContext("2d");
			
			self.drawCanvasFields(self.ctx);
		},
		init: function () {
			var i, j, self = this;
			for (i = 0; i<self.x; i+=1) {
				self.field[i] = [];
				for (j = 0; j<self.y; j+=1) {
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

}(jQuery, console, this, this.document, Grid || {}, Player));
