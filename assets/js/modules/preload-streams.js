module.exports = function(input, output, queue, tally) {

    // Preload stream audio files, if any, populate output.streams with loaded shaders
    if (input.streams) {
        output.streams = {};
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

        var loadStream = function(name, src) {
            queue();

            var element = new Audio();
            element.addEventListener('canplay', function() {
                output.streams[name] = element;
                tally();
            });
            element.addEventListener('error', function() {
                console.error('error loading stream', name, this);
            });
            
            element.src = src;
        };

        for (_name in input.streams) {
            loadStream(_name, input.streams[_name]);
        }
    }
};