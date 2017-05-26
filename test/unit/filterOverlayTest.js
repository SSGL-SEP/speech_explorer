var appDir = require('app-root-path');
var assert = require('assert');
var FilterOverlay = require(appDir + "/app/FilterOverlay");
var Data = require(appDir + "/app/Data");
var json = require(appDir + "/test/testdata.json");

describe('Overlay', function () {

	before(function () {
		// runs before all tests in this block
		this.jsdom = require('jsdom-global')(`<!DOCTYPE html><div id="overlay"></div>`);
		Data.loadData(json);
		var visualizer = require(appDir + "/app/Visualizer");
		FilterOverlay = new FilterOverlay(Data.getTags(), visualizer.setFilter);

	});

	after(function () {
		// runs after all tests in this block
		this.jsdom();
	});

	beforeEach(function () {
		// runs before each test in this block
	});

	afterEach(function () {
		// runs after each test in this block
	});

	// test cases
	describe('FilterOverlay#boolTags', function () {
		it('all should be set to false after creation', function () {
			for (var i = 0; i < FilterOverlay.boolTags.length; i++) {
				var tag = FilterOverlay.boolTags[i];
				for (var property in tag.values) {
					if (tag.values.hasOwnProperty(property)) {
						assert(tag.values[property] == false);
					}
				}
			}
		});
	});

	describe('FilterOveraly#tags', function() {
		it('should be set after creation', function(){
			assert(FilterOverlay.tags)
		});
	});

});