var Data = require('./app/Data');
var json = require('./realdata.json');
Data.loadData(json);

var Visualizer = require("./app/Visualizer");
var visualizer = new Visualizer();
visualizer.init();
