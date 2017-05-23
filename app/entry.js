var Data = require('./Data');
var json = require('../data/realdata.json');
Data.loadData(json);
require("./Overlay")
var Visualizer = require("./Visualizer");
var visualizer = new Visualizer();
visualizer.init();
