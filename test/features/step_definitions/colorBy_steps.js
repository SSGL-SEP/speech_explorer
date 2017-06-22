const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    When('I change colorBy to {stringInDoubleQuotes}', function(colorby) {
        var driver = this.driver;
        return driver.findElement(By.xpath('//span[text()="ColorBy" and contains(@class,"property-name")]/following-sibling::div[1]//select')).then(function(element) {
            return element.click().then(function() {
                return driver.findElement(By.xpath('//option[text()="' + colorby + '"]')).then(function(element) {
                    return element.click();
                });
            });
        });
    });

    Then('border of {stringInDoubleQuotes} should be colored with RGB {stringInDoubleQuotes}', function(tag, rgb) {
        return this.driver.findElement(By.xpath('//span[text()="' + tag + '"]/ancestor::li[@class="cr boolean"]')).then(function(element) {
            return element.getAttribute('style').then(function(style) {
                return expect(style).to.equal('border-left-color: rgb(' + rgb + '); border-left-width: 10px;');
            });
        });
    });
});