'use strict';

var THREE = require("three");
var Data = require("./Data");

var PointCloud = module.exports = function() {
    THREE.Object3D.call(this);

    this.cloud = null;

    var total = Data.getTotalPoints();
    var positions = new Float32Array(total * 3);
    var colors = new Float32Array(total * 3);
    var sizes = new Float32Array(total);
    var enabled = new Float32Array(total);

    var vertex;
    var color = new THREE.Color();
    var position;
    var filterIsActive = false;
    var filteredPoints = [];

    for (var i = 0; i < total; i++) {
        position = Data.getPoint(i);
        vertex = new THREE.Vector3(position.x, position.y, 0);
        vertex.toArray(positions, i * 3);

        color = Data.getColor(i);
        color.toArray(colors, i * 3);
        sizes[i] = -1;
        enabled[i] = 1; // shader does not take in booleans -> using 0 & 1 as truthiness
    }

    var vs = "attribute float customSize;\n" +
        "attribute float enabled;\n" +
        "attribute vec3 customColor;\n" +
        "uniform float pointsize;\n" +
        "varying vec3 vColor;\n" +
        "void main() {\n" +
        "   vColor = customColor;\n" +
        "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
        "   if(enabled > 0.5) {" +
        "       gl_PointSize = pointsize;" +
        "   } else {" +
        "       gl_PointSize = pointsize * 0.2;" +
        "   }" +
        "   if(customSize > 0.0) {" + // mouseover etc.
        "      gl_PointSize = customSize;" +
        "   }" +
        "   gl_Position = projectionMatrix * mvPosition;\n" +
        "}\n";

    var fs = "uniform vec3 color;\n" +
        "varying vec3 vColor;\n" +
        "void main() {\n" +
        "   gl_FragColor = vec4( color * vColor, 1.0 );\n" +
        "   if ( gl_FragColor.a < ALPHATEST ) discard;\n" +
        "}\n";

    var geometry, material;
    geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('customSize', new THREE.BufferAttribute(sizes, 1));
    geometry.addAttribute('enabled', new THREE.BufferAttribute(enabled, 1));
    
    material = new THREE.ShaderMaterial({
        uniforms: {
            color: {type: "c", value: new THREE.Color(0xffffff)},
            pointsize: {value: Data.pointSize}
        },
        vertexShader: vs,
        fragmentShader: fs,
        alphaTest: 0.1
    });
    this.cloud = new THREE.Points(geometry, material);

    this.add(this.cloud);

    this.update = function() {
        material.uniforms.pointsize.value = Data.pointSize;
    };

    this.activateFilter = function(points) {
        var attributes = this.getAttributes();
        filteredPoints = points;
        filterIsActive = true;

        for (i = 0; i < filteredPoints.length; i++) {
            attributes.enabled.array[i] = filteredPoints[i];
        }
    };

    this.disableFilter = function() {
        filterIsActive = false;
    };

    this.draw = function() {
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