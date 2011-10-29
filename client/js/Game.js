var Game = function() 
{
    /*
      is a singleton
      it is the main class of the game, that implement every other, the api, the webGL scene, the controls
    */
    var MOVE_UPDATE_TIMER = 200; //in ms

    this.scene = null; //manage the webGL scene and its (static) content (the world)
    this.api = null; //manage the protocol and the comunication with the game server
    this.controls = null; //manage the camera and controls (keybindings)

    this.players = []; //list of instances of Player (not including the user)
    this.playerMap = {}; //map of player.id -> index in this.players 
    this.me = null; //the user

    this.currentTime = Date.now(); //TODO : change to more explicit name

    this.initialized = false;

    this.lastShotTime = 0;
    this.lastBombTime = 0;
    this.shotCooldown = 100;
    this.shotReplenish = 250;
    this.bombReplenish = 350;
    this.bombCooldown = 100;

    this.init = function() {
	this.api = new Api(this); //call this.initScene when the player is connected
    };

    this.info = function(msg) {
	//TODO : a widget to print the system msgs (and a chat ?)
        console.log(msg);
    };

    this.move = function() {
	//TODO: is it ok to round ?
        this.api.move(this.me.position.x, this.me.position.y, this.me.position.r);
    };

    this._getPlayerById = function(id) {
	return this.players[this.playerMap[id]];
    };

    this.initScene = function(data) {
	this.info('I am '+data.id+' Spawn point: x='+data.x+' y='+data.y);
	this.scene = initScene();
	this.me = new Player(data);
	//bind the controls to the created Player
	this.controls = new Controls(this.me); //, this.scene.renderer.domElement);

	this.initialized = true;
	$(document).trigger("initialized");

	this.render();
    };

    this.addPlayer = function(data) {
	this.info('New player '+data.id+' Spawn point: x='+data.x+' y='+data.y);
	this.playerMap[data.id] = this.players.push(new Player(data))-1;
    };

    this.shoot = function (shoot) {
	this.api.shoot(shoot);
    }

    this.addShoot = function(data) {
	//TODO: the current implementation place the bomb at the current 'client' player position;
	//it should use the server's datas
	this.players[this.playerMap[data.id]].addShoot();
    };

    this.bomb = function(bomb) {
	this.api.bomb(bomb);
    }

    this.addBomb = function(data) {
	//TODO: the current implementation place the bomb at the current 'client' player position;
	//it should use the server's datas
	this.players[this.playerMap[data.id]].addBomb(data.p);
    };

    this.removePlayer = function(id) {
	this.info('player leaving '+id);
	//TODO: what about existing shoots, bombs, etc ?
	//update the id->index map
	for(i=this.playerMap[id]+1;i<this.players.length;i++) this.playerMap[this.players[i]] -= 1; //lol?
	this._getPlayerById(id).destroy(); //clean destructor
	this.players.splice(this.playerMap[id]);
	delete this.playerMap[id];
    };

    this.updatePlayers = function(data) {
	for(var i = 0; i < data.length ; i++)
	{
	    if(data[i].id != this.me.id)
	    {
		if(this.playerMap[data[i].id] == undefined) {
		    this.addPlayer(data[i]);
		}
		else {
		    this.players[this.playerMap[data[i].id]].updateFromServer(data[i]);
		}
	    }
	}
    };

    this.animate = function() {
	//TODO: update animated objects (for now bombs and bullets)
	this.me.updateShoots();
	this.me.updateBombs();

	for (i=0; i<this.players.length; i++) {
	    var player = this.players[i]; 
	    player.updateShoots();
	    player.updateBombs();
	}
    };


    this.updateUI = function() {
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

    }

    this.render = function() {
	this.controls.move();
	this.animate();
	this.updateUI();
	//TODO : IT MIGHT NOT BE A VERY GOOD IDEA TO SEND DATA IN THE MAIN LOOP (?)
	
	if(this.currentTime + MOVE_UPDATE_TIMER  < Date.now()) {
	    this.move();
	    this.currentTime = Date.now();
	}
	this.scene.renderer.render( this.scene, this.scene.camera );
	requestAnimationFrame( function() { game.render(); } );
    };
};
