const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const ConfigDAO = require(appDir + '/app/ConfigDAO');
const configJson = require(appDir + "/test/testconfig.json");
var config;

describe('The ConfigDAO', function() {
    before(function() {
        config = new ConfigDAO(configJson);
    });

    describe('#findDataSet()', function() {
        it('should return dataset object when called with valid argument', function() {
            var res = config.findDataSet("phonemes_mfcc - tsne, 50");
            expect(res).to.deep.equal(configJson.dataSets[0]);
        });
        it('should return null when called with invalid argument', function() {
            var res = config.findDataSet("not found");
            expect(res).to.be.null;
        });
    });

    describe('#findAllDataSetDisplayNames()', function() {
        it('should return displaynames of all datasets in config file', function() {
            var res = config.findAllDataSetDisplayNames();
            expect(res).to.deep.equal(["phonemes_mfcc - tsne, 50", "phonemes_mfcc - tsne, 200"]);
        });
    });

    describe('#findDefaultDataSetName()', function() {
        it('should return default dataset name', function() {
            var res = config.findDefaultDataSetName();
            expect(res).to.deep.equal("phonemes_mfcc - tsne, 50");
        });
    });
});