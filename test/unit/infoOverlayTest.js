// 'use strict';

// var appDir = require('app-root-path');
// var assert = require('assert');
// var Data = require(appDir + "/app/Data");
// var json = require(appDir + "/test/testdata.json");
// var InfoOverlay;

// describe('FilterOverlay', function () {

// 	before(function () {
// 		// runs before all tests in this block
// 		this.infoDomElement = require('jsdom-global')(`<!DOCTYPE html><div id="info"></div>`);
// 		this.activeDomElement = require('jsdom-global')(`<!DOCTYPE html><div id="active"></div>`);
		
// 		Data.loadData(json);
// 		InfoOverlay = require(appDir + "/app/InfoOverlay");
// 		InfoOverlay.init(this.activeDomElement, this.infoDomElement, Data.getTags());

// 	});

// 	after(function () {
// 		// runs after all tests in this block
// 		this.jsdom();
// 	});

// 	beforeEach(function () {
// 		// runs before each test in this block
// 	});

// 	afterEach(function () {
// 		// runs after each test in this block
// 	});

// 	// var checkAllFalse = function () {
// 	// 	for (var i = 0; i < FilterOverlay.boolTags.length; i++) {
// 	// 		var tag = FilterOverlay.boolTags[i];
// 	// 		for (var property in tag.values) {
// 	// 			if (tag.values.hasOwnProperty(property)) {
// 	// 				assert(tag.values[property] === false);
// 	// 			}
// 	// 		}
// 	// 	}
// 	// };



// 	// test cases
// 	describe('InfoOverlay#updateActive', function () {
// 		it('number of active units should be adjustable', function () {
// 			InfoOverlay.updateActive(2,1);
// 			assert(this.activeDomElement.innerHTML === "1/2");
// 		});
// 	});

// 	// describe('FilterOverlay#tags', function () {
// 	// 	it('should be set after creation', function () {
// 	// 		assert(FilterOverlay.tags);
// 	// 	});
// 	// });

// 	// describe('FilterOverlay#gui', function () {
// 	// 	it('should be created after init', function () {
// 	// 		assert(FilterOverlay.gui);
// 	// 	});
// 	// });

// 	// describe('FilterOverlay#filterButton#Filter()',function(){
// 	// 	it('should not be null', function(){
// 	// 		assert(FilterOverlay.filterButton.Filter);
// 	// 		FilterOverlay.filterButton.Filter();
// 	// 	});
// 	// });

// 	// describe('FilterOverlay#createFilterData()', function () {
// 	// 	it('should return null if no filter is selected', function () {
// 	// 		assert(FilterOverlay.createFilterData() === null);
// 	// 	});

// 	// 	it('should return an array of tags if filters are on',function(){
// 	// 		FilterOverlay.boolTags[0].values[0] = true;
// 	// 		assert(FilterOverlay.createFilterData().length === 1);
// 	// 	});
// 	// });

// 	// describe('FilterOverlay#clearAllButton#ClearAll()', function () {
// 	// 	it('should set all filters to false', function () {
// 	// 		FilterOverlay.boolTags[0].values[0] = true;
// 	// 		FilterOverlay.clearAllButton.ClearAll();
// 	// 		checkAllFalse();
// 	// 	});
// 	// });




// });