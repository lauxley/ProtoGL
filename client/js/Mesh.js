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

	/* camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 4000 );
	   */

	this.renderer = new THREE.CanvasRenderer();
	this.renderer.setSize( window.innerWidth, window.innerHeight );

	// create a point light
	var pointLight = new THREE.AmbientLight( 0xFFFFFF );

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	this.scene.addLight(pointLight); 

	$("body").append(this.renderer.domElement);
    }


    this.removePlayerParticle = function(particle)
    {
       this.scene.removeObject(particle);
    }

    this.makeParticle = function(playerInfo) 
    {
	var meshes = { "list" : [] };

	var _randColor = function() {
	    return Math.floor(Math.random()*16777215);
	}
	
	var bodyMaterial = new THREE.MeshLambertMaterial({ color: _randColor() });

	var body = new THREE.Mesh(new THREE.CylinderGeometry(10, 10 ,5, 3), bodyMaterial);
	//body.rotation.x = 45;
	body.id = playerInfo['id'];
	body.position.x = playerInfo['x'];
	body.position.y = playerInfo['y'];
	body.position.z = 50;
	body.scale.x = body.scale.y = 10;
	
	var bordGauche = new THREE.Mesh( new THREE.CubeGeometry( 50, 1220, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
	var bordDroit =  new THREE.Mesh( new THREE.CubeGeometry( 50, 1220, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
	var bordHaut =  new THREE.Mesh( new THREE.CubeGeometry( 1800, 50, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
	var bordBas =  new THREE.Mesh( new THREE.CubeGeometry( 1800, 50, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
	bordGauche.position = new THREE.Vector3(-900, 0, 50);
	bordDroit.position = new THREE.Vector3(900,0,50);
	bordHaut.position = new THREE.Vector3(0,580,50); 
	bordBas.position =  new THREE.Vector3(0,-580,50);
	this.scene.addObject(bordGauche);
	this.scene.addObject(bordDroit);
	this.scene.addObject(bordHaut);
	this.scene.addObject(bordBas);
	
	
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordGauche ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordHaut ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordBas ) );
	THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordDroit ) );
	
	this.scene.addObject(body);
	return body;

    };

    this.particleRender = function ( context ) 
    {
	context.beginPath();
	context.arc( 0, 0, 1, 0, Math.PI * 2, true );
	context.fill();
    };
	
	this.detectCollision = function(particle)
	{
		var rayDroit = new THREE.Ray( particle.position, new THREE.Vector3( 50, 0, 0 ) );
		var rayGauche = new THREE.Ray( particle.position, new THREE.Vector3( -50, 0, 0 ) );
		var rayBas = new THREE.Ray( particle.position, new THREE.Vector3( 0, -50, 0 ) );
		var rayHaut = new THREE.Ray( particle.position, new THREE.Vector3( 0, 50, 0 ) );
		var collisionGauche = THREE.Collisions.rayCastNearest( rayGauche );
		var collisionDroit = THREE.Collisions.rayCastNearest( rayDroit );
		var collisionHaut = THREE.Collisions.rayCastNearest( rayHaut );
		var collisionBas = THREE.Collisions.rayCastNearest( rayBas );
		
		if (collisionGauche && collisionGauche.distance < 30)
			return 1;
		if (collisionDroit && collisionDroit.distance < 30)
			return 2;
		if (collisionHaut && collisionHaut.distance < 30)
			return 3;
		if (collisionBas && collisionBas.distance < 30)
			return 4;
		return false;
	};

}