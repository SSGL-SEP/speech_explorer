'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports = {

    loadJSON: function(url) {
        return fetch(url)
            .then(function(res) {
                return res.json();
            });
    }
};