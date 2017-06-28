const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const SelectionCursor = require(appDir + '/app/SelectionCursor');
const THREE = require("three");

var mockEvent;


describe('The SelectionCursor', function() {
    before(function() {
        SelectionCursor.init(10);
        mockEvent = {clientX: 500, clientY: 300};
    });

    describe('#init()', function() {
        it('should create a circle geometry', function() {
            expect(SelectionCursor.getMesh()).to.be.instanceof(THREE.Line);
        });
        it('should set visibility of the circle to false', function() {
            expect(SelectionCursor.getMesh().visible).to.be.false;
        });
    });

    describe('#update()', function() {
        it('should change the position of the circle', function() {
            SelectionCursor.update(mockEvent);
            expect(SelectionCursor.getMesh().position).to.deep.equal(new THREE.Vector3(-12,84,10));
        });
    });

    describe('#changeMode()', function() {
        it('should change the visibility of the circle to false when mode is 0', function() {
            SelectionCursor.changeMode(1);
            SelectionCursor.changeMode(0);
            expect(SelectionCursor.getMesh().visible).to.be.false;
        });
        it('should change the color of the circle to 0x00FF00 when mode is 1', function() {
            SelectionCursor.changeMode(1);
            expect(SelectionCursor.getMesh().material.color.getHex()).to.equal(0x00FF00);
        });
        it('should change the color of the circle to 0xFF0000 when mode is 2', function() {
            SelectionCursor.changeMode(2);
            expect(SelectionCursor.getMesh().material.color.getHex()).to.equal(0xFF0000);
        });
        it('should change the visibility of the circle to true when mode is not 0', function() {
            expect(SelectionCursor.getMesh().visible).to.be.true;
        });
    });

    describe('#setScale()', function() {
        it('should set scale of the circle', function() {
            SelectionCursor.setScale(2);
            expect(SelectionCursor.getMesh().scale).to.deep.equal(new THREE.Vector3(2,2,1));
        });
    });
});