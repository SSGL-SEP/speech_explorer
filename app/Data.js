var THREE = require("three");
var jsonData = require("../mockdata.json");

var stringified = JSON.stringify(jsonData);
var jsonParsed = JSON.parse(stringified);
var parsedData = [], total = jsonParsed.length;
var parsedUrls = []


for (var i = 0; i < total; i++) {
    parsedData.push(new THREE.Vector3(jsonParsed[i][1], jsonParsed[i][2], jsonParsed[i][3]));
    parsedUrls.push(jsonParsed[i][4]);
}

var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,


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
