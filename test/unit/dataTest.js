var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Data;

describe('Data', function() {

    before(function() {
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
        var Config = require(appDir + "/app/ConfigDAO");
        var config = new Config({dataSets:[{dataSet:"phoneme", audioSrc: "phonemes"}]});
        Data.setConfig(config);
        Data.loadData(json);
    });

    after(function() {

    });

    beforeEach(function() {

    });

    afterEach(function() {

    });


    describe('#getTotalPoints()', function() {
        it('should return 13', function() {
            assert(Data.getTotalPoints() === 13);
        });
    });

    describe('#getUrl()', function() {
        it('should be audio/phonemes/mv_0693_001_k_0_0.wav with parameter 1', function() {
            console.log(Data.getUrl(1));
            assert(Data.getUrl(1) === "audio/phonemes/mv_0693_001_k_0_0.wav");
        });
    });

    describe('#getPoint(0)', function() {
        it('should return vector3', function() {
            var test = Data.getPoint(0);
            assert(test.isVector3);
        });
        it('should return vector3', function() {
            var test = Data.getPoint(0);
            assert(test.isVector3);
        });
        it('should have property x === 167.9238936178313', function() {
            var test = Data.getPoint(0);
            assert(test.x === 167.9238936178313);
        });
        it('should have property y === 254.04705572486748', function() {
            var test = Data.getPoint(0);
            assert(test.y === 254.04705572486748);
        });
        it('should have property z === 0', function() {
            var test = Data.getPoint(0);
            assert(test.z === 0);
        });
        it('should have property filename === mv_0693_003_h_0_0.wav', function() {
            var test = Data.getPoint(0);
            assert(test.filename === "mv_0693_003_h_0_0.wav");
        });
        it('should have valid and correct metadata', function() {
            var test = Data.getPoint(0);
            assert(test.meta.phoneme === "h");
            assert(test.meta.stress === "unstressed");
            assert(test.meta.voice === "unvoiced");
        });

    });

    describe('#getColor(0))', function() {
        it('should return THREE.Color object', function() {
            assert(Data.getColor(0).isColor);
        });
        it('should return object that has HEX === \"00ff3f\"  ', function() {
            assert(Data.getColor(0).getHexString() === "00ff3f");
        });
    });

    describe('Color data is created', function() {
        it('color data is not undefined', function() {
            for (var i = 0; i < Data.getTotalPoints(); i++) {
                assert(Data.getColor(i).isColor);
            }
        });
    });

    describe('#getTags())', function() {
        it('should return an object', function() {
            assert(typeof Data.getTags() === 'object');
        });
        it('should return with valid property \'phoneme\'', function() {
            var testTag = Data.getTags().phoneme;
            assert(typeof testTag === 'object');
        });
        it('should return with valid property \'stress\'', function() {
            var testTag = Data.getTags().stress;
            assert(typeof testTag === 'object');
        });
        it('should return with valid property \'voice\'', function() {
            var testTag = Data.getTags().voice;
            assert(typeof testTag === 'object');
        });
    });

    describe('#getTag(\'stress\'))', function() {
        it('should return object', function() {
            assert(typeof Data.getTag('stress') === 'object');
        });
        it('should have property \'stressed\' with correct fields ', function() {
            var testValue = Data.getTag('stress').stressed;
            var testPoints = [6, 8, 10, 11, 12];
            for (var i = 0; i < testValue.length; i++) {
                assert(testValue.points[i] === testPoints[i]);
            }
            assert(testValue.color === "#00ff00");
        });
        it('should have property \'unstressed\' with correct fields ', function() {
            var testValue = Data.getTag('stress').unstressed;
            var testPoints = [0, 1, 2, 3, 4, 5, 7, 9];
            for (var i = 0; i < testValue.length; i++) {
                assert(testValue.points[i] === testPoints[i]);
            }
            assert(testValue.color === "#0000ff");
        });
        it('should have property \'__filterable\' that is true ', function() {
            var testValue = Data.getTag('stress').__filterable;
            assert(testValue);
        });
    });

    describe('#getTag(\'notATag\'))', function() {
        it('should return undefined', function() {
            assert(typeof Data.getTag('notATag') === 'undefined');
        });
    });

    describe('#getTagColor()', function() {
        it('should return hex with value #00ff3f when called with parameter \'h\' ', function() {
            var color = Data.getTagColor('h');
            assert(color === '#00ff3f');
        });
        it('should return undefined when called with parameter \'xxx\' ', function() {
            var color = Data.getTagColor('xxx');
            assert(typeof color === 'undefined');
        });
    });

    describe('#parsedHeader()', function() {
        it('should return object with attribute \'soundInfo\' with correct value ', function() {
            var headerObject = Data.getParsedHeader().soundInfo;
            assert(headerObject === null);
        });
        it('should return object with attribute \'dataSet\' with correct value ', function() {
            var headerObject = Data.getParsedHeader().dataSet;
            assert(headerObject === "phoneme");
        });
        it('should return object with attribute \'processingMethod\' with correct value ', function() {
            var headerObject = Data.getParsedHeader().processingMethod;
            assert(headerObject === "mfcc - t-SNE");
        });
        it('should return object with attribute \'colorBy\' with correct value ', function() {
            var headerObject = Data.getParsedHeader().colorBy;
            assert(headerObject === "phoneme");
        });
        it('should return object with attribute \'totalPoints\' with correct value ', function() {
            var headerObject = Data.getParsedHeader().totalPoints;
            assert(headerObject === 13);
        });
    });

});
