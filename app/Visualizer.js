var BoilerPlate = require("./Boilerplate");
var Data = require("./Data");
var PointCloud = require("./PointCloud");

var THREE = require("three");

var Visualizer = module.exports = function(x) {
	var scope = this;
	BoilerPlate.call(this);
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
	this.filter = null;
	this.resizeTimer = null;
	this.isScrollDisabled = false;
	// ---------------------
	var activePoint = null;
	var raycaster;
	var mouse;
	var soundBuffer;
	var audioLoader;
	var allPointsNeedRefresh = true;


	this.init = function() {
		this.createEnvironment();
		this.createCloud();
		this.createDraggers();
		this.createListeners();
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


			document.body.addEventListener("mousewheel", onWheel.bind(scope), false);
			document.body.addEventListener("DOMMouseScroll", onWheel.bind(scope), false);

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
				scope.panner.position.x = -300;
				scope.panner.position.y = -200;

			}

			if(this.pointCloud) {
				this.pointCloud.removeCloud();
				this.panner.remove(this.pointCloud);
				this.pointCloud = null;
			}

			this.pointCloud = new PointCloud();
			this.panner.add( this.pointCloud );
			this.update();

		};

		this.createDraggers = function() {
			var onDragStarted = function(event) {
				// console.log("onDragStarted triggered (createDraggers)");
				scope.onBgDown(event);

				scope.pointCloud.update();
				scope.pointCloud.draw();
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

			scope.update(true);
			allPointsNeedRefresh = true;
		};

		this.createListeners = function() {
			window.addEventListener("resize", function (event) {
				scope.resize(event);
			});


		};

		this.update = function(bypass) {
			// if(bypass || !Data.areAllChunksLoaded) {
			this.pointCloud.update();
			this.pointCloud.draw();
			// }
		};

		this.draw = function() {
			this.pointCloud.draw();
			this.camera.lookAt( this.scene.position );
			//----V
			var geometry = this.pointCloud.cloud.geometry;
			var attributes = geometry.attributes;
			var size = Math.max(1.5, Data.cloudSize2D);

			if(allPointsNeedRefresh) {
				attributes.size.array.forEach(function(point, index) {
					attributes.size.array[index] = size
				});
				allPointsNeedRefresh = false;
			}

			raycaster.setFromCamera(mouse, this.camera);
			raycaster.params.Points.threshold = 8;
			var intersects = raycaster.intersectObject(this.pointCloud, true);
			if (intersects.length > 0) {
				//Sort intersected objects by 'distance to ray' because default is 'distance'
				//which is distance from the camera.
				intersects.sort(function(a, b) {
					return parseFloat(a.distanceToRay) - parseFloat(b.distanceToRay);
				});
				if (activePoint !== intersects[0].index) {
					attributes.size.array[activePoint] = size;
					activePoint = intersects[0].index;
					attributes.size.array[activePoint] = size + 10;
					attributes.size.needsUpdate = true;
					// console.log(Data.getUrl(activePoint));
					playSound(Data.getUrl(activePoint));
				}
			} else if (activePoint !== null){
				attributes.size.array[activePoint] = size;
				attributes.size.needsUpdate = true;
				activePoint = null;
			}
			//----^


			this.renderer.render( this.scene, this.camera );
			// console.log("drawing");
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
			this.draw();
			// console.log("animate");

			requestAnimationFrame(function() {
				scope.animate();
			});
		};

		this.setFilter = function(obj) {
			scope.filter = obj;
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

	Visualizer.prototype = new BoilerPlate();
	Visualizer.prototype.constructor = Visualizer;
