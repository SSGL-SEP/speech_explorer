var Data = require('./Data');
var json = require('../data/less_sne.json');
var Visualizer = require("./Visualizer");
var Overlay = require("./Overlay");

Data.loadData(json);
var visualizer = new Visualizer();
visualizer.init();

Overlay(Data.getTags(), visualizer.setFilter);
