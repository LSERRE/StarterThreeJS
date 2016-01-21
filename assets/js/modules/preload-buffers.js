module.exports = function(input, output, queue, tally) {

    // Preload buffers files, if any, populate output.buffers with loaded shaders
    if (input.buffers) {
        output.buffers = {};
        var isWebAudio = 'webkitAudioContext' in window || 'AudioContext' in window;
        var _name;

        // if no webaudio, don't charge the audio files
        if (!isWebAudio) {
            for (_name in input.buffers) {
                output.buffers[_name] = 'no webAudio';
                tally();
            }
            return;
        }

        var context = new AudioContext();
        var loadBuffer = function(name, src) {
            queue();
            var request = new XMLHttpRequest();
            request.open('GET', src, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                context.decodeAudioData(
                    request.response,
                    function(buffer) {
                        if (!buffer) {
                            console.error('error decoding buffer', name, this);
                            return;
                        }

                        output.buffers[name] = buffer;
                        tally();
                    },
                    function() {
                        console.error('error decoding buffer', name, this);
                    }
                );
            };
            request.onerror = function() {
                console.error('error loading buffer', name, this);
            };
            request.send();
        };

        for (_name in input.buffers) {
            loadBuffer(_name, input.buffers[_name]);
        }
    }
};