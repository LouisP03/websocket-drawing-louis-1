
var express = require('express');

var port = process.env.PORT || 3000;
//var port = 3000;
var app = express();
var server = app.listen(port);

//app.set('views', './views');
//app.set('view engine', 'ejs');

app.use(express.static('public'), (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	next();
});

// allow application to use URL encoded parameters instead of body for form
//app.use(express.urlencoded({ extended: true}));

const rooms = { name: {} };

//routes
//app.get('/', (req, res) => {
//	res.render('index', { rooms: rooms });
//})
// parameter passed in URL
//app.get('/:room', (req, res) => {
//	res.render('room', { roomName: req.params.room });
//});

console.log('My socket server is running.');

var socket = require('socket.io');
var io = socket(server);

var connections = new Set();

var canvasData = [];

var users = [];

io.sockets.on('connection', (socket) => {
	var id = socket.id;
	console.log('New client connection: ' + id);
	connections.add(socket);

	socket.on('user_connected', (username) => {
		users[username] = socket.id;

		socket.emit('user_connected', username);
	});

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

	socket.on('click', (clickData) => {
		socket.broadcast.emit('click', clickData);
		console.log(clickData);

		canvasData.push(clickData);
	});

	socket.on('onResetCanvas', (resetData) => {
		socket.broadcast.emit('onResetCanvas', resetData);
		console.log('Canvas reset by a client.')
	});

	socket.on('onSave', (pixelArrayData) => {
		socket.broadcast.emit('onSave', pixelArrayData);
	});

	socket.on('request', () => {
		socket.emit(canvasData);
	});

	socket.on('chat', (messageData) => {
		socket.broadcast.emit('chat', messageData);
	});

	socket.on('onResetChat', () => {
		socket.broadcast.emit('onResetChat');
	});

});

