const appDir = require('app-root-path');
const assert = require('assert');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const Loader = require(appDir + "/app/Loader");
// const testBlob = require(appDir + "/test/testblob.blob");
chai.use(chaiAsPromised);

describe('Loader', function() {

    before(function() {
        this.server = sinon.fakeServer.create();
    });

    after(function() {
        this.server.restore();
    });

    // beforeEach(function() {
    //
    // });
    //
    // afterEach(function() {
    //
    // });


    describe('#loadJSON()', function() {
        it('should return a json', function() {
            var data = { foo: 'bar' };
            this.server.respondWith("GET", "config.json",
                [200, { "Content-Type": "application/json" }, JSON.stringify(data)]
            );

            var result = Loader.loadJSON("config.json");

            this.server.respond();

            expect(result).to.eventually.deep.equal(data);
        });
    });

    describe('#loadSounds()', function() {
        it('should return an array when dataset is not same', function() {
            var data = 'appDir + "/test/testblob.blob';
            this.server.respondWith("GET", "/testblob.blob",
                [200, { "Content-Type": "application/octet-stream" }, data]
            );

            var result = Loader.loadSounds("/testblob.blob");

            this.server.respond();

            expect(result).to.eventually.be.an('array');
        });
        it('should return same array when dataset was not changed', function() {
            var data = 'appDir + "/test/testblob.blob';
            this.server.respondWith("GET", "/testblob.blob",
                [200, { "Content-Type": "application/octet-stream" }, data]
            );
            
            var firstResult = Loader.loadSounds("/testblob.blob");

            this.server.respond();

            this.server.respondWith("GET", "/testblob.blob",
                [200, { "Content-Type": "application/octet-stream" }, data]
            );

            var secondResult = Loader.loadSounds("/testblob.blob");

            this.server.respond();

            expect(firstResult).to.eventually.deep.equal(secondResult);
        });
    });
});