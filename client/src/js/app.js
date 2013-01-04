(function ($, console, Grid, App) {
	"use strict";

	App.init = function () {
		var g;

		g = Grid.create(24, 24);

		g.field[5][13].content = 'block';
		g.field[5][14].content = 'block';
		g.field[5][15].content = 'block';
		g.field[5][16].content = 'block';
		g.field[5][17].content = 'block';
		g.field[5][18].content = 'block';
		g.field[4][18].content = 'block';
		g.field[3][18].content = 'block';
		g.field[20][12].content = 'block';
		g.field[21][12].content = 'block';
		g.field[22][13].content = 'block';
		g.field[22][14].content = 'block';
		g.draw();

	};

	App.init();
}(jQuery, console, Grid, window.App || {}));

