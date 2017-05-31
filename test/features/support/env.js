const {defineSupportCode} = require('cucumber');

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(10 * 1000);
});