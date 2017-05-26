
var Data = require("./Data");
var _ = require("underscore");

var activePoints = [];


var Filter = module.exports = {

    getActivePoints: function() {
        return activePoints;
    },

    isActive: function () {
        return activePoints.length > 0;
    },

    setFilter: function(activeTags) {
        if(activeTags.length === 0) {
            this.resetFilter();
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
        this.isChanged = true;
    }
};
