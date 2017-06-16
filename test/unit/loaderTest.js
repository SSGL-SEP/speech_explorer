var appDir = require('app-root-path');
var assert = require('assert');
var chai = require("chai");
var sinon = require("sinon");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var Loader;

describe('Loader', function() {

    before(function() {
        Loader = require(appDir + "/app/Data");
        // var json = require(appDir + "/test/testdata.json");
        // var Config = require(appDir + "/app/ConfigDAO");
        // var config = new Config({dataSets:[{dataSet:"phoneme", audioSrc: "phonemes"}]});
        // Data.setConfig(config);
        // Data.loadData(json);


    });

    after(function() {

    });

    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);

    });

    afterEach(function() {
        this.xhr.restore();
    });


    describe('#loadJSON()', function() {
        it('should return a json', function() {
            var data = { foo: 'bar' };
            var dataJson = JSON.stringify(data);

            var result = Loader.loadJSON("foo");

            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);

            return expect(result).to.eventually.deep.equal(data);
        });
    });

    // describe('#getUrl()', function() {
    //     it('should be audio/phonemes/mv_0693_001_k_0_0.wav with parameter 1', function() {
    //         console.log(Data.getUrl(1));
    //         assert(Data.getUrl(1) === "audio/phonemes/mv_0693_001_k_0_0.wav");
    //     });
    // });
});