'use strict';

var sounds = [];
var soundIndex = 0;
var context = new AudioContext();
var loaded = 0;
var toLoad = 0;

var Preloader = module.exports = function() {

    function extractBuffer(src, offset, length) {
        var dstU8 = new Uint8Array(length);
        var srcU8 = new Uint8Array(src, offset, length);
        dstU8.set(srcU8);
        return dstU8;
    }

    function processConcatenatedFile(data, callback) {
        var bb = new DataView(data);
        var offset = 0;

        while (offset < bb.byteLength) {
            var length = bb.getUint32(offset, true);
            offset += 4;
            var sound = extractBuffer(data, offset, length);
            offset += length;
            createSoundWithBuffer(sound.buffer, soundIndex, callback);
            soundIndex++;
        }
        console.log('audio loaded!');
    }
    function createSoundWithBuffer(buffer, soundIndex, callback) {
        /*
          This audio context is unprefixed!
        */
        var audioSource = context.createBufferSource();

        context.decodeAudioData(buffer, function(res) {
            loaded++;
            if (loaded === toLoad) {
                return callback();
            }
            if (loaded % 1000 === 0) {
                console.log(loaded + ' audio samples loaded');
            }
            audioSource.buffer = res;
            sounds[soundIndex] = audioSource;
        });
    }

    this.loadSounds = function(filename, totalPoints, callback) {
        sounds = [];
        soundIndex = 0;
        loaded = 0;
        var request = new XMLHttpRequest();
        toLoad = totalPoints;

        request.open('GET', filename, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            if (request.status === 404) {
                console.log('no blob found');
                return callback(null);
            }
            processConcatenatedFile(request.response, function() {
                callback(sounds);
            });
        };
        request.onprogress = function(e) {
            console.log(e.loaded * 100 / e.total);
        };

        request.onloadend = function() {
            
        };

        request.send();
    };
};