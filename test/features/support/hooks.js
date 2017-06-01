// var driver = require('./world.js').getDriver();
const fs = require('fs');
const path = require('path');
const sanitize = require("sanitize-filename");
const appDir = require('app-root-path');

// start server
process.env.PORT = 3214;
const server = require(appDir + "/app/server");

const {defineSupportCode} = require('cucumber');
console.log("Path:" + appDir);


defineSupportCode(function({After, registerHandler}) {
    After(function(result) {
        // if(result.isFailed()) {
        //     this.driver.takeScreenshot().then(function(data){
        //         var base64Data = data.replace(/^data:image\/png;base64,/,"");
        //         fs.writeFile(path.join('screenshots', sanitize(result.scenario.name + ".png").replace(/ /g,"_")), base64Data, 'base64', function(err) {
        //             if(err) {
        //                 console.log(err);
        //             }
        //         });
        //     });
        // }
        return this.driver.quit();
    });

    registerHandler('AfterFeatures', function () {
        server.close();
    });
});