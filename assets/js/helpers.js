var dat = require('./lib/dat.min.js');
var Stats = require('./lib/stats.min.js');

console.log( dat );

module.exports = Helpers;

function Helpers() {
	var params = {
	}

	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
}

Helpers.prototype.init = function()
{
	console.log( "init" );
	/* Init GUI */
	// this.gui = new dat.GUI();
	
	this.stats = new Stats();
	this.stats.setMode(1); // 0: fps, 1: ms

	// align top-left
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.left = '0px';
	this.stats.domElement.style.top = '0px';

	document.body.appendChild( this.stats.domElement );

	return this.stats;
}

Helpers.prototype.update = function()
{
	stats.begin();

    // monitored code goes here

    stats.end();
}