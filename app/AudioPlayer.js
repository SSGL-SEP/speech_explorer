'use strict';

var Data = require('./Data');
var sounds = [];
var current = null;
var playingEnabled = true;
var audioFile = null;
var context;
var playingSounds = false;

var playSound = function(index, callback) {
    // if (current !== null) {
    //     current.stop(0);
    // }
    var source = context.createBufferSource();

    var clonedArrayBuffer = sounds[index].slice(0);

    context.decodeAudioData(clonedArrayBuffer, function(audioBuffer) {
        if (current !== null) {
            current.stop(0);
        }
        source.buffer = audioBuffer;
        source.connect(context.destination);
        current = source;
        // current.onended = clearCurrent;
        source.start(0);
        if (typeof callback === 'function') {
            return callback(source);
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
        playingSounds = false;
        return;
    }
    if (playingEnabled) {
        var sound;
        if (sounds.length > 0) {
            playSound(soundIndexes[index], function(source) {
                source.addEventListener('ended', function() {
                    iterateSounds(soundIndexes, index + 1);
                });
            });
        } else {
            sound = playSoundFromPath(Data.getUrl(index));
            sound.addEventListener('ended', function() {
                iterateSounds(soundIndexes, index + 1);
            });
        }

    } else {
        // end recursion and reset flag
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
        if(!playingSounds) {
            playingSounds = true;
            iterateSounds(soundIndexes, 0);
        }
    },

    stop: function() {
        if(playingEnabled && playingSounds) {
            playingEnabled = false;
        }
        playingSounds = false;
        if (current !== null) {
            current.stop(0);
        }
    }
};