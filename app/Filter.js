'use strict';

var Data = require("./Data");
var activePoints = [];

module.exports = {

    getActivePoints: function() {
        return activePoints;
    },
    getActiveCount: 0,

    /**
     * Creates a list of points that should be active based on the tags supplied.
     *
     * @param {array} - filterStatus list of tag states
     */
    setFilter: function(params) {
        var tagData = Data.getTag(params.tagName);
        var tagValue = params.tagValue;
        var totalPoints = Data.getTotalPoints();
        var i;

        if (params.clearAll) {
            for (i = 0; i < totalPoints; i++) {
                activePoints[i] = 0;
            }
        } else if (params.selectAll) {
            for (i = 0; i < totalPoints; i++) {
                activePoints[i] = 1;
            }
        } else if (params.isActive) {
            for (i = 0; i < tagData[tagValue].points.length; i++) {
                activePoints[tagData[tagValue].points[i]] = 1;
            }
        } else {
            for (i = 0; i < tagData[tagValue].points.length; i++) {
                activePoints[tagData[tagValue].points[i]] = 0;
            }
        }
    }
};