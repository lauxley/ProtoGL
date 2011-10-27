// initialisation des particules des joueurs
var players = {
    particles : [],
    me : null,

    makeMe : function(data) 
    {
	this.me = makeParticle(data);
    },

    makePlayerParticles : function(data)
    {
	for(var i = 0; i < data.length ; i++)
	{
	    this.particles[data[i].id] = makeParticle(data[i]);
	}
    },

// déplacement de la particule du joueur
    moveMe : function (movingUp0, movingDown0, movingLeft0, movingRight0)
    {
	if(movingUp0 == true && this.me.position.y < 780)
		this.me.position.y += 10;
	if(movingDown0 == true && this.me.position.y > -780)
		this.me.position.y -= 10;
	if(movingLeft0 == true && this.me.position.x > -1450 )
		this.me.position.x -= 10;
	if(movingRight0 == true && this.me.position.x < 1450)
		this.me.position.x += 10;
		
    },

// déplacement des autres particules
    updateOtherParticles : function (data)
    {
	for(var i=0; i<data.length; i++) 
	{
		if(data[i] && data[i].id != me.id)
		{
			this.particles[data[i].id].position.x = data[i]['x'];
			this.particles[data[i].id].position.y = data[i]['y'];
		}
	}
    }

};