'use strict';

var Data = require("./Data");
var THREE = require("three");

var mouseMesh;

var iiiii = function() {

};


module.exports = {

    init: function(size) {

        var mouseGeometry = new THREE.RingGeometry(14, 15, 64);
        var mouseMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000
        });
        mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);

    },

    update: function(event) {
        mouseMesh.position.set(event.clientX + window.innerWidth / -2, -event.clientY - window.innerHeight / -2, 6);
    },

    changeMode: function(mode) {
        if (mode === 0) {
            console.log("hide");
        } else if (mode === 1) {
            console.log("mode1");
        } else if (mode === 2) {
            console.log("mode2");
        }
    },

    getMesh: function() {
        return mouseMesh;
    }
};


