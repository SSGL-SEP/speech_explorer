'use strict';

var Promise = require('es6-promise').Promise;

var sounds = [];

function extractBuffer(src, offset, length) {
    var dstU8 = new Uint8Array(length);
    var srcU8 = new Uint8Array(src, offset, length);
    dstU8.set(srcU8);
    return dstU8;
}

function processConcatenatedFile(data) {
    var bb = new DataView(data);
    var offset = 0;
    var soundIndex = 0;

    while (offset < bb.byteLength) {
        var length = bb.getUint32(offset, true);
        offset += 4;
        var sound = extractBuffer(data, offset, length);
        offset += length;
        // createSoundWithBuffer(sound.buffer, soundIndex, callback);
        sounds[soundIndex] = sound.buffer;
        soundIndex++;
    }
    console.log('audio loaded!');
    return sounds;
}

/**
 * Promisified XHR request with onProgress callback to monitor loading progress
 *
 * @param url
 * @param responseType
 * @param onProgress
 * @returns {Promise}
 */
function load(url, responseType, onProgress) {
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = responseType;
        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Load unsuccessful: ' + request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error('There was a network error.'));
        };
        request.onprogress = function(e) {
            onProgress(e.loaded * 100 / e.total);
        };
        request.send();
    });
}

module.exports = {
    loadSounds: function(filename) {
        sounds = [];

        return load(filename, 'arraybuffer', console.log)
            .then(processConcatenatedFile)
            .catch(function(err) {
                console.log(err.message);
            });
    },

    loadJSON: function(url) {
        return load(url, 'json', console.log);
    }
};