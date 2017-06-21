'use strict';

var rootPath = require('app-root-path');
var express = require('express');
var path = require('path');
var opn = require('opn');

var publicFolder;
if (process.env.NODE_ENV === 'development') {
    publicFolder = rootPath + "/test/public";
} else {
    publicFolder = rootPath + "/public";
}

var pathToPublic = path.resolve(publicFolder);
var port = process.env.PORT || 3000;
var app = express();

app.get('/', function(request, response) {
    response.sendFile('index.html', {root: pathToPublic});
});

app.use(express.static(publicFolder));

var server = app.listen(port, function() {
    console.log("Server listening in port " + port);
    if (process.env.NODE_ENV === 'local') {
        console.log("Opening app with default browser..");
        console.log("Keep this terminal window open while using the app");
        opn('http://localhost:3000');
    }
});

exports.close = function() {
    server.close();
};