'use strict';

var THREE = require("three");

var parsedPoints = [];
var parsedTags = {};
var parsedHeader = {};

module.exports = {

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

            if (process.env.DATA_SRC) {
                dataPoint.filename = process.env.DATA_SRC + inputData.points[i][3];
            } else {
                dataPoint.filename = 'audio/' + inputData.points[i][3];
            }

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
        for (var tag in parsedTags) {
            if (parsedTags.hasOwnProperty(tag)) {
                for (var value in parsedTags[tag]) {
                    if (parsedTags[tag].hasOwnProperty(value)) {
                        for (var point in parsedTags[tag][value].points) {
                            if (parsedTags[tag][value].points.hasOwnProperty(point)) {
                                parsedPoints[parsedTags[tag][value].points[point]].meta[tag] = value;
                            }
                        }
                    }
                }
            }
        }
    },

    getTotalPoints: function() {
        return parsedHeader.totalPoints;
    },

    getUrl: function(index) {
        return parsedPoints[index].filename;
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