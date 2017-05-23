var THREE = require("three");

var parsedData = [], total = 0;
var parsedUrls = []

var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,

    loadData: function(data) {
        parsedData = [];
        total = data.length;
        parsedUrls = [];
        for (var i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push(data[i][4]);
        }
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function(index){
        return parsedUrls[index];
    },

    getPosition: function (index) {
        return parsedData[index];
    }

}
