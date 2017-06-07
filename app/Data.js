'use strict';

var THREE = require("three");

var parsedPoints = [],
    parsedTags = [],
    parsedData,
    total = 0;

var inputData = module.exports = {
    pointSize: 2,
    pointSizeMultiplier: 1,
    cloudSize2D: 1.5,

    loadData: function (inputData) {
        parsedPoints = [];
        parsedTags = inputData.tags;
        parsedData = inputData;
        total = inputData.totalPoints;

        // console.log(inputData);
        // console.log(parsedTags);
        // console.log(total);

        var i;
        for (i = 0; i < total; i++) {
            var dataPoint = new THREE.Vector3(parsedData.points[i][0], parsedData.points[i][1], parsedData.points[i][2]);
            dataPoint.filename = parsedData.points[i][3];
            dataPoint.meta = {};
            parsedPoints.push(dataPoint);
        }

        for (var tag in parsedTags) {
            if (parsedTags.hasOwnProperty(tag)) {
                for (var value in parsedTags[tag]) {
                    if (parsedTags[tag].hasOwnProperty(value)) {
                        for (var point in parsedTags[tag][value].points) {
                            parsedPoints[parsedTags[tag][value].points[point]].meta[tag] = value;
                        }
                    }
                }
            }
        }
        // console.log(parsedPoints);
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function (index) {
        return parsedPoints[index].filename;
    },

    getPoint: function (index) {
        return parsedPoints[index];
    },

    getColor: function (index) {
        var pointTagValue = parsedPoints[index].meta[parsedData.colorBy];
        return new THREE.Color(parsedTags[parsedData.colorBy][pointTagValue].color);
    },

    getTags: function () {
        return parsedTags;
    },

    getTagColor: function (tag) {
        if (parsedTags[parsedData.colorBy][tag]) {
            return parsedTags[parsedData.colorBy][tag].color;
        }

    }
};