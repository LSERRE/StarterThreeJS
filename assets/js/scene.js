var THREE = require('THREE');
var OrbitControls = require('three-orbit-controls')(THREE)
var pubsub = require("./modules/pubsub");

module.exports = Scene;

function Scene() {
	var container, stats;

	var camera, scene, renderer;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
}

Scene.prototype.init = function() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// Camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 100;

	// Scene
	scene = new THREE.Scene();

	// Light
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

	// Renderer
	renderer = new THREE.WebGLRenderer(); // init like this
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	// Controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;
	
	container.appendChild( renderer.domElement );

	var self = this;

	pubsub.on('windowResize', function(){
		self.onWindowResize()
	});
}

Scene.prototype.onWindowResize = function() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

Scene.prototype.animate = function() {

	requestAnimationFrame( this.animate );
	this.render();

}

Scene.prototype.render = function() {

	controls.update();

	renderer.render( scene, camera );

}