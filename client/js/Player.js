// initialisation des particules des joueurs
var Player = function(data) 
{
	var _randColor = function() 
	{
		return Math.floor(Math.random()*16777215);
    }

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
        return shoot;
    }
	
    // gestion des projectiles
    this.updateShoots = function()
    {
	for(var i=0; i<this.shoots.length; i++)
	{
	    // if shoot timelife is over lets destroy the object
	    if(this.animatonFrame > this.animationKey) 
        {
		this.shoots[i].destroy();
		this.shoots.splice(i);
	    }
	    else
	    {
            this.shoots[i].mesh.translateZ(-25);
			this.shoots[i].animationFrame++;
			if (this.testForImpact(this.shoots[i]))
            {
                // on shoot impact destroy both the mesh and the reference in shoot array
                this.shoots[i].destroy();
                this.shoots.splice(i,1);
            }
	    }
	}
    }
	
	this.testForImpact = function(shoot)
	{
		var rayX = -50 * Math.sin(shoot.mesh.rotation.y);
        var rayY = -50 * Math.cos(shoot.mesh.rotation.y);
        var ray = new THREE.Ray( shoot.mesh.position, new THREE.Vector3( rayX, rayY, 0 ) );
        var collision = THREE.Collisions.rayCastNearest( ray );
        if (collision && Math.abs(collision.distance) < 50 && collision.distance != -1)
        {
            var life = $("#lifeJauge").progressbar( "option", "value" );
            life = life - 10;
            $("#lifeJauge").progressbar({ value: life });
            return true;
        }
        return false;

	}

    this.addBomb = function(power) 
    {
	//we may need a 'Bomb' class at some point, but not for now
	// bomb only if cooldown ok
	var bomb = new BombModel(this,power);
	this.bombs.push(bomb);
	return bomb
    }

    // gestion des bombes
    this.updateBombs = function()
    {
	for(var i=0; i<this.bombs.length; i++)
	{
	    var isAlive = this.bombs[i].animate();
	    if (!isAlive) {
		this.bombs.splice(i);
	    }
	}
    }
};