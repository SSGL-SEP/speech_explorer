'use strict';

var sounds = [];
var current = null;
var playingEnabled = true;

var playSound = function(index) {
    if (current) {
        current.stop(0);
        current = null;
    }
    var context = sounds[index].context;
    var source = context.createBufferSource();
    source.buffer = sounds[index].buffer;
    source.connect(context.destination);
    current = source;
    current.onended = clearCurrent;
    source.start(0);
    return source;
};

var clearCurrent = function() {
    current = null;
};

var iterateSounds = function(soundIndexes, index) {
    if (index >= soundIndexes.length) {
        return;
    }
    if (playingEnabled) {
        var source = playSound(soundIndexes[index]);
        source.addEventListener('ended', function() {
            iterateSounds(soundIndexes, index + 1);
        });

    } else {
        playingEnabled = true;
    }
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
        iterateSounds(soundIndexes, 0);
    },

    stop: function() {
        playingEnabled = false;
    }
};