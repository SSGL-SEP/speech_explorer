var THREE = require("three");
var jsonData = require("../mockdata.json");

var stringified = JSON.stringify(jsonData);
var jsonParsed = JSON.parse(stringified);
var parsedData = [], total = jsonParsed.length;

for (var i = 0; i < total; i++) {
  parsedData.push(new THREE.Vector3(jsonParsed[i][1], jsonParsed[i][2], jsonParsed[i][3]));
  //   console.log(jsonParsed[i][1] + " " + jsonParsed[i][2] + " " + jsonParsed[i][3]);
}

var Data = module.exports = {
  pointSize: 1,
  cloudSize2D: 1.5,
  totalTracks: 1,


  getTotalPoints: function () {
    return total;
  },


  getPosition: function (index) {
    return parsedData[index];
  }

}
