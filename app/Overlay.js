var dat = require("dat.gui/build/dat.gui.min.js");


var Overlay = module.exports = function (tags) {
    var scope = this;
    this.boolTags = [];
    this.tags = tags;
    this.gui = new dat.GUI({ autoPlace: false });

    this.Init = function () {
        this.createBoolArray(this.tags);
        this.createGUI();

    }

    this.createBoolArray = function () {
        //1 because filenames are at zero
        for (var i = 1; i < this.tags.length; i++) {
            var boolObj = {
                key: this.tags[i].key,
                values: {}
            };

            for (var j = 0; j < this.tags[i].values.length; j++) {
                boolObj.values[this.tags[i].values[j].value] = true;
            }
            this.boolTags.push(boolObj);

        }
    }

    this.createGUI = function () {
        var obj = this.pushFilterData;

        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.gui.addFolder(tag.key);
            for (var property in tag.values) {
                folder.add(tag.values, property);
            }
        }

        this.gui.add(obj, 'Filter');
        var doc = document.getElementById('overlay');
        doc.appendChild(this.gui.domElement);
    }

    this.pushFilterData = { 
        Filter: function () { 
            console.log(scope.createFilterData()); 
        } };
    
    this.createFilterData = function(){
        var data = [];
        for(var i = 0; i<this.boolTags.length; i++){
            var isUsed = false;
            var tag = this.boolTags[i];
            var obj = {
                key: this.boolTags[i].key,
                values: []
            };
            for(var property in tag.values){
                if(tag.values[property]){
                    obj.values.push(property);
                    isUsed = true;
                }
            }
            if(isUsed){
                data.push(obj);
            }
        }
        return data;
    }

}








