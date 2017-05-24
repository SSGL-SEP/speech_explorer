var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Data;

describe('hooks', function () {

	before(function () {
		Data = require(appDir + "/app/Data");
		var json = require(appDir + "/test/testdata.json");
		Data.loadData(json);
	});

	after(function () {

	});

	beforeEach(function () {

	});

	afterEach(function () {

	});


	describe('Data#total', function () {
		it('should be 10', function () {
			assert(Data.getTotalPoints() === 10);
		});
	});

	describe('Data#parsedUrls(0)', function () {
		it('should be mv_0693_021_i_1_0.wav', function () {
			assert(Data.getUrl(0) === "audio/mv_0693_021_i_1_0.wav");
		});
	});

	describe('Data#getPosition(0)', function () {
			it('should be x === 87.3121953178908, y === 591.7073990926303, z === 540.4269706500198', function () {
				var test = Data.getPosition(0);
				assert(test.isVector3);
				assert(test.x === 87.3121953178908);
				assert(test.y === 591.7073990926303);
				assert(test.z === 540.4269706500198);
			});
	});

	describe('Data#parsedTags[1])', function () {
		it('should be key === phonem, values === [\'i\',\'h\',\'e\',\'n\',\'l\',\'a\']', function () {
			var testTag = Data.getTags()[1],
				testValues = ['i', 'h', 'e', 'n', 'l', 'a'];
			assert(testTag.key === 'phonem');
			for (var i = 0; i < testValues.length; i++) {
				assert(testTag.values[i].value === testValues[i]);
			}
		});
	});

	describe('Data#parsedTags[2])', function () {
		it('should be key === voice, values === [\'voiced\', \'unvoiced\']', function () {
			var testTag = Data.getTags()[2],
				testValues = ['voiced', 'unvoiced'];
			assert(testTag.key === 'voice');
			for (var i = 0; i < testValues.length; i++) {
				assert(testTag.values[i].value === testValues[i]);
			}
		});
	});

	describe('Data#parsedTags[3])', function () {
		it('should be key === stress, values === [\'unstressed\', \'stressed\']', function () {
			var testTag = Data.getTags()[3],
				testValues = ['unstressed', 'stressed'];
			assert(testTag.key === 'stress');
			for (var i = 0; i < testValues.length; i++) {
				assert(testTag.values[i].value === testValues[i]);
			}
		});
	});

	describe('Data#parsedTags[3].values[0])', function () {
		it('should be value === unstressed, values === [0,2,3,4,5,8,9]', function () {
			var testTag = Data.getTags()[3].values[0],
				testValues = [0,2,3,4,5,8,9];
			assert(testTag.value === 'unstressed');
			for (var i = 0; i < testValues.length; i++) {
				assert(testTag.points[i] === testValues[i]);
			}
		});
	});

	describe('Data#parsedTags[3].values[1])', function () {
		it('should be value === unstressed, values === [1,6,7]', function () {
			var testTag = Data.getTags()[3].values[1],
				testValues = [1,6,7];
			assert(testTag.value === 'stressed');
			for (var i = 0; i < testValues.length; i++) {
				assert(testTag.points[i] === testValues[i]);
			}
		});
	});

	describe('getTag() returns correct object with valid key', function() {
		it('getTag(\'stress\') returns object with key === \'stress\', values[0].value === \'stressed\', values[1].value === \'unstressed\' ', function(){
			var testTag = Data.getTag('stress');

			assert(testTag.key === 'stress');
			assert(testTag.values[0].value === 'unstressed');
			assert(testTag.values[1].value === 'stressed');
		});
	})

	describe('getTag() works with invalid argument', function() {
		it('getTag() returns undefined when called with invalid arguments', function(){
			var invalidTag = Data.getTag('not a key');
			assert(invalidTag === undefined);
		});
	})

	describe('Color data is created', function() {
		it('color array data is not undefined', function(){
			for (var i = 0; i < Data.getTotalPoints(); i++) {
				assert(Data.getColor(i).isColor);
			}
		});
	})

});
