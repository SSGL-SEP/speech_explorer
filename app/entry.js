'use strict';

var Data = require('./Data');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");
var ConfigDAO = require("./ConfigDAO");
var Config = new ConfigDAO();
var AudioPlayer = require('./AudioPlayer');
var Loader = require("./Loader");

var audioPath;
if (process.env.DATA_SRC) {
    audioPath = process.env.DATA_SRC;
} else {
    audioPath = 'audio/';
}
AudioPlayer.setContext(new AudioContext());

function startApp() {
    var defaultDataSet = Config.findDefaultDataSetName();
    Data.setConfig(Config);
    Visualizer = new Visualizer();
    FilterOverlay = new FilterOverlay({
        data: Data,
        filterFunction: Visualizer.setFilter,
        configDAO: Config,
        changeDataSetFunction: changeDataSet
    });
    Visualizer.init();

    changeDataSet(defaultDataSet);
}

function changeDataSet(dataset) {
    Visualizer.disableInteraction();
    var dataSetInfo = Config.findDataSet(dataset);

    Config.loadDataSetJSON(dataset).then(function(json) {
        Data.loadData(json);
        Loader.loadSounds(audioPath + dataSetInfo.audioSrc + '/concatenated_sounds.blob')
            .then(function(sounds) {
                AudioPlayer.loadSounds(sounds);
                FilterOverlay.reset();
                Visualizer.reset();
                FilterOverlay.init(dataset);
                Visualizer.enableInteraction();
            });
    });
}

function printError() {
    console.error("Loading data failed");
}

Config.loadConfigFile('config.json')
    .then(startApp, printError);