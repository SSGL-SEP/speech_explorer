
var Data = require("./Data");
var Visualizer = require("./Visualizer");
var _ = require("underscore");

var activePoints = [];


var Filter = module.exports = {

    resetFilter: function() {
        activePoints = [];
        Visualizer.needsRefresh = true;
    },

    getActivePoints: function() {
        return activePoints;
    },

    setFilter: function(activeTags) {
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
        Visualizer.needsRefresh = true;
    }
    

};
