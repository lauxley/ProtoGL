// initialisation des particules des joueurs
function players() {
    this.particles = [],
    this.me = null,

    this.makeMe = function(data) 
    {
	this.me = scene.makeParticle(data);
    };

    this.makePlayerParticle = function(data) {
	 if(data)
		this.particles[data.id] = scene.makeParticle(data);
    };

    this.removePlayerParticle = function(id) {
	scene.removePlayerParticle(this.particles[id]);
	delete this.particles[id];
    };

    this.makePlayersParticles = function(data)
    {
	for(var i = 0; i < data.length ; i++)
	{
	    if(data[i] && data[i].id != this.me.id)
	    {
		this.makePlayerParticle(data[i]);
	    }
	}
    };

// déplacement de la particule du joueur
    this.moveMe = function (movingUp0, movingDown0, movingLeft0, movingRight0)
    {
	var collision = scene.detectCollision(this.me);
	
	if(movingUp0 == true && collision != 3)
	    this.me.translateZ(-10);
	if(movingDown0 == true && collision != 4)
	    this.me.translateZ(10);
	if(movingLeft0 == true && collision != 1)
	    this.me.rotation.y += 0.1;
	if(movingRight0 == true && collision != 2)
	    this.me.rotation.y -= 0.1;

	this.me.updateMatrix();
    };

// déplacement des autres particules
    this.updateOtherParticles = function (data)
    {
	for(var i=0; i<data.length; i++) 
	{
		if(data[i].id != this.me.id)
		{
		    this.particles[data[i].id].position.x = data[i]['x'];
		    this.particles[data[i].id].position.y = data[i]['y'];
		    this.particles[data[i].id].rotation.y = data[i]['r'];
		}
	}
    };

};