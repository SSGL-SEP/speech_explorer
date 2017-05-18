var THREE = require("three");
var BoilerPlate = require("./Boilerplate");
var PointMap = require("./PointMap");


var Visualizer = module.exports = function (x) {
    var scope = this;
    BoilerPlate.call(this);
    this.name = "Visualizer";
    this.renderer = null;
	this.raycaster;
	var mouse;
	this.INTERSECTED;
	this.intersects;
	this.pointMap;

    this.init = function () {
        this.createEnvironment();
        this.createMap();
        this.addEventListeners();
        this.animate();
    };

    this.createEnvironment = function () {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setClearColor(0x0F0F0F);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        this.context = document.getElementById('visualizer');
        this.context.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera.position.z = 20;
        // this.scene.add(this.camera);

       // this.camera = new THREE.OrthographicCamera(
       //     window.innerWidth / - 2,
       //     window.innerWidth / 2,
       //     window.innerHeight / 2,
       //     window.innerHeight / - 2,
       //     -2000, 2000);
        this.camera = new THREE.OrthographicCamera(
           0,
           window.innerWidth,
           0,
           window.innerHeight,
           1,
           2000);

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 20;
        this.scene.add(this.camera);

       // this.base = new THREE.Object3D();
       // this.scene.add(this.base);

        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // this.cube = new THREE.Mesh(geometry, material);
        // this.scene.add(this.cube);

        // var geometry, material;
        // geometry = new THREE.BufferGeometry();


    };

    this.createMap = function(){
        this.pointMap = new PointMap();
        this.scene.add(this.pointMap);
    };
    
    this.addEventListeners = function() {
        this.raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    };

    this.onDocumentMouseMove = function(event) {
		event.preventDefault();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	};
	
	this.render = function() {
		var geometry = this.pointMap.cloud.geometry;
		var attributes = geometry.attributes;

		//this.raycaster.setFromCamera(this.mouse, this.camera);
		
		//this.intersects = this.raycaster.intersectObject(this.pointMap);	


		this.renderer.render(this.scene, this.camera);
	};

    this.animate = function() {
        requestAnimationFrame(function() {
            scope.animate();
        });

        // this.cube.rotation.x += 0.1;
        // this.cube.rotation.y += 0.1;
		this.render();
    }
};
Visualizer.prototype = new BoilerPlate();
Visualizer.prototype.constructor = Visualizer;
