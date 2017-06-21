const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    When('I click {stringInDoubleQuotes} link', function(link) {
        return this.driver.findElement(By.xpath("//a[contains(.,'" + link + "')]")).then(function(element) {
            return element.click();
        });
    });

    When('I click show help button', function() {
        return this.driver.findElement(By.id("help-button")).then(function(element) {
            return element.click();
        });
    });

    When('I click close help button', function() {
        return this.driver.findElement(By.id("close-button")).then(function(element) {
            return element.click();
        });
    });

    Then('I should see help', function() {
        return this.driver.findElement(By.id('manualBox')).then(function(element) {
            return element.getAttribute('style').then(function(style) {
                return expect(style).to.equal('display: block;');
            });
        });
    });

    Then('I should not see help', function() {
        return this.driver.findElement(By.id('manualBox')).then(function(element) {
            return element.getAttribute('style').then(function(style) {
                return expect(style).to.equal('display: none;');
            });
        });
    });
});