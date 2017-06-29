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


/**
 * Plays a sound using the array of arrayBuffers that contain the undecoded audio file data.
 * This function is used when playing from the concatenated_audio.blob.
 *
 * @param arrayBuffer
 * @param callback
 * @returns nothing
 */
var playSoundFromBuffer = function(arrayBuffer, callback) {
    var sound = context.createBufferSource();
    return context.decodeAudioData(arrayBuffer, function(audioBuffer) {
        if (current !== null && current.isPlaying) {
            // set audio to stop 100 ms in the future
            current.stop(context.currentTime + 0.1);
        }
        sound.buffer = audioBuffer;
        sound.connect(context.destination);
        current = sound;
        sound.start();
        // set flags to determine if a sound is playing
        current.isPlaying = true;
        current.onended = function() {
            this.isPlaying = false;
        };
        callback(sound);
        return;
    });
};

/**
 * Plays a sound by loading a file from the given path. Used when no concatenated_audio.blob is found.
 *
 * @param path
 * @param callback
 */
var playSoundFromPath = function(path, callback) {
    if (audioFile !== null) {
        audioFile.pause();
        audioFile.startTime = 0;
    }
    audioFile = new Audio(path);
    audioFile.play().catch(log);
    audioFile.isPlaying = true;
    audioFile.onended = function() {
        this.isPlaying = false;
    };

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

/**
 * Plays a sequence of sounds.
 *
 * @param soundIndexes
 * @param index
 */
var iterateSounds = function(soundIndexes, index) {
    if (index >= soundIndexes.length) {
        playingAllSounds = false;
        return;
    }
    if (playingEnabled) {
        playSound(soundIndexes[index], function(sound) {
            // play the next one, when this one stops
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

    /**
     * Stop everything.
     */
    stop: function() {
        if (playingEnabled && playingAllSounds) {
            playingEnabled = false;
        }
        playingAllSounds = false;
        // Safari does not like it if a buffers stop() is called, when it is not actually playing
        if (current !== null && current.isPlaying) {
            current.stop();
            current.isPlaying = false;
        }
        if (audioFile !== null && audioFile.isPlaying) {
            audioFile.pause();
            audioFile.isPlaying = false;
        }
    }
};