'use strict';

var THREE = require("three");

var mouseMesh;
var size;

var iiiii = function() {

};


module.exports = {

    init: function(initialSize) {
        size = initialSize;
        var mouseGeometry = new THREE.RingGeometry(13, 15, 64);
        var mouseMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });
        mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
        mouseMesh.visible = false;
    },

    update: function(event) {
        mouseMesh.position.set(event.clientX + window.innerWidth / -2, -event.clientY - window.innerHeight / -2, 6);
    },

    changeMode: function(mode) {
        if (mode === 0) {
            mouseMesh.visible = false;
        } else if (mode === 1) {
            mouseMesh.material.color.setHex(0x00FF00);
        } else if (mode === 2) {
            mouseMesh.material.color.setHex(0xFF0000);
        }
        if (mode !== 0) {
            mouseMesh.visible = true;
        }
    },

    changeSize: function(newSize) {
        size = newSize;
    },


    getSize: function() {
        return size;
    },

    getMesh: function() {
        return mouseMesh;
    }
};


