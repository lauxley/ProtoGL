// the main three.js components

function initScene() {
    var scene = new THREE.Scene();

    // Camera params :
    // field of view, aspect ratio for render output, near and far clipping plane.
    scene.camera = new THREE.Camera(80, window.innerWidth / window.innerHeight, 1, 4000);
    
    // move the camera backwards so we can see stuff!
    // default position is 0,0,0.
    scene.camera.position.z = 1000;

    scene.renderer = new THREE.CanvasRenderer();
    scene.renderer.setSize( window.innerWidth, window.innerHeight );


    //Game field
    var material = new THREE.MeshLambertMaterial({ color: player.color });
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 1 ,5, 30), material);
    

    var bordGauche = new THREE.Mesh( new THREE.CubeGeometry( 50, 1220, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
    var bordDroit =  new THREE.Mesh( new THREE.CubeGeometry( 50, 1220, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
    var bordHaut =  new THREE.Mesh( new THREE.CubeGeometry( 1800, 50, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
    var bordBas =  new THREE.Mesh( new THREE.CubeGeometry( 1800, 50, 10 ), new THREE.MeshLambertMaterial( { color: 0x003300 } ) );
    bordGauche.position = new THREE.Vector3(-900, 0, 50);
    bordDroit.position = new THREE.Vector3(900,0,50);
    bordHaut.position = new THREE.Vector3(0,580,50); 
    bordBas.position =  new THREE.Vector3(0,-580,50);
    scene.addObject(bordGauche);
    scene.addObject(bordDroit);
    scene.addObject(bordHaut);
    scene.addObject(bordBas);
	
    THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordGauche ) );
    THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordHaut ) );
    THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordBas ) );
    THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshOBB( bordDroit ) );
	
    // create a point light
    /*var pointLight = new THREE.AmbientLight( 0xFFFFFF );
    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    // add to the scene
    this.scene.addLight(pointLight); */

    $("body").append(scene.renderer.domElement);
    return scene;
}

/*
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
};*/

var Model = function() {
    /*
      Base class for every moving mesh/particle in the world
    */
    this.animationFrame = null; //the current state of the mesh animation, null if it is not animated
    this.animationKey = null; //depends on the mesh, and the complexity of the animation. meant to be overiden

    this.mesh = null; //contain a THREE.mesh / THREE.particle / THREE.group 

    this.animate = function() { return; } //meant to be overiden
    this.cancelAnimation = function() { return; } //return to the initial state

    //this.init = function() { return; } //constructor, should be overiden, and called 
    this.destroy = function() { game.scene.removeObject(this.mesh); } //destructor, have to be called manually


    this.particleRender = function ( context ) 
    {
	context.beginPath();
	context.arc( 0, 0, 1, 0, Math.PI * 2, true );
	context.fill();
    };

};

var PlayerModel = function(player) 
{
    //TODO : is there a better way to do that in js ???
    this.inheritFrom = Model;
    this.inheritFrom();
    var material = new THREE.MeshLambertMaterial({ color: player.color });
    var mesh = new THREE.Mesh(new THREE.CylinderGeometry(10, 1 ,5, 30), material);
    mesh.matrixAutoUpdate = false;
    mesh.rotation.x = 90*(180/Math.PI);
    mesh.position.x = player.position.x;
    mesh.position.y = player.position.y;
    mesh.position.z = 50;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
    mesh.updateMatrix();

    this.mesh = mesh;
    game.scene.addObject(this.mesh);

    this.updatePositions = function(data) {
	//update the position from datas received by the server, don't call this for the user
	this.mesh.position.x = data.x;
	this.mesh.position.y = data.y;
	this.mesh.rotation.y = data.r;
	this.mesh.updateMatrix();
    };
}

var ShootModel = function(player)
{
    this.inheritFrom = Model;
    this.inheritFrom();
	
	this.animationKey = 250; // fade time
    
    material = new THREE.ParticleCanvasMaterial( { color: 0xff0000, program: this.particleRender } );
    shoot = new THREE.Particle(material);
    shoot.rotation.x = 90*(180/Math.PI);
    shoot.position.x = player.position.x
    shoot.position.y = player.position.y
    shoot.position.z = 50;
    shoot.rotation.y = player.position.r; //set the direction of the shoot where the Player is facing
    //shoot.rotation.x = player.rotation.x;
    //shoot.rotation.y = player.rotation.y;
    shoot.scale.x = shoot.scale.y = 3;
    
    this.mesh = shoot;
    game.scene.addObject(this.mesh);
};
	
var BombModel = function(player,power)
{
    this.inheritFrom = Model;
    this.inheritFrom();
    this.power = power;
    this.animationKey = 150 + this.power * 3; //explosion frame
    var material = new THREE.ParticleCanvasMaterial( { color: 0x00ff00, program: this.particleRender } );
    var particle = new THREE.Particle(material);
    particle.position.x = player.position.x
    particle.position.y = player.position.y
    particle.position.z = 50;
    particle.scale.x = particle.scale.y = 3; // no need for scale.z for the time being, the bomb is flat
    
    this.mesh = particle;
    game.scene.addObject(this.mesh);

    this.animate = function() {
	//make it grow untill explosion
	if (this.animationFrame < this.animationKey) {
	    //TODO: the scale should depend on time, because framerate vary
	    this.mesh.scale.x+=0.5;
	    this.mesh.scale.y+=0.5;
	} else {
	    this.explode();
	    //TODO: to tell the Player instance to destroy the shoot, this is ugly
	    return false;
	}
	this.animationFrame++;
	return true;
    }

    this.explode = function() {
	//do some fancy animation ?
	//this.mesh.materials[0].color = 0xff0000;
	if (this.animationFrame == this.animationKey) {
	    this.destroy();
	}
    }
};
    




/*

  Mesh
  
  new Shoot()
      

      shoot.draw
      shoot.animate
      +extra methods
          -e.g. shoot.destroy
  
*/