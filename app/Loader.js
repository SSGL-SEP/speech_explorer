'use strict';

var Promise = require('es6-promise').Promise;
var log = require('./Log');

var sounds = [];
var lastUsed = "";

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
    log('audio loaded!');
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
            if(typeof onProgress === 'function') {
                onProgress(e.loaded * 100 / e.total);
            }
        };
        request.send();
    });
}

module.exports = {
    loadSounds: function(filename) {
        if (filename === lastUsed) {
            return new Promise(function(resolve, reject) {
                resolve(sounds);
            });
        } else {
            sounds = [];
            lastUsed = filename;
            return load(filename, 'arraybuffer', log)
                .then(processConcatenatedFile)
                .catch(function(err) {
                    log(err.message);
                    return [];
                });
        }
    },

    loadJSON: function(url) {
        return load(url, 'json', log);
    }
};