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
        return this.driver.findElement(By.css("#help-button .button")).then(function(element) {
            return element.click();
        });
    });

    When('I click close help button', function() {
        return this.driver.findElement(By.css(".button.close-help-button")).then(function(element) {
            return element.click();
        });
    });

    Then('I should see help', function() {
        return this.driver.findElement(By.id('help-box')).then(function(element) {
            return element.getAttribute('class').then(function(classAttr) {
                return expect(classAttr).to.contain('open');
            });
        });
    });

    Then('I should not see help', function() {
        return this.driver.findElement(By.id('help-box')).then(function(element) {
            return element.getAttribute('class').then(function(classAttr) {
                return expect(classAttr).to.not.contain('open');
            });
        });
    });
});