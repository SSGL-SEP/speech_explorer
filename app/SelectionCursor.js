'use strict';

var THREE = require("three");

var circle;


module.exports = {

    init: function(initialSize) {
        var radius = initialSize;
        circle = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({color: 0xFF0000}));

        for (var i = 0; i <= 360; i++) {
            var angle = Math.PI / 180 * i;
            var x = (radius) * Math.cos(angle);
            var y = (radius) * Math.sin(angle);
            var z = 0;
            circle.geometry.vertices.push(new THREE.Vector3(x, y, z));
        }
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
    },

    getSize: function() {
        return size;
    },

    getMesh: function() {
        return circle;
    }
};


