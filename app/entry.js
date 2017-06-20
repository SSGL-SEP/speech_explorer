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
var audioContext = new AudioContext();
AudioPlayer.setContext(audioContext);

function startApp() {
    var defaultDataSet = Config.findDefaultDataSetName();
    var dataSetInfo = Config.findDataSet(defaultDataSet);
    Data.setConfig(Config);
    Config.loadDataSetJSON(defaultDataSet).then(function(json) {
        Data.loadData(json);
        Loader.loadSounds(audioPath + dataSetInfo.audioSrc + '/concatenated_sounds.blob')
            .then(function(sounds) {
                AudioPlayer.loadSounds(sounds);
                Visualizer = new Visualizer();


                Visualizer.init();
                
                FilterOverlay = new FilterOverlay({
                    data: Data,
                    filterFunction: Visualizer.setFilter,
                    configDAO: Config,
                    changeDataSetFunction: changeDataSet
                });

                //¯\_(ツ)_/¯
                Visualizer.reset();
                FilterOverlay.init(defaultDataSet, Data.getParsedHeader().colorBy);
            });
    });

}

function changeDataSet(dataset, colorBy) {
    Visualizer.disableInteraction();
    var dataSetInfo = Config.findDataSet(dataset);

    Config.loadDataSetJSON(dataset).then(function(json) {
        Data.loadData(json);
        Loader.loadSounds(audioPath + dataSetInfo.audioSrc + '/concatenated_sounds.blob')
            .then(function(sounds) {
                AudioPlayer.loadSounds(sounds);
                FilterOverlay.reset();
                Visualizer.reset();
                FilterOverlay.init(dataset, colorBy);
                Visualizer.enableInteraction();
            });
    });
}

function printError() {
    console.error("Loading data failed");
}

Config.loadConfigFile('config.json')
    .then(startApp, printError);