'use strict';

var dat = require('../lib/dat/build/dat.gui.min.js');


var FilterOverlay = module.exports = function (data, filterFunction) {
    var scope = this;
    this.boolTags = [];
    this.tags = data.getTags();

    //this.datasetGui = new dat.GUI();
    this.dataset = { Dataset: [] };
    this.filterFolder;
    this.datasetFolder;


    this.filterFunction = filterFunction;

    this.Init = function () {
        this.createBoolArray(this.tags);
        this.createGUI();
        filterFunction(scope.createFilterData());
    };


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
    };

    this.changeDataset = function (dataset) {
        var json = require('../data/' + dataset);
        data.loadData(json);
        scope.tags = data.getTags();
        this.boolTags = [];
        var doc = document.getElementById('overlay');
        doc.parentNode.removeChild(doc);
        document.body.innerHTML += '<div id="overlay"></div>';
        console.log(doc);
        scope.Init();
        console.log(dataset);
    }

    this.createGUI = function () {
        this.gui = new dat.GUI({ width: 265 });
        this.datasetFolder = this.gui.addFolder("Dataset");
        this.datasetFolder.add(this.dataset, 'Dataset', ['2D_newformat_full.json', 'nsynth_small.json']).onChange(function (set) {
            scope.changeDataset(set);
        });
        //this.datasetFolder.add(this.soundmap,'Soundmap',['soundmap1','soundmap2','soundmap3']);
        this.filterFolder = this.gui.addFolder("Filter");
        for (var i = 0; i < this.boolTags.length; i++) {
            var tag = this.boolTags[i];
            var folder = this.filterFolder.addFolder(tag.key);
            Object.keys(tag.values).forEach(function (key, index) {
                var controller = folder.add(tag.values, key);
                controller.listen()
                    .onChange(
                    function () {
                        scope.filterFunction(scope.createFilterData());
                    }
                    );
                if (data.getTagColor(key)) {
                    controller.borderColor(data.getTagColor(key).getHexString())
                        .borderWidth(10);
                }
                scope.gui.remember(tag.values);

            });
        }
        var select = this.selectButton;
        var clear = this.clearAllButton;
        this.filterFolder.add(clear, 'ClearAll');
        this.filterFolder.add(select, 'SelectAll');
        var doc = document.getElementById('overlay');
        //doc.appendChild(this.datasetGui.domElement);
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
