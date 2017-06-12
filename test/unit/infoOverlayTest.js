const appDir = require('app-root-path');
const assert = require('assert');
const {expect} = require('chai');
const InfoOverlay = require(appDir + "/app/InfoOverlay");
const Data = require(appDir + "/app/Data");

const html = '<!DOCTYPE html><div id="info"></div><div id="active"></div><div id="infoPanels"></div></div>';

describe('InfoOverlay', function() {

    before(function() {
        const json = require(appDir + "/test/testdata.json");
        this.jsdom = require('jsdom-global')(html);

        Data.loadData(json);
        InfoOverlay.init('active', 'info', 'infoPanels', Data.getTags());

    });

    after(function() {
        // runs after all tests in this block
        this.jsdom();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });


    // test cases
    describe('InfoOverlay', function() {
        it('should hide infodisplay by default', function() {
            assert(document.getElementById('info').style.visibility === 'hidden');
        });
    });

    describe('InfoOverlay', function() {
        it('should hide infoPanel by default', function() {
            InfoOverlay.onClickOnPoint(0);
            var target = document.getElementById('infoPanels');
            assert(target.style.visibility === 'visible');
        });
    });

    describe('InfoOverlay#updateInfo', function() {
        it('should make infodisplay visible', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.style.visibility === 'visible');
        });
    });

    describe('InfoOverlay#updateActive', function() {
        it('should update display of number of active sounds correctly', function() {
            InfoOverlay.updateActive(2, 1);
            assert(document.getElementById('active').innerHTML === "1/2 active");
        });
    });

    describe('InfoOverlay#updateInfo', function() {
        it('should update display of filename correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('file name')[0].innerHTML === "mv_0693_003_h_0_0.wav");

        });
    });

    describe('InfoOverlay#updateInfo', function() {
        it('should update display of phoneme correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('phoneme')[0].innerHTML === "h");
        });
    });

    describe('InfoOverlay#updateInfo', function() {
        it('should update display of voicing correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('voice')[0].innerHTML === "unvoiced");
        });
    });

    describe('InfoOverlay#updateInfo', function() {
        it('should update display of stress correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('stress')[0].innerHTML === "unstressed");
        });
    });

    describe('InfoOverlay#hideInfo', function() {
        it('should hide display of info when requested', function() {
            InfoOverlay.hideInfo();
            var target = document.getElementById('info');
            assert(target.style.visibility === 'hidden');
        });
    });

     describe('InfoOverlay#onClickOnPoint', function() {
        it('should make infoPanel visible', function() {
            InfoOverlay.onClickOnPoint(0);
            var target = document.getElementById('infoPanels');
            assert(target.style.visibility === 'visible');
        });
    });

});

describe('InfoOverlay', function() {

    before(function() {
        const json = require(appDir + "/test/testdata.json");
        this.jsdom = require('jsdom-global')(html);

        Data.loadData(json);
        InfoOverlay.init('active', 'info', 'infoPanels', Data.getTags());
    });

    after(function() {
        // runs after all tests in this block
        this.jsdom();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });


    // test cases
    describe('InfoOverlay#updateActive', function() {
        it('updates display of number of active sounds correctly after re-initialization', function() {
            InfoOverlay.updateActive(3, 1);
            expect(document.getElementById('active').innerHTML).to.equal("1/3 active");
        });
    });
    describe('InfoOverlay#updateInfo', function() {
        it('updates display of phoneme correctly after re-initialization', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('phoneme')[0].innerHTML === "h");
        });
    });

});