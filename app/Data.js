var THREE = require("three");

var parsedPoints = [],
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
        parsedPoints = [];
        parsedTags = [];
        total = data.length;
        var hues = [];

        var i;
        for (i = 0; i < data.length; i++) {
            var dataPoint = new THREE.Vector3(data[i][1], data[i][2], data[i][3]);
            dataPoint.url = "audio/" + data[i][4];
            dataPoint.meta = this.parseTags(data[i][5], i);
            parsedPoints.push(dataPoint);

            var x = Math.pow(parsedPoints[i].x, 2);
            var y = Math.pow(parsedPoints[i].y, 2);
            var z = Math.pow(parsedPoints[i].z, 2);
            var hue = Math.sqrt(x + y + z);
            hues.push(hue);

            maxZ = Math.max(maxZ, z);
            maxEuc = Math.max(maxEuc, hue);
            minEuc = Math.min(minEuc, hue);
        }
        for (i = 0; i < data.length; i++) {
            var color = new THREE.Color();
            var lightness = parsedPoints[i].z / (2 * maxZ);
            // should we continue (maxEuc-minEuc+hueOffset):lla? Seemes to make it worse..
            color.setHSL((hues[i] - minEuc + hueOffset) / (maxEuc - minEuc), 1, lightness + 0.5);
            parsedPoints[i].color = color;

        }
    },


    /**
     * Parses tag JSON into tag objects. 
     * @param {Array} tags
     * @param {Number} pointIndex
     * @return {Array} meta
     */
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
        // Returns array of tag objects for use as a property of a point object
        return meta;
    },


    /**
     * Adds a tag object to an array if it doesn't exist.
     * Returns index of a tag object in a array.
     */
    // addTagObject: function (array, tagKey) {
    //     var tagIndex = this.getObjectIndex(array, 'key', tagKey);
    //     if (tagIndex === -1) {
    //         array.push({ key: tagKey, values: [] });
    //         return array.length - 1;
    //     }
    //     return tagIndex;
    // },
    addTagObject: function (array, tagKey) {
        return this.addTwoValueObject(array, 'key', tagKey, 'values', new Array());
    },

    /**
     * Adds a value object to an array if it doesn't exist.
     * Returns index of a value object in a array.
     */
    addValueObject: function (array, tagVal) {
        return this.addTwoValueObject(array, 'value', tagVal, 'points', new Array());
    },
    // addValueObject: function (array, tagVal) {
    //     var valueIndex = this.getObjectIndex(array, 'value', tagVal);
    //     if (valueIndex === -1) {
    //         array.push({ value: tagVal, points: [] });
    //         return array.length - 1;
    //     }
    //     return valueIndex;
    // },

    addTwoValueObject: function (array, firstKey, firstValue, secondKey, secondValue) {
        var valueIndex = this.getObjectIndex(array, firstKey, firstValue);
        if (valueIndex === -1) {
            array.push({ [firstKey]: firstValue, [secondKey]: secondValue });
            return array.length - 1;
        }
        return valueIndex;
    },

    getObjectIndex: function (array, propertyName, value) {
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            if (array[i][propertyName] === value) {
                return i;
            }
        }
        return -1;
    },

    getTag: function (key) {
        var index = this.getObjectIndex(parsedTags, 'key', key)
        if (index === -1) {
            return undefined;
        }
        return parsedTags[index];
    },

    getTotalPoints: function () {
        return total;
    },

    getUrl: function (index) {
        return parsedPoints[index].url;
    },

    getPosition: function (index) {
        return parsedPoints[index];
    },

    getColor: function (index) {
        return parsedPoints[index].color;
    },

    getTags: function () {
        return parsedTags;
    }

};

