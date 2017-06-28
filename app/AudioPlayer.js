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


var playSoundFromBuffer = function(arrayBuffer) {
    var sound = context.createBufferSource();
    return context.decodeAudioData(arrayBuffer).then(function(audioBuffer) {
        if (current !== null) {
            current.stop(0);
        }
        sound.buffer = audioBuffer;
        sound.connect(context.destination);
        current = sound;
        sound.start(0);
        return sound;
    });
};

var playSoundFromPath = function(path) {
    if (audioFile !== null) {
        audioFile.pause();
        audioFile.startTime = 0;
    }
    audioFile = new Audio(path);
    audioFile.play().catch(log);
    // return a promise to be interchangeable with playSoundFromBuffer()
    return new Promise(function(resolve) {
        resolve(audioFile);
    });
};

/**
 * Plays a single audio sample.
 *
 * @param index - index of the point
 */
var playSound = function(index) {
    var promisedSound;
    if (sounds.length > 0) {
        // using concatenated sound file
        // use a clone of the stored array buffer to avoid a detached buffer exception
        var clonedArrayBuffer = sounds[index].slice(0);
        promisedSound = playSoundFromBuffer(clonedArrayBuffer);
    } else {
        // using original wav files
        promisedSound = playSoundFromPath(Data.getUrl(index));
    }
    return promisedSound.catch(function(err) {
        log('playSound: ' + err);
    });
};

var iterateSounds = function(soundIndexes, index) {
    if (index >= soundIndexes.length) {
        playingAllSounds = false;
        return;
    }
    if (playingEnabled) {
        playSound(soundIndexes[index]).then(function(sound) {
            sound.onended = function() {
                iterateSounds(soundIndexes, index + 1);
            };
        });

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
        if (!playingAllSounds) {
            playSound(index).catch(log);
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