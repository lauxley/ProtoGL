// initialisation des particules des joueurs
function makePlayerParticles()
{
	var particle, material;

	for(var i = 0; i < playersInfo.length ; i++)
	{
	    particles[playersInfo['id']] = makeParticle(playersInfo[i]);
	}
}

// déplacement de la particule du joueur
function updatePlayerParticle()
{
	if(movingUp0 == true && me.position.y < 780)
		me.position.y += 10;
	if(movingDown0 == true && me.position.y > -780)
		me.position.y -= 10;
	if(movingLeft0 == true && me.position.x > -1450 )
		me.position.x -= 10;
	if(movingRight0 == true && me.position.x < 1450)
		me.position.x += 10;
		
}

// déplacement des autres particules
function updateOtherParticles()
{
	for(var i=0; i<data.length; i++) 
	{
		if(data[i] && data[i].id != me.id)
		{
			particles[data[i].id].position.x = data[i]['x'];
			particles[data[i].id].position.y = data[i]['y'];
		}
	}
}