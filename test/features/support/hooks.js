'use strict';

// var driver = require('./world.js').getDriver();
var fs = require('fs');
var path = require('path');
var sanitize = require("sanitize-filename");
var appDir = require('app-root-path');

// start server
process.env.PORT = 1234;
var server = require(appDir + "/app/server");

var {defineSupportCode} = require('cucumber');



defineSupportCode(function({After, registerHandler}) {
    After(function(result) {
        if(result.isFailed()) {
            this.driver.takeScreenshot().then(function(data){
                var base64Data = data.replace(/^data:image\/png;base64,/,"");
                fs.writeFile(path.join('screenshots', sanitize(result.scenario.name + ".png").replace(/ /g,"_")), base64Data, 'base64', function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            });
        }
        return this.driver.quit();
    });

    registerHandler('AfterFeatures', function () {
        server.close();
    });
});