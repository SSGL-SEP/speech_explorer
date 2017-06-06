const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    Given('I navigate to {stringInDoubleQuotes}', function (url) {
        return this.driver.get(url);
    });

    Given('I navigate to the homepage', function () {
        return this.driver.get('http://localhost:' + process.env.PORT);
    });

    // When('I click on {stringInDoubleQuotes}', function (text) {
    //     return this.driver.findElement({linkText: text}).then(function(element) {
    //         return element.click();
    //     });
    // });

    Then('I should see {stringInDoubleQuotes} in title', function (str) {
        return this.driver.getTitle().then(function (title) {
            return expect(title).to.equal(str);
        });
    });
});