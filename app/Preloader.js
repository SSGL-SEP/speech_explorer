'use strict';

var sounds = [];
var soundIndex = 0;
var context = new AudioContext();
var loaded = 0;
var Data = require('./Data');

var Preloader = module.exports = function() {

    function extractBuffer(src, offset, length) {
        var dstU8 = new Uint8Array(length);
        var srcU8 = new Uint8Array(src, offset, length);
        dstU8.set(srcU8);
        return dstU8;
    }

    function processConcatenatedFile(data) {
        var bb = new DataView(data);
        var offset = 0;

        while (offset < bb.byteLength) {
            var length = bb.getUint32(offset, true);
            offset += 4;
            var sound = extractBuffer(data, offset, length);
            offset += length;
            createSoundWithBuffer(sound.buffer, soundIndex);
            soundIndex++;
        }
        console.log('audio loaded!');
    }
    function createSoundWithBuffer(buffer, soundIndex) {
        /*
          This audio context is unprefixed!
        */
        var audioSource = context.createBufferSource();
        audioSource.connect(context.destination); // why? unneeded?

        context.decodeAudioData(buffer, function(res) {
            loaded++;
            if(loaded === Data.getTotalPoints())
                console.log('hep');
            audioSource.buffer = res;
            audioSource.playbackRate.value = 1; // unneeded?
            sounds[soundIndex] = audioSource;
            //audioSource.noteOn(0); // deprecated use .start(0)
        });
    }

    this.loadSounds = function(filename) {
        var request = new XMLHttpRequest();

        request.open('GET', filename, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            processConcatenatedFile(request.response);
        };
        request.onprogress = function(e) {
            console.log(e.loaded * 100 / e.total);
        };

        request.send();

        return sounds;
    };
};