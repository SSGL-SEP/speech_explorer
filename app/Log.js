'use strict';

var DEBUG = false;

module.exports = function(msg) {
    if (DEBUG) {
        console.log(msg);
    }
};