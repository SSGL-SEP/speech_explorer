var Data = require("./Data");
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
    var needsRefresh = true;
   	var infotext;

    this.init = function() {
        this.createEnvironment();
        this.createCloud();
        this.createDraggers();
        this.createListeners();
        //this.infotext = document.getElementById('info');        
        // this.createZoomElements();
        // this.createInfo();
        this.animate();
        showActive();

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


        this.context.addEventListener("mousewheel", onWheel.bind(scope), false);
        this.context.addEventListener("DOMMouseScroll", onWheel.bind(scope), false);

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
            scope.onBgDown(event);

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

    var onWheel = function (event) {
        var delta = (!event.deltaY) ? event.detail : event.deltaY;
        // var controller = document.getElementById("controller");
        var scalarWidth = window.innerWidth/1000;
        var scalarHeight = window.innerHeight/1000;
        var resetScale = (scalarWidth<scalarHeight) ? scalarWidth : scalarHeight;

        if(scope.isScrollDisabled) {
            return true;
        }

        if(delta>0) {
            Data.cloudSize2D/=1.05;
            Data.cloudSize2D = (Data.cloudSize2D<resetScale) ? resetScale : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            scope.zoomer.scale.set(scalar,scalar,scalar);
            // scope.updateDraggers();
        } else {
            Data.cloudSize2D*=1.05;
            Data.cloudSize2D = (Data.cloudSize2D>20) ? 20 : Data.cloudSize2D;
            scalar = Data.cloudSize2D;
            scope.zoomer.scale.set(scalar,scalar,scalar);
            // scope.updateDraggers();
        }
        Data.pointSize = Math.max(2, Data.cloudSize2D);
        scope.update(true);
        needsRefresh = true;
    };

    this.createListeners = function() {
        window.addEventListener("resize", function (event) {
            scope.resize(event);
        });
    };

    this.setFilter = function(activeTags) {
        Filter.setFilter(activeTags);

        if(Filter.isActive()) {
            Data.pointSizeMultiplier = 1.5;
            scope.pointCloud.filter(true, Filter.getActivePoints());
        } else {
            Data.pointSizeMultiplier = 1;
            scope.pointCloud.filter(false);
        }
        needsRefresh = true;
        showActive();
    };

    this.update = function() {
        if(needsRefresh) {
            this.pointCloud.getAttributes().size.needsUpdate = true;
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
            infotext.style.visibility = 'hidden';//hides infodiv with sound information
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
	};

    var showActive = function () {
        active = document.getElementById('active');
        var activeAmount = "";
        if (Filter.isActive() === false) {
            activeAmount = Data.getTotalPoints();
        } else {
            activeAmount = Filter.getActivePoints().length;
        }
        active.innerHTML =  activeAmount + '/' + Data.getTotalPoints() + ' active';
        active.style.visibility = 'visible';
    };

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



    this.onBgDown = function (event) {
        var x = (event.clientX-window.innerWidth*0.5) / scope.zoomer.scale.x;
        var y = (-event.clientY+window.innerHeight*0.5) / scope.zoomer.scale.y;
        // console.log("onBgDown triggered");
        var anchorOffset = new THREE.Vector2( x, y );
        var draggerStart = new THREE.Vector2(scope.panner.position.x,scope.panner.position.y);

        var onTouchMove = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onMove(event);
        };

        var onMove = function(event) {
            // console.log("onMove triggered");
            if(	scope.touchState === scope.IS_ZOOMING) {
                return;
            }

            scope.panner.position.x = event.clientX-window.innerWidth*0.5;
            scope.panner.position.y = -event.clientY+window.innerHeight*0.5;
            scope.panner.position.x/=scope.zoomer.scale.x;
            scope.panner.position.y/=scope.zoomer.scale.y;
            scope.panner.position.x -= anchorOffset.x;
            scope.panner.position.y -= anchorOffset.y;
            scope.panner.position.x += draggerStart.x;
            scope.panner.position.y += draggerStart.y;
            // scope.updateDraggers();
            event.preventDefault();
        };

        var onTouchUp = function(event) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
            onUp(event);
        };

        var onUp = function(event) {
            // console.log("onUp triggered");
            scope.context.removeEventListener('mousemove', onMove, false);
            scope.context.removeEventListener('mouseup', onUp, false);
            scope.context.removeEventListener('mouseupoutside', onUp, false);

            scope.context.removeEventListener('touchmove', onTouchMove, false);
            scope.context.removeEventListener('touchend', onTouchUp, false);
            scope.context.removeEventListener('touchcancel', onTouchUp, false);
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

