'use strict';
var dat = require('../lib/dat/build/dat.gui.min.js');


module.exports = function(params) {
    var scope = this;
    var data = params.data;
    this.boolTags = [];
    this.tags = data.getTags();

    this.dataset = {Dataset: []};
    this.filterFolder = null;
    this.datasetFolder = null;
    this.Config = params.configDAO;
    this.filterFunction = params.filterFunction;
    this.changeDataSetFunction = params.changeDataSetFunction;

    this.Init = function() {
        this.createBoolArray(this.tags);
        this.createDatasets();
        this.createGUI();
        this.filterFunction({
            selectAll: true
        });
    };

    this.reset = function() {
        scope.tags = data.getTags();
        scope.boolTags = [];
        scope.dataset = {Dataset: []};
        var overlay = document.getElementById('overlay');
        overlay.innerHTML = '';
    };


    this.createBoolArray = function() {
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

    this.createDatasets = function() {
        this.dataset.Dataset = this.Config.findAllDataSetNames();
    };

    this.createGUI = function() {
        this.gui = new dat.GUI({width: 265});
        this.datasetFolder = this.gui.addFolder("Dataset");
        this.datasetFolder.add(this.dataset, 'Dataset', this.dataset.Dataset).onChange(function(set) {
            scope.changeDataSetFunction(set);
        });

        var createItem = function(key) {
            var controller = folder.add(tag.values, key);
            controller.listen()
                .onChange(
                    (function(tagKey) {
                        return function(boxIsChecked) {
                            scope.filterFunction({
                                tagName: tagKey,
                                tagValue: this.property,
                                addPoints: boxIsChecked
                            });
                        };
                    })(tag.key)
                );
            if (data.getTagColor(key)) {
                controller.borderColor(data.getTagColor(key))
                    .borderWidth(10);
            }
            scope.gui.remember(tag.values);
        };

        this.filterFolder = this.gui.addFolder("Filter");
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.filterFolder.addFolder(tag.key);
            var keys = Object.keys(tag.values);
            for(var j = 0; j < keys.length; j++){
                createItem(keys[j]);
            }
        }

        var select = this.selectButton;
        var clear = this.clearAllButton;
        this.filterFolder.add(clear, 'ClearAll');
        this.filterFolder.add(select, 'SelectAll');
        var element = document.getElementById('overlay');
        element.appendChild(this.gui.domElement);

    };

    var updateAll = function(isActive) {
        for (var i = 0; i < scope.boolTags.length; i++) {
            var tag = scope.boolTags[i];
            
            var tagValues = Object.keys(tag.values);
            for(var j = 0; j < tagValues.length; j++) {
                tag.values[tagValues[j]] = isActive;
            }
        }
        scope.update();

        if (isActive) {
            scope.filterFunction({
                selectAll: true
            });
        } else {
            scope.filterFunction({
                clearAll: true
            });
        }
    };

    this.selectButton = {
        SelectAll: function() {
            updateAll(true);
        }
    };


    this.clearAllButton = {
        ClearAll: function() {
            updateAll(false);
        }
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
