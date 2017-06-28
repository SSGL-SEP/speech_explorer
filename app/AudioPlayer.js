'use strict';

var Promise = require('es6-promise').Promise;
var Data = require('./Data');
var log = require('./Log');
var sounds = [];
var current = null;
var playingEnabled = true;
var audioFile = null;
var context;
var playingAllSounds = false;


var playSoundFromBuffer = function(arrayBuffer, callback) {
    var sound = context.createBufferSource();
    return context.decodeAudioData(arrayBuffer, function(audioBuffer) {
        if (current !== null) {
            current.stop();
        }
        sound.buffer = audioBuffer;
        sound.connect(context.destination);
        current = sound;
        sound.start();
        callback(sound);
        return;
    });
};

var playSoundFromPath = function(path, callback) {
    if (audioFile !== null) {
        audioFile.pause();
        audioFile.startTime = 0;
    }
    audioFile = new Audio(path);
    audioFile.play().catch(log);

    callback(audioFile);
    return;
};

/**
 * Plays a single audio sample.
 *
 * @param index - index of the point
 */
var playSound = function(index, callback) {
    if (sounds.length > 0) {
        // using concatenated sound file
        // use a clone of the stored array buffer to avoid a detached buffer exception
        var clonedArrayBuffer = sounds[index].slice(0);
        playSoundFromBuffer(clonedArrayBuffer, callback);
    } else {
        // using original wav files
        playSoundFromPath(Data.getUrl(index), callback);
    }
};

var iterateSounds = function(soundIndexes, index) {
    if (index >= soundIndexes.length) {
        playingAllSounds = false;
        return;
    }
    if (playingEnabled) {
        playSound(soundIndexes[index], function(sound) {
            sound.onended = function() {
                iterateSounds(soundIndexes, index + 1);
            };
        });

    } else {
        // end recursion and reset flag
        playingEnabled = true;
    }
};

var doNothing = function() {
};

module.exports = {

    loadSounds: function(array) {
        sounds = array;
    },

    setContext: function(audioContext) {
        context = audioContext;
    },

    playSound: function(index) {
        if (!playingAllSounds) {
            playSound(index, doNothing);
        }
    },

    /**
     * @param {number[]} soundIndexes
     */
    playSounds: function(soundIndexes) {
        if (!playingAllSounds) {
            playingAllSounds = true;
            iterateSounds(soundIndexes, 0);
        }
    },

    stop: function() {
        if (playingEnabled && playingAllSounds) {
            playingEnabled = false;
        }
        playingAllSounds = false;
        if (current !== null) {
            current.stop(0);
        }
    }
};