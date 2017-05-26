var Data = require("./Data");
var Events = require("./Events");
var PointCloud = require("./PointCloud");
var Filter = require("./Filter");
var THREE = require("three");

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
    this.isScrollDisabled = false;
    // ---------------------
    var activePoint = null;
    var raycaster;
    var mouse;
    var soundBuffer;
    var audioLoader;
    this.needsRefresh = true;
   	var infotext;
	var hide; // hiding the div that displays phoneme
	var hideInfoDivAfter = 3000; //msec
	var hideInfoDiv = function (currPoint) {
		if (currPoint !== activePoint) {
			infotext.style.visibility = 'hidden';
		}
	}


    this.init = function() {
        this.createEnvironment();
        this.createCloud();
        this.createDraggers();
        this.createListeners();
        Events.init(this);
        //this.infotext = document.getElementById('info');        
        // this.createZoomElements();
        // this.createInfo();
        this.animate();

    };

    this.createEnvironment = function() {
        // this.info = document.getElementById('info');
        // this.info.classList.add("show");
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setClearColor( 0x0F0F0F );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        this.context = document.getElementById('visualizer');
        this.context.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        var near = -2000;
        var far = 2000;

        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / - 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / - 2,
            near, far );

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;

        var audioListener = new THREE.AudioListener();

        this.camera.add( audioListener );
        soundBuffer = new THREE.Audio( audioListener );
        audioLoader = new THREE.AudioLoader();
        this.scene.add( soundBuffer );

        this.scene.add(this.camera);

        this.base = new THREE.Object3D();
        this.scene.add(this.base);


        this.context.addEventListener("mousewheel", Events.onWheel.bind(scope), false);
        this.context.addEventListener("DOMMouseScroll", Events.onWheel.bind(scope), false);

        document.addEventListener('mousemove', this.onDocumentMouseMove, false);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
    };

    this.createCloud = function() {
        if(!this.zoomer) {
            this.zoomer = new THREE.Object3D();
            this.base.add( this.zoomer );
            this.panner = new THREE.Object3D();
            this.zoomer.add( this.panner );

            var scalarWidth = window.innerWidth/1000;
            var scalarHeight = window.innerHeight/1000;
            var resetScale = (scalarWidth<scalarHeight) ? scalarWidth : scalarHeight;
            resetScale *= 1.65;
            Data.cloudSize2D = resetScale;
            scope.zoomer.scale.set(resetScale,resetScale,resetScale);

            // Set panner position to match data between coordinates 0 - 800
            scope.panner.position.x = -200;
            scope.panner.position.y = -300;

            // Rotate panner so that camera is facing the right side
            // scope.panner.rotateOnAxis(new THREE.Vector3(-1,0,0), THREE.Math.degToRad(90));

        }

        if(this.pointCloud) {
            this.pointCloud.removeCloud();
            this.panner.remove(this.pointCloud);
            this.pointCloud = null;
        }

        this.pointCloud = new PointCloud();
        this.panner.add( this.pointCloud );
        // scope.pointCloud.rotateOnAxis(new THREE.Vector3(1,0,0), THREE.Math.degToRad(90));
        this.update();

    };

    this.createDraggers = function() {
        var onDragStarted = function(event) {
            // console.log("onDragStarted triggered (createDraggers)");
            Event.onBgDown(event);

            scope.pointCloud.update();
            //scope.pointCloud.draw();
        };

        var onPinchStarted = function(event) {
            var startScale = scope.zoomer.scale.x;

            var dx = event.touches[ 0 ].clientX - event.touches[ 1 ].clientX;
            var dy = event.touches[ 0 ].clientY - event.touches[ 1 ].clientY;
            var touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

            var onPinchMoved = function(event) {

                var dx = event.touches[ 0 ].clientX - event.touches[ 1 ].clientX;
                var dy = event.touches[ 0 ].clientY - event.touches[ 1 ].clientY;
                var touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );
                var size = startScale + (touchZoomDistanceEnd - touchZoomDistanceStart)*0.025;

                var scalarWidth = window.innerWidth/1000;
                var scalarHeight = (window.innerHeight-controller.clientHeight)/1000;
                var resetScale = (scalarWidth<scalarHeight) ? scalarWidth : scalarHeight;

                size = (size>6) ? 6 : size;
                size = (size<resetScale) ? resetScale : size;

                scope.zoomer.scale.set(size,size,size);
                scope.updateDraggers();
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
        var mouse = new THREE.Vector2(100000,100000);

        this.context.addEventListener('mousedown', onDragStarted, false);

        var onTouchStarted = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            // HACK - Need a better solution instead of using state changes;
            // SEE - this.onBgDown() onMove()
            switch ( event.touches.length ) {
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



    this.createListeners = function() {
        window.addEventListener("resize", function (event) {
            scope.resize(event);
        });
    };

    this.setFilter = function(activeTags) {
        Filter.setFilter(activeTags);
        var activePoints = Filter.getActivePoints();
        scope.pointCloud.filteredPoints = activePoints;

        if(Filter.isActive()) {
            Data.pointSizeMultiplier = 1.5;
        } else {
            Data.pointSizeMultiplier = 1;
        }
        this.needsRefresh = true;
        scope.update();
    };

    this.update = function() {
        if(this.needsRefresh) {
            this.pointCloud.getAttributes().size.needsUpdate = true;
            this.pointCloud.draw();
            this.pointCloud.update();
            this.needsRefresh = false;
        }
        this.draw();
    };

    this.draw = function() {
        var attributes = this.pointCloud.getAttributes();
        var size = Data.pointSize * Data.pointSizeMultiplier;
        var intersectingPoints = getIntersectingPoints(8);

        if (intersectingPoints.length > 0) {

            if (activePoint !== intersectingPoints[0].index) {
                attributes.size.array[activePoint] = size;
                // Reset z-position back to 0
                attributes.position.array[activePoint * 3 + 2] = 0;
                activePoint = intersectingPoints[0].index;
                attributes.size.array[activePoint] = size + 10;
                // Move activepoint towards a camera so that overlapping
                // points don't clip through.
                attributes.position.array[activePoint * 3 + 2] = 1;
                attributes.position.needsUpdate = true;
                attributes.size.needsUpdate = true;
				showInfo(activePoint);
                playSound(Data.getUrl(activePoint)); // TODO: move to a better location
            }
        } else if (activePoint !== null){
            attributes.size.array[activePoint] = size;
            attributes.position.array[activePoint * 3 + 2] = 1;
            attributes.size.needsUpdate = true;
            activePoint = null;
            hideInfoDiv(0); //hides infodiv with sound information
        }

        this.renderer.render( this.scene, this.camera );
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

    var showInfo = function (activePoint) {
    	var currPoint = activePoint;
        var point = Data.getPoint(activePoint);
        infotext = document.getElementById('info');
        infotext.innerHTML = point.meta[0].values + '<br />';
		for (var i = 1; i < point.meta.length; i++) {
            infotext.innerHTML += point.meta[i].key + ': ' + point.meta[i].values + '<br />';
		}
		infotext.style.visibility = 'visible';
		window.clearTimeout(hide);
		hide = window.setTimeout(hideInfoDiv(currPoint), hideInfoDivAfter);
	}

    var playSound = function(path) {
        audioLoader.load(
            // resource URL
            path,
            // Function when resource is loaded
            function ( buffer ) {
                // set the audio object buffer to the loaded object
                soundBuffer.setBuffer( buffer );

                // play the audio
                soundBuffer.play();
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'Download failed' );
            }
        );
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
        mouse.x = ( event.offsetX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
        // console.log(mouse.x,mouse.y);
    };





    this.resize = function(event) {

        clearTimeout(scope.resizeTimer);
        scope.resizeTimer = setTimeout(function() {
            scope.camera.left = window.innerWidth / - 2;
            scope.camera.right = window.innerWidth / 2;
            scope.camera.top = window.innerHeight / 2;
            scope.camera.bottom = window.innerHeight / - 2;
            scope.camera.updateProjectionMatrix();
            scope.renderer.setSize( window.innerWidth, window.innerHeight );
            // scope.updateDraggers();
        }, 250);

    };
};

