
var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
var Visualizer = require(appDir + '/app/Visualizer');
var vis = new Visualizer();

describe('Visualizer', function() {

    before(function() {
        // runs before all tests in this block
        this.jsdom = require('jsdom-global')('<!DOCTYPE html><div id="overlay"></div>');
    });

    after(function() {
        // runs after all tests in this block
        this.jsdom();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases
    describe('Visualizer#name', function() {
        it('should be Visualizer', function() {
            assert(vis.name === "Visualizer");
        });
    });

});
