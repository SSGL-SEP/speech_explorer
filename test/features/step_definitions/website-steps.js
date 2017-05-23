'use strict';

var expect = require('chai').expect;
var testData = require("../../app/Data");
var THREE = require("three");
var assert = require("assert");

module.exports = function () {
  this.World = require('../support/world.js').World;

  this.When(/^I navigate to "([^"]*)"$/, function (url) {
    this.driver.get(url);
  });

  //play sound
  this.When(/^I click one random point$/, function (callback) {
    var pos = testData.getPosition(0);
    var x = pos.x;
    var y = pos.y;
    //this.driver.mouseMove(this.webdriver.By.id("visualizer"),x,y);
    this.driver.getTitle().then(function (title) {
      expect(title).to.equal("testi");
    });
  });


  this.Then(/^I should see "([^"]*)" in title$/, function (str) {
    this.driver.getTitle().then(function (title) {
      expect(title).to.equal(str);
    });
  });

  //play sound
  this.Then(/^sound is played$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    this.driver.getTitle().then(function (title) {
      expect(title).to.equal("testi");
    });

    this.Then(/^I can see visualized data$/, function (callback) {
      // Write code here that turns the phrase above into concrete actions
      driver.takeScreenshot().then(
        function (image, err) {
          require('fs').writeFile('out.png', image, 'base64', function (err) {
            console.log(err);
          });
        }
      );
    });


  });





};
