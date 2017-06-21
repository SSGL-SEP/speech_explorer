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
        return this.driver.findElement(By.xpath("//*[@id='overlay']/div/ul/li[1]/select/option[2]")).then(function (element) {
            return element.getText().then(function (text) {
                return expect(text).to.equal(preset);
            });
        });

    });

    Then('I should not find {stringInDoubleQuotes} in the dropdown menu', function (preset) {
        // Write code here that turns the phrase above into concrete actions
        return this.driver.findElements(By.xpath("//*[@id='overlay']/div/ul/li[1]/select/option[2]")).then(function (elements) {

            return expect(elements.length).to.equal(0);

        });
    });
});