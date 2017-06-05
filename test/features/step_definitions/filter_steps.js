const {expect} = require('chai');
const {By, until} = require('selenium-webdriver');
const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    Then('I should see all points being active', function() {
        return this.driver.findElement(By.css("#active")).then(function(element) {
            element.getText().then(function(text) {
                return expect(text).to.equal('200/200 active');
            });
        });
    });

    Then('I should see {stringInDoubleQuotes} active samples', function(activeAmount) {
        return this.driver.findElement(By.css("#active")).then(function(element) {
            element.getText().then(function(element) {
                return expect(element).to.equal(activeAmount + '/200 active');
            });
        });
    });


    When('I press {stringInDoubleQuotes} button', function(button) {
        return this.driver.findElement(By.xpath("//div[contains(.,'" + button + "')]")).then(function(element) {
            return element.click();
        });
    });


    When('I open folder {stringInDoubleQuotes}', function(folder) {
        return this.driver.findElement(By.css("#overlay > div > ul > li:nth-child(2) > div > ul > li.title")).then(function(element) {
            return element.click();
        });
    });


    When('I click on checkbox of phonem s', function() {
        return this.driver.findElement(By.xpath("//*[@id=\"overlay\"]/div/ul/li[2]/div/ul/li[16]")).then(function(element) {
           return element.click();
        });
    });


});

