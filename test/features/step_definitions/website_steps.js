'use strict';

var expect = require('chai').expect;

module.exports = function () {
    this.World = require('../support/world.js').World;

    this.Given(/^I navigate to "([^"]*)"$/, function (url) {
        this.driver.get(url);
    });


    this.Then(/^I should see "([^"]*)" in title$/, function (str) {
        this.driver.getTitle().then(function (title) {
            expect(title).to.equal(str);
        });
    });

};