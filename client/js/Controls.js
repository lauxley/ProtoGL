var Controls = function(player) { //, domElement
    this.player = player;
    this.movingDown = false;
    this.movingUp = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.shooting = false;
    this.bombing = false;
    this.bombPower = 0;
    this.firstPush = true;
    this.lastMoveTime = null;
    this.playerSpeed = 500;//in unit/sec
    this.turnSpeed = Math.PI*1.5;//in rad/sec

    //this.domElement = domElement;

    // key listeners
   this.onKeyDown = function(e){
       if(e.keyCode == 37)
	   this.movingLeft = true;
       if(e.keyCode == 38)
	   this.movingUp = true;
       if(e.keyCode == 39)
	   this.movingRight = true;
       if(e.keyCode == 40)
	   this.movingDown = true;
       if(e.keyCode == 32)
	   this.shooting = true;
       if(e.keyCode == 17 && getBombJauge() > 20) //move this, along with the shoot cooldown and ressource logic
	   this.bombing = true;
   };
   this.onKeyUp = function(e){
       if(e.keyCode == 37) {
	   this.movingLeft = false;
	   this.lastTurnTime = null;
       }
       if(e.keyCode == 38) {
	   this.movingUp = false;
	   this.lastMoveTime = null;
       }
       if(e.keyCode == 39) {
	   this.movingRight = false;
	   this.lastTurnTime = null;
       }
       if(e.keyCode == 40) {
	   this.movingDown = false;
	   this.lastMoveTime = null;	   
       }
       if(e.keyCode == 32)
	   this.shooting = false;
       if(e.keyCode == 17)
       {
	   if(this.bombing == true)
	   {
	       this.bombing = false;
	       this.dropBomb();
	   }
       }
   };
	
	function getBombJauge()
	{
		return $("#bombCooldown").progressbar( "option", "value" );
	}
	
    function bind( scope, fn ) { return function () { fn.apply( scope, arguments ); }; };

    document.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
    document.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

    // déplacement de la particule du joueur
    this.move = function ()
    {
	//var collision = scene.detectCollision(this.me);
	if(this.movingUp == true) {// && collision != 3)
	    if (this.lastMoveTime) {
		var p = Date.now()-this.lastMoveTime;
		this.player.model.mesh.translateZ(-p/1000*this.playerSpeed);
	    }
	    this.lastMoveTime = Date.now();
	}
	if(this.movingDown == true) {// && collision != 4)
	    if (this.lastMoveTime) {
		var p = Date.now()-this.lastMoveTime;
		this.player.model.mesh.translateZ(p/1000*this.playerSpeed*2/3);
	    }
	    this.lastMoveTime = Date.now();
	}
	if(this.movingLeft == true) {// && collision != 1)
	    if (this.lastTurnTime) {
		var p = Date.now()-this.lastTurnTime;
		this.player.model.mesh.rotation.y -= p/1000*this.turnSpeed;
	    }
	    this.lastTurnTime = Date.now();
	}
	if(this.movingRight == true) {// && collision != 2)
	    if (this.lastTurnTime) {
		var p = Date.now()-this.lastTurnTime;
		this.player.model.mesh.rotation.y += p/1000*this.turnSpeed;
	    }
	    this.lastTurnTime = Date.now();
	}
	if(this.shooting == true)
	{
	    shootJauge = $("#shootCooldown").progressbar( "option", "value" );
	    if(game.lastShotTime + game.shotCooldown  < Date.now() && shootJauge > 3) 
	    {		
		shootJauge = shootJauge - 3;
		$("#shootCooldown").progressbar({ value: shootJauge });
		if(shootJauge > 50 && shootJauge < 75)
		    $("#shootCooldown > div").css({ 'background': '#ff0' });
		if(shootJauge < 25)
		    $("#shootCooldown > div").css({ 'background': '#f00' });
		var shoot = this.player.addShoot();
		
		game.lastShotTime = Date.now();
		game.shoot(shoot);
	    }
	}
	if(this.bombing == true)
	{	
		bombJauge = $("#bombCooldown").progressbar( "option", "value" );

		if(game.lastBombTime + game.bombCooldown  < Date.now() && bombJauge > 0) 
		{	
			if(this.firstPush == true)
			{
				bombJauge = bombJauge - 15;
				this.firstPush = false;
			}
			this.bombPower++;
			bombJauge = bombJauge - 1 ;
			$("#bombCooldown").progressbar({ value: bombJauge });
			if(bombJauge > 20 && bombJauge < 70)
				$("#bombCooldown > div").css({ 'background': '#ff0' });
			if(bombJauge < 25)
				$("#bombCooldown > div").css({ 'background': '#f00' });

		}
		else if(bombJauge <= 0)
		{
			this.dropBomb();
			this.bombing = false;
		}
	}
	
	this.player.model.mesh.updateMatrix();	
	this.player.updateFromControl();
    };
    
    this.dropBomb = function()
    {
	var bomb = this.player.addBomb(this.bombPower);
	game.lastBombTime = Date.now();
	game.bomb(bomb);
	this.bombPower = 0;
	this.firstPush = true;
    }
}