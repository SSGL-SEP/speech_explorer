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
        sizes[i] = Data.pointSize;
        enabled[i] = true;
    }

    var vs = "attribute float size;\n" +
        "attribute vec3 customColor;\n" +
        "varying vec3 vColor;\n" +
        "void main() {\n" +
        "	vColor = customColor;\n" +
        "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
        "	gl_PointSize = size ;//* ( 300.0 / length( mvPosition.xyz ) );\n" +
        "	gl_Position = projectionMatrix * mvPosition;\n" +
        "}\n";

    var fs = "uniform vec3 color;\n" +
        "varying vec3 vColor;\n" +
        "void main() {\n" +
        "	gl_FragColor = vec4( color * vColor, 1.0 );\n" +
        "	if ( gl_FragColor.a < ALPHATEST ) discard;\n" +
        "}\n";

    var geometry, material;
    geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.addAttribute('enabled', new THREE.BufferAttribute(enabled, 1));
    material = new THREE.ShaderMaterial({
        uniforms: {
            color: {type: "c", value: new THREE.Color(0xffffff)}
        },
        vertexShader: vs,
        fragmentShader: fs,
        alphaTest: 0.1
    });
    this.cloud = new THREE.Points(geometry, material);

    this.add(this.cloud);

    // ------------------------------------------------------------
    // VARS AND OBJECTS
    // ------------------------------------------------------------

    this.update = function() {
        var attributes = this.getAttributes();
        var total = Data.getTotalPoints();
        var size = Data.pointSize * Data.pointSizeMultiplier;

        var i;
        if (filterIsActive) {
            for (i = 0; i < total; i++) {
                if (filteredPoints.includes(i)) {
                    attributes.size.array[i] = size;
                    attributes.enabled.array[i] = true;
                } else {
                    attributes.size.array[i] = size * 0.4; //magic number \o/
                    attributes.enabled.array[i] = false;
                }
            }
        } else {
            for (i = 0; i < total; i++) {
                attributes.size.array[i] = size;
                attributes.enabled.array[i] = true;
            }
        }
    };

    this.activateFilter = function(points) {
        filteredPoints = points;
        filterIsActive = true;
    };

    this.disableFilter = function() {
        filterIsActive = false;
    };

    this.draw = function() {
        this.cloud.geometry.attributes.position.needsUpdate = true;
        this.cloud.geometry.attributes.size.needsUpdate = true;
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
