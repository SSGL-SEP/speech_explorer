'use strict';

var THREE = require("three");
var Config;

var parsedPoints = [];
var parsedTags = {};
var parsedHeader = {};

module.exports = {

    setConfig: function(config) {
        Config = config;
    },

    loadData: function(inputData) {
        parsedPoints = [];
        parsedTags = inputData.tags;
        parsedHeader = {};

        console.log('Loading data...');

        console.log('Parsing header...');
        parsedHeader.soundInfo = inputData.soundInfo;
        parsedHeader.dataSet = inputData.dataSet;
        parsedHeader.processingMethod = inputData.processingMethod;
        parsedHeader.colorBy = inputData.colorBy;
        parsedHeader.totalPoints = inputData.totalPoints;

        console.log('Loading points...');
        for (var i = 0; i < inputData.totalPoints; i++) {
            var dataPoint = new THREE.Vector3(inputData.points[i][0], inputData.points[i][1], inputData.points[i][2]);
            dataPoint.filename = inputData.points[i][3];
            dataPoint.meta = {};
            parsedPoints.push(dataPoint);
            if (i % 1000 === 0) {
                console.log('Points loaded: ' + i);
            }
        }

        console.log('Parsing tags...');
        this.parseTags();

        console.log('Data loaded!');
    },

    parseTags: function() {
        var tag, tagName, tagValues, tagValue, i, j, k;

        var setMetaFieldForPoints = function(points, tagName, tagValue) {
            for (k = 0; k < points.length; k++) {
                parsedPoints[points[k]].meta[tagName] = tagValue;
            }
        };

        var tagNames = Object.keys(parsedTags);

        for (i = 0; i < tagNames.length; i++) {
            tagName = tagNames[i];
            tag = parsedTags[tagName];
            tagValues = Object.keys(tag);

            for (j = 0; j < tagValues.length; j++) {
                tagValue = tagValues[j];
                if (tagValue === '__filterable') {
                    continue; // no need to process this flag
                }
                setMetaFieldForPoints(tag[tagValue].points, tagName, tagValue);
            }
        }
    },

    getTotalPoints: function() {
        return parsedHeader.totalPoints;
    },

    getUrl: function(index) {
        var folder = Config.getAudioSrc(parsedHeader.dataSet);
        if (process.env.DATA_SRC) {
            return process.env.DATA_SRC + folder + parsedPoints[index].filename;
        }
        return 'audio/' + folder + parsedPoints[index].filename;
    },

    getPoint: function(index) {
        return parsedPoints[index];
    },

    getColor: function(index) {
        var pointTagValue = parsedPoints[index].meta[parsedHeader.colorBy];
        return new THREE.Color(parsedTags[parsedHeader.colorBy][pointTagValue].color);
    },

    getTags: function() {
        return parsedTags;
    },

    getTag: function(tagName) {
        return parsedTags[tagName];
    },

    getTagColor: function(tag) {
        if (parsedTags[parsedHeader.colorBy][tag]) {
            return parsedTags[parsedHeader.colorBy][tag].color;
        }
    },

    getParsedHeader: function() {
        return parsedHeader;
    }
};