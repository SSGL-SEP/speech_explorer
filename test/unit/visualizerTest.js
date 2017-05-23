var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var BoilerPlate = require(appDir + "/app/Boilerplate");
var Visualizer = require(appDir + '/app/Visualizer');
var vis = new Visualizer();

describe('hooks', function() {

	before(function() {
		// runs before all tests in this block

	});

	after(function() {
	    // runs after all tests in this block
	});

	beforeEach(function() {
	// runs before each test in this block
	});

	afterEach(function() {
    	// runs after each test in this block
  	});

  	// test cases
  	describe('Visualizer#name', function(){
    	it('should be Visualizer', function(){
      		assert(vis.name === "Visualizer");
    	});
  	})

});
