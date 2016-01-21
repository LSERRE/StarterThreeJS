var preload = require("./modules/preload");
var pubsub = require("./modules/pubsub");
var Scene = require("./Scene");
var Helpers = require("./Helpers")

_assets = null;
_appWidth = 0;
_appHeight = 0;
_frustum = { width:0, height:0 };
_scene = null;
_helpers = null;

window.addEventListener("load", loadAssets, false);

function loadAssets()
{
	preload(
	{
		id:"assets",
		update:false,
		images:
		{},
		geometries:
		{},
		shaders:
		{},
		buffers:{},
		streams:{},
	});

	// pubsub.once("preload-assets", function( assets )
	// {
	// 	_assets = assets;
	// 	init();
	// });

	init();

	window.addEventListener("resize", function()
	{
		_appWidth = window.innerWidth;
		_appHeight = window.innerHeight;
		pubsub.emit("windowResize");
	});
}

function init( argument )
{
	_appWidth = window.innerWidth;
	_appHeight = window.innerHeight;

	_scene = new Scene();
	_scene.init();

	_helpers = new Helpers();
	_helpers.init();
}

function animate() {
	requestAnimationFrame(this.animate);
	_scene.update();
	_helpers.update();
}