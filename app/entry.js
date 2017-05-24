var Data = require('./Data');
var json = require('../data/less_sne.json');
Data.loadData(json);
var Overlay = require("./Overlay");
var overlay = new Overlay(Data.getTags());
var Visualizer = require("./Visualizer");
var visualizer = new Visualizer();
visualizer.init();
