
var express = require('express');

var port = process.env.PORT || 3000;
//var port = 3000;
var app = express();
var server = app.listen(port);

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

var canvasData = [];

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

		canvasData.push(data);
	});

	socket.on('onReset', (resetData) => {
		socket.broadcast.emit('onReset', resetData);
		console.log('Canvas reset by a client.')
	});

	socket.on('onSave', (pixelArrayData) => {
		socket.broadcast.emit('onSave', pixelArrayData);
	})

});

