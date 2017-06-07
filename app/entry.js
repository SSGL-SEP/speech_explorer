'use strict';

if (process.env.NODE_ENV === 'production') {
    //webpack was build with -p, set base url to amazon s3 for heroku to DL files
}

var Data = require('./Data');
var IO = require('./IO.js');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");
var config = {};

function startApp(pointData) {
    Data.loadData(pointData);
    var visualizer = new Visualizer();
    visualizer.init();

    new FilterOverlay(Data, visualizer.setFilter, config); // eslint-disable-line no-new

}

function loadDefaultDataSet(configuration) {
    config = configuration;
    return IO.loadJSON(config.dataSets[config.defaultSet].src);
}

function printError() {
    console.error("Loading data failed");
}

IO.loadJSON('config.json')
    .then(loadDefaultDataSet, printError)
    .then(startApp, printError);
