'use strict';
var IO = require('./IO.js');

var ConfigDAO = module.exports = function() {
    var scope = this;
    this.config = {};
    
    this.loadConfigFile = function(file){
        return IO.loadJSON(file).then(function(json){
            scope.config = json;
            return scope.config;
        });
    };

    this.loadDefaultDataSetJSON = function(){
       return IO.loadJSON(scope.config.dataSets[scope.config.defaultSet].src);
    };
    
    
    this.findDataSet = function(dataset) {
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            if (scope.config.dataSets[i].dataSet === dataset) {
                return scope.config.dataSets[i];
            }
        }
        return null;
    };

    this.findAllDataSets = function(){
        var allSets = [];
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            allSets.push(scope.config.dataSets[i]);
        }
        return allSets;
    };

    this.findAllDataSetNames = function(){
        var allNames = [];
        for (var i = 0; i < scope.config.dataSets.length; i++) {
            allNames.push(scope.config.dataSets[i].dataSet);
        }
        return allNames;
    };
};