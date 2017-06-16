'use strict';

var Data = require("./Data");
var THREE = require("three");

var mouseMesh;

var iiiii = function() {

};


module.exports = {

    init: function(size) {

        var mouseGeometry = new THREE.SphereGeometry(1, 0, 0);
        var mouseMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff
        });
        mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
        mouseMesh.position.z = 1;
        mouseMesh.position.x = 100;
        mouseMesh.position.y = 100;
        return mouseMesh;
    },

    update: function(mouse) {
        mouseMesh.position.copy(mouse.x, mouse.y, 1);
    },

    changeMode: function(mode) {
        if (mode === 0) {
            console.log("hide");
        } else if (mode === 1) {
            console.log("mode1");
        } else if (mode === 2) {
            console.log("mode2");
        }
    }
};


