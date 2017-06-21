const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');

defineSupportCode(function({ Given, When, Then }) {
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

    Then('borders of {stringInDoubleQuotes} should be colored', function(tag) {
        return this.driver.findElement(By.xpath('//*[@id="overlay"]/div/ul/li[3]/div/ul/li[2]/div/ul/li[4]')).then(function(element) {
            return element.getAttribute('style').then(function(style) {
                console.log(style);
                return expect(style).to.equal('border-left-color: rgb(255, 229, 0); border-left-width: 10px;');
            });
        });
    });

});