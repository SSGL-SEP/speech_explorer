'use strict';

var THREE = require("three");
var Config;

var parsedPoints = [];
var parsedTags = {};
var parsedHeader = {};

var Data = module.exports = {

    /**
     * Sets ConfigDAO object for further use.
     * 
     * @param {ConfigDAO} config 
     */
    setConfig: function(config) {
        Config = config;
    },

    /**
     * Parses data in json format into more suitable form.
     * 
     * @param {json} inputData - Data in json format, see documentation for format specification.
     */
    loadData: function(inputData) {
        parsedPoints = [];
        parsedTags = inputData.tags;
        parsedHeader = {};

        parsedHeader.soundInfo = inputData.soundInfo;
        parsedHeader.dataSet = inputData.dataSet;
        parsedHeader.processingMethod = inputData.processingMethod;
        parsedHeader.colorBy = inputData.colorBy;
        parsedHeader.totalPoints = inputData.totalPoints;

        if (Object.keys(parsedTags).length === 0) {
            window.alert("No tag information found in the input json!\nReplace json for current dataset with valid one.");
            throw new Error("No tag information found!");
        }

        for (var i = 0; i < inputData.totalPoints; i++) {
            var dataPoint = new THREE.Vector3(inputData.points[i][0], inputData.points[i][1], inputData.points[i][2]);
            dataPoint.filename = inputData.points[i][3];
            dataPoint.meta = {};
            parsedPoints.push(dataPoint);
        }

        this.parseTags();
    },

    /**
     * Adds tag information to the property 'meta' of point objects.
     */
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

    /**
     * Returns total number of data points in dataset.
     * 
     * @returns {number} 
     */
    getTotalPoints: function() {
        return parsedHeader.totalPoints;
    },

    /**
     * Returns the file name of the audio file corresponding to a data point.
     * 
     * @param {number} index - index of a data point.
     * @returns {string}
     */
    getFileName: function(index) {
        return parsedPoints[index].filename;
    },

    /**
     * Returns path to the audio file corresponding to a data point.
     * 
     * @param {number} index - index of a data point.
     * @returns {string}
     */
    getUrl: function(index) {
        var folder = Config.getAudioSrc(parsedHeader.dataSet);
        var path = "";
        if (process.env.DATA_SRC) {
            path += process.env.DATA_SRC;
        } else {
            path += 'audio/';
        }
        return path + folder + '/' + Data.getFileName(index);
    },

    /**
     * Returns data point object.
     * 
     * @param {number} index - index of a data point.
     * @returns {object}
     */
    getPoint: function(index) {
        return parsedPoints[index];
    },

    /**
     * Returns the color of a data point. Color is determined by the tag which is currently set as colorBy in parsedHeader.
     * 
     * @param {number} index - index of a data point.
     * @returns {THREE.Color} A three.js Color object.
     */
    getColor: function(index) {
        var pointTagValue = parsedPoints[index].meta[parsedHeader.colorBy];
        return new THREE.Color(parsedTags[parsedHeader.colorBy][pointTagValue].color);
    },

    /**
     * Returns an object that contains all tags.
     * 
     * @returns {Object} An object that has tag objects as attributes, see json specification for more information on tag objects.
     */
    getTags: function() {
        return parsedTags;
    },

    /**
     * Returns a tag object.
     * 
     * @param {string} tagName - name of the tag.
     * @returns {Object} A tag object.
     */
    getTag: function(tagName) {
        return parsedTags[tagName];
    },

    /**
     * Returns color of a tag. Color is determined by the tag which is currently set as colorBy in parsedHeader.
     * 
     * @param {string} tag - name of the tag.
     * @returns {string} A hex string representing a color.
     */
    getTagColor: function(tag) {
        if (parsedTags[parsedHeader.colorBy][tag]) {
            return parsedTags[parsedHeader.colorBy][tag].color;
        }
    },

    /**
     * Returns header information as an object.
     * 
     * @returns {Object} An object with properties colorBy, dataSet, processingMethod, soundInfo and totalPoints.
     */
    getParsedHeader: function() {
        return parsedHeader;
    },

    /**
     * Sets the tag wich determines coloring of points.
     * 
     * @param {String} tag - name of the tag. 
     */
    setColorBy: function(tag) {
        parsedHeader.colorBy = tag;
    },

    /**
     * Returns name of the tag that determines coloring of points.
     * 
     * @returns {string} Name og the tag.
     */
    getColorBy: function() {
        return parsedHeader.colorBy;
    }
};