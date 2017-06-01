'use strict';

var appDir = require('app-root-path');
var assert = require('assert');
var InfoOverlay = require(appDir + "/app/InfoOverlay");

describe('InfoOverlay', function () {

	before(function () {
		var Data = require(appDir + "/app/Data");
		var json = require(appDir + "/test/testdata.json");
		const jsdom = require("jsdom");
		const { JSDOM } = jsdom;

		this.dom = new JSDOM('<!DOCTYPE html><div id="info"></div><div id="active"></div><div id="infoPanels"></div></div>');				
		Data.loadData(json);
		InfoOverlay.init(this.dom.window.document.getElementById('active'), this.dom.window.document.getElementById('info'), this.dom.window.document.getElementById('infoPanels'), Data.getTags());

	});

	after(function () {
		// runs after all tests in this block
		//this.jsdom();
	});

	beforeEach(function () {
		// runs before each test in this block
	});

	afterEach(function () {
		// runs after each test in this block
	});


	// test cases 
	describe('InfoOverlay', function () {
		it('should hide infodisplay by default', function () {
			assert(this.dom.window.document.getElementById('info').style.visibility === 'hidden');
		});
	});

	describe('InfoOverlay#updateInfo', function () {
		it('should make infodisplay visible', function () {
			InfoOverlay.updateInfo(0);
			var target = this.dom.window.document.getElementById('info');
			assert(target.style.visibility === 'visible');
		});
	});

	describe('InfoOverlay#updateActive', function () {
		it('should update display of number of active sounds correctly', function () {
			InfoOverlay.updateActive(2,1);
			assert(this.dom.window.document.getElementById('active').innerHTML === "1/2 active");
		});
	});

	describe('InfoOverlay#updateInfo', function () {
		it('should update display of filename correctly', function () {
			InfoOverlay.updateInfo(0);
			var target = this.dom.window.document.getElementById('info');
			assert(target.getElementsByClassName('filename')[0].innerHTML === "mv_0693_021_i_1_0.wav");
		});
	});

	describe('InfoOverlay#updateInfo', function () {
		it('should update display of phonem correctly', function () {
			InfoOverlay.updateInfo(0);
			var target = this.dom.window.document.getElementById('info');
			assert(target.getElementsByClassName('phonem')[0].innerHTML === "i");
		});
	});

	describe('InfoOverlay#updateInfo', function () {
		it('should update display of voicing correctly', function () {
			InfoOverlay.updateInfo(0);
			var target = this.dom.window.document.getElementById('info');
			assert(target.getElementsByClassName('voice')[0].innerHTML === "voiced");
		});
	});

	describe('InfoOverlay#updateInfo', function () {
		it('should update display of stress correctly', function () {
			InfoOverlay.updateInfo(0);
			var target = this.dom.window.document.getElementById('info');
			assert(target.getElementsByClassName('stress')[0].innerHTML === "unstressed");
		});
	});

	describe('InfoOverlay#hideInfo', function () {
		it('should hide display of info when requested', function () {
			InfoOverlay.hideInfo();
			var target = this.dom.window.document.getElementById('info');
			assert(target.style.visibility === 'hidden');
		});
	});

	// describe('InfoOverlay#onClickOnPoint', function () {
	// 	it('should make infopanel visible', function () {
	// 		InfoOverlay.onClickOnPoint(0);
	// 		var target = this.dom.window.document.getElementById('infoPanels');
	// 		assert(target.style.visibility === 'visible');
	// 	});
	// });

});