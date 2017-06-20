'use strict';
var Data = require("./Data");
var Events = require("./Events");
var PointCloud = require("./PointCloud");
var Filter = require("./Filter");
var THREE = require("three");
var InfoOverlay = require("./InfoOverlay");
var AudioPlayer = require("./AudioPlayer");
var SelectionCursor = require("./SelectionCursor");
var DEFAULT_POINTSIZE = 2;

var Visualizer = module.exports = function() {
    var scope = this;
    this.name = "Visualizer";

    this.base = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.pointCloud = null;
    this.context = null;
    this.IS_DRAGGING = 1;
    this.IS_ZOOMING = 2;
    this.touchState = this.IS_DRAGGING;
    this.resizeTimer = null;
    this.pointSize = 2;
    this.cloudSize2D = 1.5;
    this.mode = 0;
    this.enabled = false;
    // ---------------------

    this.activePoint = null;
    this.lastClickedPoint = null;
    var raycaster;
    var mouse;
    var attributes;

    this.init = function() {
        this.createEnvironment();
        Events = new Events(this);
        Events.createDraggers();

        InfoOverlay.setAction('download', function() {
            Events.downloadSound();
        });

        InfoOverlay.setAction('downloadAll', function() {
            Events.downloadSounds(Array.from(Filter.getSelected()));
        });

        InfoOverlay.setAction('playAll', function() {
            var selected = Array.from(Filter.getSelected());
            AudioPlayer.playSounds(selected);
        });

        InfoOverlay.setAction('deselectAll', function() {
            Filter.clearSelected();
            InfoOverlay.resetAndHideSelected();
            scope.pointCloud.update();
        });

        InfoOverlay.setAction('play', function() {
            var pointIndex = scope.lastClickedPoint;
            if (pointIndex !== null) {
                AudioPlayer.playSound(pointIndex);
            }
        });

        InfoOverlay.setAction('stop', function() {
            AudioPlayer.stop();
        });

        InfoOverlay.setAction('deselect', function() {
            Filter.deselectPointByIndex(scope.lastClickedPoint);
            scope.pointCloud.update();
            if (Filter.getSelectedCount() !== 0) {
                InfoOverlay.updateSelected(Filter.getSelectedCount());
            }
        });

        this.createListeners();
        // this.reset();
        this.animate();
    };

    this.reset = function() {
        this.IS_DRAGGING = 1;
        this.IS_ZOOMING = 2;
        this.touchState = this.IS_DRAGGING;
        this.resizeTimer = null;
        this.pointSize = DEFAULT_POINTSIZE;
        this.cloudSize2D = 1.5;
        this.createCloud();
        this.resetZoomAndPan();
        InfoOverlay.init('active', 'info', 'infoPanels', 'selected', Data.getTags());
        Filter.init(this.pointCloud.getAttributes().enabled.array);
        updateActiveCountDisplay();
        this.update(true);
        this.mode = 0;
        this.enabled = false;
        attributes = this.pointCloud.getAttributes();
    };

    this.createEnvironment = function() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setClearColor(0x0F0F0F);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        this.context = document.getElementById('visualizer');
        this.context.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        var near = -2000;
        var far = 2000;

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            near, far);
        this.scene.add(this.camera);

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;
        SelectionCursor.init(8);
        this.scene.add(SelectionCursor.getMesh());
        this.base = new THREE.Object3D();
        this.scene.add(this.base);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(999999, 999999);


    };

    this.createCloud = function() {
        if (!this.zoomer) {
            this.zoomer = new THREE.Object3D();
            this.base.add(this.zoomer);
            this.panner = new THREE.Object3D();
            this.zoomer.add(this.panner);
        }

        if (this.pointCloud) {
            this.pointCloud.removeCloud();
            this.panner.remove(this.pointCloud);
            this.pointCloud = null;
        }

        this.pointCloud = new PointCloud(this.pointSize);
        this.panner.add(this.pointCloud);
    };

    this.resetZoomAndPan = function() {
        var scalarWidth = window.innerWidth / 1000;
        var scalarHeight = window.innerHeight / 1000;
        var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;
        resetScale *= 1.65;

        this.cloudSize2D = resetScale;
        scope.zoomer.scale.set(resetScale, resetScale, resetScale);

        // Set panner position to match data between coordinates 0 - 800
        scope.panner.position.x = -200;
        scope.panner.position.y = -300;
    };

    this.createListeners = function() {
        var scope = this;
        Events.createInfoBoxListener(InfoOverlay);

        window.addEventListener("resize", Events.resize);

        this.context.addEventListener("mousewheel", Events.onWheel.bind(scope), false);
        this.context.addEventListener("DOMMouseScroll", Events.onWheel.bind(scope), false);

        this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove);

        var keyPress = function(e) {
            if (e.keyCode === 68) {
                Events.downloadSound();
            } else if (e.keyCode === 83) {
                if (scope.mode !== 1) {
                    scope.mode = 1;
                } else {
                    scope.mode = 0;
                }
            } else if (e.keyCode === 82) {
                if (scope.mode !== 2) {
                    scope.mode = 2;
                } else {
                    scope.mode = 0;
                }
            }
            SelectionCursor.changeMode(scope.mode);
        };
        window.addEventListener('keyup', keyPress);
    };

    this.setFilter = function(params) {
        if (params.clearAll) {
            Filter.clearAll();
        } else if (params.selectAll) {
            Filter.selectAll();
        } else if (params.addPoints) {
            Filter.activatePoints(params.tagName, params.tagValue);
        } else {
            Filter.deactivatePoints(params.tagName, params.tagValue);
        }
        updateActiveCountDisplay();

        // changing filter settings clears manually selected points
        InfoOverlay.resetAndHideSelected();
        scope.update(true);
    };

    this.enableInteraction = function() {
        scope.enabled = true;
    };

    this.disableInteraction = function() {
        scope.enabled = false;
    };

    this.onActivePointChanged = function(newActivePoint) {
        InfoOverlay.updateInfo(newActivePoint);
        AudioPlayer.playSound(newActivePoint);
    };

    this.update = function(refreshPointCloud) {
        if (refreshPointCloud) {
            this.pointSize = Math.max(DEFAULT_POINTSIZE, this.cloudSize2D);
            this.pointCloud.setPointSize(this.pointSize);
            this.pointCloud.update();
        }
        if (this.enabled) {
            // attributes = this.pointCloud.getAttributes();
            var intersectingPoints = getIntersectingPoints(8);
            if (intersectingPoints.length > 0) {
                this.updateSelections(intersectingPoints);

                if (this.activePoint !== intersectingPoints[0].index) {
                    attributes.customSize.array[this.activePoint] = 0;
                    // Reset z-position back to 0
                    attributes.position.array[this.activePoint * 3 + 2] = 0;
                    this.activePoint = intersectingPoints[0].index;
                    attributes.customSize.array[this.activePoint] = this.pointSize + 10;
                    attributes.customSize.needsUpdate = true;
                    // Move activepoint towards a camera so that overlapping
                    // points don't clip through.
                    attributes.position.array[this.activePoint * 3 + 2] = 1;
                    attributes.position.needsUpdate = true;
                    this.onActivePointChanged(this.activePoint);
                }
            } else if (this.activePoint !== null) {
                attributes.customSize.array[this.activePoint] = 0;
                attributes.position.array[this.activePoint * 3 + 2] = 1;
                attributes.customSize.needsUpdate = true;
                this.activePoint = null;
                InfoOverlay.hideInfo();//hides infodiv with sound information
            }
        }
        this.draw();
    };

    this.draw = function() {
        this.renderer.render(this.scene, this.camera);
    };

    this.updateSelections = function(intersectingPoints) {
        var changed = false;
        if (this.mode === 1) {
            changed = Filter.selectPoints(intersectingPoints);
        }
        if (this.mode === 2) {
            changed = Filter.deselectPoints(intersectingPoints);
        }

        if (changed) {
            this.update(true);
            var selectedAmount = Filter.getSelectedCount();
            if (selectedAmount === 0) {
                InfoOverlay.resetAndHideSelected();
            } else {
                InfoOverlay.updateSelected(Filter.getSelectedCount());
            }
        }
    };

    var getIntersectingPoints = function(radius) {
        var attributes = scope.pointCloud.getAttributes();
        raycaster.setFromCamera(mouse, scope.camera);
        raycaster.params.Points.threshold = radius;
        var intersects = raycaster.intersectObject(scope.pointCloud, true);

        // remove disabled points
        intersects = intersects.filter(function(point) {
            return attributes.enabled.array[point.index];
        });

        // Sort intersected objects by 'distance to ray' because default is 'distance'
        // which is distance from the camera.
        intersects.sort(function(a, b) {
            return parseFloat(a.distanceToRay) - parseFloat(b.distanceToRay);
        });

        return intersects;
    };

    var updateActiveCountDisplay = function() {
        InfoOverlay.updateActive(Data.getTotalPoints(), Filter.getActiveCount());
    };


    this.animate = function() {
        this.update();

        requestAnimationFrame(function() {
            scope.animate();
        });
    };

    // ------------------------------------------------------------
    // EVENTS
    // ------------------------------------------------------------
    this.onDocumentMouseMove = function(event) {
        event.preventDefault();
        SelectionCursor.update(event);
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
    };

};