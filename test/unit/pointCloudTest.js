var appDir = require('app-root-path');
var assert = require('assert');
var THREE = require("three");
const {expect} = require('chai');
var pointCloud = require(appDir + '/app/PointCloud');
var pc;
var Data;

describe('The PointCloud', function() {
    before(function() {
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        pc = new pointCloud();

        pc.activateFilter([1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1]);
        pc.draw();
        pc.update();

    });

    it('should have correct number of points after filtering', function() {
        var pts = pc.getAttributes().enabled.array;
        var enableds = 0;
        for (var i = 0; i < pts.length; i++) {
            enableds += pts[i];
        }
        expect(enableds).to.equal(Data.getTotalPoints() - 2);
    });
});