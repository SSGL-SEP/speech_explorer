'use strict';

var THREE = require("three");

var parsedPoints = [],
    parsedTags = [],
    tagColors = new Map(),
    total = 0;

var Data = module.exports = {
    pointSize: 2,
    pointSizeMultiplier: 1,
    cloudSize2D: 1.5,

    loadData: function(data) {
        parsedPoints = [];
        parsedTags = [];
        total = data.length;

        console.log('Loading data...');

        var i;
        for (i = 0; i < data.length; i++) {
            var dataPoint = new THREE.Vector3(data[i][1], data[i][2], data[i][3]);
            if (process.env.DATA_SRC) {
                dataPoint.url = process.env.DATA_SRC + data[i][4];
            } else {
                dataPoint.url = "audio/" + data[i][4];
            }

            dataPoint.meta = this.parseTags(data[i][5], i);
            dataPoint.color = new THREE.Color(data[i][6]);
            this.parseTagColors(dataPoint, 'phoneme');
            parsedPoints.push(dataPoint);
            if (i % 1000 === 0) {
                console.log('Points loaded: ' + i);
            }
        }
        this.sortTagValues();
    },

    /**
     * Parses tag JSON into tag objects.
     * @param {array} tags - array of {key: foo, value: bar} objects
     * @param {number} pointIndex - index of current dataPoint
     * @returns {array} Array that includes tag information for a point {key: foor, values: []}
     */
    parseTags: function(tags, pointIndex) {
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
            tagIndex = this.addTwoPropertyObject(meta, 'key', tagKey, 'values', []);
            meta[tagIndex].values.push(tagVal);

            // Parse tag for parsedTag array
            tagIndex = this.addTwoPropertyObject(parsedTags, 'key', tagKey, 'values', []);
            values = parsedTags[tagIndex].values;
            valueIndex = this.addTwoPropertyObject(values, 'value', tagVal, 'points', []);
            values[valueIndex].points.push(pointIndex);
        }
        // Returns array of tag objects for use as a property of a point object
        return meta;
    },

    /**
     * Function that maps the color to the correct tag value. Wanted tag is usually the one
     * that was used to compute the color of the point.
     * @param {any} dataPoint - data point object
     * @param {any} tagKey - key value of tag that was used to determine color of the point
     */


    parseTagColors: function(dataPoint, tagKey) {
        var metaData = dataPoint.meta,
            value,
            tag;

        for (var i = 0; i < metaData.length; i++) {
            tag = metaData[i];
            if (tag.key === tagKey) {
                value = tag.values[0];
            }
        }


        if (!tagColors.has(value)) {
            tagColors.set(value, dataPoint.color);
        }
    },

    /**
     * Computes color for every datapoint and sets the color of each point.
     * Used when no color information is provided in data JSON
     * @param {JSON} data - data in JSON format
     */
    computeColorInformation: function(data) {
        var maxEuc = 0,
            minEuc = Number.MAX_VALUE,
            maxZ = 0,
            hueOffset = 20,
            hues = [];
        var i;
        for (i = 0; i < data.length; i++) {
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
            color.setHSL((hues[i] - minEuc + hueOffset) / (maxEuc - minEuc), 1, lightness + 0.5);
            parsedPoints[i].color = color;

        }
    },

    /**
     * Adds an object with two properties to an array, if it doesnt exist, and returns index of that object.
     * @param {array} array - array to wich object will be added
     * @param {string} firstKey - name (key) of the first property
     * @param {any} firstValue - value of the first property
     * @param {string} secondKey - name (key) of the second property
     * @param {any} secondValue - value of the second property
     * @returns {number} Index of the object
     */
    addTwoPropertyObject: function(array, firstKey, firstValue, secondKey, secondValue) {
        var valueIndex = this.getObjectIndex(array, firstKey, firstValue);
        if (valueIndex === -1) {
            var metaTag = {};
            metaTag[firstKey] = firstValue;
            metaTag[secondKey] = secondValue;
            array.push(metaTag);
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
    getObjectIndex: function(array, propertyName, value) {
        for (var i = 0; i < array.length; i++) {
            var object = array[i];
            if (array[i][propertyName] === value) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Sorts tag values alphabetically
     */
    sortTagValues: function() {
        for (var i = 0; i < parsedTags.length; i++) {
            var values = parsedTags[i].values;
            values.sort(function(a, b) {
                if (a.value < b.value) {
                    return -1;
                }
                if (a.value > b.value) {
                    return 1;
                }
                return 0;
            });
        }
    },

    getTag: function(key) {
        var index = this.getObjectIndex(parsedTags, 'key', key);
        if (index === -1) {
            return undefined;
        }
        return parsedTags[index];
    },

    getTotalPoints: function() {
        return total;
    },

    getUrl: function(index) {
        return parsedPoints[index].url;
    },

    getPoint: function(index) {
        return parsedPoints[index];
    },

    getColor: function(index) {
        return parsedPoints[index].color;
    },

    getTags: function() {
        return parsedTags;
    },

    getTagColor: function(tag) {
        return tagColors.get(tag);
    }
};