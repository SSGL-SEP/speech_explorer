const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    Then('I should see {stringInDoubleQuotes} active samples', function(activeAmount) {
        return this.driver.findElement(By.css("#active")).then(function(element) {
            element.getText().then(function(element) {
                return expect(element).to.equal(activeAmount + ' active');
            });
        });
    });


    When('I press {stringInDoubleQuotes} button', function(button) {
        return this.driver.findElement(By.xpath("//span[contains(.,'" + button + "')]")).then(function(element) {
            return element.click();
        });
    });

    When('I open folder {stringInDoubleQuotes}', function(folder) {
        return this.driver.findElement(By.id("overlay")).then(function(element) {
            return element.findElement(By.xpath('//*[text()="' + folder + '" and contains(@class,"title")]')).then(function(element) {
                return element.click();
            });
        });
    });

    When('I click on checkbox of {stringInDoubleQuotes}', function(setting) {
        return this.driver.findElement(By.xpath('//span[text()="' + setting + '" and contains(@class,"property-name")]/following-sibling::div[1]//input')).then(function(element) {
            return element.click();
        });
    });

    When('I click folder checkbox off for {stringInDoubleQuotes}', function(folder) {
        return this.driver.findElement(By.id("overlay")).then(function(element) {
            return element.findElement(By.xpath('//*[text()="' + folder + '" and contains(@class,"title")]')).then(function(element) {
                return element.findElement(By.className("check-icon deselect-folder")).then(function(element) {
                    return element.click();
                });
            });
        });
    });

    When('I click folder checkbox on for {stringInDoubleQuotes}', function(folder) {
        return this.driver.findElement(By.id("overlay")).then(function(element) {
            return element.findElement(By.xpath('//*[text()="' + folder + '" and contains(@class,"title")]')).then(function(element) {
                return element.findElement(By.className("check-icon select-folder")).then(function(element) {
                    return element.click();
                });
            });
        });
    });

});

