'use strict';
var IO = require('./IO.js');

var ConfigDAO = module.exports = function(config) {
    var scope = this;
    this.config = config || {};

    this.loadConfigFile = function(file) {
        return IO.loadJSON(file).then(function(json) {
            scope.config = json;
            return scope.config;
        });
    };

    this.loadDefaultDataSetJSON = function() {
        return IO.loadJSON(scope.config.dataSets[scope.config.defaultSet].dataSrc);
    };

    this.loadDataSetJSON = function(datasetName) {
        var src = this.findDataSet(datasetName).dataSrc;
        return IO.loadJSON(src);
    };

    this.findDataSet = function(datasetName) {
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            if (scope.config.dataSets[i].dataSet === datasetName) {
                return scope.config.dataSets[i];
            }
        }
        return null;
    };

    this.findAllDataSets = function() {
        var allSets = [];
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            allSets.push(scope.config.dataSets[i]);
        }
        return allSets;
    };

    this.findAllDataSetNames = function() {
        var allNames = [];
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            allNames.push(scope.config.dataSets[i].dataSet);
        }
        return allNames;
    };

    this.getAudioSrc = function(dataSetName) {
        if(dataSetName.startsWith("syllable")) {
            return "syllables/";
        }

        for (var i = 0; i < this.config.dataSets.length; i++) {
            var set = this.config.dataSets[i];
            if (set.dataSet === dataSetName) {
                return set.audioSrc;
            }
        }
        console.error('audioSrc not found');
        return "";
    };
};