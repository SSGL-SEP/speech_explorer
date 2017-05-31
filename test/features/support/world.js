require('geckodriver');
var fs = require('fs');
var seleniumWebdriver = require('selenium-webdriver');
var {defineSupportCode} = require('cucumber');

function CustomWorld() {
    this.driver = new seleniumWebdriver.Builder()
        .forBrowser('firefox')
        .build();

    var defaultTimeout = 10000;
    this.waitFor = function(cssLocator, timeout) {
        var waitTimeout = timeout || defaultTimeout;
        return driver.wait(function() {
            return driver.isElementPresent({ css: cssLocator });
        }, waitTimeout);
    };

    var screenshotPath = "test/screenshots";
    if(!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath);
    }
}

defineSupportCode(function({setWorldConstructor}) {
    setWorldConstructor(CustomWorld)
});