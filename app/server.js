'use strict';

var rootPath = require('app-root-path');
var express = require('express');
var path = require('path');

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
});

exports.close = function() {
    server.close();
};