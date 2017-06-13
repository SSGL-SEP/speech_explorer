'use strict';

var sounds = [];
var playSound = function(index) {
    var context = sounds[index].context;
    var source = context.createBufferSource();
    source.buffer = sounds[index].buffer;
    source.connect(context.destination);
    source.start(0);
};

var AudioPlayer = module.exports = {

    loadSounds: function(array) {
        sounds = array;
    },

    playSound: playSound,

    /**
     * @param {number[]} soundIndexes
     */
    playSounds: function(soundIndexes) {
        // var bufferLength = 0;
        // for(var i = 0; i < soundIndexes.length; i++) {
        //     bufferLength += sounds[soundIndexes[i]].buffer.length;
        // }
        // var context = sounds[0].context;
        // var buffer = context.createBuffer(1, bufferLength, sounds[0].buffer.sampleRate);
        // var channel = buffer.getChannelData(0);
        //
        // channel.set(sounds[soundIndexes[0]].buffer, 0);
        // var offset = sounds[soundIndexes[0]].buffer.length;
        // for(var i = 1; i < soundIndexes.length; i++) {
        //     channel.set(sounds[soundIndexes[i]].buffer, offset);
        //     offset += sounds[soundIndexes[i]].buffer.length;
        // }
        // var source = context.createBufferSource();
        // source.buffer = buffer;
        // source.connect(context.destination);
        // source.start(0);

        var context = sounds[0].context;
        var offset = 0;
        for(var i = 0; i < soundIndexes.length; i++) {
            var source = context.createBufferSource();
            source.buffer = sounds[soundIndexes[i]].buffer;
            source.connect(context.destination);
            source.start(offset);
            offset += source.buffer.duration + 1;
        }
    }
};