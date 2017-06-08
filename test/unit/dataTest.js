var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Data;

describe('Data', function() {

    before(function() {
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
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

    describe('#getUrl(1)', function() {
        it('should be mv_0693_001_k_0_0.wav', function() {
            assert(Data.getUrl(1) === "mv_0693_001_k_0_0.wav");
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
            assert(Data.getTags().typeof === 'object');
        });
        it('should return  ', function() {
            assert(Data.getColor(0).getHexString() === "00ff3f");
        });
    });

    describe('Data#parsedTags[1])', function() {
        it('should be key === phonem, values === [\'a\',\'e\',\'h\',\'i\',\'l\',\'n\']', function() {
            var testTag = Data.getTags()[1],
                testValues = ['a', 'e', 'h', 'i', 'l', 'n'];
            assert(testTag.key === 'phonem');
            for (var i = 0; i < testValues.length; i++) {
                assert(testTag.values[i].value === testValues[i]);
            }
        });
    });

    describe('Data#parsedTags[2])', function() {
        it('should be key === voice, values === [\'unvoiced\', \'voiced\']', function() {
            var testTag = Data.getTags()[2],
                testValues = ['unvoiced', 'voiced'];
            assert(testTag.key === 'voice');
            for (var i = 0; i < testValues.length; i++) {
                assert(testTag.values[i].value === testValues[i]);
            }
        });
    });

    describe('Data#parsedTags[3])', function() {
        it('should be key === stress, values === [\'stressed\', \'unstressed\']', function() {
            var testTag = Data.getTags()[3],
                testValues = ['stressed', 'unstressed'];
            assert(testTag.key === 'stress');
            for (var i = 0; i < testValues.length; i++) {
                assert(testTag.values[i].value === testValues[i]);
            }
        });
    });

    describe('Data#parsedTags[3].values[0])', function() {
        it('should be value === stressed, values === [1,6,7]', function() {
            var testTag = Data.getTags()[3].values[0],
                testValues = [1, 6, 7];
            assert(testTag.value === 'stressed');
            for (var i = 0; i < testValues.length; i++) {
                assert(testTag.points[i] === testValues[i]);
            }
        });
    });

    describe('Data#parsedTags[3].values[1])', function() {
        it('should be value === unstressed, values === [0,2,3,4,5,8,9]', function() {
            var testTag = Data.getTags()[3].values[1],
                testValues = [0, 2, 3, 4, 5, 8, 9];
            assert(testTag.value === 'unstressed');
            for (var i = 0; i < testValues.length; i++) {
                assert(testTag.points[i] === testValues[i]);
            }
        });
    });

    describe('Point object at index 0', function() {
        it('should have valid url', function() {
            assert(Data.getPoint(0).url === 'audio/mv_0693_021_i_1_0.wav');
        });
        it('should have valid position information', function() {
            assert(Data.getPoint(0).x === 167.9238936178313);
            assert(Data.getPoint(0).y === 254.04705572486748);
            assert(Data.getPoint(0).z === 0);
        });
    });


    describe('Meta information of point object', function() {
        it('should have \'phonem\' property with a value ', function() {
            var point = Data.getPoint(0);
            assert(point.meta[1].key === 'phonem');
            assert(point.meta[1].values[0] === 'i');
        });
        it('should have \'voice\' property with a value ', function() {
            var point = Data.getPoint(0);
            assert(point.meta[2].key === 'voice');
            assert(point.meta[2].values[0] === 'voiced');
        });
        it('should have \'stress\' property with a value ', function() {
            var point = Data.getPoint(0);
            assert(point.meta[3].key === 'stress');
            assert(point.meta[3].values[0] === 'unstressed');
        });
    });

    describe('Data#getTagColor(\'i\')', function() {
        it('should return color object with value 6bff00', function() {
            var color = Data.getTagColor('i');
            assert(color.getHexString() === '6bff00');
        });
    });

});
