const appDir = require('app-root-path');
const assert = require('assert');
const {expect} = require('chai');
const PointCloud = require(appDir + '/app/PointCloud');
const Data = require(appDir + "/app/Data");

describe('The PointCloud', function() {
    before(function() {
        const json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        this.pointCloud = new PointCloud(1);
    });

    after(function() {

    });

    it('should have correct number of points after initialization', function() {
        var pts = this.pointCloud.getAttributes().enabled.array;
        var enableds = pts.length;
        expect(enableds).to.equal(Data.getTotalPoints());
    });
});