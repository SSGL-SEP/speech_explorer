var THREE = require("three");

var parsedData = [],
    parsedUrls = [],
    parsedColors = [],
    parsedTags = [],
    maxEuc = 0,
    minEuc = Number.MAX_VALUE,
    maxZ = 0,
    hueOffset = 20,
    total = 0;

var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,

    loadData: function (data) {
        parsedData = [];
        parsedUrls = [];
        parsedTags = [];
        var hues = [];
        total = data.length;

        var i;
        for (i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push("audio/" + data[i][4]);
            this.parseTags(data[i][5], i);
            var x = Math.pow(parsedData[i].x, 2);
            var y = Math.pow(parsedData[i].y, 2);
            var z = Math.pow(parsedData[i].z, 2);
            maxZ = Math.max(maxZ, z);
            var hue = Math.sqrt(x + y + z);
            hues.push(hue);
            maxEuc = Math.max(maxEuc, hue);
            minEuc = Math.min(minEuc, hue);
        }
        for (i = 0; i < data.length; i++) {
            var color = new THREE.Color();
            var lightness = parsedData[i].z / (2 * maxZ);
            //pitäiskö jakaa (maxEuc-minEuc+hueOffset):lla? Näytti tulevan huonomman näköinen..
            color.setHSL((hues[i] - minEuc + hueOffset) / (maxEuc - minEuc), 1, lightness + 0.5);
            parsedColors.push(color);

        }
        //console.log(parsedColors);
        console.log(this.getTag('stress'));
        console.log(this.getTag('phonem'));
    },

    // Parses tag JSON into tag objects
    parseTags: function (tags, pointIndex) {
        for (var i = 0; i < tags.length; i++) {
            this.tag = tags[i];

            if (this.getTagIndex(this.tag.key) === -1) {
                parsedTags.push({ key: this.tag.key, values: [] });
            }

            this.tagIndex = this.getTagIndex(this.tag.key);
            this.values = parsedTags[this.tagIndex].values;
            if (this.getValueIndex(this.values, this.tag.val) === -1) {
                this.values.push({ value: this.tag.val, points: [] });
            }

            this.valueIndex = this.getValueIndex(this.values, this.tag.val);
            this.values[this.valueIndex].points.push(pointIndex);
        }
    },

    getTagIndex: function (key) {
        for (var i = 0; i < parsedTags.length; i++) {
            if (parsedTags[i].key === key) {
                return i;
            }
        }
        return -1;
    },

    getValueIndex: function (values, value) {
        for (var i = 0; i < values.length; i++) {
            if (values[i].value === value) {
                return i;
            }
        }
        return -1;
    },

    getTag: function (key){
        var index = this.getTagIndex(key)
        if(index === -1){
            return undefined;
        }
        return parsedTags[index];
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

    getColor: function (index) {
        return parsedColors[index];
    },

    getTags: function () {
        return parsedTags;
    }

};

