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
	this.mesh.destroy();
    };

    this.updateFromControl = function() {
	this.position.x = this.model.mesh.position.x;
	this.position.y = this.model.mesh.position.y;
	this.position.r = this.model.mesh.rotation.y;
    }

    this.updateFromServer = function(data) {
	
	this.position.x = data[i]['x'];
	this.position.y = data[i]['y'];
	this.position.r = data[i]['r'];

	this.model.updatePositions(data);
    };

    this.addShoot = function() {
	//we may need a 'Shoot' or 'Bullet' class at some point, but not for now
	this.shoots.push(new ShootModel(this));
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
	this.bombs.push(new BombModel(this));
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