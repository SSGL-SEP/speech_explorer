const jsdom = require('jsdom-global');
const appDir = require('app-root-path');
const assert = require('assert');
const Visualizer = require(appDir + '/app/Visualizer');
const vis = new Visualizer();

describe('Visualizer', function() {

    before(function() {
        // runs before all tests in this block
        jsdom('<!DOCTYPE html><div id="overlay"></div>');
    });

    after(function() {
        // runs after all tests in this block
        jsdom();
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
