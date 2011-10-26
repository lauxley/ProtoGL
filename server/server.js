var fs = require('fs');
var path = require('path');

var id = 1;
var players = {};
var sockets = {};

var broadcast = function(type, msg) {
    for(var sId in sockets) {
	console.log(sId);
	console.log(sockets[sId]);
	sockets[sId].emit(type, msg);
    }
};

var app = require('http').createServer(function (req, res) {
    fs.readFile(path.normalize(__dirname+'/../client/index.html'),
    function (err, data) {
	if (err) {
	    res.writeHead(500);
	    return res.end('Error loading index.html');
	}
	res.writeHead(200);
	res.end(data);
    });
}).listen(8000);;
var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    console.log('New client ('+socket.id+')!');
    socket.emit('info', 'welcome !');
    var player = { 'id':id, 'x':0, 'y':0 };
    sockets[id] = socket;
    players[socket.id] = player;
    id++;
    broadcast('info', 'there is now '+Object.keys(players).length+' players in the field!');
    broadcast('players', players);

    socket.on('disconnect', function() {
	delete sockets[players[this.id].id];
	delete players[this.id];
    });

    socket.on('move', function(data) {
	player = players[this.id];
	var p = JSON.parse(data);
	player.x = p.x;
	player.y = p.y;
	broadcast(players);
    })
});

console.log('Server running at http://localhost:8000/');