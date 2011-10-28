var Game = function() {
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

    this.currentTime = Date.UTC();

    this.initialized = false;

    this.init = function() {
	this.api = new Api(this); //call this.initScene when the player is connected
    };

    this.info = function(msg) {
	//TODO : a widget to print the system msgs (and a chat ?)
        console.log(msg);
    };

    this.move = function() {
	function roundNumber(num, dec) {
	    return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	}

	//TODO: is it ok to round ?
        this.api.move(Math.round(this.me.position.x), Math.round(this.me.position.y), Math.round(this.me.position.r*1000)/1000);
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

    this.removePlayer = function(id) {
	this.info('player leaving '+id);
	//TODO: what about existing shoots, bombs, etc ?
	//update the id->index map
	for(i=this.playerMap[id]+1;i<this.players.length;i++) this.playerMap[this.player[i]] -= 1; //lol?
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

    this.render = function() {
	this.animate();
	this.controls.move();
	if(this.currentTime + MOVE_UPDATE_TIMER  > Date.UTC()) {
	    this.move();
	    this.currentTime = Date.UTC();
	}
	//TODO: send positions every X ms
	this.scene.renderer.render( this.scene, this.scene.camera );
	requestAnimationFrame( function() { game.render(); } );
    };
};
