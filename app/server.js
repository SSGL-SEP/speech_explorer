var express = require('express');
var path = require('path');
var pathToPublic = path.resolve(__dirname, '../public');
var port = process.env.PORT || 3000;
var app = express();

app.get('/', function(request, response) {
    response.sendFile('index.html', {root: pathToPublic});
});

app.use(express.static('public'));

app.listen(port, function() {
    console.log("Server listening in port " + port);
});
