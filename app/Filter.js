'use strict';

var Data = require("./Data");
var _ = require("underscore");

var activePoints = [];

var Filter = module.exports = {

    getActivePoints: function() {
        return activePoints;
    },

    /**
     * Creates a list of points that should be active based on the tags supplied.
     *
     * @param {array} activeTags list of tags that are selected. If null, the filter is deactivated.
     */
    setFilter: function(activeTags) {
        activePoints = [];
        for (var i = 0; i < Data.getTotalPoints(); i++) {
            var meta = Data.getPoint(i).meta;
            var isPresent = false;

            for (var j = 0; j < meta.length; j++) {
                var metaTag = meta[j];
                for (var k = 0; k < activeTags.length; k++) {
                    var element = activeTags[k];
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