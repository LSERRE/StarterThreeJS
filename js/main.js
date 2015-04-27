var params = new function() {
}

$(function () {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	/* Init ThreeJS perfomance stats */
	var stats = initStats();

	/* Init GUI */
	var gui = new dat.GUI();

	var scene, camera, renderer;

	init();
	animate();

	function init() {
		/* Init Scene */
	    scene = new THREE.Scene();

	    /* Init Camera */
	    camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 1, 10000 );
	    camera.position.z =  1000;

	    /* Init renderer as WebGlRenderer */
	    renderer = new THREE.WebGLRenderer();

	    /* Set renderer size */
	    renderer.setSize( windowWidth, windowHeight );

	    /* Append canvas with goods sizes in body  */
	    document.body.appendChild( renderer.domElement );
	}

	function animate() {
		/* Updates stats */
		stats.update();

		/* Loop on animate function when browser has an avaible frame */
	    requestAnimationFrame( animate );

	    /* Render and update canvas with scene and camera */
	    renderer.render( scene, camera );
	}

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