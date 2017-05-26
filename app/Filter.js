
var Data = require("./Data");
var _ = require("underscore");

var activePoints = [];
var isActive = false;


var Filter = module.exports = {

    getActivePoints: function() {
        return activePoints;
    },

    isActive: function () {
        return isActive;
    },

    setFilter: function(activeTags) {
        isActive = activeTags instanceof Array;

        if(!isActive) {
            activePoints = [];
            return;
        }


        var activeLists = [];
        activeTags.forEach(function(activeTag) {
            var tag = Data.getTag(activeTag.key);
            var values = tag.values;
            values.forEach(function(parsedTag) {
                activeTag.values.forEach(function(activeTag) {
                    if(activeTag === parsedTag.value) {
                        activeLists.push(parsedTag.points);
                    }
                });
            });
        });
        activePoints = _.intersection.apply(_, activeLists);
    }
};
