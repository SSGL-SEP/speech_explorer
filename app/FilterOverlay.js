'use strict';
var dat = require('../lib/dat/build/dat.gui.min.js');


module.exports = function(params) {
    var scope = this;
    var data = params.data;
    this.boolTags = [];
    this.tags = data.getTags();


    this.dataset = { Dataset: [], ColorBy: [] };
    this.selectedDataSet = null;
    this.filterFolder = null;
    this.datasetFolder = null;
    this.Config = params.configDAO;
    this.filterFunction = params.filterFunction;
    this.changeDataSetFunction = params.changeDataSetFunction;
    this.gui = null;
    this.datasetController = null;
    this.colorController = null;

    this.init = function(selectedDataSet) {
        this.createBoolArray(this.tags);
        this.createDatasets();
        this.createGUI(selectedDataSet);
        this.initFilter();
        //this.update();

        window.onbeforeunload = function() {
            localStorage.clear();
        };
    };

    this.reset = function() {
        scope.tags = data.getTags();
        scope.boolTags = [];
        scope.dataset = {Dataset: []};
        var overlay = document.getElementById('overlay');
        this.selectedDataSet = null;
        overlay.innerHTML = '';
        this.datasetController = null;
        this.colorController = null;
        this.filterFolder = null;
        this.datasetFolder = null;
        this.gui = null;
    };


    this.createBoolArray = function() {
        var folders = Object.keys(this.tags).sort();
        for (var i = 0; i < folders.length; i++) {
            if (this.tags[folders[i]].__filterable) {
                var boolObj = {
                    key: folders[i],
                    values: {}
                };
                var keys = Object.keys(this.tags[folders[i]]).sort();
                for (var j = 0; j < keys.length; j++) {
                    if (!keys[j].startsWith("__")) {
                        boolObj.values[keys[j]] = true;
                    }
                }
                this.boolTags.push(boolObj);
            }

        }
    };

    this.createDatasets = function() {
        this.dataset.Dataset = this.Config.findAllDataSetDisplayNames();
        var arr = [];
        var keys = Object.keys(this.tags).sort();
        for (var i = 0; i<keys.length; i++) {
            arr.push(keys[i]);
        }
        this.dataset.ColorBy = arr;
    };

    this.createGUI = function(selectedDataSet) {
        //always use localstorage;
        localStorage.setItem(document.location.href + '.isLocal', true);
        this.selectedDataSet = selectedDataSet;
        this.gui = new dat.GUI({ width: 265 });

        this.datasetFolder = this.gui.addFolder("Dataset");
        this.gui.__folders.Dataset.open();
        var controller = this.datasetFolder.add(this.dataset, 'Dataset', this.dataset.Dataset).onChange(function(set) {
            if (scope.Config.findAudioSource(set).toString() !== scope.Config.findAudioSource(scope.selectedDataSet).toString()) {
                localStorage.clear();
                scope.newSet = true;
            } else {
                scope.newSet = false;
            }
            scope.changeDataSetFunction(set, null);
        });

        var colorController = this.datasetFolder.add(this.dataset, 'ColorBy', this.dataset.ColorBy).onChange(function(colorBy) {
            scope.changeDataSetFunction(scope.selectedDataSet, colorBy);
        });

        var opts = controller.domElement.getElementsByTagName('select')[0];
        opts.value = this.selectedDataSet;

        opts = colorController.domElement.getElementsByTagName('select')[0];
        opts.value = data.getColorBy();

        this.datasetController = controller;
        this.colorController = colorController;

        var createItem = function(key, parent) {
            //important: first remember, then add!
            scope.gui.remember(tag.values);
            var controller = folder.add(tag.values, key).borderColor("blue").borderWidth(3);

            controller.listen().borderColor("blue")
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
            if (parent === opts.value && data.getTagColor(key)) {
                controller.borderColor(data.getTagColor(key))
                    .borderWidth(10);
            }

        };

        var folders = [];
        var colorByFolder = null;

        this.filterFolder = this.gui.addFolder("Filter");
        var i;
        for (i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.filterFolder.addFolder(tag.key);
            if(tag.key === opts.value) {
                colorByFolder = folder;
            }
            folders.push(folder);
            var keys = Object.keys(tag.values);
            for (var j = 0; j < keys.length; j++) {
                createItem(keys[j], tag.key);
            }
        }

        // Create buttons for selecting and deselecting all checkboxes is a folder
        for (i = 0; i < folders.length; i++) {
            (function(folder) {

                var title = folder.domElement.firstChild.firstChild;
                var checkbox_on = document.createElement('span');
                var checkbox_off = document.createElement('span');
                checkbox_on.className = "check-icon select-folder";
                checkbox_off.className = "check-icon deselect-folder";

                function setValueToChildren(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var childCheckboxes = folder.__controllers;
                    for (var i = 0; i < childCheckboxes.length; i++) {
                        childCheckboxes[i].setValue(event.target === checkbox_on);
                    }
                }

                checkbox_off.addEventListener('click', setValueToChildren);
                checkbox_on.addEventListener('click', setValueToChildren);
                title.appendChild(checkbox_on);
                title.appendChild(checkbox_off);

            }(folders[i]));
        }
        this.gui.__folders.Filter.open();
        var select = this.selectButton;
        var clear = this.clearAllButton;
        this.filterFolder.add(clear, 'ClearAll');
        this.filterFolder.add(select, 'SelectAll');
        var element = document.getElementById('overlay');
        element.appendChild(this.gui.domElement);
        if(colorByFolder !== null) {
            colorByFolder.open();
        }
    };

    var updateAll = function(isActive) {
        for (var i = 0; i < scope.boolTags.length; i++) {
            var tag = scope.boolTags[i];

            var tagValues = Object.keys(tag.values);
            for (var j = 0; j < tagValues.length; j++) {
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
        for (var i = 0; i < Object.keys(scope.filterFolder.__folders).length; i++) {
            var key = Object.keys(scope.filterFolder.__folders)[i];
            for (var j = 0; j < scope.filterFolder.__folders[key].__controllers.length; j++) {
                scope.filterFolder.__folders[key].__controllers[j].updateDisplay();
            }
        }

    };

    this.initFilter = function() {
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var keys = Object.keys(tag.values);
            for (var j = 0; j < keys.length; j++) {
                scope.filterFunction({
                    tagName: tag.key,
                    tagValue: keys[j],
                    addPoints: tag.values[keys[j]]
                });
            }

        }
    };

};
