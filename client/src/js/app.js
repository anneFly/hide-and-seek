(function ($, console, Grid) {
	"use strict";
	
	var App = window.App || {};
	
	App.init = function () {
		var g;
		
		g = Grid.create(40, 40);
		g.field[35][35].content = 'block';
		g.field[35][34].content = 'block';
		g.field[35][33].content = 'block';
		g.field[35][32].content = 'block';
		g.field[35][31].content = 'block';
		g.field[35][30].content = 'block';
		g.field[34][35].content = 'block';
		g.field[33][35].content = 'block';
		g.field[20][12].content = 'block';
		g.field[21][12].content = 'block';
		g.field[22][13].content = 'block';
		g.field[22][14].content = 'block';
		g.draw();
		
	};
	
	App.init();
}(jQuery, console, Grid));

