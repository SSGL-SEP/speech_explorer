var appDir = require('app-root-path');
var dat = require('../lib/dat/build/dat.gui.min.js');


var FilterOverlay = module.exports = function (data, filterFunction) {
    var scope = this;
    this.boolTags = [];
    this.tags = data.getTags();
    this.gui = new dat.GUI();
    this.filterFunction = filterFunction;

    this.Init = function() {
        this.createBoolArray(this.tags);
        this.createGUI();
    };

    this.createBoolArray = function() {
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
    };

    this.createGUI = function() {
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.gui.addFolder(tag.key);
            Object.keys(tag.values).forEach(function(key, index) {
                var controller = folder.add(tag.values, key);
                controller.listen()
                    .onChange(
                        function() {
                            scope.filterFunction(scope.createFilterData());
                        }
                    );
                if(data.getTagColor(key)){
                    controller.borderColor(data.getTagColor(key).getHexString())
                    .borderWidth(10);
                    
                }
                scope.gui.remember(tag.values);
                

            });
        }
        var filter = this.filterButton;
        var clear = this.clearAllButton;
        this.gui.add(clear, 'ClearAll');
        this.gui.add(filter, 'Filter');
        var doc = document.getElementById('overlay');
        doc.appendChild(this.gui.domElement);
    };

    this.filterButton = {
        Filter: function() {
            scope.filterFunction(scope.createFilterData());
        }
    };


    this.clearAllButton = {
        ClearAll: function() {
            for (var i = 0; i < scope.boolTags.length; i++) {
                var tag = scope.boolTags[i];
                Object.keys(tag.values).forEach(function(key, index) {
                    tag.values[key] = false;
                });
            }
            scope.update();
            scope.filterFunction(null);
        }
    };

    this.createFilterData = function() {
        var data = [];
        for (var i = 0; i < this.boolTags.length; i++) {
            var isUsed = false;
            var tag = this.boolTags[i];
            var obj = {
                key: this.boolTags[i].key,
                values: []
            };
            Object.keys(tag.values).forEach(function(key, index) {
                if (tag.values[key]) {
                    obj.values.push(key);
                    isUsed = true;
                }
            });
            if (isUsed) {
                data.push(obj);
            }
        }
        if (data.length === 0) {
            // nothing selected -> filter off
            return null;
        }
        return data;
    };

    this.update = function() {
        for (var i = 0; i < Object.keys(scope.gui.__folders).length; i++) {
            var key = Object.keys(scope.gui.__folders)[i];
            for (var j = 0; j < scope.gui.__folders[key].__controllers.length; j++) {
                scope.gui.__folders[key].__controllers[j].updateDisplay();
            }
        }
    };

    this.Init();
};
