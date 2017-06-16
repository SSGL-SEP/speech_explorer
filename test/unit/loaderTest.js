const appDir = require('app-root-path');
const assert = require('assert');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const Loader = require(appDir + "/app/Loader");
chai.use(chaiAsPromised);

describe('Loader', function() {

    before(function() {
        this.server = sinon.fakeServer.create();
    });

    after(function() {
        this.server.restore();
    });

    beforeEach(function() {

    });

    afterEach(function() {

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
});