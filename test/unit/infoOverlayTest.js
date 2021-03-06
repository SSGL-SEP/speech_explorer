const jsdom = require('jsdom-global');
const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const Data = require(appDir + "/app/Data");
const InfoOverlay = require(appDir + "/app/InfoOverlay");
const sinon = require('sinon');

const html = '<!DOCTYPE html><div id="info"></div><div id="active"></div><div id="infoPanels"></div><div id="selected"></div><div id="help-button"></div><div id="help-box"></div><div id="background"></div></div>';

describe('InfoOverlay', function() {

    before(function() {
        jsdom(html);

        const json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        Data.setConfig({
            getAudioSrc: function() {
                return '';
            } // stub method
        });

        InfoOverlay.init('active', 'info', 'infoPanels', 'selected', Data.getTags());
    });

    after(function() {
        jsdom();
    });

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

    describe('#updateInfo', function() {
        it('should make infodisplay visible', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.style.visibility === 'visible');
        });
    });

    describe('#updateActive', function() {
        it('should update display of number of active sounds correctly', function() {
            InfoOverlay.updateActive(2, 1);
            assert(document.getElementById('active').innerHTML === "1/2 active");
        });
    });

    describe('#updateInfo', function() {
        it('should update display of filename correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('file name')[0].innerHTML === "mv_0693_003_h_0_0.wav");

        });
    });

    describe('#updateInfo', function() {
        it('should update display of phoneme correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('phoneme')[0].innerHTML === "h");
        });
    });

    describe('#updateInfo', function() {
        it('should update display of voicing correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('voice')[0].innerHTML === "unvoiced");
        });
    });

    describe('#updateInfo', function() {
        it('should update display of stress correctly', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('stress')[0].innerHTML === "unstressed");
        });
    });

    describe('#hideInfo', function() {
        it('should hide display of info when requested', function() {
            InfoOverlay.hideInfo();
            var target = document.getElementById('info');
            assert(target.style.visibility === 'hidden');
        });
    });

    describe('#onClickOnPoint', function() {
        it('should make infoPanel visible', function() {
            InfoOverlay.onClickOnPoint(0);
            var target = document.getElementById('infoPanels');
            assert(target.style.visibility === 'visible');
        });
    });

    describe('Selected', function() {
        it('should hide selected by default', function() {
            assert(document.getElementById('selected').style.visibility === 'hidden');
        });

        describe('#updateSelected', function() {
            it('should make Selected visible', function() {
                InfoOverlay.updateSelected(0);
                var target = document.getElementById('selected');
                assert(target.style.visibility === 'visible');
            });
        });

        describe('#resetAndHideSelected', function() {
            it('should reset and hide selected', function() {
                InfoOverlay.resetAndHideSelected();
                var target = document.getElementById('selected');
                assert(target.style.visibility === 'hidden');
            });
        });

        describe('#updateSelected', function() {
            it('should update display of number of selected sounds correctly', function() {
                InfoOverlay.updateSelected(1);
                assert(document.getElementById('selected').getElementsByTagName('div')[0].innerHTML === "1 selected");
            });
        });
    });

});

describe('InfoOverlay', function() {

    before(function() {
        jsdom(html);
        const json = require(appDir + "/test/testdata.json");

        Data.loadData(json);
        InfoOverlay.init('active', 'info', 'infoPanels', 'selected', Data.getTags());
    });

    after(function() {
        // runs after all tests in this block
        jsdom();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });


    // test cases
    describe('#updateActive', function() {
        it('updates display of number of active sounds correctly after re-initialization', function() {
            InfoOverlay.updateActive(3, 1);
            expect(document.getElementById('active').innerHTML).to.equal("1/3 active");
        });
    });

    describe('#updateInfo', function() {
        it('updates display of phoneme correctly after re-initialization', function() {
            InfoOverlay.updateInfo(0);
            var target = document.getElementById('info');
            assert(target.getElementsByClassName('phoneme')[0].innerHTML === "h");
        });
    });

    describe('#pushPlayButton', function() {
        it('can define a function to be called when pushing play', function() {
            var callback = sinon.spy();
            InfoOverlay.setAction('play', callback);

            // simulate clicking a point
            InfoOverlay.onClickOnPoint(0);

            var button = document.querySelector('.button.play');
            expect(button).to.be.defined;
            button.click();

            assert(callback.calledOnce);
        });
    });
});