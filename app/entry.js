var Data = require('./Data');
var json = require('../data/less_sne.json');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");

Data.loadData(json);
var visualizer = new Visualizer();
visualizer.init();

FilterOverlay(Data.getTags(), visualizer.setFilter);
