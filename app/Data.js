var THREE = require("three");

var parsedData = [], total = 0;
var parsedUrls = [];
var parsedColors = [];
var max = 0;
var maxZ = 0;

parsedTags = [];
var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,

    loadData: function (data) {
        parsedData = [];
        total = data.length;
        parsedUrls = [];
        hues = [];
        parsedTags = [];
        for (var i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push(data[i][4]);
            this.parseTags(data[i][5]);
            var x = Math.pow(parsedData[i].x, 2);
            var y = Math.pow(parsedData[i].y, 2);
            var z = Math.pow(parsedData[i].z, 2);
            maxZ = Math.max(maxZ, z);
            var hue = Math.sqrt(x+y+z);
            hues.push(hue);
            max = Math.max(max, hue);
        }
        for (var i = 0; i < data.length; i++) {
            var color = new THREE.Color();
            var lightness = parsedData[i].z / (2 * maxZ);
            color.setHSL(hues[i] / max, 1, lightness + 0.5);
            parsedColors.push(color);

        }
        console.log(parsedColors);
    },


    getColor: function(index) {
        return parsedColors[index];
    },

    getColor: function(index) {
        return parsedColors[index];
    },

    // Parses tag JSON into tag objects
    parseTags: function (tags) {
        for (var i = 0; i < tags.length; i++) {
            this.tag = tags[i];

            if (this.getTagIndex(this.tag.key) === -1) {
                parsedTags.push({ key: this.tag.key, values: [] });
            }

            this.tagIndex = this.getTagIndex(this.tag.key);
            this.values = parsedTags[this.tagIndex].values;
            if (!this.values.includes(this.tag.val)) {
                this.values.push(this.tag.val);
            }

        }
    },

    // Gets index of tag object if exists
    getTagIndex: function (key) {
        for (var i = 0; i < parsedTags.length; i++) {
            if (parsedTags[i].key === key) {
                return i;
            }
        }
        return -1;
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function (index) {
        return parsedUrls[index];
    },

    getPosition: function (index) {
        return parsedData[index];
    },

    getTags: function () {
        return parsedTags;
    }

}
