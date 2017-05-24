var appDir = require('app-root-path');
var assert = require('assert');
var _ = require("underscore");

var Data, Filter;

describe('hooks', function () {

    before(function () {
        Data = require(appDir + "/app/Data");
        var json = require(appDir + "/test/testdata.json");
        Data.loadData(json);
        Filter = require(appDir + "/app/Filter");
    });

    after(function () {

    });

    beforeEach(function () {

    });

    afterEach(function () {

    });


    describe('Filtered samples with phonem e', function () {
        it('should be 3', function () {

            var filterParam = [{
                key: "phonem",
                values: ['e']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 3);
        });
    });


    describe('Filtered samples with phonem v', function () {
        it('should be 0', function () {

            var filterParam = [{
                key: "phonem",
                values: ['v']
            }];


            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 0);
        });
    });


    describe('Filtered samples with phonem h', function () {
        it('should have indexes 0 and 3', function () {

            var filterParam = [{
                key: "phonem",
                values: ['h']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 2);
            assert(_.contains(Filter.getActivePoints(), 3));
            assert(_.contains(Filter.getActivePoints(), 0));
        });
    });
});
