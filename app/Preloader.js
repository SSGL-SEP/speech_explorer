'use strict';

var Preloader = module.exports = function() {

    function loadSounds() {
        var sounds = [];
        var soundIndex = 0;
        var request = new XMLHttpRequest();

        request.open('GET', 'concatenated_file.mp3', true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            processConcatenatedFile(request.response);
        }

        request.send();

        return sounds;
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
    }

    function extractBuffer(src, offset, length) {
        var dstU8 = new Uint8Array(length);
        var srcU8 = new Uint8Array(src, offset, length);
        dstU8.set(srcU8);
        return dstU8;
    }

    function createSoundWithBuffer(buffer, soundIndex) {
        /*
          This audio context is unprefixed!
        */
        var context = new AudioContext();
        var audioSource = context.createBufferSource();
        audioSource.connect(context.destination);

        context.decodeAudioData(buffer, function(res) {
            audioSource.buffer = res;
            audioSource.playbackRate.value = 1; // unneeded?
            sounds[soundIndex] = audioSource;
            audioSource.noteOn(0); // deprecated use .start(0)
        });
    }
};