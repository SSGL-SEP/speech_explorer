
var Data = require("./Data");
var PointCloud = require("./PointCloud");
var _ = require("underscore");

var activePoints = [];


var Filter = module.exports = {

    resetFilter: function() {
        activePoints = [];
    },

    getActivePoints: function() {
        return activePoints;
    },

    setFilter: function(activeTags) {
        var activeLists = [];
        activeTags.forEach(function(activeTag) {
            var tag = Data.getTag(activeTag.key);
            var values = tag.values;
            values.forEach(function(value) {
                activeTag.values.forEach(function(activeTag) {
                    if(activeTag === value.value) {
                        activeLists.push(value.points);
                    }
                });
            });
        });
        activePoints = _.intersection(activeLists);
    }

};
