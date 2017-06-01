var appDir = require('app-root-path');
var assert = require('assert');
var _ = require("underscore");

var Data, Filter;

describe('Filter', function () {

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


    describe('Filter returns correct data', function () {
        it('Filtered samples without phonem e should be 7', function () {

            var filterParam = [{
                key: "phonem",
                values: ['e']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 7);
        });
        it('Filtered samples without non existing phonem v should be 10', function () {

            var filterParam = [{
                key: "phonem",
                values: ['v']
            }];


            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 10);
        });
        it('Filtered samples with only phonem i active should have indexes 0 and 2', function () {
            var filterParam = [{
                key: "phonem",
                values: ['a','e','h','l','n']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 2);
            assert(_.contains(Filter.getActivePoints(), 2));
            assert(_.contains(Filter.getActivePoints(), 0));
        });
        it('When parameter is invalid, activePoints is empty', function () {
            Filter.setFilter(1);
            assert(Filter.getActivePoints.length === 0);
        });
    });
});
