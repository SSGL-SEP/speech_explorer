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
        it('Filtered samples with phonem e should be 3', function () {

            var filterParam = [{
                key: "phonem",
                values: ['e']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 3);
        });
        it('Filtered samples with phonem v should be 0', function () {

            var filterParam = [{
                key: "phonem",
                values: ['v']
            }];


            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 0);
        });
        it('Filtered samples with phonem h should have indexes 0 and 3', function () {
            var filterParam = [{
                key: "phonem",
                values: ['h']
            }];

            Filter.setFilter(filterParam);

            assert(Filter.getActivePoints().length === 2);
            assert(_.contains(Filter.getActivePoints(), 3));
            assert(_.contains(Filter.getActivePoints(), 0));
        });
        it('When parameter is invalid, activePoints is empty and isActive is false', function () {
            Filter.setFilter(1)
            assert(Filter.getActivePoints.length === 0);
            assert(Filter.isActive() === false);
        });
    });
});
