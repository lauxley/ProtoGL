// initialisation des particules des joueurs
function players() {
    this.particles = [],
    this.me = null,

    this.makeMe = function(data) 
    {
	this.me = scene.makeParticle(data);
    },

    this.makePlayerParticle = function(data) {
	 if(data)
		this.particles[data.id] = scene.makeParticle(data);
    }

    this.makePlayersParticles = function(data)
    {
	for(var i = 0; i < data.length ; i++)
	{
	    if(data[i] && data[i].id != this.me.id)
		{
			this.makePlayerParticle(data[i]);
		}
	}
    },

// déplacement de la particule du joueur
    this.moveMe = function (movingUp0, movingDown0, movingLeft0, movingRight0)
    {
	var collision = scene.detectCollision(this.me);
	
	if(movingUp0 == true && collision != 3)
		this.me.position.y += 10;
	if(movingDown0 == true && collision != 4)
		this.me.position.y -= 10;
	if(movingLeft0 == true && collision != 1)
		this.me.position.x -= 10;
	if(movingRight0 == true && collision != 2)
		this.me.position.x += 10;
		
    },

// déplacement des autres particules
    this.updateOtherParticles = function (data)
    {
	for(var i=0; i<data.length; i++) 
	{
		if(data[i] && data[i].id != this.me.id)
		{
			this.particles[data[i].id].position.x = data[i]['x'];
			this.particles[data[i].id].position.y = data[i]['y'];
		}
	}
    }

};