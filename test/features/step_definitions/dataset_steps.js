const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    When('I change dataset to {stringInDoubleQuotes}', function(dataset) {
        var driver = this.driver;
        return driver.findElement(By.xpath('//span[text()="Dataset" and contains(@class,"property-name")]/following-sibling::div[1]//select')).then(function(element) {
            return element.click().then(function() {
                return driver.findElement(By.xpath('//option[text()="' + dataset +'"]')).then(function (element){
                    return element.click();
                });
            });
        });
    });
});