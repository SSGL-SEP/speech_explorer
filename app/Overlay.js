var dat = require("dat.gui/build/dat.gui.min.js");
var fil = require("./Filter");

var Overlay = module.exports = function (tags) {
    var scope = this;
    this.boolTags = [];
    this.tags = tags;
    this.gui = new dat.GUI();
    this.listeners = [];

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
                boolObj.values[this.tags[i].values[j].value] = false;
            }
            this.boolTags.push(boolObj);

        }
    }

    this.createGUI = function () {


        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.gui.addFolder(tag.key);
            for (var property in tag.values) {
                folder.add(tag.values, property).listen();
            }
        }

        var filter = this.filterButton;
        var clear = this.clearAllButton;
        this.gui.add(clear, 'ClearAll');
        this.gui.add(filter, 'Filter');
        var doc = document.getElementById('overlay');
        doc.appendChild(this.gui.domElement);
    }

    this.filterButton = {
        Filter: function () {
            fil.setFilter(scope.createFilterData());
        } };

    

    this.clearAllButton = {
        ClearAll: function () {
            for (var i = 0; i < scope.boolTags.length; i++) {
                var tag = scope.boolTags[i];
                for (var property in tag.values) {
                    tag.values[property] = false;
                }
            }
            scope.update();
            fil.setFilter(scope.createFilterData());
        }
    }

    this.createFilterData = function () {
        var data = [];
        for (var i = 0; i < this.boolTags.length; i++) {
            var isUsed = false;
            var tag = this.boolTags[i];
            var obj = {
                key: this.boolTags[i].key,
                values: []
            };
            for (var property in tag.values) {
                if (tag.values[property]) {
                    obj.values.push(property);
                    isUsed = true;
                }
            }
            if (isUsed) {
                data.push(obj);
            }
        }
        if (data.length === 0) {
            return this.noFilters();
        }
        return data;
    }

    this.noFilters = function () {
        var data = [];
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var obj = {
                key: this.boolTags[i].key,
                values: []
            };
            for (var property in tag.values) {
                obj.values.push(property);
            }
            data.push(obj);
        }
        return data;
    }

    this.update = function () {
        for (var i = 0; i < Object.keys(scope.gui.__folders).length; i++) {
            var key = Object.keys(scope.gui.__folders)[i];
            for (var j = 0; j < scope.gui.__folders[key].__controllers.length; j++) {
                scope.gui.__folders[key].__controllers[j].updateDisplay();
            }
        }
    }



}
