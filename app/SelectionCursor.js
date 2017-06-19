'use strict';

var THREE = require("three");

var circle;
var size;
var radius;


module.exports = {

    init: function(initialSize) {
        size = initialSize;
        var mouseGeometry = new THREE.CircleGeometry(size, 128);
        var mouseMaterial = new THREE.LineBasicMaterial({
            color: 0xFF0000
        });
        mouseGeometry.vertices.shift();
        circle = new THREE.Line(mouseGeometry, mouseMaterial);
        circle.autoClose = true;
        circle.position.set(10000, 10000);
        circle.visible = false;
    },

    update: function(event) {
        circle.position.set(event.clientX + window.innerWidth / -2, -event.clientY - window.innerHeight / -2, 10);
    },

    changeMode: function(mode) {
        if (mode === 0) {
            circle.visible = false;
        } else if (mode === 1) {
            circle.material.color.setHex(0x00FF00);
        } else if (mode === 2) {
            circle.material.color.setHex(0xFF0000);
        }
        if (mode !== 0) {
            circle.visible = true;
        }
    },

    setScale: function(scale) {
        circle.scale.set(scale, scale, 1);
        circle.geometry.parameters.innerRadius = radius * scale;
    },

    getSize: function() {
        return size;
    },

    getMesh: function() {
        return circle;
    }
};


