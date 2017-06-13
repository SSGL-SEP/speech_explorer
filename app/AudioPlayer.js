'use strict';

var sounds = [];

var AudioPlayer = module.exports = {

    loadSounds: function(array) {
        sounds = array;
    },

    playSound: function(index) {
        var context = sounds[index].context;
        var source = context.createBufferSource();
        source.buffer = sounds[index].buffer;
        source.connect(context.destination);
        source.start(0);
    }
};