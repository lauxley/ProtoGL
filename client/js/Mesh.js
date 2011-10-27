// the main three.js components

function Scene() {
    this.camera = null;
    this.scene = null;
    this.renderer = null;

    this.init = function()
    {
	// Camera params :
	// field of view, aspect ratio for render output, near and far clipping plane.
	this.camera = new THREE.Camera(80, window.innerWidth / window.innerHeight, 1, 4000 );

	// move the camera backwards so we can see stuff!
	// default position is 0,0,0.
	this.camera.position.z = 1000;

	this.scene = new THREE.Scene();


	this.renderer = new THREE.CanvasRenderer();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	$("body").append(this.renderer.domElement);
    }

    this.makeParticle = function(playerInfo) 
    {
	material = new THREE.ParticleCanvasMaterial( { color: 0xffffff, program: this.particleRender } );
	particle = new THREE.Particle(material);

	particle.id = playerInfo['id'];
	particle.position.x = playerInfo['x'];
	particle.position.y = playerInfo['y'];
	particle.position.z = 50;
	particle.scale.x = particle.scale.y = 10;

	this.scene.addObject(particle);
	return particle;
    };

    this.particleRender = function ( context ) 
    {
	context.beginPath();
	context.arc( 0, 0, 1, 0, Math.PI * 2, true );
	context.fill();
    };
}