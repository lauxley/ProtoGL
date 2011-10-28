var Controls = function(player) { //, domElement
    this.player = player;
    this.movingDown = false;
    this.movingUp = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.shooting = false;
    this.bombing = false;
   
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
       if(e.keyCode == 17)
	   this.bombing = true;
   };
   this.onKeyUp = function(e){
       if(e.keyCode == 37)
	   this.movingLeft = false;
       if(e.keyCode == 38)
	   this.movingUp = false;
       if(e.keyCode == 39)
	   this.movingRight = false;
       if(e.keyCode == 40)
	   this.movingDown = false;
       if(e.keyCode == 32)
	   this.shooting = false;
       if(e.keyCode == 17)
	   this.bombing = false;
   };

    function bind( scope, fn ) { return function () { fn.apply( scope, arguments ); }; };

    document.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
    document.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

    // déplacement de la particule du joueur
    this.move = function ()
    {
	//var collision = scene.detectCollision(this.me);
	
	//TODO : speed depends on the framerate ?!

	if(this.movingUp == true)// && collision != 3)
	    this.player.model.mesh.translateZ(-10);
	if(this.movingDown == true)// && collision != 4)
	    this.player.model.mesh.translateZ(10);
	if(this.movingLeft == true)// && collision != 1)
	    this.player.model.mesh.rotation.y -= 0.1;
	if(this.movingRight == true)// && collision != 2)
	    this.player.model.mesh.rotation.y += 0.1;
	if(this.shooting == true)
	{
	    shootJauge = $("#shootCooldown").progressbar( "option", "value" );
		if(this.player.lastShotTime + this.player.shotCooldown  < Date.now() && shootJauge > 3) 
		{		
			shootJauge = shootJauge - 3;
			$("#shootCooldown").progressbar({ value: shootJauge });
			if(shootJauge > 50 && shootJauge < 75)
				$("#shootCooldown > div").css({ 'background': '#ff0' });
			if(shootJauge < 25)
				$("#shootCooldown > div").css({ 'background': '#f00' });
			var shoot = this.player.addShoot();
			game.shoot(shoot);
		}
	}
	if(this.bombing == true)
	{
		bombJauge = $("#bombCooldown").progressbar( "option", "value" );
		if(this.player.lastBombTime + this.player.bombCooldown  < Date.now() && bombJauge > 33) 
		{		
			bombJauge = bombJauge - 33;
			$("#bombCooldown").progressbar({ value: bombJauge });
			if(bombJauge > 50 && bombJauge < 75)
				$("#bombCooldown > div").css({ 'background': '#ff0' });
			if(bombJauge < 25)
				$("#bombCooldown > div").css({ 'background': '#f00' });
			var bomb = this.player.addBomb();
			game.bomb(bomb);
		}
	}

	this.player.model.mesh.updateMatrix();	
	this.player.updateFromControl();
    };
}