const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ Given, When, Then }) {
    
    When('I press the new button', function () {
        var scope = this;
        this.driver.wait(until.elementLocated(By.className('button save-as')), 6000);
        var element = this.driver.findElement(By.className('button save-as'));
        return element.click();
    });

    When('I give input {stringInDoubleQuotes}', function (stringInDoubleQuotes) {
        var scope = this;
        return this.driver.switchTo().alert().sendKeys(stringInDoubleQuotes).then(function () {
            return scope.driver.switchTo().alert().accept();
        });
    });

    When('I press the delete button', function () {
         // Write code here that turns the phrase above into concrete actions
        var scope = this;
        this.driver.wait(until.elementLocated(By.className('button delete')), 6000);
        var element = this.driver.findElement(By.className('button delete'));
        element.click();
        var alert = this.driver.switchTo().alert();
        return alert.accept();
    });


    Then('I should see {stringInDoubleQuotes} in dropdown menu', function (preset) {
        // Write code here that turns the phrase above into concrete actions
        this.driver.findElement(By.name(preset)).getText().then(function (text) {
            return expect(text).to.equal(preset);
        });

    });

    Then('I should not find {stringInDoubleQuotes} in the dropdown menu', function (stringInDoubleQuotes, callback) {
         // Write code here that turns the phrase above into concrete actions
         callback(null, 'pending');
       });

    Then('The preset should be set to default', function (callback) {
         // Write code here that turns the phrase above into concrete actions
         callback(null, 'pending');
    });



    /*
    Then('I should see all points being active', function() {
        return this.driver.findElement(By.css("#active")).then(function(element) {
            element.getText().then(function(element) {
                return expect(element).to.equal('200/200 active');
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
    });*/


});