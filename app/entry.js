'use strict';

if (process.env.NODE_ENV === 'production') {
    //webpack was build with -p, set base url to amazon s3 for heroku to DL files
}

var Data = require('./Data');
var IO = require('./IO.js');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");
var Config = require("./ConfigDAO");
//var config = {};


function startApp(pointData) {
    Data.loadData(pointData);
    Visualizer = new Visualizer();
    Visualizer.init();

    FilterOverlay = new FilterOverlay(Data, Visualizer.setFilter, Config, changeDataSet); // eslint-disable-line no-new

}

function changeDataSet(dataset) {
    var confobj = Config.findDataSet(dataset);
    return IO.loadJSON(confobj.src).then(function(json) {
        Data.loadData(json);
        FilterOverlay.reset();
        Visualizer.reset();
        Visualizer.init();
        FilterOverlay.Init();

    });
}

/*
function loadDefaultDataSet(configuration) {
    config = configuration;
    return IO.loadJSON(config.dataSets[config.defaultSet].src);
}




IO.loadJSON('config.json')
    .then(loadDefaultDataSet, printError)
    .then(startApp, printError);
    */
function printError() {
    console.error("Loading data failed");
}

Config = new Config();
console.log(Config.loadConfigFile('config.json')
.then(Config.loadDefaultDataSetJSON, printError)
.then(startApp, printError));