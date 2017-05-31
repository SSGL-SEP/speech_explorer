'use strict';

var Data = require("./Data");
var _ = require("underscore");

var activePoints = [];
var isActive = false;


var Filter = module.exports = {

    getActivePoints: function() {
        return activePoints;
    },

    isActive: function() {
        return isActive;
    },

    /**
     * Creates a list of points that should be active based on the tags supplied.
     *
     * @param {array} activeTags list of tags that are selected. If null, the filter is deactivated.
     */
    setFilter: function(activeTags) {
        // if param is not an array, turn the filter off
        isActive = activeTags instanceof Array;

        if (!isActive) {
            activePoints = [];
            return;
        }

        activePoints = [];

        console.log(activeTags);
        for (var i = 0; i < Data.getTotalPoints(); i++) {
            var point = Data.getPoint(i);
            var meta = point.meta;
            var isPresent = false;

            for (var k = 0; k < meta.length; k++) {
                var metaTag = meta[k];
                for (var j = 0; j < activeTags.length; j++) {
                    var element = activeTags[j];
                    var tagKey = element.key;
                    var tagValues = element.values;

                    if (tagKey === metaTag.key && tagValues.includes(metaTag.values[0])) {
                        isPresent = true;
                    }


                }
            }
            if (!isPresent) {
                activePoints.push(i);
            }
        }
    }
};