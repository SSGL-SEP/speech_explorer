'use strict';
var Loader = require('./Loader');

module.exports = function(config) {
    var scope = this;
    this.config = config || {};

    this.loadConfigFile = function(file) {
        return Loader.loadJSON(file).then(function(json) {
            scope.config = json;
            return scope.config;
        });
    };

    this.loadDefaultDataSetJSON = function() {
        return Loader.loadJSON(scope.config.dataSets[scope.config.defaultSet].dataSrc);
    };

    /**
     * dat.gui uses display names to change data sets
     *
     * @param datasetDisplayName
     * @returns {*}
     */
    this.loadDataSetJSON = function(datasetDisplayName) {
        var src = this.findDataSet(datasetDisplayName).dataSrc;
        return Loader.loadJSON(src);
    };

    this.findDataSet = function(displayName) {
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            if (scope.config.dataSets[i].displayName === displayName) {
                return scope.config.dataSets[i];
            }
        }
        return null;
    };

    this.findAllDataSetDisplayNames = function() {
        var allNames = [];
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            allNames.push(scope.config.dataSets[i].displayName);
        }
        return allNames;
    };

    this.findDefaultDataSetName = function() {
        return scope.config.dataSets[scope.config.defaultSet].displayName;
    };

    this.findAudioSource = function(dataSetDisplayName) {
        var set = this.findDataSet(dataSetDisplayName);
        return set.audioSrc;
    };

    this.getAudioSrc = function(dataSetName) {
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