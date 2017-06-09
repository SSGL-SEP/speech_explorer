'use strict';

var Data = require("./Data");
var activePoints = [];
var activeCount = 0;

module.exports = {

    getActivePoints: function() {
        return activePoints;
    },

    getActiveCount: function() {
        return activeCount;
    },

    /**
     * Creates a list of points that should be active based on the tags supplied.
     *
     * @param {array} - filterStatus list of tag states
     */
    setFilter: function(params) {
    },

    activatePoints(tagName, tagValue) {
        var tagData = Data.getTag(tagName);
        var i;
        for (i = 0; i < tagData[tagValue].points.length; i++) {
            activePoints[tagData[tagValue].points[i]] = 1;
            activeCount++;
        }
    },

    deactivatePoints(tagName, tagValue) {
        var tagData = Data.getTag(tagName);
        var i;
        for (i = 0; i < tagData[tagValue].points.length; i++) {
            activePoints[tagData[tagValue].points[i]] = 0;
            activeCount--;
        }
    },

    clearAll: function() {
        var totalPoints = Data.getTotalPoints();
        var i;
        for (i = 0; i < totalPoints; i++) {
            activePoints[i] = 0;
        }
        activeCount = 0;
    },

    selectAll: function() {
        var totalPoints = Data.getTotalPoints();
        var i;
        for (i = 0; i < totalPoints; i++) {
            activePoints[i] = 1;
        }
        activeCount = Data.getTotalPoints();
    }
};