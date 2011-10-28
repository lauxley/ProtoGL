var HOST = '192.168.0.10';
var PORT = 8000;

var Api = function(game) {
    /*
      This class is straightforward, it is the link between the Socket and the Game instances
    */

    game.info('Connecting...');
    this.socket = io.connect(HOST, {port:PORT});

    this.socket.on('connect', function (data) {
        game.info('Connected!');
    });

    this.socket.on('welcome', function(data) {
	game.initScene(data);
    });

    this.socket.on('new_player', function(data) {
        game.addPlayer(data);
    });

    this.socket.on('player_leave', function(id) {
        game.removePlayer(id);
    });

    this.socket.on('players', function (data) {
	if (game.initialized) { //to avoid trying to initialize players if the scene is not done.
	    game.updatePlayers(data);	    
	} else {
	    $(document).bind("initialized", function() { game.updatePlayers(data); }) 
	}
    });

    this.socket.on('this.info', function (data) {
        game.info(data);
    });

    this.move = function(x, y, r) {
	this.socket.emit('move', '{"x":'+x+', "y":'+y+', "r":'+r+'}');
    }
}