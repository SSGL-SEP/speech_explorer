var THREE = require("three");
var RTree = require("rtree");
var jsonData = require("../mockdata.json");

var Data = module.exports = function () {



    var stringified = JSON.stringify(jsonData);
    var jsonParsed = JSON.parse(stringified);


    console.log(new THREE.Vector3(jsonParsed["1"][0], jsonParsed["1"][1], jsonParsed["1"][2]));

}