var Game = function() 
{
    /*
      is a singleton
      it is the main class of the game, that implement every other, the api, the webGL scene, the controls
    */
    var move_update_timer = 150; //in ms

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
	$("#shootCooldown").progressbar({ value: 100 });
	$("#shootCooldown > div").css({ 'background': '#0f0' });
	$("#bombCooldown").progressbar({ value: 100 });
	$("#bombCooldown > div").css({ 'background': '#0f0' });
	$("#lifeJauge").progressbar({ value: 100 });
	$("#lifeJauge > div").css({ 'background': '#0f0' });
    };

    this.info = function(msg) {
	//TODO : a widget to print the system msgs (and a chat ?)
        console.log(msg);
	$('#content','#msgBoard').append('<br>'+msg);
    };

    this.move = function() {
	//TODO: is it ok to round ?
        this.api.move(this.me.position.x, this.me.position.y, this.me.position.r);
    };

    this._getPlayerById = function(id) {
	return this.players[this.playerMap[id]];
    };

    this.initScene = function(data) {
	this.info('I am #'+data.id+' Spawn point: x='+data.x+' y='+data.y);
	this.scene = initScene();
	this.me = new Player(data);
	//bind the controls to the created Player
	this.controls = new Controls(this.me); //, this.scene.renderer.domElement);

	this.initialized = true;
	$(document).trigger("initialized");

	this.render();
    };

    this.shoot = function (shoot) {
	this.api.shoot(shoot);
    }

    this.addShoot = function(data) {
	this.players[this.playerMap[data.id]].addShoot(data);
    };

    this.bomb = function(bomb) {
	this.api.bomb(bomb);
    }

    this.addBomb = function(data) {
	this.players[this.playerMap[data.id]].addBomb(data);
    };

    this.hit = function(player) {
	this.api.hit(player);
    }

    this.addPlayer = function(data) {
	this.info('New player #'+data.id+' Spawn point: x='+data.x+' y='+data.y);
	$('#players').append('<div id="player_'+data.id+'" class="player">#'+data.id+': <span class="score">'+data.p+'</span><div class="plife"></div></div>');
	this.playerMap[data.id] = this.players.push(new Player(data))-1;
    };

    this.removePlayer = function(id) {
	this.info('player leaving '+id);
	//update the id->index map
	$("#player_"+id).remove();
	for(i=this.playerMap[id]+1;i<this.players.length;i++) 
	    this.playerMap[this.players[i]] -= 1; //lol?
	this._getPlayerById(id).destroy(); //clean destructor
	this.players.splice(this.playerMap[id], 1);
	delete this.playerMap[id];
    };

    this.updatePlayers = function(data) {
	for(var i = 0; i < data.length ; i++)
	{
	    if(data[i].id != this.me.id)
	    {
		if(this.playerMap[data[i].id] == undefined) {
		    this.addPlayer(data[i]);
		} else {
		    this.players[this.playerMap[data[i].id]].updateFromServer(data[i]);
		}
	    } else {
		//we update life
		console.log(data[i]);
		this.me.life = data[i].l;
		this.me.score = data[i].p;
	    }
	}
    };

    this.respawn = function(data) {
	if (data.id == this.me.id) {
	    this.me.updateFromServer(data)
	} else {
	    this.players[this.playerMap[data.id]].updateFromServer(data);
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
	    if(bombCooldown > 20 && bombCooldown < 70)
		$("#bombCooldown > div").css({ 'background': '#ff0' });
	    if(bombCooldown > 75)
		$("#bombCooldown > div").css({ 'background': '#0f0' });
	}
	
	$("#lifeJauge").progressbar({ value: this.me.life });
	$("#score").html('Score : '+this.me.score);

	for (var i=0; i<this.players.length;i++) {
	    $(".plife", '#player_'+this.players[i].id).progressbar({ value: this.players[i].life });
	    $(".score", '#player_'+this.players[i].id).html(this.players[i].score);
	}
    }

    this.render = function() {
	//this.info('test');
	this.controls.move();
	this.animate();
	this.updateUI();
	//TODO : IT MIGHT NOT BE A VERY GOOD IDEA TO SEND DATA IN THE MAIN LOOP (?)
	if(this.currentTime + move_update_timer  < Date.now()) {
	    this.move();
	    this.currentTime = Date.now();
	}
	this.scene.renderer.render( this.scene, this.scene.camera );

	stats.update();

	requestAnimationFrame( function() { game.render(); } );
    };
};
