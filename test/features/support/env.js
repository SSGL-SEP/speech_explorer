const {defineSupportCode} = require('cucumber');

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(30 * 1000);
});