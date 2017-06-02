var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var pointCloud = require(appDir + '/app/PointCloud');
var pc;
var Data;

describe('The PointCloud', function() {
	before(function() {
		Data = require(appDir + "/app/Data");
		var json = require(appDir + "/test/testdata.json");
		Data.loadData(json);
		pc = new pointCloud();
		pc.update();
	});

	it('should have a point for each data point after initialization', function() {
		assert(pc.getAttributes().size.count === Data.getTotalPoints());
	});
});

describe('The PointCloud', function() {
	before(function() {
		Data = require(appDir + "/app/Data");
		var json = require(appDir + "/test/testdata.json");
		Data.loadData(json);
		pc = new pointCloud();

		var activePoints = [];
		activePoints.push(1);
		activePoints.push(2);
		pc.activateFilter(activePoints);
		pc.draw();
		pc.update();

	});

	it('should have correct number of points after filtering', function() {
		var pts = pc.getAttributes().enabled.array;
		var enableds = Data.getTotalPoints();
		for (var i = 0; i < pts.length; i++) {
			enableds -= pts[i];
		}
		assert(enableds === Data.getTotalPoints() - 2);
	});
});