var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

app.listen(port, function() {
    console.log("Server listening in port " + port);
});
