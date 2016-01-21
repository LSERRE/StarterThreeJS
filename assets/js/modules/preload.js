/*
 *
 * Preload.js is a require module used to asynchronously load external assets.
 * Upon completion a custom event is triggered, passing the loaded assets.
 *
 * Requires pubsub
 *
 * Can load:
 *     images: returns an htmlElement - ready to clone and drop or use directly.
 *     geometries: requires threejs! buffer geometries require an 'bfr' prefix in the filename,
 *         objects/scenes require an 'obj' prefix in the filename. Returns a
 *         three js object.
 *     shaders: returns a string.
 *     buffers: completely loaded and decoded, ready to be used for analysis/other.
 *     streams: loaded as an html media element - only canplay event guaranteed.
 *
 * Use:
 *
 * var preload = require(preload);
 *
 * preload({
 *     id: 'customName',
 *     update: true, // if true, update event fired after load of each file
 *     images: {
 *         imgName: 'src',
 *     },
 *     geometries: {
 *         geoName: 'src',
 *         bufferGeoName: 'src-including-bfr-prefix',
 *         objName: 'src-including-obj-prefix',
 *         sceneName: 'src-including-obj-prefix',
 *     },
 *     shaders: {
 *         shaderName: 'src',
 *     },
 *     buffers: {
 *         bufferName: 'src',
 *     },
 *     streams: {
 *         streamName: 'src',
 *     },
 * });
 *
 * pubsub.on('preload-customName', function(assets) {
 *     console.log(assets.images.imgName);
 * });
 *
 * pubsub.on('preload-update-customName', function(progress) {
 *     console.log(Math.round(progress * 100), 'percent loaded');
 * });
 *
 */

var pubsub = require('./pubsub');

// Require support for necessary formats
var images = require('./preload-images');
var shaders = require('./preload-shaders');
var streams = require('./preload-streams');
var buffers = require('./preload-buffers');
var geometries = require('./preload-geometries');

module.exports = function(input) {
    var output = {};
    var total = 0;
    var loaded = 0;
    var _name;

    var queue = function() {
        total++;
    };

    var tally = function() {
        loaded++;

        if (input.update) pubsub.emit(input.id ? 'preload-update-' + input.id : 'preload-update', loaded / total);

        if (loaded == total) {

            // Once loaded, fire a custom event with all of the loaded assets
            pubsub.emit(input.id ? 'preload-' + input.id : 'preload', output);
        }
    };

    images(input, output, queue, tally);
    shaders(input, output, queue, tally);
    streams(input, output, queue, tally);
    buffers(input, output, queue, tally);
    geometries(input, output, queue, tally);
};



