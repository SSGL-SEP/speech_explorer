const jsdom = require('jsdom-global');
const appDir = require('app-root-path');
const assert = require('assert');
const {expect} = require('chai');
const pointCloud = require(appDir + '/app/PointCloud');
let pc;
let Data;

describe('The PointCloud', function() {
    before(function() {

        jsdom('<!DOCTYPE html><div id="overlay"></div>');
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        pc = new pointCloud(1);

    });

    after(function() {
        // runs after all tests in this block
        jsdom();
    });

    it('should have correct number of points after initialization', function() {
        var pts = pc.getAttributes().enabled.array;
        var enableds = pts.length;
        expect(enableds).to.equal(Data.getTotalPoints());
    });
});