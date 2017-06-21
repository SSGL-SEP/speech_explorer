const jsdom = require('jsdom-global');
const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const PointCloud = require(appDir + '/app/PointCloud');
const InfoOverlay = require(appDir + "/app/InfoOverlay");
const html = '<!DOCTYPE html><div id="info"></div><div id="active"></div><div id="infoPanels"></div><div id="selected"></div></div>';

var Data;
var Filter;
var Cloud;

describe('Filter', function() {

    before(function() {
        jsdom(html);
        const json = require(appDir + "/test/testdata.json");
        Data = require(appDir + "/app/Data");
        Data.loadData(json);
        InfoOverlay.init('active', 'info', 'infoPanels', 'selected', Data.getTags());

        Cloud = new PointCloud(2,'phoneme');
        Filter = require(appDir + "/app/Filter");
        Filter.init(Cloud.getAttributes().enabled.array);
    });

    after(function() {
        jsdom();
    });

    // beforeEach(function() {
    //
    // });

    afterEach(function() {
        Filter.init(Cloud.getAttributes().enabled.array);
        InfoOverlay.resetAndHideSelected();
    });


    describe('Filter returns correct data', function() {
        it('Filtered samples without phoneme k should be 11', function() {
            Filter.deactivatePoints("phoneme", "k");
            expect(11).to.equal(Filter.getActiveCount());
        });

        it('Filtered samples without phonemes k and a should be 8', function() {
            Filter.deactivatePoints("phoneme", "k");
            Filter.deactivatePoints("phoneme", "a");
            expect(8).to.equal(Filter.getActiveCount());
        });

        it('Filtered samples without unvoiced phoneme a should be 6', function() {
            Filter.deactivatePoints("phoneme", "a");
            Filter.deactivatePoints("voice", "unvoiced");
            expect(6).to.equal(Filter.getActiveCount());
        });

        it('Filtered samples without voiced and unvoiced should be 0', function() {
            Filter.deactivatePoints("voice", "unvoiced");
            Filter.deactivatePoints("voice", "voiced");
            expect(0).to.equal(Filter.getActiveCount());

        });

        it('Filtered samples by disabling stress:stressed and voice:unvoiced should be 6', function() {
            Filter.deactivatePoints("voice", "unvoiced");
            Filter.deactivatePoints("stress", "stressed");
            expect(6).to.equal(Filter.getActiveCount());
        });

        it('Filtered samples by an exhaustive filtering', function() {
            Filter.deactivatePoints("voice", "unvoiced");
            Filter.deactivatePoints("stress", "stressed");
            Filter.deactivatePoints("phoneme", "a");
            Filter.deactivatePoints("phoneme", "k");
            Filter.deactivatePoints("phoneme", "h");
            Filter.deactivatePoints("phoneme", "v");
            Filter.activatePoints("voice", "unvoiced");
            Filter.activatePoints("stress", "stressed");
            Filter.activatePoints("phoneme", "a");
            expect(8).to.equal(Filter.getActiveCount());
        });

    });

    describe('Selecting and deselecting work', function() {
        it('Selecting 3 points should update overlay', function() {
            var params = [
                {index: 2},
                {index: 4},
                {index: 5}
            ];

            Filter.selectPoints(params);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("3 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);
        });

        it('Multiple selections and deselections work', function() {
            var params = [];
            for (var i = 0; i < 13; i++) {
                params.push({index: i});
            }
            Filter.selectPoints(params);
            var params2 = [
                {index: 1},
                {index: 5}
            ];
            Filter.deselectPoints(params2);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("11 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);

        });

    });

    describe('Selections get cleared when filter states change', function() {
        it('Selection is cleared when clear all is used', function() {
            var params = [];
            for (var i = 0; i < 10; i++) {
                params.push({index: i});
            }
            Filter.selectPoints(params);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("10 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);
            Filter.clearAll();
            expect(0).to.equal(Filter.getSelected().size);
        });

        it('Selection is cleared when select all is used', function() {
            var params = [];
            for (var i = 0; i < 10; i++) {
                params.push({index: i});
            }
            Filter.selectPoints(params);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("10 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);
            Filter.selectAll();
            expect(0).to.equal(Filter.getSelected().size);
        });

        it('Selection is cleared when a tag is filtered', function() {
            var params = [];
            for (var i = 0; i < 10; i++) {
                params.push({index: i});
            }
            Filter.selectPoints(params);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("10 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);
            Filter.deactivatePoints("phoneme", "k");
            expect(0).to.equal(Filter.getSelected().size);
        });

        it('Selection is cleared when a tag is unfiltered', function() {
            Filter.deactivatePoints("phoneme", "k");
            var params = [
                {index: 3},
                {index: 4},
                {index: 5},
                {index: 6}
            ];
            Filter.selectPoints(params);
            InfoOverlay.updateSelected(Filter.getSelectedCount());
            expect("4 selected").to.equal(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML);
            Filter.activatePoints("phoneme", "k");
            expect(0).to.equal(Filter.getSelected().size);
        });

    });
});
