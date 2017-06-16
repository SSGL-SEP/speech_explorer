const jsdomify = require('jsdomify').default;
const appDir = require('app-root-path');
const assert = require('assert');
const LocalStorage = require('node-localstorage').LocalStorage;
var FilterOverlay;


describe('FilterOverlay', function() {

    before(function() {
        jsdomify.create('<!DOCTYPE html><html><body><div id="overlay"></div></body></html>');
        FilterOverlay = require(appDir + "/app/FilterOverlay");

        var ConfigMock = {
            findAllDataSetDisplayNames: function() {
                return ["testdata"];
            },
            findDefaultDataSetName: function(){
                return "testdata";
            }
        };
        var filterFunctionMock = function(filter){
            return "filter";
        };

        var dataSetChangeFunctionMock = function(dataset){
            return "dataSetChange";
        };

        global.localStorage = new LocalStorage('mockstorage');
        global.window = document.defaultView;
        global.window.localStorage = global.localStorage;
        var Data = require(appDir + "/app/Data");
        var json = require(appDir + '/test/testdata.json');

        Data.loadData(json);

        FilterOverlay = new FilterOverlay({
            data: Data,
            filterFunction: filterFunctionMock,
            configDAO: ConfigMock,
            changeDataSetFunction: dataSetChangeFunctionMock
        });
    });

    after(function() {
        jsdomify.destroy();
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    var checkAll = function(tf) {
        for (var i = 0; i < FilterOverlay.boolTags.length; i++) {
            var tag = FilterOverlay.boolTags[i];
            for (var property in tag.values) {
                if (tag.values.hasOwnProperty(property)) {
                    assert(tag.values[property] === tf);
                }
            }
        }
    };


    // test cases
    describe('FilterOverlay#boolTags', function() {
        it('all should be set to true after creation', function() {
            checkAll(true);
        });
    });

    describe('FilterOverlay#tags', function() {
        it('should be set after creation', function() {
            assert(FilterOverlay.tags);
        });
    });

    describe('FilterOverlay#gui', function() {
        it('should be created after init', function() {
            assert(FilterOverlay.gui);
        });
    });

    describe('FilterOverlay#selectButton#SelectAll()', function() {
        it('should not be null', function() {
            assert(FilterOverlay.selectButton.SelectAll);
        });
        it('should select all filters', function() {
            FilterOverlay.boolTags[0].values[0] = false;
            FilterOverlay.selectButton.SelectAll();
            checkAll(true);
        });
    });

    describe('FilterOverlay#clearAllButton#ClearAll()', function() {
        it('should set all filters to false', function() {
            FilterOverlay.boolTags[0].values[0] = true;
            FilterOverlay.clearAllButton.ClearAll();
            checkAll(false);
        });
    });
    describe('FilterOverlay#selectButton#SelectAll()', function() {
        it('should set all filters to true', function() {
            FilterOverlay.boolTags[0].values[0] = false;
            FilterOverlay.selectButton.SelectAll();
            checkAll(true);
        });
    });

});
