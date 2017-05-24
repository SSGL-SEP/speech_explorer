var THREE = require("three");

var parsedData = [],
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
        var metaData = {};
        total = data.length;

        var i;
        for (i = 0; i < data.length; i++) {
            var dataPoint = new THREE.Vector3(data[i][1], data[i][2], data[i][3]);
            dataPoint.url = "audio/" + data[i][4];
            dataPoint.meta = this.parseMetadata(data[i][5]);
            parsedData.push(dataPoint);

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
            // should we continue (maxEuc-minEuc+hueOffset):lla? Seemes to make it worse..
            color.setHSL((hues[i] - minEuc + hueOffset) / (maxEuc - minEuc), 1, lightness + 0.5);
            parsedData[i].color = color;

        }
    },

    // Parses tag JSON into tag objects
    parseTags: function (tags, pointIndex) {
        for (var i = 0; i < tags.length; i++) {
            this.tag = tags[i];

            if (this.getTagIndex(parsedTags, this.tag.key) === -1) {
                parsedTags.push({ key: this.tag.key, values: [] });
            }

            this.tagIndex = this.getTagIndex(parsedTags, this.tag.key);
            this.values = parsedTags[this.tagIndex].values;
            if (this.getValueIndex(this.values, this.tag.val) === -1) {
                this.values.push({ value: this.tag.val, points: [] });
            }

            this.valueIndex = this.getValueIndex(this.values, this.tag.val);
            this.values[this.valueIndex].points.push(pointIndex);
        }
    },

    parseMetadata: function (tags) {
        var meta = [];

        for (var i = 0; i < tags.length; i++) {
            this.tag = tags[i];

            if (this.getTagIndex(meta, this.tag.key) === -1) {
                meta.push({ key: this.tag.key, values: [] });
            }

            this.tagIndex = this.getTagIndex(meta, this.tag.key);
            this.values = meta[this.tagIndex].values.push(this.tag.val);
        }
        return meta;
    },

    getTagIndex: function (array, key) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].key === key) {
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

    getTag: function (key) {
        var index = this.getTagIndex(parsedTags, key)
        if (index === -1) {
            return undefined;
        }
        return parsedTags[index];
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function (index) {
        return parsedData[index].url;
    },

    // TODO: Rename this function as it returns more than
    // position information
    getPosition: function (index) {
        return parsedData[index];
    },

    getColor: function (index) {
        return parsedData[index].color;
    },

    getTags: function () {
        return parsedTags;
    }

};

