const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const PointCloud = require(appDir + '/app/PointCloud');
const Data = require(appDir + "/app/Data");

describe('The PointCloud', function() {
    before(function() {
        const json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        this.pointCloud = new PointCloud(1);
    });

    it('should have correct number of points after initialization', function() {
        var pts = this.pointCloud.getAttributes().enabled.array;
        var enableds = pts.length;
        expect(enableds).to.equal(Data.getTotalPoints());
    });

    describe('#setPointsSize()', function() {
        it('should update point size value', function() {
            this.pointCloud.setPointSize(10);
            expect(this.pointCloud.cloud.material.uniforms.pointsize.value).to.equal(10);
        });
    });

    describe('#update()', function() {
        it('should increment version for geometry buffer attributes position, customSize and enabled', function() {
            this.pointCloud.update();
            expect(this.pointCloud.cloud.geometry.attributes.position.version).to.equal(1);
            expect(this.pointCloud.cloud.geometry.attributes.customSize.version).to.equal(1);
            expect(this.pointCloud.cloud.geometry.attributes.enabled.version).to.equal(1);
        });
    });

    describe('#removeCloud()', function() {
        it('should remove cloud attribute and set it to null', function() {
            this.pointCloud.removeCloud();
            expect(this.pointCloud.cloud).to.be.null;
        });
        it('should do nothing if cloud is null', function() {
            this.pointCloud.removeCloud();
            expect(this.pointCloud.cloud).to.be.null;
        });
    });
});