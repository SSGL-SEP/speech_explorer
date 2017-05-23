var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Data;

describe('Data', function() {
	describe('data parsing', function() {

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


		describe('Data#total', function(){
			it('should be 10', function(){
			  	assert(Data.getTotalPoints() === 10);
			});
		})

		describe('Data#parsedUrls(0)', function(){
			it('should be audio/mv_0763_019_a_1_1.wav', function(){
			  	assert(Data.getUrl(0) === "audio/mv_0763_019_a_1_1.wav");
			});
		})

		describe('Data#getPosition(0)', function(){
			it('should be x === 95.6850419438296, y === 244.51765847203887, z === 469.97548434392615', function(){
				var test = Data.getPosition(0);
			  	assert(test.isVector3);
				assert(test.x === 95.6850419438296);
				assert(test.y === 244.51765847203887);
				assert(test.z === 469.97548434392615);
			});
		})
	});
});
