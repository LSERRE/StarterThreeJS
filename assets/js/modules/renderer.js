pubsub = require("./pubsub");

module.exports = Renderer;

var bind = function( fn, me )
{
	return function() { return fn.apply(me, arguments); }
}

function Renderer( clearColor, container )
{
	this.container = container;
	this.renderer = null;
	this.scene = null;
	this.camera = null;
	this.clearColor = clearColor;
	this.clock = new THREE.Clock();
	this.et = 0;
	this.dt = 0;

	this.init = bind(this.init, this);
	this.update = bind(this.update, this);
	this.draw = bind(this.draw, this);
	this.resize = bind(this.resize, this);
}

Renderer.prototype.init = function()
{
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize(_appWidth, _appHeight);
	this.renderer.setClearColor(new THREE.Color(this.clearColor));

	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(60, _appWidth / _appHeight, 1, 10000);

	this.computeFrustum();

	if (this.container != undefined || this.container != null)
		this.container.appendChild(this.renderer.domElement);
	else
		document.body.appendChild(this.renderer.domElement);

	this.domElement = this.renderer.domElement;

	pubsub.on("windowResize", this.resize);
}

Renderer.prototype.run = function()
{
	this.clock.start();
}

Renderer.prototype.update = function()
{
	this.dt = this.clock.getDelta();
	this.et += this.dt;
	this.draw();
}

Renderer.prototype.draw = function()
{
	this.renderer.render(this.scene, this.camera);
}

Renderer.prototype.resize = function()
{	
	this.camera.aspect = _appWidth / _appHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize(_appWidth, _appHeight);
	this.computeFrustum();

	//pubsub.emit("rendererResize");
}

Renderer.prototype.computeFrustum = function()
{
	_frustum.height = 2.0 * Math.tan((this.camera.fov * Math.PI / 180) * .5);
	_frustum.width = _frustum.height * this.camera.aspect;
}

Renderer.prototype.setClearColor = function( color )
{
	this.renderer.setClearColor(new THREE.Color(color));
}
