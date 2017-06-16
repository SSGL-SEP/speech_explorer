'use strict';

var THREE = require("three");

var mouseMesh;
var size;
var borderWidth = 2;


var changeSize = function() {
    // mouseMesh.geometry.parameters.outerRadius = size;
    // mouseMesh.geometry.parameters.innerRadius = size - borderWidth;

    // console.log(mouseMesh.geometry);

    mouseMesh.scale.set(size, size, 0);

};

module.exports = {

    init: function(initialSize) {
        size = initialSize;
        var mouseGeometry = new THREE.RingGeometry(size - borderWidth, initialSize, 64);
        var mouseMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });
        mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
        mouseMesh.visible = false;
    },

    update: function(event) {
        mouseMesh.position.set(event.clientX + window.innerWidth / -2, -event.clientY - window.innerHeight / -2, 10);
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

    setScale: function(scale) {
        mouseMesh.scale.set(scale, scale, 1);
    },

    getSize: function() {
        return size;
    },

    getMesh: function() {
        return mouseMesh;
    }
};


