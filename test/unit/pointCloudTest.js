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
        pc = new pointCloud();

        pc.activateFilter([1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1]);
        pc.draw();
        pc.update();

    });

    // it('should have correct number of points after filtering', function() {
    //     var pts = pc.getAttributes().enabled.array;
    //     var enableds = 0;
    //     for (var i = 0; i < pts.length; i++) {
    //         enableds += pts[i];
    //     }
    //     expect(enableds).to.equal(Data.getTotalPoints() - 2);
    // });
});