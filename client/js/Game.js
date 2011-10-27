var HOST = '192.168.0.10';
var PORT = 8000;

function Game() {

    this.players = new players();

    this.info = function(msg) {
        console.log(msg);
    };

    this.move = function(x, y, r) {
        this.socket.emit('move', '{"x":'+x+', "y":'+y+', "r":'+r+'}');
    };

    this.init = function() {
	this.socket = io.connect(HOST, {port:PORT});
	var game = this;

	this.socket.on('connect', function (data) {
            game.info('connected!');
	});

	this.socket.on('welcome', function(data) {
            game.info('I am '+data.id+' Spawn point: x='+data.x+' y='+data.y);
            init();
	    game.players.makeMe(data);
	});

	this.socket.on('new_player', function(data) {
            game.info('New player '+data.id+' Spawn point: x='+data.x+' y='+data.y);
	    game.players.makePlayerParticle(data);
	});

	this.socket.on('player_leave', function(id) {
            game.info('player leaving '+id);
            game.players.removePlayerParticle(id);
	});

	this.socket.on('players', function (data) {
	    if (Object.keys(game.players.particles).length)
			game.players.updateOtherParticles(data);
	    else
			game.players.makePlayersParticles(data);
		game.players.updateShoot();
		game.players.updateBomb();
	});

	this.socket.on('this.info', function (data) {
            game.info(data);
	});
    };
};
