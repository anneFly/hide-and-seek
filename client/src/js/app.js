(function ($, console, Grid, App) {
	"use strict";

	App.init = function () {
		var g, map, i, j,
			GRID_X = 24,
			GRID_Y = 24;
		
		$.getJSON('src/data/map.json', function(data) {
			map = data.layout;
			
			g = Grid.create(GRID_X, GRID_Y);
		
			for (i = 0; i<GRID_X; i+=1) {
				for (j = 0; j<GRID_Y; j+=1) {
					g.field[i][j].content = map[j][i];
				}
			}
			g.draw();
		});
	};
	App.init();
}(jQuery, console, Grid, window.App || {}));
