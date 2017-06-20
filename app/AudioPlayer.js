'use strict';

var Data = require('./Data');
var sounds = [];
var current = null;
var playingEnabled = true;
var audioFile = null;
var context;

var playSound = function(index, callback) {
    if (current) {
        current.stop(0);
        current = null;
    }
    var source = context.createBufferSource();

    var clonedArrayBuffer = sounds[index].slice(0);

    context.decodeAudioData(clonedArrayBuffer, function(audioBuffer) {
        source.buffer = audioBuffer;
        source.connect(context.destination);
        current = source;
        current.onended = clearCurrent;
        source.start(0);
        if (typeof callback === 'function') {
            callback(source);
        }
    });
};

var playSoundFromPath = function(path) {
    if (audioFile !== null) {
        audioFile.pause();
        audioFile.startTime = 0;
    }
    audioFile = new Audio(path);
    audioFile.play().catch(function() {
        //whatever
    });
    return audioFile;
};

var clearCurrent = function() {
    current = null;
};

var iterateSounds = function(soundIndexes, index) {
    if (index >= soundIndexes.length) {
        return;
    }
    if (playingEnabled) {
        var source;
        if (sounds.length > 0) {
            playSound(soundIndexes[index], function(source) {
                source.addEventListener('ended', function() {
                    iterateSounds(soundIndexes, index + 1);
                });
            });
        } else {
            source = playSoundFromPath(Data.getUrl(index));
            source.addEventListener('ended', function() {
                iterateSounds(soundIndexes, index + 1);
            });
        }

    } else {
        playingEnabled = true;
    }
};

module.exports = {

    loadSounds: function(array) {
        sounds = array;
    },

    setContext: function(audioContext) {
        context = audioContext;
    },

    playSound: function(index) {
        if (sounds.length > 0) {
            playSound(index);
        } else {
            playSoundFromPath(Data.getUrl(index));
        }
    },

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