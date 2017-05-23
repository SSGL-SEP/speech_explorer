var THREE = require("three");

var parsedData = [],
    parsedUrls = [],
    parsedTags = [],
    total = 0


var Data = module.exports = {
    pointSize: 2,
    cloudSize2D: 1.5,

    loadData: function (data) {
        total = data.length;
        parsedData = [];
        parsedUrls = [];
        parsedTags = [];
        for (var i = 0; i < data.length; i++) {
            parsedData.push(new THREE.Vector3(data[i][1], data[i][2], data[i][3]));
            parsedUrls.push(data[i][4]);
            this.parseTags(data[i][5]);
        }
        console.log(parsedTags);
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
    getTags: function(){
        return parsedTags;
    }

}
