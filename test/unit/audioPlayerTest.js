var appDir = require('app-root-path');
var audioPlayer = require(appDir + "/app/AudioPlayer");
var assert = require('assert');
var AudioPlayer;
var testAudio = [];

describe('AudioPlayer', function() {

    before(function() {
        AudioPlayer = require(appDir + "/app/AudioPlayer");
        var context = new AudioContext();
        for (var i = 0; i < 10; i++) {
            var audioSource = context.createBufferSource();
            audioSource.buffer = new AudioBuffer(10000);
            testAudio.push(audioSource);
        }
    });

    describe('#playSound', function() {
        it('should ', function() {
            assert(true);
        });
    });

});