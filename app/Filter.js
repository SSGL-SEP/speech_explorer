'use strict';

var Data = require("./Data");
var activePoints = [];
var activeCount = 0;
var pointGroups = {};
var totalPoints = 0;

var calculateActivePoints = function() {
    var groups = Object.keys(pointGroups);
    var i, j, val, count = 0;
    for (i = 0; i < totalPoints; i++) {
        val = 1;
        for (j = 0; j < groups.length; j++) {
            if (pointGroups[groups[j]][i] === 0) {
                val = 0;
                break;
            }
        }
        activePoints[i] = val;
        if (val === 1) {
            count++;
        }
    }
    activeCount = count;
};

var initializeGroups = function(initialValue) {
    var tagNames = Object.keys(Data.getTags());
    tagNames = tagNames.filter(function(tag) {
        return Data.getTag(tag).__filterable;
    });
    for (var i = 0; i < tagNames.length; i++) {
        pointGroups[tagNames[i]] = [];
        for (var j = 0; j < totalPoints; j++) {
            pointGroups[tagNames[i]][j] = initialValue;
        }
    }
};

var setGroupPointValuesTo = function(newValue, tagName, tagValue) {
    var tagData = Data.getTag(tagName);
    var tagPoints = tagData[tagValue].points;

    var i;
    for (i = 0; i < tagPoints.length; i++) {
        pointGroups[tagName][tagPoints[i]] = newValue;
    }
};

module.exports = {
    /**
     * (Re-)initializes the filter
     *
     * @param {number[]} activationStatusArray - A vector of ones and zeroes that indicate if points are enabled
     */
    init: function(activationStatusArray) {
        totalPoints = activationStatusArray.length || Data.getTotalPoints();
        pointGroups = {};
        activePoints = activationStatusArray || [];
        initializeGroups(1);
        calculateActivePoints();
    },

    getActivePoints: function() {
        return activePoints;
    },

    getActiveCount: function() {
        return activeCount;
    },

    /**
     * Activates a set of points based on the supplied tag name and value.
     *
     * @param {string} tagName
     * @param {string} tagValue
     */
    activatePoints: function(tagName, tagValue) {
        setGroupPointValuesTo(1, tagName, tagValue);
        calculateActivePoints();
    },

    /**
     * Deactivates a set of points based on the supplied tag name and value.
     *
     * @param {string} tagName
     * @param {string} tagValue
     */
    deactivatePoints: function(tagName, tagValue) {
        setGroupPointValuesTo(0, tagName, tagValue);
        calculateActivePoints();
    },

    clearAll: function() {
        initializeGroups(0);
        calculateActivePoints();
    },

    selectAll: function() {
        initializeGroups(1);
        calculateActivePoints();
    }
};