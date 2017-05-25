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
     * @param {array} tags
     * @param {number} pointIndex
     * @returns {array} meta
     */
    parseTags: function (tags, pointIndex) {
        var meta = [],
            tagKey,
            tagVal,
            tagIndex,
            values,
            valueIndex;

        for (var i = 0; i < tags.length; i++) {
            tagKey = tags[i].key;
            tagVal = tags[i].val;

            // Parse tag for a point object 
            tagIndex = this.addTwoPropertyObject(meta, 'key', tagKey, 'values', new Array());
            meta[tagIndex].values.push(tagVal);

            // Parse tag for parsedTag array
            tagIndex = this.addTwoPropertyObject(parsedTags, 'key', tagKey, 'values', new Array());
            values = parsedTags[tagIndex].values;
            valueIndex = this.addTwoPropertyObject(values, 'value', tagVal, 'points', new Array());
            values[valueIndex].points.push(pointIndex);
        }
        // Returns array of tag objects for use as a property of a point object
        return meta;
    },


    /**
     * Adds an object with two properties to an array if it doesnt exist and returns index of that object.
     * @param {array} array - array to wich object will be added
     * @param {string} firstKey - name of the first property 
     * @param {any} firstValue - value of the first property
     * @param {string} secondKey - name of the second property 
     * @param {any} secondValue - value of the second property
     * @returns {number} Index of the object
     */
    addTwoPropertyObject: function (array, firstKey, firstValue, secondKey, secondValue) {
        var valueIndex = this.getObjectIndex(array, firstKey, firstValue);
        if (valueIndex === -1) {
            array.push({ [firstKey]: firstValue, [secondKey]: secondValue });
            return array.length - 1;
        }
        return valueIndex;
    },

    /**
     * Returns index of an object with desired value of a property
     * @param {array} array - array that will be searched
     * @param {string} propertyName - name of the attribute that will be compared
     * @param {any} value - wanted value of the attribute
     * @returns {number} Index of an object
     */
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

