const appDir = require('app-root-path');
const assert = require('assert');
const expect = require('chai').expect;
const sinon = require('sinon');
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
            expect(res).to.equal("phonemes_mfcc - tsne, 50");
        });
    });

    describe('#findAudioSource()', function() {
        it('should return audio source of dataset', function() {
            var res = config.findAudioSource("phonemes_mfcc - tsne, 50");
            expect(res).to.equal("phonemes");
        });
    });
    
    describe('#getAudioSrc()', function() {
        it('should return audio source of dataset with valid argument', function() {
            var res = config.getAudioSrc("phonemes");
            expect(res).to.equal("phonemes");
        });
        it('should return empty stringwith invalid argument', function() {
            var res = config.getAudioSrc("asdf");
            expect(res).to.equal("");
        });
    });

    describe('#loadDefaultDataSetJSON', function() {
        before(function() {
            this.server = sinon.fakeServer.create();
        });

        after(function() {
            this.server.restore();
        });

        it('should return a promise that returns a parsed json object ', function(done) {
            this.server.respondWith([200, { "Content-Type": "application/json" },
                    '[{ "id": 12, "comment": "Hey there" }]']);

            config.loadDefaultDataSetJSON().then(function(json) {
                expect(json).to.deep.equal([{ "id": 12, "comment": "Hey there" }]);
                done();
            });
            this.server.respond();
        });
    });
});