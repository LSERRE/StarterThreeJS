$(function () {

	var params = {
	}

	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	/* Init ThreeJS perfomance stats */
	var stats = initStats();

	/* Init GUI */
	var gui = new dat.GUI();

	function initStats () {
		var stats = new Stats();
		stats.setMode(1); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );

		var update = function () {

		    stats.begin();

		    // monitored code goes here

		    stats.end();

		    requestAnimationFrame( update );

		};

		requestAnimationFrame( update );

		return stats;
	}
});