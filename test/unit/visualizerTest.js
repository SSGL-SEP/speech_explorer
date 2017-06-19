// const jsdom = require('jsdom-global');
const appDir = require('app-root-path');
const assert = require('assert');
let vis;

describe('Visualizer', function() {

    before(function() {
        // jsdom('<!DOCTYPE html><html><body><div id="overlay"></div></body></html>');
        const Visualizer = require(appDir + '/app/Visualizer');
        vis = new Visualizer();
    });

    // after(function() {
    //     // runs after all tests in this block
    //     jsdomify.destroy();
    // });
    //
    // beforeEach(function() {
    //     // runs before each test in this block
    // });
    //
    // afterEach(function() {
    //     // runs after each test in this block
    // });

    // test cases
    describe('Visualizer#name', function() {
        it('should be Visualizer', function() {
            assert(vis.name === "Visualizer");
        });
    });

});
