var Grid = (function ($, console, window, document, Grid, Player) {
	"use strict";

	var BLOCK_SIZE = 20,
		START_X = 12 * BLOCK_SIZE,
		START_Y = 12 * BLOCK_SIZE,
		GRID_X,
		GRID_Y,
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
	};
	
	Gr.prototype = {
		checkCollision: function (x, y) {
			var xpos = x/BLOCK_SIZE,
				ypos = y/BLOCK_SIZE,
				d = new $.Deferred();
			
			if ((xpos < 0) || (ypos < 0) || (xpos >= GRID_X) || (ypos >= GRID_Y)) {
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
			var xpos = x/BLOCK_SIZE,
				ypos = y/BLOCK_SIZE,
				d = new $.Deferred();

			if ((this.field[xpos][ypos].content === 'G')) {
				d.resolve();
			} else {
				d.reject();
			}
			return d.promise();
		},
		drawFields: function () {
			var i, j, self = this;
			for (i = 0; i<self.x; i+=1) {
				if ((i > (self.player.x/BLOCK_SIZE - 6)) && (i < (self.player.x/BLOCK_SIZE + 6))) {
					for (j = 0; j<self.y; j+=1) {
						if ((j > (self.player.y/BLOCK_SIZE - 6)) && (j < (self.player.y/BLOCK_SIZE + 6))) {
							self.field[i][j].dark = false;
						} else {
							self.field[i][j].dark = true;
						}
						if (self.field[i][j].dark === true) {
                            $('#x'+i+'y'+j).addClass('dark');
                        } else {
                            $('#x'+i+'y'+j).removeClass('dark');
                        }
					}
				} else {
					for (j = 0; j<self.y; j+=1) {
						self.field[i][j].dark = true;

						if (self.field[i][j].dark === true) {
                            $('#x'+i+'y'+j).addClass('dark');
                        } else {
                            $('#x'+i+'y'+j).removeClass('dark');
                        }
					}
				}
			}
		},
		updateView: function () {
			var x = mouseX - this.$el.get(0).offsetLeft + $(window).scrollLeft() - this.player.x,
				y = mouseY - this.$el.get(0).offsetTop + $(window).scrollTop() - this.player.y,
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
				var x = mouseX - this.offsetLeft + $(window).scrollLeft() - self.player.x,
					y = mouseY - this.offsetTop + $(window).scrollTop() - self.player.y,
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
							self.drawFields();
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
							self.drawFields();
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
							self.drawFields();
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
							self.drawFields();
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
		init: function () {
			var i,
				j,
				self = this;
			for (i = 0; i<self.x; i+=1) {
				self.field[i] = [];
				for (j = 0; j<self.y; j+=1) {
					self.field[i][j] = new Field(i, j);
				}
			}
			this.bindEvents();
		},
		draw: function () {
			var i, j, self = this, $col, $cell;

			for (i = 0; i<self.x; i+=1) {
				$col = $('<div class="grid-col">');
				for (j = 0; j<self.y; j+=1) {
					$cell = $('<div class="grid-cell">');
					$cell.addClass(self.field[i][j].content).attr('id', 'x'+i+'y'+j);
					$col.append($cell);
				}
				self.$el.append($col);
			}
			self.$el.append(self.player.el).append(self.player.light.el);
			self.player.draw();
			$('body').append(self.$el);

			self.drawFields();
		}
	};

	Grid.create = function (x, y) {
		GRID_X = x;
		GRID_Y = y;
		var g = new Gr(x, y);
		g.init();
		return g;
	};

	return Grid;

}(jQuery, console, this, this.document, Grid || {}, Player));
