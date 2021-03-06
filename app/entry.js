'use strict';

require('audio-context-polyfill');
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
var lastUsedDataset = "";

/**
 * Changes the data set and loads new audio when needed. Called almost exclusively from FilterOverlay.
 *
 * @param dataset - the display name of the data set
 * @param colorBy - the tag name which is used for coloring
 */
function changeDataSet(dataset, colorBy) {
    Visualizer.disableInteraction();
    AudioPlayer.stop();
    var dataSetInfo = Config.findDataSet(dataset);

    var resetComponents = function() {
        if (colorBy) {
            Data.setColorBy(colorBy);
        }
        Loader.loadSounds(audioPath + dataSetInfo.audioSrc + '/concatenated_sounds.blob')
            .then(function(sounds) {
                AudioPlayer.loadSounds(sounds);
                FilterOverlay.reset();
                Visualizer.reset();
                FilterOverlay.init(dataset);
                Visualizer.enableInteraction();
                if (typeof window, Pace !== 'undefined') {
                    // fix for Pace running in Firefox after app loaded
                    window.Pace.bar.update(100);
                    window.Pace.stop();
                }
            });
    };
    if (dataset === lastUsedDataset) {
        resetComponents();
    } else {
        lastUsedDataset = dataset;
        Config.loadDataSetJSON(dataset).then(function(json) {
            Data.loadData(json);
            resetComponents();
        });
    }

}

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

                changeDataSet(defaultDataSet);
            });
    });

}


function printError() {
    console.error("Loading data failed");
}

Config.loadConfigFile('config.json')
    .then(startApp, printError);