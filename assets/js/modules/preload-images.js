module.exports = function(input, output, queue, tally) {

    // Preload images, if any, populate output.images with final images
    if (input.images) {
        output.images = {};

        var loadImage = function(name, src) {
            queue();
            var img = new Image();
            img.src = src;
            img.onload = function() {
                output.images[name] = img;
                tally();
            };
            img.onerror = function(e) {
                console.error('error loading image', name, e);
                tally();
            };
        };
        for (var _name in input.images) {
            loadImage(_name, input.images[_name]);
        }
    }
};