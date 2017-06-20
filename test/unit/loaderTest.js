const appDir = require('app-root-path');
const assert = require('assert');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const Loader = require(appDir + "/app/Loader");
const fs = require('fs');
const testArray = [new ArrayBuffer(1), new ArrayBuffer(2)];
var testBlob;
chai.use(chaiAsPromised);

describe('Loader', function() {

    before(function() {
        this.server = sinon.fakeServer.create();
        testBlob = '\1\0\0\0\1\2\0\0\0\1\1';
    });

    after(function() {
        this.server.restore();
    });

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
            this.server.respondWith("GET", "/testblob.blob",
                [200, { "Content-Type": "application/ascii" }, testBlob]
            );

            var tets = [new ArrayBuffer(1), new ArrayBuffer(2)];
            var result = Loader.loadSounds("/testblob.blob");

            this.server.respond();

            expect(result).to.eventually.become(testArray);
        });
        it('should return same array without making new request when dataset was not changed', function() {
            this.server.respondWith("GET", "/testblob.blob",
                [200, { "Content-Type": "application/octet-stream" }, testBlob]
            );

            var firstResult = Loader.loadSounds("/testblob.blob");

            this.server.respond();

            var secondResult = Loader.loadSounds("/testblob.blob");

            expect(firstResult).to.eventually.deep.equal(secondResult);
        });
        it('should return empty array on code 404', function() {
            this.server.respondWith("GET", "/foo.bar", [404, {}, "Nan"]);
            var res = Loader.loadSounds("/foo.bar");
            this.server.respond();
            expect(res).to.eventually.deep.equal([]);
        });
    });
});