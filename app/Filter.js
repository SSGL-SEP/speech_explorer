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

        var res = [];

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
                res.push(i);
            }

        }
        console.log(res);
        activePoints = res;
        // var activeLists = [];

        // console.log('activeTags');
        // console.log(activeTags);
        // activeTags.forEach(function(activeTag) {
        //     var tag = Data.getTag(activeTag.key);
        //     var values = tag.values;
        //     // console.log('values');
        //     // console.log(values);
        //     values.forEach(function(parsedTag) {
        //         activeTag.values.forEach(function(activeTag) {
        //             if(activeTag !== parsedTag.value) {
        //                 activeLists.push(parsedTag.points);
        //             }
        //         });
        //     });
        // });
        // activePoints = _.intersection.apply(_, activeLists);
        // console.log('active points');
        // console.log(activePoints);
    }
};
//     /**
//      * Creates a list of points that should be active based on the tags supplied.
//      *
//      * @param {array} activeTags list of tags that are selected. If null, the filter is deactivated.
//      */
//     setFilter: function(activeTags) {
//         // if param is not an array, turn the filter off
//         isActive = activeTags instanceof Array;

//         if(!isActive) {
//             activePoints = [];
//             return;
//         }

//         var activeLists = [];
//         activeTags.forEach(function(activeTag) {
//             var tag = Data.getTag(activeTag.key);
//             var values = tag.values;
//             values.forEach(function(parsedTag) {
//                 activeTag.values.forEach(function(activeTag) {
//                     if(activeTag === parsedTag.value) {
//                         activeLists.push(parsedTag.points);
//                     }
//                 });
//             });
//         });
//         console.log(activeLists);
//         activePoints = _.intersection.apply(_, activeLists);
//     }
// };
