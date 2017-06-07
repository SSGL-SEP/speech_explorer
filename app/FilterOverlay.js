'use strict';

var dat = require('../lib/dat/build/dat.gui.min.js');

var FilterOverlay = module.exports = function (data, filterFunction) {
    var scope = this;
    this.boolTags = [];
    this.tags = data.getTags();
    this.gui = new dat.GUI({ width: 265 });
    this.filterFunction = filterFunction;

    this.Init = function () {
        this.createBoolArray(this.tags);
        this.createGUI();
        filterFunction(scope.createFilterData());
    };

    this.createBoolArray = function () {
        //1 because filenames are at zero
        for (var folder in this.tags) {
            if (this.tags[folder].__filterable) {
                var boolObj = {
                    key: folder,
                    values: {}
                };

                for (var tag in this.tags[folder]) {
                    if (!tag.startsWith("__")) {
                        boolObj.values[tag] = true;
                    }

                }
                this.boolTags.push(boolObj);

            }

        }
    };

    this.createGUI = function () {
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.gui.addFolder(tag.key);
            Object.keys(tag.values).forEach(function (key, index) {
                var controller = folder.add(tag.values, key);
                controller.listen()
                    .onChange(
                    function () {
                        scope.filterFunction(scope.createFilterData());
                    }
                    );
                if (data.getTagColor(key)) {
                    controller.borderColor(data.getTagColor(key))
                        .borderWidth(10);
                }
                scope.gui.remember(tag.values);

            });
        }
        var select = this.selectButton;
        var clear = this.clearAllButton;
        this.gui.add(clear, 'ClearAll');
        this.gui.add(select, 'SelectAll');
        var doc = document.getElementById('overlay');
        doc.appendChild(this.gui.domElement);
    };

    var updateAll = function (isActive) {
        for (var i = 0; i < scope.boolTags.length; i++) {
            var tag = scope.boolTags[i];
            Object.keys(tag.values).forEach(function (key, index) {
                tag.values[key] = isActive;
            });
        }
        scope.update();
        scope.filterFunction(scope.createFilterData());
    };

    this.selectButton = {
        SelectAll: function () {
            updateAll(true);
        }
    };


    this.clearAllButton = {
        ClearAll: function () {
            updateAll(false);
        }
    };

    this.createFilterData = function () {
        var data = [];
        for (var i = 0; i < this.boolTags.length; i++) {
            var isUsed = false;
            var tag = this.boolTags[i];
            var obj = {
                key: this.boolTags[i].key,
                values: []
            };
            Object.keys(tag.values).forEach(function (key, index) {
                if (!tag.values[key]) {
                    obj.values.push(key);
                    isUsed = true;
                }
            });
            if (isUsed) {
                data.push(obj);
            }
        }
        return data;
    };

    this.update = function () {
        for (var i = 0; i < Object.keys(scope.gui.__folders).length; i++) {
            var key = Object.keys(scope.gui.__folders)[i];
            for (var j = 0; j < scope.gui.__folders[key].__controllers.length; j++) {
                scope.gui.__folders[key].__controllers[j].updateDisplay();
            }
        }
    };

    this.Init();
};
