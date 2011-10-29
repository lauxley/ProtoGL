var fs = require('fs');
var path = require('path');

var id = 1;
var players = [];
var shoots = [];
var bombs = [];
var sockets = {};

var broadcast = function(type, msg, excludeID) {
    for(var sId in sockets) {
	if (sId != excludeID) {
	    sockets[sId].emit(type, msg);
	}
    }
};

var app = require('http').createServer(function (req, res) {
    var _path = '';
    if (req.url == '/') { _path =  'index.html';}
    else { _path = req.url;  }
	fs.readFile(path.normalize(__dirname+'/../client/'+_path),
	function (err, data) {
	    if (err) {
                res.writeHead(404);
	        res.end('404 ('+_path+') MOFO! '+err);
	    }
	    res.writeHead(200);
	    res.end(data);
	});
}).listen(8000);;
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    function _getPlayersInfo() {
	l = [];
	keys = Object.keys(sockets);
	for (i=0;i<keys.length;i++) { l.push(sockets[keys[i]].player); }
	return l
    }

    console.log('New client ('+socket.id+')!');
    socket.emit('info', 'welcome !');
    var x = Math.round(Math.random()*400-200);
    var y = Math.round(Math.random()*400-200);
    var r = Math.round(Math.random()*360); //angle
    var player = {"id":id, "x":x, "y":y, "r":r};
    socket.emit('welcome', player);
    //players.push(player);
    socket.emit('players', _getPlayersInfo());
    broadcast('new_player', player, id);
    socket.player = player;
    sockets[id] = socket;

    id++;
    //broadcast('info', 'there is now '+Object.keys(players).length+' players in the field!');

    socket.on('disconnect', function() {
	broadcast('player_leave', socket.player.id, socket.player.id);
	delete sockets[socket.player.id];
    });

    socket.on('move', function(data) {
	var d = JSON.parse(data);
	socket.player.x = d.x;
	socket.player.y = d.y;
	socket.player.r = d.r;
	broadcast('players', _getPlayersInfo(), socket.player.id);
    });

    socket.on('shoot', function(data) {
	var d = JSON.parse(data);
	//r is the angle, s the strength
	var shoot = {"id":socket.player.id, "x":d.x, "y":d.y, "r":d.r, "p":d.p}; 
	shoots.push(shoot);
	broadcast('shoot', shoot, socket.player.id);
    });

    socket.on('bomb', function(data) {
	var d = JSON.parse(data);
	var bomb = {"id":socket.player.id, "x":d.x, "y":d.y, "r":d.r, "p":d.p};
	bombs.push(bombs);
	broadcast('bomb', bomb, socket.player.id);
    });
});

console.log('Server running at http://localhost:8000/');