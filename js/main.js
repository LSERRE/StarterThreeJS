$(function () {
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	var params = {
		multiPlaneteDistance: 5,
		multiPlaneteSize: 1
	}

	/* Init ThreeJS perfomance stats */
	var stats = initStats();

	/* Init GUI */
	var gui = new dat.GUI();

    gui.add(params, 'multiPlaneteDistance', 1, 100).onChange(function(){
    	scene.remove(circleGroup);
    	circleGroup.children = [];
        generateCircles();
    });

    gui.add(params, 'multiPlaneteSize', 1, 100).onChange(function(){
    	planeteGroup.children = [];
    	planetes = [];
        generatePlanetes();
        generateSolarAngle();
    });

	var scene, camera, renderer;

	var planeteGroup = new THREE.Object3D();
	var circleGroup = new THREE.Object3D();

	var planetes = [];

	var xAxis = new THREE.Vector3(1,0,0);
	var yAxis = new THREE.Vector3(0,1,0);

	init();
	animate();

	function init() {
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 45, windowWidth / windowHeight, 0.1, 100000 );

		camera.position.set(0, 800, 0);

		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

		controls = new THREE.OrbitControls( camera );
		controls.damping = 0.2;

		renderer = new THREE.WebGLRenderer();

		renderer.setSize( windowWidth, windowHeight);

		document.body.appendChild( renderer.domElement );

		generateCircles();

		generatePlanetes();

		generateSolarAngle();
	}

	function generateCircles() {
		for( var i = 0; i < sources.planetes.length; i++ ) {
			var circleGeometry = new THREE.RingGeometry( sources.planetes[i].distance * params.multiPlaneteDistance, sources.planetes[i].distance * params.multiPlaneteDistance - 3, 64 );
			var circleMaterial = new THREE.MeshBasicMaterial( { color: 0xe5e5e5 } )
			var circleMesh = new THREE.Mesh( circleGeometry, circleMaterial );
			rotateAroundWorldAxis(circleMesh, xAxis, Math.PI / 2 );
			circleGroup.add( circleMesh );
			scene.add( circleGroup );
		}
	}

	function generatePlanetes() {
		for( var i = 0; i < sources.planetes.length; i++ ) {
			var planeteGeometry = new THREE.SphereGeometry( sources.planetes[i].size * params.multiPlaneteSize / 800, 64, 64 );
			var planeteTexture = THREE.ImageUtils.loadTexture('assets/images/' + sources.planetes[i].texture );
			var planeteMaterial = new THREE.MeshBasicMaterial({ map: planeteTexture, side:THREE.DoubleSide  });
			var planeteMesh = new THREE.Mesh( planeteGeometry, planeteMaterial );
			planetes.push(planeteMesh);
			planetes[i]["solarAngle"] = {value : 0};
			planeteGroup.add( planeteMesh );
			scene.add( planeteGroup );
		}
	}

	function generateSolarAngle() {
		for( var i = 0; i < sources.planetes.length; i++ ) {
			TweenMax.to(planetes[i]["solarAngle"], sources.planetes[i].revolution / 10, {value: 2 * Math.PI, ease: Linear.easeNone }).repeat(-1);
		}
	}

	function animate() {

		rotatePlanetes();
		requestAnimationFrame(animate);
		controls.update();
		stats.update();
		renderer.render( scene, camera );

	}

	function rotatePlanetes() {
		for( var i = 0; i < planeteGroup.children.length; i++ )  {
			// The sun doesn't rotate
			if( i!= 0 ) {
				rotateAroundObjectAxis(planeteGroup.children[i], yAxis, 100 / sources.planetes[i].rotation);
				planeteGroup.children[i].position.x = Math.sin(planetes[i]["solarAngle"].value) * sources.planetes[i].distance * params.multiPlaneteDistance;
	        	planeteGroup.children[i].position.z = Math.cos(planetes[i]["solarAngle"].value) * sources.planetes[i].distance * params.multiPlaneteDistance;
        	}
		}
	}

	// This function rotate an element around it self axis
	function rotateAroundObjectAxis( object, axis, radians ) {
	    rotObjectMatrix = new THREE.Matrix4();
	    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
	    object.matrix.multiply(rotObjectMatrix);
	    object.rotation.setFromRotationMatrix(object.matrix);
	}

	// This function rotate an element around world axis
	function rotateAroundWorldAxis(object, axis, radians) {
	    rotWorldMatrix = new THREE.Matrix4();
	    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	    rotWorldMatrix.multiply(object.matrix);
	    object.matrix = rotWorldMatrix;
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