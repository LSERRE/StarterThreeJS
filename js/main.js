$(function () {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	var params = {
		timeSpeed: 1
	}

	/* Init ThreeJS perfomance stats */
	var stats = initStats();

	/* Init GUI */
	var gui = new dat.GUI();

	gui.add(params, 'timeSpeed', 1, 100).onChange(function(){
        generateAnimations();
    });

	var scene, camera, renderer;

	var planeteGroup = new THREE.Object3D();

	var planetes = [];

	var yAxis = new THREE.Vector3(0,1,0);

	init();
	render();

	function init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 1, 1000 );

		camera.position.set(0, 800, 0);

		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

		controls = new THREE.OrbitControls( camera );
		controls.damping = 0.2;
		controls.addEventListener( 'change', render );

		renderer = new THREE.WebGLRenderer();

		renderer.setSize( windowWidth, windowHeight);

		document.body.appendChild( renderer.domElement );

		generatePlanetes();

		generateAnimations();

		scene.add(planeteGroup);

		animate();
	}

	function generatePlanetes() {
		for( var i = 0; i < sources.planetes.length; i++ ) {
			console.log(sources.planetes[i].size);
			var planeteGeometry = new THREE.SphereGeometry( sources.planetes[i].size / 800, 64, 64 );
			var planeteTexture = THREE.ImageUtils.loadTexture('assets/images/' + sources.planetes[i].texture );
			var planeteMaterial = new THREE.MeshBasicMaterial({ map: planeteTexture, side:THREE.DoubleSide  });
			var planeteMesh = new THREE.Mesh( planeteGeometry, planeteMaterial );
			planetes.push(planeteMesh);
			planetes[i]["solarAngle"] = {value : 0};
			planetes[i]["selfAngle"] = {value : 2 * Math.PI};
			planeteGroup.add( planeteMesh );
		}
	}

	function generateAnimations() {
		for( var i = 0; i < sources.planetes.length; i++ ) {
			TweenMax.to(planetes[i]["solarAngle"], sources.planetes[i].revolution / 20 / params.timeSpeed, {value: 2 * Math.PI, ease: Linear.easeNone }).repeat(-1);
			TweenMax.to(planetes[i]["selfAngle"], sources.planetes[i].rotation / params.timeSpeed, {value: 4 * Math.PI,  onUpdate: function(){console.log(sources.planetes[2].name + "selfAngle: " + planetes[2]["selfAngle"].value )}, ease: Linear.easeNone }).repeat(-1);
		}
	}

	function animate() {

		rotatePlanetes();
		requestAnimationFrame(animate);
		controls.update();
		renderer.render( scene, camera );

	}

	function render() {

		stats.update();

	}

	function rotatePlanetes() {
		for( var i = 0; i < planeteGroup.children.length; i++ )  {
			rotateAroundObjectAxis(planeteGroup.children[i], yAxis, planetes[i]["selfAngle"].value);
			planeteGroup.children[i].position.x = Math.sin(planetes[i]["solarAngle"].value) * sources.planetes[i].distance / 2;
        	planeteGroup.children[i].position.z = Math.cos(planetes[i]["solarAngle"].value) * sources.planetes[i].distance / 2;
		}
	}

	// This function rotate an element around it self axis
	function rotateAroundObjectAxis( object, axis, radians ) {
	    rotObjectMatrix = new THREE.Matrix4();
	    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
	    object.matrix.multiply(rotObjectMatrix);
	    object.rotation.setFromRotationMatrix(object.matrix);
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