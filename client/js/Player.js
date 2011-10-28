// initialisation des particules des joueurs
var Player = function(data) {
    var _randColor = function() {
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

    this.updateFromControl = function() {
	this.position.x = this.model.mesh.position.x;
	this.position.y = this.model.mesh.position.y;
	this.position.r = this.model.mesh.rotation.y;
    }

    this.updateFromServer = function(data) {
	
	this.position.x = data.x;
	this.position.y = data.y;
	this.position.r = data.r;

	this.model.updatePositions(data);
    };

    this.addShoot = function() {
	//we may need a 'Shoot' or 'Bullet' class at some point, but not for now
	var shoot = new ShootModel(this)
	this.shoots.push(shoot);
	game.shoot(shoot);
    }
	
    // gestion des projectiles
    this.updateShoots = function()
    {
	for(var i=0; i<this.shoots.length; i++)
	{
	    this.shoots[i].mesh.translateZ(-25);
	}
    }

    this.addBomb = function() {
	//we may need a 'Bomb' class at some point, but not for now
	var bomb = new BombModel(this);
	this.bombs.push(bomb);
	game.bomb(bomb);
    }

    // gestion des bombes
    this.updateBombs = function()
    {
	for(var i=0; i<this.bombs.length; i++)
	{
	    this.bombs[i].animate();
	}
    }
};