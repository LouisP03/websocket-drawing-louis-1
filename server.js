
var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'), (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

console.log("My socket server is running.");

var socket = require('socket.io');

var io = socket(server);

var connections = new Set();

io.sockets.on('connection', (socket) => {
	var id = socket.id;
	console.log('New client connection: ' + id);
	connections.add(socket);

	socket.on('disconnect', () => {
		console.log('Client disconnected: ' + id);
		connections.delete(socket);
	});

	socket.on('mouse', (data) => {
		socket.broadcast.emit('mouse', data);
		// io.sockets.emit('mouse', data);
		console.log(data);
	});


});

