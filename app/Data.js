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
        parsedTags = [];
        var hues = [];
        total = data.length;

        var i;
        for (i = 0; i < data.length; i++) {
            var dataPoint = new THREE.Vector3(data[i][1], data[i][2], data[i][3]);
            dataPoint.url = "audio/" + data[i][4];
            dataPoint.meta = this.parseTags(data[i][5], i);;
            parsedData.push(dataPoint);

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
        console.log(parsedTags);
        for (var index = 0; index < 10; index++) {
            console.log(parsedData[index]);;

        }
    },

    // Parses tag JSON into tag objects
    // parseTags: function (tags, pointIndex) {
    //     for (var i = 0; i < tags.length; i++) {
    //         this.tag = tags[i];

    //         if (this.getTagIndex(parsedTags, this.tag.key) === -1) {
    //             parsedTags.push({ key: this.tag.key, values: [] });
    //         }

    //         this.tagIndex = this.getTagIndex(parsedTags, this.tag.key);
    //         this.values = parsedTags[this.tagIndex].values;
    //         if (this.getValueIndex(this.values, this.tag.val) === -1) {
    //             this.values.push({ value: this.tag.val, points: [] });
    //         }

    //         this.valueIndex = this.getValueIndex(this.values, this.tag.val);
    //         this.values[this.valueIndex].points.push(pointIndex);
    //     }
    // },

    parseTags: function (tags, pointIndex) {
        var meta = [];
        for (var i = 0; i < tags.length; i++) {
            var tagKey = tags[i].key;
            var tagVal = tags[i].val;

            // Parse tag for a point object 
            var tagIndex = this.addTagObject(meta, tagKey);
            meta[tagIndex].values.push(tagVal);

            // Parse tag for parsedTag array
            tagIndex = this.addTagObject(parsedTags, tagKey);
            var values = parsedTags[tagIndex].values;
            var valueIndex = this.addValueObject(values, tagVal);
            values[valueIndex].points.push(pointIndex);
        }
        // Returns array of tag objects for use as a property
        // of a point object
        return meta;
    },

    // parseMetadata: function (tags) {
    //     var meta = [];

    //     for (var i = 0; i < tags.length; i++) {
    //         var tag = tags[i];

    //         var tagKey = tag.key;
    //         var tagVal = tag.val;


    //         var tagIndex = this.addTagObject(meta, tagKey);
    //         meta[tagIndex].values.push(tagVal);
    //     }
    //     return meta;
    // },
    // parseMetadata: function (tags) {
    //     var meta = [];

    //     for (var i = 0; i < tags.length; i++) {
    //         var tag = tags[i];

    //         var tagKey = tag.key;
    //         var tagVal = tag.val;


    //         var tagIndex = this.addTagObject(meta, tagKey);
    //         meta[tagIndex].values.push(tagVal);
    //     }
    //     return meta;
    // },

    // parseMetadata: function (tags) {
    //     var meta = [];

    //     for (var i = 0; i < tags.length; i++) {
    //         this.tag = tags[i];

    //         if (this.getTagIndex(meta, this.tag.key) === -1) {
    //             meta.push({ key: this.tag.key, values: [] });
    //         }

    //         this.tagIndex = this.getTagIndex(meta, this.tag.key);
    //         this.values = meta[this.tagIndex].values.push(this.tag.val);
    //     }
    //     return meta;
    // },


    // Adds tag object to an array if it doesn't exist. 
    // Returns index of tag object.
    addTagObject: function (array, tagKey) {
        var tagIndex = this.getTagIndex(array, tagKey);
        // Checks if tag key already exists
        if (tagIndex === -1) {
            // if no, creates new tag object and initializes value array
            array.push({ key: tagKey, values: [] });
            return array.length - 1;
        }
        return tagIndex;
    },

    // Adds a value object to an array if it doesn't exist. 
    // Returns index of a value object.
    addValueObject: function (array, tagVal) {
        var valueIndex = this.getValueIndex(array, tagVal);
        // Checks if value is present in values array
        if (valueIndex === -1) {
            // if no, creates new value object and initializes array of point object indexes
            array.push({ value: tagVal, points: [] });
            return array.length - 1;
        }
        return valueIndex;
    },

    getTagIndex: function (array, key) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].key === key) {
                return i;
            }
        }
        return -1;
    },

    getValueIndex: function (array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].value === value) {
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

