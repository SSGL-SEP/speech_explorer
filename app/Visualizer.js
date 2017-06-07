'use strict';

var Data = require("./Data");
var PointCloud = require("./PointCloud");
var Filter = require("./Filter");
var THREE = require("three");
var infoOverlay = require("./InfoOverlay");
var audioPlayer = require("./AudioPlayer");

var Visualizer = module.exports = function() {
    var scope = this;
    // BoilerPlate.call(this);
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
    // ---------------------
    var activePoint = null;
    var raycaster;
    var mouse;
    var needsRefresh = true;

    this.init = function() {
        this.createEnvironment();
        this.createCloud();
        this.createDraggers();
        this.createListeners();
        infoOverlay.init(document.getElementById('active'), document.getElementById('info'), document.getElementById('infoPanels'), Data.getTags());
        this.animate();
        showActive();

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

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;

        this.scene.add(this.camera);

        this.base = new THREE.Object3D();
        this.scene.add(this.base);


        this.context.addEventListener("mousewheel", onWheel.bind(scope), false);
        this.context.addEventListener("DOMMouseScroll", onWheel.bind(scope), false);

        document.addEventListener('mousemove', this.onDocumentMouseMove, false);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2(999999, 999999);
    };

    this.createCloud = function() {
        if (!this.zoomer) {
            this.zoomer = new THREE.Object3D();
            this.base.add(this.zoomer);
            this.panner = new THREE.Object3D();
            this.zoomer.add(this.panner);

            var scalarWidth = window.innerWidth / 1000;
            var scalarHeight = window.innerHeight / 1000;
            var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;
            resetScale *= 1.65;
            Data.cloudSize2D = resetScale;
            scope.zoomer.scale.set(resetScale, resetScale, resetScale);

            // Set panner position to match data between coordinates 0 - 800
            scope.panner.position.x = -200;
            scope.panner.position.y = -300;
        }

        if (this.pointCloud) {
            this.pointCloud.removeCloud();
            this.panner.remove(this.pointCloud);
            this.pointCloud = null;
        }

        this.pointCloud = new PointCloud();
        this.panner.add(this.pointCloud);
        this.update();

    };

    this.createDraggers = function() {
        var onDragStarted = function(event) {
            scope.onBgDown(event);
        };


        var onPinchStarted = function(event) {
            var startScale = scope.zoomer.scale.x;

            var dx = event.touches[0].clientX - event.touches[1].clientX;
            var dy = event.touches[0].clientY - event.touches[1].clientY;
            var touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

            var onPinchMoved = function(event) {

                var dx = event.touches[0].clientX - event.touches[1].clientX;
                var dy = event.touches[0].clientY - event.touches[1].clientY;
                var touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
                var size = startScale + (touchZoomDistanceEnd - touchZoomDistanceStart) * 0.025;

                var scalarWidth = window.innerWidth / 1000;
                var scalarHeight = window.innerHeight / 1000;
                var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;

                size = (size > 6) ? 6 : size;
                size = (size < resetScale) ? resetScale : size;

                scope.zoomer.scale.set(size, size, size);
                event.stopPropagation();
                event.preventDefault();
            };

            var onPinchEnded = function(event) {
                scope.context.removeEventListener('touchmove', onPinchMoved, false);
                scope.context.removeEventListener('touchend', onPinchEnded, false);
                scope.context.addEventListener('touchstart', onTouchStarted, false);
            };

            scope.context.addEventListener('touchmove', onPinchMoved, false);
            scope.context.addEventListener('touchend', onPinchEnded, false);

        };
        var mouse = new THREE.Vector2(100000, 100000);

        this.context.addEventListener('mousedown', onDragStarted, false);

        var onTouchStarted = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            // HACK - Need a better solution instead of using state changes;
            // SEE - this.onBgDown() onMove()
            switch (event.touches.length) {
                case 1:
                    scope.touchState = scope.IS_DRAGGING;
                    onDragStarted(event);
                    break;
                case 2:
                    scope.touchState = scope.IS_ZOOMING;
                    scope.context.removeEventListener('mousedown', onDragStarted, false);
                    scope.context.removeEventListener('touchstart', onTouchStarted, false);
                    onPinchStarted(event);
                    break;

                default:
            }
        };

        scope.context.addEventListener('touchstart', onTouchStarted, false);
    };

    var onWheel = function(event) {
        var delta = (!event.deltaY) ? event.detail : event.deltaY;
        var scalarWidth = window.innerWidth / 1000;
        var scalarHeight = window.innerHeight / 1000;
        var resetScale = (scalarWidth < scalarHeight) ? scalarWidth : scalarHeight;
        var scalar;

        if (delta > 0) {
            Data.cloudSize2D /= 1.05;
            Data.cloudSize2D = (Data.cloudSize2D < resetScale) ? resetScale : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            scope.zoomer.scale.set(scalar, scalar, scalar);
        } else {
            Data.cloudSize2D *= 1.05;
            Data.cloudSize2D = (Data.cloudSize2D > 20) ? 20 : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            scope.zoomer.scale.set(scalar, scalar, scalar);
        }
        Data.pointSize = Math.max(2, Data.cloudSize2D);
        scope.update(true);
        needsRefresh = true;
    };

    this.createListeners = function() {
        window.addEventListener("resize", function(event) {
            scope.resize(event);
        });
    };

    this.setFilter = function(activeTags) {
        Filter.setFilter(activeTags);
        scope.pointCloud.activateFilter(Filter.getActivePoints());
        needsRefresh = true;
        showActive();
    };

    this.update = function() {
        if (needsRefresh) {
            // this.pointCloud.getAttributes().size.needsUpdate = true;
            this.pointCloud.draw();
            this.pointCloud.update();
            needsRefresh = false;
        }
        this.draw();
    };

    this.draw = function() {
        var attributes = this.pointCloud.getAttributes();
        var size = Data.pointSize * Data.pointSizeMultiplier;
        var intersectingPoints = getIntersectingPoints(8);

        if (intersectingPoints.length > 0) {

            if (activePoint !== intersectingPoints[0].index) {
                attributes.customSize.array[activePoint] = 0;
                // Reset z-position back to 0
                attributes.position.array[activePoint * 3 + 2] = 0;
                activePoint = intersectingPoints[0].index;
                attributes.customSize.array[activePoint] = size + 10;
                // Move activepoint towards a camera so that overlapping
                // points don't clip through.
                attributes.position.array[activePoint * 3 + 2] = 1;
                attributes.position.needsUpdate = true;
                attributes.customSize.needsUpdate = true;
                infoOverlay.updateInfo(activePoint);
                playSound(Data.getUrl(activePoint)); // TODO: move to a better location
            }
        } else if (activePoint !== null) {
            attributes.customSize.array[activePoint] = 0;
            attributes.position.array[activePoint * 3 + 2] = 1;
            attributes.customSize.needsUpdate = true;
            activePoint = null;
            infoOverlay.hideInfo();//hides infodiv with sound information
        }

        this.renderer.render(this.scene, this.camera);
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

    var showActive = function() {
        infoOverlay.updateActive(Data.getTotalPoints(), Filter.getActivePoints().length);
    };

    var playSound = function(path) {
        audioPlayer.play(path);
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
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
    };


    this.onBgDown = function(event) {
        var x = (event.clientX - window.innerWidth * 0.5) / scope.zoomer.scale.x;
        var y = (-event.clientY + window.innerHeight * 0.5) / scope.zoomer.scale.y;
        var anchorOffset = new THREE.Vector2(x, y);
        var draggerStart = new THREE.Vector2(scope.panner.position.x, scope.panner.position.y);

        var onTouchMove = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onMove(event);
        };

        var onMove = function(event) {
            if (scope.touchState === scope.IS_ZOOMING) {
                return;
            }

            scope.panner.position.x = event.clientX - window.innerWidth * 0.5;
            scope.panner.position.y = -event.clientY + window.innerHeight * 0.5;
            scope.panner.position.x /= scope.zoomer.scale.x;
            scope.panner.position.y /= scope.zoomer.scale.y;
            scope.panner.position.x -= anchorOffset.x;
            scope.panner.position.y -= anchorOffset.y;
            scope.panner.position.x += draggerStart.x;
            scope.panner.position.y += draggerStart.y;
            event.preventDefault();
        };

        var onTouchUp = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onUp(event);
        };

        var onUp = function(event) {
            scope.context.removeEventListener('mousemove', onMove, false);
            scope.context.removeEventListener('mouseup', onUp, false);
            scope.context.removeEventListener('mouseupoutside', onUp, false);

            scope.context.removeEventListener('touchmove', onTouchMove, false);
            scope.context.removeEventListener('touchend', onTouchUp, false);
            scope.context.removeEventListener('touchcancel', onTouchUp, false);
            if (activePoint !== null) {
                infoOverlay.onClickOnPoint(activePoint);
            }
            event.preventDefault();
        };

        this.context.addEventListener('mousemove', onMove, false);
        this.context.addEventListener('mouseup', onUp, false);
        this.context.addEventListener('mouseupoutside', onUp, false);

        scope.context.addEventListener('touchmove', onTouchMove, false);
        scope.context.addEventListener('touchend', onTouchUp, false);
        scope.context.addEventListener('touchcancel', onTouchUp, false);
    };

    this.resize = function(event) {

        clearTimeout(scope.resizeTimer);
        scope.resizeTimer = setTimeout(function() {
            scope.camera.left = window.innerWidth / -2;
            scope.camera.right = window.innerWidth / 2;
            scope.camera.top = window.innerHeight / 2;
            scope.camera.bottom = window.innerHeight / -2;
            scope.camera.updateProjectionMatrix();
            scope.renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);

    };
};

