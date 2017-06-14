var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Preloader;
var testAudio;

describe('Preloader', function() {

    before(function() {
        Preloader = require(appDir + "/app/Preloader");
        audio = require(appDir + "/test/public/audio/testblob");
    });

    after(function() {

    });

    beforeEach(function() {

    });

    afterEach(function() {

    });


    describe('#loadSounds', function() {
        it('should return an array with length x', function() {
            assert(Data.getTotalPoints() === 13);
        });
    });
});
