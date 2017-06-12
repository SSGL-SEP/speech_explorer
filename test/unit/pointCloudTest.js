const appDir = require('app-root-path');
const assert = require('assert');
const THREE = require("three");
const {expect} = require('chai');
const pointCloud = require(appDir + '/app/PointCloud');
let pc;
let Data;

describe('The PointCloud', function() {
    before(function() {
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        pc = new pointCloud(1);

    });

    it('should have correct number of points after initialization', function() {
        var pts = pc.getAttributes().enabled.array;
        var enableds = pts.length;
        expect(enableds).to.equal(Data.getTotalPoints());
    });
});