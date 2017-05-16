var THREE = require("three");
var BoilerPlate = require("./Boilerplate");

var Visualizer = module.exports = function(x) {
    var scope = this;
    BoilerPlate.call(this);
    this.name = "Visualizer";
    this.renderer = null;

    this.init = function() {
        this.createEnvironment();
    };
    
    this.createEnvironment = function() {
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setClearColor( 0x0F0F0F );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        this.context = document.getElementById('visualizer');
        this.context.appendChild(this.renderer.domElement); 
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( 
            window.innerWidth / - 2, 
            window.innerWidth / 2, 
            window.innerHeight / 2, 
            window.innerHeight / - 2, 
            -2000, 2000 );

        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;
        this.scene.add(this.camera);

        this.base = new THREE.Object3D();
        this.scene.add(this.base);
    };
};
Visualizer.prototype = new BoilerPlate();
Visualizer.prototype.constructor = Visualizer;
