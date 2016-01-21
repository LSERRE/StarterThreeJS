module.exports = function(input, output, queue, tally) {

    // Preload shaders, if any, populate output.shaders with loaded shaders
    if (input.shaders) {
        output.shaders = {};

        var loadShader = function(name, src) {
            queue();
            var request = new XMLHttpRequest();
            request.open('GET', src);
            request.onload = function() {
                output.shaders[name] = this.responseText;
                tally();
            };
            request.onerror = function() {
                console.error('error loading shader', name, this);
            };
            request.send();
        };

        for (var _name in input.shaders) {
            loadShader(_name, input.shaders[_name]);
        }
    }
};


