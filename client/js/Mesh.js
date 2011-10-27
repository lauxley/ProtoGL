// the main three.js components
var camera, scene, renderer;

function initScene()
{
		// Camera params :
	// field of view, aspect ratio for render output, near and far clipping plane.
	camera = new THREE.Camera(80, window.innerWidth / window.innerHeight, 1, 4000 );

	// move the camera backwards so we can see stuff!
	// default position is 0,0,0.
	camera.position.z = 1000;

	scene = new THREE.Scene();


	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );
}

function makeParticle(playerInfo) 
{
	material = new THREE.ParticleCanvasMaterial( { color: 0xffffff, program: particleRender } );
	particle = new THREE.Particle(material);

	particle.id = playerInfo['id'];
	particle.position.x = playerInfo['x'];
	particle.position.y = playerInfo['y'];
	particle.position.z = 50;
	particle.scale.x = particle.scale.y = 10;

	scene.addObject(particle);
	return particle;
}

function particleRender( context ) 
{
	context.beginPath();
	context.arc( 0, 0, 1, 0, Math.PI * 2, true );
	context.fill();
};