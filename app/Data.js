var THREE = require("three");

var parsedData = [],
    parsedUrls = [],
    parsedTags = [],
    total = 0


var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,

    loadData: function (data) {
        total = data.length;
        parsedData = [];
        parsedUrls = [];
        parsedTags = [];
        for (var i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push(data[i][4]);
            parsedTags.push(data[i][5]);
            console.log(data[i][5]);
        }
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function (index) {
        return parsedUrls[index];
    },

    getPosition: function (index) {
        return parsedData[index];
    }

}
