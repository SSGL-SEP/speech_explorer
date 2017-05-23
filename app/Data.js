var THREE = require("three");

var parsedData = [], total = 0;
var parsedUrls = [];
var parsedColors = [];
var max = 0;

var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,
    
    loadData: function(data) {
        parsedData = [];
        total = data.length;
        parsedUrls = [];
        hues = [];
        for (var i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push(data[i][4]);
            var x = Math.pow(parsedData[i].x, 2);
            var y = Math.pow(parsedData[i].y, 2);
            var z = Math.pow(parsedData[i].z, 2);
            var hue = Math.sqrt(x+y+z);
            hues.push(hue);
            max = Math.max(max, hue);
        }
        for (var i = 0; i < data.length; i++) {
            var color = new THREE.Color();
            color.setHSL(hues[i] / max, 1, 0.5);
            parsedColors.push(color);

        }
        console.log(parsedColors);
    },


    getColor: function(index) {
        return parsedColors[index];
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
