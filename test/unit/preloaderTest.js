var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Preloader;
var testAudio;

describe('Preloader', function() {

    before(function() {
        Preloader = require(appDir + "/app/Preloader");
        testAudio = require(appDir + "/test/testblob");
    });

    after(function() {

    });

    beforeEach(function() {

    });

    afterEach(function() {

    });


    describe('#loadSounds', function() {
        it('should return an array with length 13', function() {
            var soundArray = Preloader.loadSounds(testAudio);
            assert(soundArray.length() === 13);
        });
    });
});
