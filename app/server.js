'use strict';
var bodyParser = require('body-parser');
var rootPath = require('app-root-path');
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var IO = require('./IO.js');
var dir = './tmp';



var publicFolder;
if (process.env.NODE_ENV === 'development') {
    publicFolder = rootPath + "/test/public";
} else {
    publicFolder = rootPath + "/public";
}

var pathToPublic = path.resolve(publicFolder);
var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile('index.html', { root: pathToPublic });
});

app.post('/download', function(request, response) {
    var json = request.body.urls;
    var urls = JSON.parse(json);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var files =[];
    for(var i = 0; i< urls.length; i++){
    	files.push(fs.createWriteStream(dir+'/'+urls[i].split("/")[1]));
    }
    console.log(urls);
    for(i = 0; i < urls.length; i++){
    	var file = files[i];

    	request = http.get('http://s3-eu-west-1.amazonaws.com/ssglsep/'+urls[i], function(response) {
    	response.pipe(file);
    	});
    	//file.end();
    }
   	
	
	/*
	var file = IO.loadWav(urls[0]).then(function(file){
		console.log(file);
	});
	*/
	
});



app.use(express.static(publicFolder));

var server = app.listen(port, function() {
    console.log("Server listening in port " + port);
});

exports.close = function() {
    server.close();
};