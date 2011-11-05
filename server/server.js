var fs = require('fs');
var path = require('path');


var id = 1;
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
}).listen(8000);
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    function _getPlayersInfo() {
	var l = [];
	var keys = Object.keys(sockets);
	for (i=0;i<keys.length;i++) { l.push(sockets[keys[i]].player); }
	return l
    }
    
    function _spawn() {
	var x = Math.round(Math.random()*600-300);
	var y = Math.round(Math.random()*600-300);
	var r = Math.round(Math.random()*360); //angle
	return {"x":x, "y":y, "r":r};
    }

    function _respawn(player) {
	var d = _spawn();
	player.x = d.x;
	player.y = d.y;
	player.r = d.r;
	player.l = 100;
    }

    console.log('New client ('+socket.id+')!');
    socket.emit('info', 'welcome !');
    var s = _spawn();
    //r = angle / l = life / p = points
    var player = {"id":id, "x":s.x, "y":s.y, "r":s.r, "l":100, "p":0};
    socket.emit('welcome', player);
    socket.emit('players', _getPlayersInfo());
    broadcast('new_player', player, player.id);
    socket.player = player;
    sockets[id] = socket;

    id++;

    socket.on('disconnect', function() {
	broadcast('player_leave', socket.player.id, socket.player.id);
	delete sockets[socket.player.id];
    });

    socket.on('move', function(data) {

	function has_moved(d) {
	    return (socket.player.x != d.x || socket.player.y != d.y || socket.player.r != d.r)
	}

	var d = JSON.parse(data);
	if (has_moved(d)) {
	    socket.player.x = d.x;
	    socket.player.y = d.y;
	    socket.player.r = d.r;
	    broadcast('players', [socket.player], socket.player.id);
	}
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

    socket.on('hit', function(data) {
	var d = JSON.parse(data);
	if (!sockets[d.id]) return;
	sockets[d.id].player.l -= 10;
	broadcast('players', [sockets[d.id].player]);
	if(sockets[d.id].player.l <= 0) {
	    socket.player.p += 1;
	    _respawn(sockets[d.id].player);
	    //TODO: this get ugly
	    broadcast('respawn', sockets[d.id].player);
	    broadcast('players', [socket.player]);
	    broadcast('info', 'Player #'+socket.player.id+' killed player #'+sockets[d.id].player.id+' !');
	}
    });
});

console.log('Server running at http://localhost:8000/');