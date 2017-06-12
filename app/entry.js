'use strict';

if (process.env.NODE_ENV === 'production') {
    //webpack was build with -p, set base url to amazon s3 for heroku to DL files
}

var Data = require('./Data');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");
var ConfigDAO = require("./ConfigDAO");
var Config = new ConfigDAO();


function startApp(pointData) {
    Data.setConfig(Config);
    Data.loadData(pointData);
    Visualizer = new Visualizer();
    Visualizer.init();
    FilterOverlay = new FilterOverlay({
        data: Data,
        filterFunction: Visualizer.setFilter,
        configDAO: Config,
        changeDataSetFunction: changeDataSet
    });
}

function changeDataSet(dataset) {
    Config.loadDataSetJSON(dataset).then(function(json) {
        Data.loadData(json);
        FilterOverlay.reset();
        Visualizer.reset();
        FilterOverlay.Init();
    });
}

function printError() {
    console.error("Loading data failed");
}

Config.loadConfigFile('config.json')
    .then(Config.loadDefaultDataSetJSON, printError)
    .then(startApp, printError);