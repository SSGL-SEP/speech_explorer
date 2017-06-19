'use strict';

var THREE = require("three");
var Data = require("./Data");

var createGeometry = function() {
    var total = Data.getTotalPoints();
    var positions = new Float32Array(total * 3);
    var colors = new Float32Array(total * 3);
    var sizes = new Float32Array(total);
    var enabled = new Float32Array(total);

    var vertex;
    var color = new THREE.Color();
    var position;

    for (var i = 0; i < total; i++) {
        position = Data.getPoint(i);
        vertex = new THREE.Vector3(position.x, position.y, 0);
        vertex.toArray(positions, i * 3);

        color = Data.getColor(i);
        color.toArray(colors, i * 3);
        sizes[i] = -1;
        enabled[i] = 1; // shader does not take in booleans -> using 0 & 1 as truthiness
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('customSize', new THREE.BufferAttribute(sizes, 1));
    geometry.addAttribute('enabled', new THREE.BufferAttribute(enabled, 1));

    return geometry;
};

var createMaterial = function(initialPointSize) {
    var vs = "attribute float customSize;" +
        "attribute float enabled;" +
        "attribute vec3 customColor;" +
        "uniform float pointsize;" +
        "varying vec3 vColor;" +
        "void main() {" +
        "   vColor = customColor;" +
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );" +
        "   if (enabled > 1.5) {" +
        "       gl_PointSize = pointsize * 1.2;" +
        "       vColor = vec3(255,255,255);" +
        "   } else if(enabled > 0.5) {" +
        "       gl_PointSize = pointsize;" +
        "   } else {" +
        "       gl_PointSize = pointsize * 0.2;" +
        "   }" +
        "   if(customSize > 0.0) {" + // mouseover etc.
        "      gl_PointSize = customSize;" +
        "   }" +
        "   gl_Position = projectionMatrix * mvPosition;" +
        "}";

    var fs = "uniform vec3 color;" +
        "varying vec3 vColor;" +
        "void main() {" +
        "   gl_FragColor = vec4( color * vColor, 1.0 );" +
        "   if ( gl_FragColor.a < ALPHATEST ) discard;" +
        "}";

    return new THREE.ShaderMaterial({
        uniforms: {
            color: {type: "c", value: new THREE.Color(0xffffff)},
            pointsize: {value: initialPointSize}
        },
        vertexShader: vs,
        fragmentShader: fs,
        alphaTest: 0.1
    });
};

var PointCloud = module.exports = function(initialPointSize) {
    THREE.Object3D.call(this);

    this.cloud = null;

    var geometry = createGeometry();
    var material = createMaterial(initialPointSize);

    this.cloud = new THREE.Points(geometry, material);

    this.add(this.cloud);

    this.setPointSize = function(newSize) {
        material.uniforms.pointsize.value = newSize;
    };

    this.update = function() {
        this.cloud.geometry.attributes.position.needsUpdate = true;
        this.cloud.geometry.attributes.customSize.needsUpdate = true;
        this.cloud.geometry.attributes.enabled.needsUpdate = true;
    };

    this.removeCloud = function() {
        if (this.cloud) {
            this.remove(this.cloud);
            this.cloud = null;
        }
    };

    this.getAttributes = function() {
        return this.cloud.geometry.attributes;
    };

};

PointCloud.prototype = new THREE.Object3D();
PointCloud.prototype.constructor = PointCloud;