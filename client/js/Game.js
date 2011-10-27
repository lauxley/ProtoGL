var HOST = '192.168.0.10';
var PORT = 8000;

function Game() {

    this.players = new players();

    this.info = function(msg) {
        console.log(msg);
    };

    this.move = function(x, y) {
        socket.emit('move', '{"x":'+x+', "y":'+y+'}');
    };

    this.init = function() {
	var socket = io.connect(HOST, {port:PORT});
	var game = this;

	socket.on('connect', function (data) {
            game.info('connected!');
	});

	socket.on('welcome', function(data) {
            game.info('I am '+data.id+' Spawn point: x='+data.x+' y='+data.y);
            init();
	    game.players.makeMe(data);
	});

	socket.on('new_player', function(data) {
            game.info('New player '+data.id+' Spawn point: x='+data.x+' y='+data.y);
	    game.players.makePlayerParticle(data);
	});

	socket.on('players', function (data) {
	    game.players.updateOtherParticles(data);
	});

	socket.on('this.info', function (data) {
            game.info(data);
	});
    };
};
