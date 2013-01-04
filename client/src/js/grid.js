var Grid = (function (Grid, $, console, window) {
	"use strict";

	var BLOCK_SIZE = 20,
		START_X = 12 * BLOCK_SIZE,
		START_Y = 12 * BLOCK_SIZE;

	var Field = function (i, j) {
		this.x = i;
		this.y = j;
		this.content = 'free';
		this.dark = true;
	};
	var Light = function () {
		this.x = START_X;
		this.y = START_Y;
		this.$el = $('<div class="light">');
		this.draw = function (x, y) {
			this.$el.css({
				top: y + BLOCK_SIZE / 2,
				left: x + BLOCK_SIZE / 2
			});
		};
	};

	var Player = function () {
		this.x = START_X;
		this.y = START_Y;
		this.$el = $('<div class="player">');
		this.light = new Light();
    };
    Player.prototype = {
        draw: function () {
			this.$el.css({
				top: this.y,
				left: this.x
			});
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

	var TheGrid = function (x, y) {
		this.x = x;
		this.y = y;
		this.field = [];
		this.$el = $('<div class="grid">');
		this.player = new Player();
		this.checkCollision = function (x, y) {
			var xpos = x/BLOCK_SIZE,
				ypos = y/BLOCK_SIZE,
				d = new $.Deferred();

			if (this.field[xpos][ypos].content === 'block') {
				d.reject();
			} else {
				d.resolve();
			}

			return d.promise();
		};
		this.drawFields = function () {
			var i, j, self = this;
			var $cell = $('.grid-cell');
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
		};
		this.init = function () {
			var i,
				j,
				self = this;
			for (i = 0; i<self.x; i+=1) {
				self.field[i] = [];
				for (j = 0; j<self.y; j+=1) {
					self.field[i][j] = new Field(i, j);
				}
			}

			this.$el.on('mousemove', function (e) {
				var x = e.clientX - this.offsetLeft + $(window).scrollLeft() - self.player.x,
					y = e.clientY - this.offsetTop + $(window).scrollTop() - self.player.y;

				var rad = Math.atan2(y,x);

				self.player.light.$el.css({
					'-webkit-transform': 'rotate(' + rad + 'rad)'
				});
			});

			$(document).on('keydown', function (e) {
				if ((e.which === 38) || (e.which === 87)) {
					self.player.moveUp();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.drawFields();
							self.$el.trigger('mousemove');
						},
						function () {
							self.player.moveDown();
						}
					);
				}
				if ((e.which === 37) || (e.which === 65)) {
					self.player.moveLeft();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.drawFields();
							self.$el.trigger('mousemove');
						},
						function () {
							self.player.moveRight();
						}
					);
				}
				if ((e.which === 40) || (e.which ===  83)) {
					self.player.moveDown();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.drawFields();
							self.$el.trigger('mousemove');
						},
						function () {
							self.player.moveUp();
						}
					);
				}
				if ((e.which === 39) || (e.which === 68)) {
					self.player.moveRight();
					$.when(self.checkCollision(self.player.x, self.player.y)).then(
						function () {
							self.player.draw();
							self.drawFields();
							self.$el.trigger('mousemove');
						},
						function () {
							self.player.moveLeft();
						}
					);
				}
			});

		};
		this.draw = function () {
			var i, j, self = this;

			var $ground = self.$el;
			for (i = 0; i<self.x; i+=1) {
				var $col = $('<div class="grid-col">');
				for (j = 0; j<self.y; j+=1) {
					var $cell = $('<div class="grid-cell">');
					$cell.addClass(self.field[i][j].content).attr('id', 'x'+i+'y'+j);
					$col.append($cell);
				}
				$ground.append($col);
			}
			$ground.append(self.player.$el).append(self.player.light.$el);
			self.player.draw();
			$('body').append($ground);

			self.drawFields();
		};
	};

	Grid.create = function (x, y) {
		var g = new TheGrid(x, y);
		g.init();
		return g;
	};

	return Grid;

}(Grid || {}, jQuery, console, this));
