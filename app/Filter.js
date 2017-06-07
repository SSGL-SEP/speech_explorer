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
     * @param {array} - filterStatus list of tag states
     */
    setFilter: function(filterStatus) {
        console.log('filterStatus');
        console.log(filterStatus)
        activePoints = [];
        var tagMap = Data.getTags();

        filterStatus.forEach(function(category) {
            var categories = [];
            var tagObj = tagMap[category.key];


            Object.keys(category.values).forEach(function(key) {
                if (category.values[key]) {
                    categories.push(tagObj[key]);
                }
            });

            categories = _.union.apply(_, categories);
            activePoints.push(categories);
        });

        activePoints = _.intersection.apply(_, activePoints);
    }

    /**
     * Creates a list of points that should be active based on the tags supplied.
     *
     * @param {array} activeTags list of tags that are selected. If null, the filter is deactivated.
     */
    // setFilter: function(activeTags) {
    // console.log(activeTags);
    // activePoints = [];
    // for (var i = 0; i < Data.getTotalPoints(); i++) {
    //     var meta = Data.getPoint(i).meta;
    //     var isPresent = false;

    //     for (var j = 0; j < meta.length; j++) {
    //         var metaTag = meta[j];
    //         for (var k = 0; k < activeTags.length; k++) {
    //             var element = activeTags[k];
    //             var tagKey = element.key;
    //             var tagValues = element.values;

    //             if (tagKey === metaTag.key && tagValues.includes(metaTag.values[0])) {
    //                 isPresent = true;
    //             }
    //         }
    //     }
    //     if (!isPresent) {
    //         activePoints.push(i);
    //     }
    // }
    // console.log(activePoints);
    // }
};