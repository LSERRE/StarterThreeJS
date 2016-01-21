var THREE = require('THREE');

module.exports = function(input, output, queue, tally) {

    // Preload geometries, if any, populate output.geometries with final geometries
    if (input.geometries) {
        output.geometries = {};

        var jsonLoader = new THREE.JSONLoader();
        var objectLoader = new THREE.ObjectLoader();
        var bufferGeoloader = new THREE.BufferGeometryLoader();
        var loadGeometry = function(name, src) {
            queue();
            
            // If src has 'bfr' use buffer loader, else, json. e.g 'assets/models/bfrGeoTrack.js'
            if (src.indexOf('bfr') !== -1) {
                bufferGeoloader.load(
                    src,
                    function(geometry) {
                        output.geometries[name] = geometry;
                        tally();
                    },
                    function() {},
                    function(xhr) {
                        console.error('error loading geometry', name, xhr);
                        tally();
                    }
                );
            } else if (src.indexOf('obj') !== -1) {
                objectLoader.load(
                    src,
                    function(geometry) {
                        output.geometries[name] = geometry;
                        tally();
                    },
                    function() {},
                    function(xhr) {
                        console.error('error loading scene', name, xhr);
                        tally();
                    }
                );
            } else {

                // JSON loader has no error catch :(
                jsonLoader.load(
                    src,
                    function(geometry) {
                        output.geometries[name] = geometry;
                        tally();
                    }
                );
            }
        };
        for (var _name in input.geometries) {
            loadGeometry(_name, input.geometries[_name]);
        }
    }
};