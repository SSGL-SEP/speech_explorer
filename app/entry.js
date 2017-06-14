'use strict';

if (process.env.NODE_ENV === 'production') {
    //webpack was build with -p, set base url to amazon s3 for heroku to DL files
}

var Data = require('./Data');
var Visualizer = require("./Visualizer");
var FilterOverlay = require("./FilterOverlay");
var ConfigDAO = require("./ConfigDAO");
var Config = new ConfigDAO();
var AudioPlayer = require('./AudioPlayer');
var Preloader = require("./Preloader");
Preloader = new Preloader();


function startApp(pointData) {
    var audioSrc = Config.findDefaultDataSetAudioSrc();
    var path;
    if (process.env.DATA_SRC) {
        path = process.env.DATA_SRC;
    } else {
        path = 'audio/';
    }
    Data.setConfig(Config);
    Data.loadData(pointData);
    Preloader.loadSounds(path + audioSrc + '/concatenated_sounds.blob', Data.getTotalPoints(), function(sounds) {
        AudioPlayer.loadSounds(sounds);

        Visualizer = new Visualizer();
        Visualizer.init();
        FilterOverlay = new FilterOverlay({
            data: Data,
            filterFunction: Visualizer.setFilter,
            configDAO: Config,
            changeDataSetFunction: changeDataSet
        });
        Visualizer.enableInteraction();
    });
}

function changeDataSet(dataset) {
    Visualizer.disableInteraction();
    var dataSetInfo = Config.findDataSet(dataset);
    var path;
    if (process.env.DATA_SRC) {
        path = process.env.DATA_SRC;
    } else {
        path = 'audio/';
    }

    Config.loadDataSetJSON(dataset).then(function(json) {
        Data.loadData(json);
        Preloader.loadSounds(path + dataSetInfo.audioSrc + '/concatenated_sounds.blob', Data.getTotalPoints(), function(sounds) {
            AudioPlayer.loadSounds(sounds);
            FilterOverlay.reset();
            Visualizer.reset();
            FilterOverlay.Init(dataset);
            Visualizer.enableInteraction();
        });
    });
}

function printError() {
    console.error("Loading data failed");
}

Config.loadConfigFile('config.json')
    .then(Config.loadDefaultDataSetJSON, printError)
    .then(startApp, printError);