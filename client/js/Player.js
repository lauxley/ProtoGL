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
    this.life = 100; //start with 10 health
    this.score = 0;
    this.color = _randColor();

    this.model = new PlayerModel(this);

    this.destroy = function() {
	this.model.destroy();
	//destroy all existing objects
	for(i=0;i<this.shoots.lenght;i++) {
	    this.shoots[i].destroy();
	}
	for(i=0;i<this.bombs.lenght;i++) {
	    this.bombs[i].destroy();
	}
    };

    this.updateFromControl = function() 
    {
	//ideally should be the contrary ? from the player position to the model ?
	this.position.x = this.model.mesh.position.x;
	this.position.y = this.model.mesh.position.y;
	this.position.r = this.model.mesh.rotation.y;
    }

    this.updateFromServer = function(data) 
    {
	this.position.x = data.x;
	this.position.y = data.y;
	this.position.r = data.r;
	this.life = data.l;
	this.score = data.p;
	this.model.updatePositions(data);
    };

    this.addShoot = function(data) 
    {
        //we may need a 'Shoot' or 'Bullet' class at some point, but not for now
        var shoot = new ShootModel(this, data);
        this.shoots.push(shoot);
        return shoot;
    }
	
    // gestion des projectiles
    this.updateShoots = function()
    {
        for(var i=0; i<this.shoots.length; i++)
        {
            // if shoot timelife is over lets destroy the object
            if(this.shoots[i].animationFrame > this.shoots[i].animationKey) 
            {
                this.shoots[i].destroy();
                this.shoots.splice(i, 1);
            }
            else
            {
                
                this.shoots[i].mesh.translateZ(-25);
                this.shoots[i].animationFrame++;
                // test only for collision after shoot frame 3 to avoid collision with own ship
                if(this.shoots[i].animationFrame > 3)
                {
                    if (this.testForImpact(this.shoots[i]))
                    {
                        // on shoot impact destroy both the mesh and the reference in shoot array
                        this.shoots[i].destroy();
                        this.shoots.splice(i,1);
                    }
                }
            }
        }
    }
	
    this.testForImpact = function(shoot)
    {
        var rayX = -50 * Math.sin(shoot.mesh.rotation.y);
        var rayY = -50 * Math.cos(shoot.mesh.rotation.y);
        var ray = new THREE.Ray( shoot.mesh.position, new THREE.Vector3( rayX, rayY, 50 ) );
        var collision = THREE.Collisions.rayCastNearest( ray );
        if (collision && Math.abs(collision.distance) < 50 && collision.distance != -1)
        {
            if (collision.mesh.owner)
            {
		if (shoot.mesh.owner == game.me) {
		    game.hit(collision.mesh.owner);
		}
            }

            return true;
        }
        return false;
    }

    this.addBomb = function(power) 
    {
	var bomb = new BombModel(this, {"p": power });
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
		this.bombs[i].destroy();
		this.bombs.splice(i, 1);
		i--;//OUCH
	    }
	}
    }
};