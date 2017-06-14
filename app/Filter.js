'use strict';

var Data = require("./Data");
var InfoOverLay = require("./InfoOverlay");
var pointStates = [];
var activeCount = 0;
var pointGroups = {};
var totalPoints = 0;
var selectedPoints = new Set();


var calculateActivePoints = function() {
    var groups = Object.keys(pointGroups);
    var val;
    var count = 0;
    // val: 0 = inactive, 1 = active, 2 = selected
    for (var i = 0; i < totalPoints; i++) {
        val = 1;
        for (var j = 0; j < groups.length; j++) {
            if (pointGroups[groups[j]][i] === 0) {
                val = 0;
                break;
            }
        }
        pointStates[i] = val;

        if (val === 1 || val === 2) {
            count++;
        }
    }
    var arr = Array.from(selectedPoints);
    for (i = 0; i < arr.length; i++) {
        pointStates[arr[i]] = 2;
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

    for (var i = 0; i < tagPoints.length; i++) {
        pointGroups[tagName][tagPoints[i]] = newValue;
    }
};

var clearSelected = function() {
    selectedPoints = new Set(); // jshint ignore:line
    InfoOverLay.resetAndHideSelected();
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
        pointStates = activationStatusArray || [];
        clearSelected();
        initializeGroups(1);
        calculateActivePoints();
    },

    getPointStates: function() {
        return pointStates;
    },

    getActiveCount: function() {
        return activeCount;
    },

    getSelectedCount: function() {
        return selectedPoints.size;
    },

    /**
     * Activates a set of points based on the supplied tag name and value.
     *
     * @param {string} tagName
     * @param {string} tagValue
     */
    activatePoints: function(tagName, tagValue) {
        setGroupPointValuesTo(1, tagName, tagValue);
        clearSelected();
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
        clearSelected();
        calculateActivePoints();
    },

    selectPoints: function(indexes) {
        var changed = false;
        for (var i = 0; i < indexes.length; i++) {
            if (pointStates[indexes[i].index] !== 2) {
                changed = true;
            }
            selectedPoints.add(indexes[i].index);
        }
        calculateActivePoints();
        return changed;
    },

    deselectPoints: function(indexes) {
        var changed = false;
        for (var i = 0; i < indexes.length; i++) {
            if (pointStates[indexes[i].index] === 2) {
                changed = true;
            }
            selectedPoints.delete(indexes[i].index);
        }
        calculateActivePoints();
        return changed;
    },

    clearAll: function() {
        initializeGroups(0);
        clearSelected();
        calculateActivePoints();
    },

    selectAll: function() {
        initializeGroups(1);
        clearSelected();
        calculateActivePoints();
    },

    getSelected: function() {
        return selectedPoints;
    }
};