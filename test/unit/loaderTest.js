var appDir = require('app-root-path');
var assert = require('assert');
var chai = require("chai");
var sinon = require("sinon");
var FormData = require("form-data");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var Loader;

describe('Loader', function() {

    before(function() {
        Loader = require(appDir + "/app/Loader");
        // var json = require(appDir + "/test/testdata.json");
        // var Config = require(appDir + "/app/ConfigDAO");
        // var config = new Config({dataSets:[{dataSet:"phoneme", audioSrc: "phonemes"}]});
        // Data.setConfig(config);
        // Data.loadData(json);

        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);


    });

    after(function() {
        this.xhr.restore();
    });

    beforeEach(function() {


    });

    afterEach(function() {

    });


    describe('#loadJSON()', function() {
        it('should return a json', function() {
            var data = { foo: 'bar' };
            // var dataJson = JSON.stringify(data);
            var dataJson = "{ foo: 'bar' }";

            var result = Loader.loadJSON("http://localhost:3000/config.json");

            assert(1, this.requests.length);

            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
            
            return result.then(function(resp) {
                expect(resp).to.equal(data);
            });
            // return expect(result).to.eventually.deep.equal(data);
        });
    });

    // describe('#getUrl()', function() {
    //     it('should be audio/phonemes/mv_0693_001_k_0_0.wav with parameter 1', function() {
    //         console.log(Data.getUrl(1));
    //         assert(Data.getUrl(1) === "audio/phonemes/mv_0693_001_k_0_0.wav");
    //     });
    // });
});