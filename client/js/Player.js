// initialisation des particules des joueurs
var Player = function(data) 
{
	var _randColor = function() 
	{
		return Math.floor(Math.random()*16777215);
    }
	this.lastShotTime = 0;
	this.lastBombTime = 0;
	this.shotCooldown = 100;
	this.shotReplenish = 250;
	this.bombReplenish = 250;
	this.bombCooldown = 100;
	this.shootJauge = 100;
    this.id = data.id;
    this.position = {"x":data.x, "y":data.y, "r":data.r};
    this.shoots = [];
    this.bombs = [];
    this.color = _randColor();

    this.model = new PlayerModel(this);


    this.destroy = function() {
	this.model.destroy();

    };

    this.updateFromControl = function() 
	{
		this.position.x = this.model.mesh.position.x;
		this.position.y = this.model.mesh.position.y;
		this.position.r = this.model.mesh.rotation.y;
    }

    this.updateFromServer = function(data) 
	{
		this.position.x = data.x;
		this.position.y = data.y;
		this.position.r = data.r;

		this.model.updatePositions(data);
    };

    this.addShoot = function() 
	{
		//we may need a 'Shoot' or 'Bullet' class at some point, but not for now
		var shoot = new ShootModel(this);
		this.shoots.push(shoot);
		this.lastShotTime = Date.now();
		return shoot;
    }
	
    // gestion des projectiles
    this.updateShoots = function()
    {
		// replenish shoot gauge
		shootJauge = $("#shootCooldown").progressbar( "option", "value" );
		if(shootJauge < 100 && this.lastShotTime + this.shotReplenish < Date.now())
		{
			this.lastShotTime = Date.now();
			shootJauge++;
			if(shootJauge > 50 && shootJauge < 75)
				$("#shootCooldown > div").css({ 'background': '#ff0' });
			if(shootJauge > 75)
				$("#shootCooldown > div").css({ 'background': '#0f0' });
			$("#shootCooldown").progressbar({ value: shootJauge });
		}
		for(var i=0; i<this.shoots.length; i++)
		{
			// if shoot is too far or if its timelife is over lets destroy the object
			if(this.shoots[i].mesh.position.x >1000 ||
			this.shoots[i].mesh.position.x < -1000 ||
			this.shoots[i].mesh.position.y < -1000 ||
			this.shoots[i].mesh.position.y > 1000 ||
			this.animatonFrame > this.animationKey)
				this.shoots[i].destroy();
			else
			{
				this.shoots[i].mesh.translateZ(-25);
				this.shoots[i].animationFrame++;
			}
		}
    }

    this.addBomb = function() 
	{
		//we may need a 'Bomb' class at some point, but not for now
		// bomb only if cooldown ok
		var bomb = new BombModel(this);
		this.bombs.push(bomb);
		this.lastBombTime = Date.now();
		return bomb
    }

    // gestion des bombes
    this.updateBombs = function()
    {
		var bombCooldown = $( "#bombCooldown" ).progressbar( "option", "value" );
		if(bombCooldown < 100 && this.lastBombTime + this.bombReplenish  < Date.now())
		{
			this.lastBombTime = Date.now();
			bombCooldown++;
			$("#bombCooldown").progressbar({ value: bombCooldown });
			if(bombCooldown > 50 && bombCooldown < 75)
				$("#bombCooldown > div").css({ 'background': '#ff0' });
			if(bombCooldown > 75)
				$("#bombCooldown > div").css({ 'background': '#0f0' });
		}
		for(var i=0; i<this.bombs.length; i++)
		{
			this.bombs[i].animate();
		}
    }
};