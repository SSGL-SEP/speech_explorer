
var Data = require("./Data");
<<<<<<< HEAD
var Visualizer = require("./Visualizer");
=======
>>>>>>> d49e7bbf1822a4f23a8fb43a5fa614baf554ac9c
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
<<<<<<< HEAD
        Visualizer.needsRefresh = true;
=======
>>>>>>> d49e7bbf1822a4f23a8fb43a5fa614baf554ac9c
    }
    

};
