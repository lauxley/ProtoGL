var fs = require('fs');
var path = require('path');

var id = 1;
var players = [];
var sockets = {};

var broadcast = function(type, msg) {
    for(var sId in sockets) {
	sockets[sId].emit(type, msg);
    }
};

var app = require('http').createServer(function (req, res) {
    var _path = '';
    if (req.url == '/') { _path =  'index.html';}
    else { _path = req.url;  }
	fs.readFile(path.normalize(__dirname+'/../client/'+_path),
	function (err, data) {
	    if (err) {
		//res.writeHead(500);
                res.writeHead(404);
	        res.end('404 MOFO! '+err);

		return res.end('Error loading '+req.url);
	    }
	    res.writeHead(200);
	    res.end(data);
	});
}).listen(8000);;
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    console.log('New client ('+socket.id+')!');
    socket.emit('info', 'welcome !');
    var x = Math.round(Math.random()*3001-1500);
    var y = Math.round(Math.random()*1561-780);
    var player = {'id':id, 'x':x, 'y':y };
    socket.emit('welcome', player);
    broadcast('new_player', player);
    socket.player = player;
    sockets[id] = socket;
    players.push(player);
    socket.emit('players', players);
    id++;
    broadcast('info', 'there is now '+Object.keys(players).length+' players in the field!');

    socket.on('disconnect', function() {
	//broadcast();
	for(i=0;i<players.length;i++) {
	    if(players[i] && players[i].id == socket.player.id) {
		delete sockets[players[i].id];
		delete players[i];	
	    }
	}
    });

    socket.on('move', function(data) {
	var d = JSON.parse(data);
	socket.player.x = d.x;
	socket.player.y = d.y;
	broadcast('players', players);
    })
});

console.log('Server running at http://localhost:8000/');